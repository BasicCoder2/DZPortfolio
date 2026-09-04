import { describe, expect, it } from 'vitest'
import {
  certificationSchema,
  engagementSchema,
  experienceSchema,
  loginSchema,
  postSchema,
  projectSchema,
} from '@/lib/content/schemas'

/** Extracts the field names an issue set touched, for concise assertions. */
function fieldsInError(result: {
  success: boolean
  error?: { issues: { path: PropertyKey[] }[] }
}) {
  if (result.success || !result.error) return []
  return result.error.issues.map((issue) => issue.path.map(String).join('.'))
}

const validPostDraft = {
  title: 'Building Useful Systems',
  slug: 'building-useful-systems',
  excerpt: '',
  content: '',
  coverImagePath: '',
  coverImageAlt: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
}

describe('postSchema', () => {
  it('accepts an almost-empty draft', () => {
    // Drafts must stay cheap to save, or people stop saving.
    expect(postSchema.safeParse(validPostDraft).success).toBe(true)
  })

  it('folds empty optional strings to null', () => {
    const result = postSchema.parse(validPostDraft)
    expect(result.excerpt).toBeNull()
    expect(result.coverImagePath).toBeNull()
    expect(result.seoTitle).toBeNull()
  })

  it('requires a title', () => {
    const result = postSchema.safeParse({ ...validPostDraft, title: ' ' })
    expect(fieldsInError(result)).toContain('title')
  })

  it('rejects a malformed slug', () => {
    for (const slug of ['Not A Slug', 'trailing-', 'double--hyphen', '']) {
      const result = postSchema.safeParse({ ...validPostDraft, slug })
      expect(fieldsInError(result)).toContain('slug')
    }
  })

  it('lowercases a slug typed in capitals', () => {
    expect(postSchema.parse({ ...validPostDraft, slug: 'My-Post' }).slug).toBe('my-post')
  })

  it('refuses to publish without a body or an excerpt', () => {
    const result = postSchema.safeParse({ ...validPostDraft, status: 'published' })
    const fields = fieldsInError(result)
    expect(fields).toContain('content')
    expect(fields).toContain('excerpt')
  })

  it('publishes when the post is actually complete', () => {
    const result = postSchema.safeParse({
      ...validPostDraft,
      status: 'published',
      excerpt: 'A note on turning complex requirements into software people can rely on.',
      content: 'x'.repeat(120),
    })
    expect(result.success).toBe(true)
  })

  it('demands alt text once an image is attached', () => {
    const result = postSchema.safeParse({
      ...validPostDraft,
      coverImagePath: 'posts/2026/09/abc.webp',
      coverImageAlt: '',
    })
    expect(fieldsInError(result)).toContain('coverImageAlt')
  })

  it('caps SEO fields at the lengths the database enforces', () => {
    expect(
      fieldsInError(postSchema.safeParse({ ...validPostDraft, seoTitle: 'x'.repeat(71) }))
    ).toContain('seoTitle')
    expect(
      fieldsInError(postSchema.safeParse({ ...validPostDraft, seoDescription: 'x'.repeat(201) }))
    ).toContain('seoDescription')
  })
})

describe('projectSchema', () => {
  const base = {
    title: 'LMMU Governance / Admissions Platform',
    slug: 'lmmu-governance-admissions',
    category: 'Enterprise System',
    summary: 'Institutional admissions and governance workflows.',
    content: '',
    technologies: 'Laravel, React, MySQL',
    previewImagePath: '',
    previewImageAlt: '',
    externalUrl: '',
    repositoryUrl: '',
    featured: 'on',
    displayOrder: '0',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
  }

  it('parses a comma-separated technology list into a deduplicated array', () => {
    const result = projectSchema.parse({ ...base, technologies: 'React, React , Laravel,  ,MySQL' })
    expect(result.technologies).toEqual(['React', 'Laravel', 'MySQL'])
  })

  it('reads a checkbox "on" as true and its absence as false', () => {
    expect(projectSchema.parse(base).featured).toBe(true)
    expect(projectSchema.parse({ ...base, featured: null }).featured).toBe(false)
  })

  it('rejects a URL without a scheme', () => {
    expect(
      fieldsInError(projectSchema.safeParse({ ...base, externalUrl: 'example.com' }))
    ).toContain('externalUrl')
    expect(
      fieldsInError(projectSchema.safeParse({ ...base, repositoryUrl: 'javascript:alert(1)' }))
    ).toContain('repositoryUrl')
  })

  it('accepts a full https URL', () => {
    expect(
      projectSchema.safeParse({ ...base, externalUrl: 'https://example.com/app' }).success
    ).toBe(true)
  })

  it('rejects a non-numeric display order', () => {
    expect(fieldsInError(projectSchema.safeParse({ ...base, displayOrder: 'first' }))).toContain(
      'displayOrder'
    )
  })

  it('refuses to publish without a summary', () => {
    expect(
      fieldsInError(projectSchema.safeParse({ ...base, summary: '', status: 'published' }))
    ).toContain('summary')
  })
})

