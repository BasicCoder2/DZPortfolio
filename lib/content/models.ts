import { markdownReadingTime } from '@/lib/content/markdown'
import { resolveImageUrl } from '@/lib/media/images'
import type {
  CertificationRecord,
  ContentStatus,
  CurrencyMode,
  EngagementOptionRecord,
  ExperienceRecord,
  PostRecord,
  ProjectRecord,
} from '@/lib/supabase/types'

/**
 * Domain models and row mappers.
 *
 * Database rows are snake_case and carry storage object paths; the components
 * want camelCase and resolved URLs. Every read goes through a mapper here so
 * that translation happens in exactly one place, and so a column rename is a
 * one-file change rather than a search across the component tree.
 */

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  /** Bucket-relative object path, as stored. The admin form round-trips this. */
  coverImagePath: string | null
  coverImageUrl: string | null
  coverImageAlt: string | null
  status: ContentStatus
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  readingTime: string
}

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  content: string
  technologies: string[]
  previewImagePath: string | null
  previewImageUrl: string | null
  previewImageAlt: string | null
  externalUrl: string | null
  repositoryUrl: string | null
  featured: boolean
  displayOrder: number
  status: ContentStatus
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  href: string
}

export interface ExperienceEntry {
  id: string
  organization: string
  role: string
  location: string
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  summary: string
  technologies: string[]
  displayOrder: number
  published: boolean
  /** Pre-formatted "Mar 2023 — Present", or '' when no dates are recorded. */
  period: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate: string | null
  credentialUrl: string | null
  credentialId: string | null
  imagePath: string | null
  imageUrl: string | null
  imageAlt: string | null
  displayOrder: number
  published: boolean
  /** Pre-formatted "Mar 2024", or an em dash when the date is unknown. */
  issuedLabel: string
}

export interface EngagementOption {
  id: string
  slug: string
  title: string
  description: string
  items: string[]
  pricePrefix: string
  priceLabel: string | null
  priceUsd: number | null
  priceZmw: number | null
  currency: CurrencyMode
  recommended: boolean
  displayOrder: number
  published: boolean
  /** Exactly what the pricing card renders, e.g. "Starting from $150". */
  priceDisplay: string
}

// --- Formatting -------------------------------------------------------------

const MONTH_YEAR: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric', timeZone: 'UTC' }

/**
 * `YYYY-MM-DD` to "Mar 2024".
 *
 * `timeZone: 'UTC'` is not incidental: a bare date parses as UTC midnight, and
 * formatting that in a negative-offset zone rolls it back to the previous day,
 * which turns a January start date into December of the year before.
 */
function formatMonthYear(value: string | null): string | null {
  if (!value) return null
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('en-US', MONTH_YEAR)
}

/**
 * Returns '' rather than a placeholder when no start date is recorded. The
 * public timeline then omits the period line entirely, which is what the
 * migration away from the literal string "Details pending confirmation"
 * was for.
 */
function experiencePeriod(row: ExperienceRecord): string {
  if (!row.start_date) return ''
  const start = formatMonthYear(row.start_date) ?? row.start_date
  if (row.is_current) return `${start} — Present`
  const end = formatMonthYear(row.end_date)
  return end ? `${start} — ${end}` : start
}

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const ZMW = new Intl.NumberFormat('en-ZM', {
  style: 'currency',
  currency: 'ZMW',
  maximumFractionDigits: 0,
})

/**
 * Renders a tier's price line.
 *
 * A tier either shows free text ("Custom Quote") or one or both amounts. The
 * prefix ("Starting from") is stored separately so switching a tier from a
 * label to a figure does not require retyping the lead-in.
 */
export function formatEngagementPrice(option: {
  currency: CurrencyMode
  pricePrefix: string
  priceLabel: string | null
  priceUsd: number | null
  priceZmw: number | null
}): string {
  const prefix = option.pricePrefix.trim()
  const withPrefix = (amount: string) => (prefix === '' ? amount : `${prefix} ${amount}`)

  switch (option.currency) {
    case 'USD':
      return option.priceUsd === null ? '' : withPrefix(USD.format(option.priceUsd))
    case 'ZMW':
      return option.priceZmw === null ? '' : withPrefix(ZMW.format(option.priceZmw))
    case 'BOTH': {
      if (option.priceUsd === null || option.priceZmw === null) return ''
      return withPrefix(`${USD.format(option.priceUsd)} / ${ZMW.format(option.priceZmw)}`)
    }
    case 'label':
    default:
      return option.priceLabel ?? ''
  }
}

// --- Mappers ----------------------------------------------------------------

export function toPost(row: PostRecord): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImagePath: row.cover_image_path,
    coverImageUrl: resolveImageUrl(row.cover_image_path),
    coverImageAlt: row.cover_image_alt,
    status: row.status,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    readingTime: markdownReadingTime(row.content),
  }
}

export function toProject(row: ProjectRecord): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    summary: row.summary,
    content: row.content,
    technologies: row.technologies,
    previewImagePath: row.preview_image_path,
    previewImageUrl: resolveImageUrl(row.preview_image_path),
    previewImageAlt: row.preview_image_alt,
    externalUrl: row.external_url,
    repositoryUrl: row.repository_url,
    featured: row.featured,
    displayOrder: row.display_order,
    status: row.status,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    href: `/projects/${row.slug}`,
  }
}

export function toExperience(row: ExperienceRecord): ExperienceEntry {
  return {
    id: row.id,
    organization: row.organization,
    role: row.role,
    location: row.location,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    summary: row.summary,
    technologies: row.technologies,
    displayOrder: row.display_order,
    published: row.published,
    period: experiencePeriod(row),
  }
}

export function toCertification(row: CertificationRecord): Certification {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    issueDate: row.issue_date,
    credentialUrl: row.credential_url,
    credentialId: row.credential_id,
    imagePath: row.image_path,
    imageUrl: resolveImageUrl(row.image_path),
    imageAlt: row.image_alt,
    displayOrder: row.display_order,
    published: row.published,
    issuedLabel: formatMonthYear(row.issue_date) ?? '—',
  }
}

export function toEngagementOption(row: EngagementOptionRecord): EngagementOption {
  const base = {
    currency: row.currency,
    pricePrefix: row.price_prefix,
    priceLabel: row.price_label,
    // PostgREST returns numeric as a string to preserve precision. These are
    // display prices, not ledger entries, so a Number is the right shape.
    priceUsd: row.price_usd === null ? null : Number(row.price_usd),
    priceZmw: row.price_zmw === null ? null : Number(row.price_zmw),
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    items: row.items,
    recommended: row.recommended,
    displayOrder: row.display_order,
    published: row.published,
    ...base,
    priceDisplay: formatEngagementPrice(base),
  }
}
