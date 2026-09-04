import { z } from 'zod'
import { SLUG_MAX_LENGTH, SLUG_PATTERN } from '@/lib/content/slug'

/**
 * The single validation contract for every piece of managed content.
 *
 * These schemas are imported by both the admin forms (client) and the server
 * actions that write to the database, which is the point: a field cannot be
 * relaxed in the UI without relaxing it on the server too. Client-side
 * validation here is a convenience for the operator; the server parse is the
 * one that decides.
 *
 * Each rule that also exists as a CHECK constraint in
 * supabase/migrations/0001_content_schema.sql is marked. The duplication is
 * intentional — Zod produces a usable error message, the constraint produces a
 * guarantee.
 */

// --- Reusable field builders ------------------------------------------------

/**
 * Trims, then folds empty to `null`.
 *
 * HTML forms submit unfilled inputs as `''`, never as absent. Without this
 * every optional column would fill with empty strings and the "is this set?"
 * checks downstream would all have to test two falsy values instead of one.
 */
function optionalText(max: number, label: string) {
  return z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'string' ? value.trim() : ''))
    .transform((value) => (value === '' ? null : value))
    .refine((value) => value === null || value.length <= max, {
      message: `${label} must be ${max} characters or fewer.`,
    })
}

function requiredText(min: number, max: number, label: string) {
  return z
    .string({ message: `${label} is required.` })
    .transform((value) => value.trim())
    .refine((value) => value.length >= min, { message: `${label} is required.` })
    .refine((value) => value.length <= max, {
      message: `${label} must be ${max} characters or fewer.`,
    })
}

function bodyText(max: number, label: string) {
  return z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'string' ? value : ''))
    .refine((value) => value.length <= max, {
      message: `${label} must be ${max} characters or fewer.`,
    })
}

/** Optional absolute http(s) URL. Mirrors the `*_url_scheme` CHECK constraints. */
function optionalUrl(label: string) {
  return optionalText(2048, label).refine(
    (value) => value === null || /^https?:\/\/\S+$/i.test(value),
    { message: `${label} must be a full URL starting with http:// or https://.` }
  )
}

/** Optional calendar date in `YYYY-MM-DD`, the shape `<input type="date">` submits. */
function optionalDate(label: string) {
  return optionalText(10, label)
    .refine((value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: `${label} must be a date.`,
    })
    .refine((value) => value === null || !Number.isNaN(Date.parse(value)), {
      message: `${label} is not a real date.`,
    })
}

function optionalAmount(label: string) {
  return z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((value) => {
      if (value === null || value === undefined) return null
      if (typeof value === 'number') return value
      const trimmed = value.trim()
      if (trimmed === '') return null
      // Operators paste "1,500" out of a quote as readily as "1500".
      return Number(trimmed.replace(/,/g, ''))
    })
    .refine((value) => value === null || Number.isFinite(value), {
      message: `${label} must be a number.`,
    })
    .refine((value) => value === null || value >= 0, {
      message: `${label} cannot be negative.`,
    })
}

const slugField = z
  .string({ message: 'Slug is required.' })
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => value.length > 0, { message: 'Slug is required.' })
  .refine((value) => value.length <= SLUG_MAX_LENGTH, {
    message: `Slug must be ${SLUG_MAX_LENGTH} characters or fewer.`,
  })
  .refine((value) => SLUG_PATTERN.test(value), {
    message: 'Slug may use lowercase letters, numbers and single hyphens only.',
  })

const statusField = z.enum(['draft', 'published'], { message: 'Choose draft or published.' })

const booleanField = z
  .union([z.boolean(), z.string(), z.undefined(), z.null()])
  .transform((value) => value === true || value === 'true' || value === 'on' || value === '1')

const orderField = z
  .union([z.number(), z.string(), z.undefined(), z.null()])
  .transform((value) => {
    if (typeof value === 'number') return value
    if (typeof value !== 'string' || value.trim() === '') return 0
    return Number(value.trim())
  })
  .refine((value) => Number.isInteger(value), { message: 'Display order must be a whole number.' })
  .refine((value) => value >= 0 && value <= 9999, {
    message: 'Display order must be between 0 and 9999.',
  })

