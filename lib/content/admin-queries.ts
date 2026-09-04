import 'server-only'

import { requireAdmin } from '@/lib/auth/admin'
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
 * Read side of the admin area.
 *
 * Unlike lib/content/repositories.ts, these run through the cookie-backed
 * client and therefore see drafts. Each one calls `requireAdmin()` first: the
 * layout guard is not treated as sufficient, because a future route could
 * import one of these outside that layout and quietly become a data leak.
 *
 * These also fail *loud*. An admin list that silently renders empty because a
 * query broke would look identical to "you have no posts", and the operator
 * would go write one.
 */

function unwrap<T>(operation: string, data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(`${operation} failed: ${error.message}`)
  if (data === null) throw new Error(`${operation} returned no data.`)
  return data
}

// --- Posts ------------------------------------------------------------------

export async function listAllPosts(): Promise<Post[]> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false })

  return unwrap('listAllPosts', data, error).map(toPost)
}

export async function getPostById(id: string): Promise<Post | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`getPostById failed: ${error.message}`)
  return data ? toPost(data) : null
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).maybeSingle()
  if (error) throw new Error(`getPostBySlug failed: ${error.message}`)
  return data ? toPost(data) : null
}

// --- Projects ---------------------------------------------------------------

export async function listAllProjects(): Promise<Project[]> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('updated_at', { ascending: false })

  return unwrap('listAllProjects', data, error).map(toProject)
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`getProjectById failed: ${error.message}`)
  return data ? toProject(data) : null
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle()
  if (error) throw new Error(`getProjectBySlug failed: ${error.message}`)
  return data ? toProject(data) : null
}

// --- Experience -------------------------------------------------------------

export async function listAllExperience(): Promise<ExperienceEntry[]> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('experience_entries')
    .select('*')
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false })

  return unwrap('listAllExperience', data, error).map(toExperience)
}

export async function getExperienceById(id: string): Promise<ExperienceEntry | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('experience_entries')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`getExperienceById failed: ${error.message}`)
  return data ? toExperience(data) : null
}

// --- Certifications ---------------------------------------------------------

export async function listAllCertifications(): Promise<Certification[]> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order', { ascending: true })
    .order('issue_date', { ascending: false, nullsFirst: false })

  return unwrap('listAllCertifications', data, error).map(toCertification)
}

export async function getCertificationById(id: string): Promise<Certification | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`getCertificationById failed: ${error.message}`)
  return data ? toCertification(data) : null
}

// --- Engagement -------------------------------------------------------------

export async function listAllEngagementOptions(): Promise<EngagementOption[]> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('engagement_options')
    .select('*')
    .order('display_order', { ascending: true })

  return unwrap('listAllEngagementOptions', data, error).map(toEngagementOption)
}

export async function getEngagementOptionById(id: string): Promise<EngagementOption | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('engagement_options')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`getEngagementOptionById failed: ${error.message}`)
  return data ? toEngagementOption(data) : null
}

// --- Dashboard --------------------------------------------------------------

export interface DashboardCounts {
  postsDraft: number
  postsPublished: number
  projectsDraft: number
  projectsPublished: number
  experienceTotal: number
  experiencePublished: number
  certificationsTotal: number
  certificationsPublished: number
  engagementTotal: number
  engagementPublished: number
}

/**
 * Counts for the dashboard.
 *
 * Uses `head: true` so PostgREST returns the count in a header and no rows in
 * the body — ten cheap COUNT queries in parallel rather than pulling every
 * record across the wire to call `.length` on it.
 */
export async function getDashboardCounts(): Promise<DashboardCounts> {
  const { supabase } = await requireAdmin()

  type CountableTable =
    'posts' | 'projects' | 'experience_entries' | 'certifications' | 'engagement_options'

  const count = async (
    table: CountableTable,
    filter?: { column: string; value: string | boolean }
  ): Promise<number> => {
    const base = supabase.from(table).select('*', { count: 'exact', head: true })
    const { count: total, error } = await (filter ? base.eq(filter.column, filter.value) : base)
    if (error) throw new Error(`count(${table}) failed: ${error.message}`)
    return total ?? 0
  }

  const [
    postsDraft,
    postsPublished,
    projectsDraft,
    projectsPublished,
    experienceTotal,
    experiencePublished,
    certificationsTotal,
    certificationsPublished,
    engagementTotal,
    engagementPublished,
  ] = await Promise.all([
    count('posts', { column: 'status', value: 'draft' }),
    count('posts', { column: 'status', value: 'published' }),
    count('projects', { column: 'status', value: 'draft' }),
    count('projects', { column: 'status', value: 'published' }),
    count('experience_entries'),
    count('experience_entries', { column: 'published', value: true }),
    count('certifications'),
    count('certifications', { column: 'published', value: true }),
    count('engagement_options'),
    count('engagement_options', { column: 'published', value: true }),
  ])

  return {
    postsDraft,
    postsPublished,
    projectsDraft,
    projectsPublished,
    experienceTotal,
    experiencePublished,
    certificationsTotal,
    certificationsPublished,
    engagementTotal,
    engagementPublished,
  }
}
