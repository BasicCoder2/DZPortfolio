import { revalidatePath } from 'next/cache'

/**
 * Caching and revalidation strategy for database-backed public content.
 *
 * ## The strategy
 *
 * Public routes are **prerendered and time-revalidated** (ISR). They read
 * through the session-less client in lib/supabase/public.ts, so nothing about
 * them is per-request; Next can build them once and serve them from the CDN.
 * Their `revalidate` value is the ceiling on staleness if nothing else
 * happens.
 *
 * On top of that, every mutation explicitly revalidates the routes it can
 * affect, so a publish is visible immediately rather than within five minutes.
 * The timer is the safety net; the explicit call is the mechanism.
 *
 * ## Why paths and not tags
 *
 * `revalidateTag` invalidates entries in Next's *fetch* cache. Supabase reads
 * here are not tagged fetches — they go through `@supabase/supabase-js`, whose
 * requests this app does not annotate — so tagging them would require wrapping
 * every repository call in `unstable_cache`, and `unstable_cache` cannot be
 * used from code that touches cookies. Path revalidation targets exactly the
 * rendered output that actually needs to change, with no such constraint.
 *
 * ## Over-revalidating on purpose
 *
 * Each helper invalidates the whole family of routes a change could touch —
 * editing one project title changes the projects index, the homepage grid,
 * that project's page, and the sitemap. Recomputing a handful of static pages
 * costs almost nothing on a site this size; serving a stale title costs
 * credibility.
 */

// The ISR window itself (300 seconds) is declared as a literal in each public
// route. It cannot live here: Next statically analyses route segment config, so
// `export const revalidate` must be a literal and an imported constant is
// rejected at build time with "Invalid segment configuration export detected".

/** Sitemap output is a route like any other and must be refreshed too. */
function revalidateSitemap(): void {
  revalidatePath('/sitemap.xml')
}

export function revalidatePosts(slug?: string): void {
  revalidatePath('/') // homepage "Latest Blog Posts"
  revalidatePath('/blog')
  // 'page' with the route pattern refreshes every rendered instance, which is
  // what a slug *change* needs — the old URL must stop resolving too.
  revalidatePath('/blog/[slug]', 'page')
  if (slug) revalidatePath(`/blog/${slug}`)
  revalidateSitemap()
}

export function revalidateProjects(slug?: string): void {
  revalidatePath('/') // homepage featured grid
  revalidatePath('/projects')
  revalidatePath('/projects/[slug]', 'page')
  if (slug) revalidatePath(`/projects/${slug}`)
  revalidateSitemap()
}

/** Experience, certifications and engagement all render on the homepage only. */
export function revalidateHomeSections(): void {
  revalidatePath('/')
}