/**
 * Accepts either a real array or the comma/newline-separated text the admin
 * forms use, and normalizes to a deduplicated, non-empty list.
 */
function listField(max: number, label: string) {
  return z
    .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
    .transform((value) => {
      const raw = Array.isArray(value)
        ? value
        : typeof value === 'string'
          ? value.split(/[,\n]/)
          : []
      const cleaned = raw.map((item) => item.trim()).filter((item) => item !== '')
      return Array.from(new Set(cleaned))
    })
    .refine((value) => value.length <= max, {
      message: `${label}: keep it to ${max} entries or fewer.`,
    })
    .refine((value) => value.every((item) => item.length <= 120), {
      message: `${label}: each entry must be 120 characters or fewer.`,
    })
}

const seoTitleField = optionalText(70, 'SEO title')
const seoDescriptionField = optionalText(200, 'SEO description')
const imagePathField = optionalText(500, 'Image path')
const altTextField = optionalText(240, 'Alt text')

/**
 * An image that carries meaning needs a text alternative, and the moment to
 * ask for it is while the operator still remembers what the picture shows.
 * The same rule exists as a `*_needs_alt` CHECK constraint.
 */
function requireAltWithImage<T extends { alt: string | null; path: string | null }>(
  value: T,
  ctx: z.RefinementCtx,
  altField: string
) {
  if (value.path && !value.alt) {
    ctx.addIssue({
      code: 'custom',
      path: [altField],
      message: 'Describe the image for screen readers before saving it.',
    })
  }
}

// --- Posts ------------------------------------------------------------------

export const postSchema = z
  .object({
    title: requiredText(2, 160, 'Title'),
    slug: slugField,
    excerpt: optionalText(320, 'Excerpt'),
    content: bodyText(120_000, 'Content'),
    coverImagePath: imagePathField,
    coverImageAlt: altTextField,
    status: statusField,
    seoTitle: seoTitleField,
    seoDescription: seoDescriptionField,
  })
  .superRefine((value, ctx) => {
    requireAltWithImage(
      { alt: value.coverImageAlt, path: value.coverImagePath },
      ctx,
      'coverImageAlt'
    )

    // Publishing is the irreversible-feeling action, so it is the one that
    // gets the stricter completeness bar. Drafts stay cheap to save.
    if (value.status === 'published') {
      if (value.content.trim().length < 80) {
        ctx.addIssue({
          code: 'custom',
          path: ['content'],
          message: 'Add the article body before publishing (at least 80 characters).',
        })
      }
      if (!value.excerpt) {
        ctx.addIssue({
          code: 'custom',
          path: ['excerpt'],
          message: 'An excerpt is required before publishing — it is the listing and SEO summary.',
        })
      }
    }
  })

export type PostInput = z.infer<typeof postSchema>

// --- Projects ---------------------------------------------------------------

export const projectSchema = z
  .object({
    title: requiredText(2, 160, 'Title'),
    slug: slugField,
    category: optionalText(80, 'Category').transform((value) => value ?? ''),
    summary: optionalText(400, 'Summary').transform((value) => value ?? ''),
    content: bodyText(120_000, 'Case study'),
    technologies: listField(40, 'Technologies'),
    previewImagePath: imagePathField,
    previewImageAlt: altTextField,
    externalUrl: optionalUrl('Live URL'),
    repositoryUrl: optionalUrl('Repository URL'),
    featured: booleanField,
    displayOrder: orderField,
    status: statusField,
    seoTitle: seoTitleField,
    seoDescription: seoDescriptionField,
  })
  .superRefine((value, ctx) => {
    requireAltWithImage(
      { alt: value.previewImageAlt, path: value.previewImagePath },
      ctx,
      'previewImageAlt'
    )

    if (value.status === 'published' && value.summary.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'A summary is required before publishing — it is what the project card shows.',
      })
    }
  })

export type ProjectInput = z.infer<typeof projectSchema>

// --- Experience -------------------------------------------------------------

