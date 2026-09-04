import { describe, expect, it, vi } from 'vitest'

/**
 * Behaviour on a deployment that has never been connected to Supabase.
 *
 * This is the state a fresh clone is in, and the state a Vercel preview is in
 * before the environment variables are filled. `next build` prerenders the
 * public routes, and those routes read content — so if the repositories threw
 * here, the build would fail before anyone could configure anything.
 *
 * Its own file because `vi.mock` replaces the client for the whole module
 * graph, and mixing that with the configured-client tests leaks between them.
 */

vi.mock('@/lib/supabase/public', () => ({ createPublicClient: () => null }))

describe('repositories without Supabase', () => {
  it('return empty results rather than throwing', async () => {
    const repositories = await import('@/lib/content/repositories')

    expect(await repositories.listPublishedPosts()).toEqual([])
    expect(await repositories.listPublishedProjects()).toEqual([])
    expect(await repositories.listFeaturedProjects()).toEqual([])
    expect(await repositories.listPublishedExperience()).toEqual([])
    expect(await repositories.listPublishedCertifications()).toEqual([])
    expect(await repositories.listPublishedEngagementOptions()).toEqual([])
    expect(await repositories.listPublishedPostSlugs()).toEqual([])
    expect(await repositories.listPublishedProjectSlugs()).toEqual([])
  })

  it('return null for single-record lookups', async () => {
    const repositories = await import('@/lib/content/repositories')

    expect(await repositories.getPublishedPost('anything')).toBeNull()
    expect(await repositories.getPublishedProject('anything')).toBeNull()
  })

  it('produce an empty sitemap rather than a broken one', async () => {
    const repositories = await import('@/lib/content/repositories')
    expect(await repositories.getSitemapEntries()).toEqual({ posts: [], projects: [] })
  })
})
