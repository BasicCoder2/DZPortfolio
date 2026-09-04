import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseStub, type SupabaseStub } from '@/tests/helpers/supabase-stub'

/**
 * Public content reads.
 *
 * The property under test is that **drafts never reach a public page**. On a
 * real project Row-Level Security enforces that independently, but the tests
 * assert both halves: that draft rows are not returned, and that the query
 * actually sent the `status = published` filter. Checking only the output would
 * still pass if someone deleted the filter, because the stub has no RLS.
 */

let stub: SupabaseStub

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => stub.client,
}))

const publishedPost = {
  id: 'post-live',
  title: 'Published note',
  slug: 'published-note',
  excerpt: 'Visible.',
  content: 'Body of the published note, long enough to be worth reading.',
  cover_image_path: null,
  cover_image_alt: null,
  status: 'published',
  seo_title: null,
  seo_description: null,
  published_at: '2026-08-01T00:00:00Z',
  created_at: '2026-07-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
}

const draftPost = {
  ...publishedPost,
  id: 'post-draft',
  title: 'Building Useful Systems',
  slug: 'building-useful-systems',
  excerpt: 'A draft note.',
  status: 'draft',
  published_at: null,
}

const publishedProject = {
  id: 'project-live',
  title: 'LMMU Governance / Admissions Platform',
  slug: 'lmmu-governance-admissions',
  category: 'Enterprise System',
  summary: 'Institutional admissions workflows.',
  content: '',
  technologies: ['Laravel', 'React'],
  preview_image_path: '/assets/projects/lmmu-governance-admissions.svg',
  preview_image_alt: 'Abstract mark',
  external_url: null,
  repository_url: null,
  featured: true,
  display_order: 0,
  status: 'published',
  seo_title: null,
  seo_description: null,
  published_at: '2026-08-01T00:00:00Z',
  created_at: '2026-07-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
}

const draftProject = {
  ...publishedProject,
  id: 'project-draft',
  slug: 'secret-project',
  title: 'Unannounced client work',
  featured: true,
  status: 'draft',
  published_at: null,
}

