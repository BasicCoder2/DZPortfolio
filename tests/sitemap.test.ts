import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Sitemap generation.
 *
 * A sitemap is an explicit invitation to crawl every URL it lists, so a draft
 * appearing here would be worse than a draft merely being reachable — it would
 * be advertised.
 */

const getSitemapEntries = vi.fn()

vi.mock('@/lib/content/repositories', () => ({ getSitemapEntries }))

const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

beforeEach(() => {
  vi.resetModules()
  process.env.NEXT_PUBLIC_SITE_URL = 'https://danielzimba.dev'
  getSitemapEntries.mockResolvedValue({
    posts: [{ slug: 'published-note', updatedAt: '2026-08-01T00:00:00Z' }],
    projects: [{ slug: 'lmmu-governance-admissions', updatedAt: '2026-07-15T00:00:00Z' }],
  })
})

afterEach(() => {
  if (ORIGINAL_SITE_URL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL
})

async function generate() {
  const sitemap = (await import('@/app/sitemap')).default
  return sitemap()
}

describe('sitemap', () => {
  it('includes the static routes', async () => {
    const urls = (await generate()).map((entry) => entry.url)

    expect(urls).toContain('https://danielzimba.dev')
    expect(urls).toContain('https://danielzimba.dev/blog')
    expect(urls).toContain('https://danielzimba.dev/projects')
    expect(urls).toContain('https://danielzimba.dev/me')
  })

  it('includes published content URLs', async () => {
    const urls = (await generate()).map((entry) => entry.url)

    expect(urls).toContain('https://danielzimba.dev/blog/published-note')
    expect(urls).toContain('https://danielzimba.dev/projects/lmmu-governance-admissions')
  })

  it('never lists the admin area', async () => {
    const urls = (await generate()).map((entry) => entry.url)
    expect(urls.some((url) => url.includes('/admin'))).toBe(false)
  })

  it('lists only what the repository returned', async () => {
    // The repository is the boundary that excludes drafts (see
    // repositories.test.ts); the sitemap adds nothing of its own.
    getSitemapEntries.mockResolvedValue({ posts: [], projects: [] })
    const urls = (await generate()).map((entry) => entry.url)

    expect(urls.some((url) => url.includes('/blog/'))).toBe(false)
    expect(urls.some((url) => url.includes('/projects/'))).toBe(false)
    // The index pages themselves stay, because they render their empty state.
    expect(urls).toContain('https://danielzimba.dev/blog')
  })

  it('uses each record updated_at as lastModified', async () => {
    const entries = await generate()
    const post = entries.find((entry) => entry.url.endsWith('/blog/published-note'))

    expect(post?.lastModified).toEqual(new Date('2026-08-01T00:00:00Z'))
  })

  it('falls back to now for an unparseable timestamp', async () => {
    getSitemapEntries.mockResolvedValue({
      posts: [{ slug: 'odd', updatedAt: 'not-a-date' }],
      projects: [],
    })

    const entries = await generate()
    const post = entries.find((entry) => entry.url.endsWith('/blog/odd'))

    expect(post?.lastModified).toBeInstanceOf(Date)
    expect(Number.isNaN((post?.lastModified as Date).getTime())).toBe(false)
  })

  it('emits absolute URLs on the configured origin', async () => {
    for (const entry of await generate()) {
      expect(entry.url.startsWith('https://danielzimba.dev')).toBe(true)
    }
  })
})