describe('experienceSchema', () => {
  const base = {
    organization: 'Levy Mwanawasa Medical University',
    role: 'Software Developer',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: null,
    summary: 'Enterprise systems and institutional software delivery.',
    technologies: 'Laravel, React, MySQL',
    displayOrder: '0',
    published: 'on',
  }

  it('accepts an entry with no dates at all', () => {
    // The migrated CV data had none, and inventing them was not an option.
    const result = experienceSchema.safeParse(base)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.startDate).toBeNull()
  })

  it('rejects an end date that precedes the start date', () => {
    const result = experienceSchema.safeParse({
      ...base,
      startDate: '2024-01-01',
      endDate: '2023-01-01',
    })
    expect(fieldsInError(result)).toContain('endDate')
  })

  it('rejects an end date on a current role', () => {
    const result = experienceSchema.safeParse({
      ...base,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      isCurrent: 'on',
    })
    expect(fieldsInError(result)).toContain('endDate')
  })

  it('rejects an end date with no start date', () => {
    const result = experienceSchema.safeParse({ ...base, endDate: '2025-01-01' })
    expect(fieldsInError(result)).toContain('startDate')
  })

  it('rejects a malformed date', () => {
    expect(fieldsInError(experienceSchema.safeParse({ ...base, startDate: '2024' }))).toContain(
      'startDate'
    )
  })
})

describe('certificationSchema', () => {
  const base = {
    title: 'Huawei Cloud Computing',
    issuer: 'Huawei',
    issueDate: '',
    credentialUrl: '',
    credentialId: '',
    imagePath: '',
    imageAlt: '',
    displayOrder: '0',
    published: 'on',
  }

  it('accepts a certification with no date', () => {
    expect(certificationSchema.safeParse(base).success).toBe(true)
  })

  it('requires alt text with an image', () => {
    expect(
      fieldsInError(certificationSchema.safeParse({ ...base, imagePath: 'certifications/x.webp' }))
    ).toContain('imageAlt')
  })

  it('requires the issuer', () => {
    expect(fieldsInError(certificationSchema.safeParse({ ...base, issuer: '' }))).toContain(
      'issuer'
    )
  })
})

describe('engagementSchema', () => {
  const base = {
    slug: 'discovery',
    title: 'Discovery',
    description: 'A focused starting point.',
    items: 'Requirements analysis\nProject scoping',
    pricePrefix: 'Starting from',
    priceLabel: '',
    priceUsd: '150',
    priceZmw: '',
    currency: 'USD',
    recommended: null,
    displayOrder: '0',
    published: 'on',
  }

  it('accepts the migrated Discovery tier', () => {
    const result = engagementSchema.safeParse(base)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.priceUsd).toBe(150)
  })

  it('parses a thousands separator pasted from a quote', () => {
    const result = engagementSchema.parse({ ...base, priceUsd: '1,500' })
    expect(result.priceUsd).toBe(1500)
  })

  it('splits the item list on newlines', () => {
    expect(engagementSchema.parse(base).items).toEqual(['Requirements analysis', 'Project scoping'])
  })

  it('requires an amount for the currency it promises to show', () => {
    expect(fieldsInError(engagementSchema.safeParse({ ...base, priceUsd: '' }))).toContain(
      'priceUsd'
    )
    expect(
      fieldsInError(engagementSchema.safeParse({ ...base, currency: 'ZMW', priceZmw: '' }))
    ).toContain('priceZmw')

    const both = engagementSchema.safeParse({ ...base, currency: 'BOTH', priceZmw: '' })
    expect(fieldsInError(both)).toContain('priceZmw')
  })

  it('requires price text in label mode', () => {
    expect(
      fieldsInError(engagementSchema.safeParse({ ...base, currency: 'label', priceLabel: '' }))
    ).toContain('priceLabel')
  })

  it('accepts both currencies together', () => {
    const result = engagementSchema.safeParse({
      ...base,
      currency: 'BOTH',
      priceUsd: '150',
      priceZmw: '4000',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a negative amount', () => {
    expect(fieldsInError(engagementSchema.safeParse({ ...base, priceUsd: '-10' }))).toContain(
      'priceUsd'
    )
  })
})

describe('loginSchema', () => {
  it('normalizes the email', () => {
    const result = loginSchema.parse({
      email: '  Owner@Example.COM ',
      password: 'hunter2',
      next: '',
    })
    expect(result.email).toBe('owner@example.com')
  })

  it('rejects a malformed email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false)
  })

  it('rejects an empty password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.co', password: '' }).success).toBe(false)
  })

  it('does not impose a password policy of its own', () => {
    // Any complexity rule here would leak the account's real policy to an
    // unauthenticated caller. Supabase is the authority.
    expect(loginSchema.safeParse({ email: 'a@b.co', password: 'a' }).success).toBe(true)
  })
})