export const experienceSchema = z
  .object({
    organization: requiredText(2, 160, 'Organization'),
    role: requiredText(2, 160, 'Role'),
    location: optionalText(120, 'Location').transform((value) => value ?? ''),
    // Optional: the CV this schema was migrated from recorded roles without
    // dates, and an entry with no start date is valid — it simply renders
    // without a period line rather than with an invented one.
    startDate: optionalDate('Start date'),
    endDate: optionalDate('End date'),
    isCurrent: booleanField,
    summary: optionalText(1200, 'Summary').transform((value) => value ?? ''),
    technologies: listField(40, 'Technologies'),
    displayOrder: orderField,
    published: booleanField,
  })
  .superRefine((value, ctx) => {
    // Both mirror CHECK constraints, but a constraint violation surfaces as an
    // opaque 400 from PostgREST; these land on the offending field.
    if (value.isCurrent && value.endDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'A current role cannot have an end date.',
      })
    }
    if (value.endDate && value.startDate && value.endDate < value.startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'The end date cannot come before the start date.',
      })
    }
    if (value.endDate && !value.startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'Add a start date before setting an end date.',
      })
    }
  })

export type ExperienceInput = z.infer<typeof experienceSchema>

// --- Certifications ---------------------------------------------------------

export const certificationSchema = z
  .object({
    title: requiredText(2, 200, 'Title'),
    issuer: requiredText(2, 160, 'Issuer'),
    issueDate: optionalDate('Issue date'),
    credentialUrl: optionalUrl('Credential URL'),
    credentialId: optionalText(160, 'Credential ID'),
    imagePath: imagePathField,
    imageAlt: altTextField,
    displayOrder: orderField,
    published: booleanField,
  })
  .superRefine((value, ctx) => {
    requireAltWithImage({ alt: value.imageAlt, path: value.imagePath }, ctx, 'imageAlt')
  })

export type CertificationInput = z.infer<typeof certificationSchema>

// --- Engagement options (the public "Engagement" pricing section) -----------

export const currencyModeField = z.enum(['label', 'USD', 'ZMW', 'BOTH'], {
  message: 'Choose how this price should be shown.',
})

export const engagementSchema = z
  .object({
    slug: slugField,
    title: requiredText(2, 120, 'Title'),
    description: optionalText(400, 'Description').transform((value) => value ?? ''),
    items: listField(12, 'Included items'),
    pricePrefix: optionalText(40, 'Price prefix').transform((value) => value ?? ''),
    priceLabel: optionalText(60, 'Price label'),
    priceUsd: optionalAmount('USD price'),
    priceZmw: optionalAmount('ZMW price'),
    currency: currencyModeField,
    recommended: booleanField,
    displayOrder: orderField,
    published: booleanField,
  })
  .superRefine((value, ctx) => {
    // Mirrors engagement_price_source_present: the card must be able to render
    // whatever the currency mode promises.
    if (value.currency === 'label' && !value.priceLabel) {
      ctx.addIssue({
        code: 'custom',
        path: ['priceLabel'],
        message: 'Add the text to show, for example "Custom Quote".',
      })
    }
    if ((value.currency === 'USD' || value.currency === 'BOTH') && value.priceUsd === null) {
      ctx.addIssue({ code: 'custom', path: ['priceUsd'], message: 'Enter the USD amount.' })
    }
    if ((value.currency === 'ZMW' || value.currency === 'BOTH') && value.priceZmw === null) {
      ctx.addIssue({ code: 'custom', path: ['priceZmw'], message: 'Enter the ZMW amount.' })
    }
  })

export type EngagementInput = z.infer<typeof engagementSchema>

// --- Login ------------------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string({ message: 'Enter your email address.' })
    .transform((value) => value.trim().toLowerCase())
    .refine((value) => value.length > 0, { message: 'Enter your email address.' })
    .refine((value) => value.length <= 254, { message: 'That email address is too long.' })
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: 'Enter a valid email address.',
    }),
  // Length only. Any further rule here would leak the account's password
  // policy to an unauthenticated caller, and Supabase is the authority anyway.
  password: z
    .string({ message: 'Enter your password.' })
    .min(1, 'Enter your password.')
    .max(256, 'That password is too long.'),
  // .optional(): the field is genuinely absent when the login form is reached
  // without a destination, and a missing key must not fail the whole parse.
  next: optionalText(500, 'Redirect').optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