beforeEach(() => {
  vi.resetModules()
  stub = createSupabaseStub({
    posts: [publishedPost, draftPost],
    projects: [publishedProject, draftProject],
    experience_entries: [
      {
        id: 'exp-1',
        organization: 'Levy Mwanawasa Medical University',
        role: 'Software Developer',
        location: '',
        start_date: null,
        end_date: null,
        is_current: false,
        summary: 'Enterprise systems.',
        technologies: ['Laravel'],
        display_order: 0,
        published: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'exp-hidden',
        organization: 'Unlisted',
        role: 'Contractor',
        location: '',
        start_date: null,
        end_date: null,
        is_current: false,
        summary: '',
        technologies: [],
        display_order: 1,
        published: false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        title: 'Huawei AI',
        issuer: 'Huawei',
        issue_date: null,
        credential_url: null,
        credential_id: null,
        image_path: null,
        image_alt: null,
        display_order: 0,
        published: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'cert-hidden',
        title: 'In progress',
        issuer: 'Someone',
        issue_date: null,
        credential_url: null,
        credential_id: null,
        image_path: null,
        image_alt: null,
        display_order: 1,
        published: false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ],
    engagement_options: [
      {
        id: 'eng-1',
        slug: 'discovery',
        title: 'Discovery',
        description: 'A focused starting point.',
        items: ['Requirements analysis'],
        price_prefix: 'Starting from',
        price_label: null,
        price_usd: 150,
        price_zmw: null,
        currency: 'USD',
        recommended: false,
        display_order: 0,
        published: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'eng-hidden',
        slug: 'retired-tier',
        title: 'Retired tier',
        description: '',
        items: [],
        price_prefix: '',
        price_label: 'Gone',
        price_usd: null,
        price_zmw: null,
        currency: 'label',
        recommended: false,
        display_order: 1,
        published: false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ],
  })
})

function filtersFor(table: string) {
  return stub.queries.filter((query) => query.table === table).flatMap((query) => query.filters)
}

describe('posts', () => {
  it('lists only published posts', async () => {
    const { listPublishedPosts } = await import('@/lib/content/repositories')
    const posts = await listPublishedPosts()

    expect(posts.map((post) => post.slug)).toEqual(['published-note'])
    expect(filtersFor('posts')).toContainEqual(['status', 'published'])
  })

  it('returns null for a draft requested by slug', async () => {
    const { getPublishedPost } = await import('@/lib/content/repositories')

    expect(await getPublishedPost('building-useful-systems')).toBeNull()
    expect(await getPublishedPost('published-note')).not.toBeNull()
  })

  it('does not enumerate draft slugs for prerendering', async () => {
    const { listPublishedPostSlugs } = await import('@/lib/content/repositories')
    expect(await listPublishedPostSlugs()).toEqual(['published-note'])
  })

  it('respects a limit, for the homepage preview', async () => {
    const { listPublishedPosts } = await import('@/lib/content/repositories')
    expect(await listPublishedPosts(0)).toHaveLength(0)
  })
})

describe('projects', () => {
  it('lists only published projects', async () => {
    const { listPublishedProjects } = await import('@/lib/content/repositories')
    const projects = await listPublishedProjects()

    expect(projects.map((project) => project.slug)).toEqual(['lmmu-governance-admissions'])
    expect(filtersFor('projects')).toContainEqual(['status', 'published'])
  })

  it('excludes a featured draft from the homepage grid', async () => {
    // The draft in the fixture is `featured: true` on purpose: filtering by
    // featured alone would surface it.
    const { listFeaturedProjects } = await import('@/lib/content/repositories')
    const featured = await listFeaturedProjects()

    expect(featured.map((project) => project.slug)).toEqual(['lmmu-governance-admissions'])
    expect(filtersFor('projects')).toContainEqual(['featured', true])
    expect(filtersFor('projects')).toContainEqual(['status', 'published'])
  })

  it('returns null for a draft project by slug', async () => {
    const { getPublishedProject } = await import('@/lib/content/repositories')
    expect(await getPublishedProject('secret-project')).toBeNull()
  })

  it('maps storage paths and derives the public href', async () => {
    const { getPublishedProject } = await import('@/lib/content/repositories')
    const project = await getPublishedProject('lmmu-governance-admissions')

    expect(project?.href).toBe('/projects/lmmu-governance-admissions')
    expect(project?.previewImageUrl).toBe('/assets/projects/lmmu-governance-admissions.svg')
  })
})

describe('homepage sections', () => {
  it('lists only published experience entries', async () => {
    const { listPublishedExperience } = await import('@/lib/content/repositories')
    const entries = await listPublishedExperience()

    expect(entries.map((entry) => entry.organization)).toEqual([
      'Levy Mwanawasa Medical University',
    ])
    expect(filtersFor('experience_entries')).toContainEqual(['published', true])
  })

  it('lists only published certifications', async () => {
    const { listPublishedCertifications } = await import('@/lib/content/repositories')
    const certifications = await listPublishedCertifications()

    expect(certifications.map((entry) => entry.title)).toEqual(['Huawei AI'])
  })

  it('lists only published engagement options', async () => {
    const { listPublishedEngagementOptions } = await import('@/lib/content/repositories')
    const options = await listPublishedEngagementOptions()

    expect(options.map((option) => option.slug)).toEqual(['discovery'])
    expect(options[0]?.priceDisplay).toBe('Starting from $150')
  })
})

describe('degraded operation', () => {
  // The "Supabase entirely unconfigured" case lives in its own file. `doMock`
  // survives `resetModules`, so swapping the client here would silently leak
  // into every test that ran after it — which is exactly what it did.
  it('returns an empty list when a query fails', async () => {
    stub.failNext('posts', 'connection reset')
    const { listPublishedPosts } = await import('@/lib/content/repositories')

    expect(await listPublishedPosts()).toEqual([])
  })
})

describe('getSitemapEntries', () => {
  it('returns only published slugs', async () => {
    const { getSitemapEntries } = await import('@/lib/content/repositories')
    const entries = await getSitemapEntries()

    expect(entries.posts.map((entry) => entry.slug)).toEqual(['published-note'])
    expect(entries.projects.map((entry) => entry.slug)).toEqual(['lmmu-governance-admissions'])

    // Explicit: the sitemap is the worst possible place to leak a draft URL.
    const allSlugs = [...entries.posts, ...entries.projects].map((entry) => entry.slug)
    expect(allSlugs).not.toContain('building-useful-systems')
    expect(allSlugs).not.toContain('secret-project')
  })
})
