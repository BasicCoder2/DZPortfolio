import { createPublicClient } from '@/lib/supabase/public'
import type { DZSupabaseClient } from '@/lib/supabase/server'
import {
  toCertification,
  toEngagementOption,
  toExperience,
  toPost,
  toProject,
  type Certification,
  type EngagementOption,
  type ExperienceEntry,
  type Post,
  type Project,
} from '@/lib/content/models'

/**
 * Read side of the public site.
 *
 * Every function here is **fail-soft**: a missing configuration or a failed
 * query logs and returns an empty result rather than throwing. That is a
 * deliberate trade. The alternative — an unhandled error — takes down a page
 * that would otherwise have rendered its header, navigation, and a perfectly
 * good empty state. For a portfolio, a section that is briefly empty beats a
 * 500, and it means `next build` succeeds on a checkout that has never been
 * pointed at a Supabase project.
 *
 * The `status = 'published'` filters below are belt-and-braces. The client is
 * session-less, so RLS would refuse a draft regardless; the explicit filter
 * documents the intent at the call site and keeps the query honest if the
 * client is ever swapped.
 */

/** Logs a query failure without leaking connection details into the response. */
function reportFailure(operation: string, error: { message: string } | null): void {
  if (!error) return
  console.error(`[content] ${operation} failed: ${error.message}`)
}

function client(): DZSupabaseClient | null {
  const supabase = createPublicClient()
  if (!supabase) {
    console.warn('[content] Supabase is not configured; serving empty content.')
  }
  return supabase
}

// --- Posts ------------------------------------------------------------------

export async function listPublishedPosts(limit?: number): Promise<Post[]> {
  const supabase = client()
  if (!supabase) return []

  let query = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (typeof limit === 'number') query = query.limit(limit)

  const { data, error } = await query
  reportFailure('listPublishedPosts', error)
  return (data ?? []).map(toPost)
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const supabase = client()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  reportFailure('getPublishedPost', error)
  return data ? toPost(data) : null
}

export async function listPublishedPostSlugs(): Promise<string[]> {
  const supabase = client()
  if (!supabase) return []

  const { data, error } = await supabase.from('posts').select('slug').eq('status', 'published')
  reportFailure('listPublishedPostSlugs', error)
  return (data ?? []).map((row) => row.slug)
}

// --- Projects ---------------------------------------------------------------

export async function listPublishedProjects(limit?: number): Promise<Project[]> {
  const supabase = client()
  if (!supabase) return []

  let query = supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (typeof limit === 'number') query = query.limit(limit)

  const { data, error } = await query
  reportFailure('listPublishedProjects', error)
  return (data ?? []).map(toProject)
}

export async function listFeaturedProjects(limit?: number): Promise<Project[]> {
  const supabase = client()
  if (!supabase) return []

  let query = supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (typeof limit === 'number') query = query.limit(limit)

  const { data, error } = await query
  reportFailure('listFeaturedProjects', error)
  return (data ?? []).map(toProject)
}

export async function getPublishedProject(slug: string): Promise<Project | null> {
  const supabase = client()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  reportFailure('getPublishedProject', error)
  return data ? toProject(data) : null
}

export async function listPublishedProjectSlugs(): Promise<string[]> {
  const supabase = client()
  if (!supabase) return []

  const { data, error } = await supabase.from('projects').select('slug').eq('status', 'published')
  reportFailure('listPublishedProjectSlugs', error)
  return (data ?? []).map((row) => row.slug)
}

// --- Experience -------------------------------------------------------------

export async function listPublishedExperience(): Promise<ExperienceEntry[]> {
  const supabase = client()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('experience_entries')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false })

  reportFailure('listPublishedExperience', error)
  return (data ?? []).map(toExperience)
}

// --- Certifications ---------------------------------------------------------

export async function listPublishedCertifications(): Promise<Certification[]> {
  const supabase = client()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('issue_date', { ascending: false, nullsFirst: false })

  reportFailure('listPublishedCertifications', error)
  return (data ?? []).map(toCertification)
}

// --- Engagement -------------------------------------------------------------

export async function listPublishedEngagementOptions(): Promise<EngagementOption[]> {
  const supabase = client()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('engagement_options')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })

  reportFailure('listPublishedEngagementOptions', error)
  return (data ?? []).map(toEngagementOption)
}

/** Newest `updated_at` per content type, for sitemap `lastModified` values. */
export async function getSitemapEntries(): Promise<{
  posts: Array<{ slug: string; updatedAt: string }>
  projects: Array<{ slug: string; updatedAt: string }>
}> {
  const supabase = client()
  if (!supabase) return { posts: [], projects: [] }

  const [posts, projects] = await Promise.all([
    supabase.from('posts').select('slug, updated_at').eq('status', 'published'),
    supabase.from('projects').select('slug, updated_at').eq('status', 'published'),
  ])

  reportFailure('getSitemapEntries(posts)', posts.error)
  reportFailure('getSitemapEntries(projects)', projects.error)

  return {
    posts: (posts.data ?? []).map((row) => ({ slug: row.slug, updatedAt: row.updated_at })),
    projects: (projects.data ?? []).map((row) => ({ slug: row.slug, updatedAt: row.updated_at })),
  }
}
