/**
 * Hand-maintained database types for the DZPortfolio schema.
 *
 * These mirror supabase/migrations/0001_content_schema.sql exactly. They are
 * written by hand rather than generated so the repo has no dependency on the
 * Supabase CLI being installed or a project being reachable at build time — a
 * checkout with no credentials still type-checks.
 *
 * If you change a migration, change this file in the same commit. The shape is
 * what `@supabase/supabase-js` uses to type every query result.
 *
 * **Everything here is a `type`, never an `interface`.** supabase-js constrains
 * schemas to `Record<string, GenericTable>`, and only type aliases get the
 * implicit index signature that satisfies it. Converting any of these to an
 * interface makes every query result collapse to `never`.
 */

export type ContentStatus = 'draft' | 'published'
export type CurrencyMode = 'label' | 'USD' | 'ZMW' | 'BOTH'

type PostRow = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_path: string | null
  cover_image_alt: string | null
  status: ContentStatus
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

type ProjectRow = {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  content: string
  technologies: string[]
  preview_image_path: string | null
  preview_image_alt: string | null
  external_url: string | null
  repository_url: string | null
  featured: boolean
  display_order: number
  status: ContentStatus
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

type ExperienceRow = {
  id: string
  organization: string
  role: string
  location: string
  start_date: string | null
  end_date: string | null
  is_current: boolean
  summary: string
  technologies: string[]
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

type CertificationRow = {
  id: string
  title: string
  issuer: string
  issue_date: string | null
  credential_url: string | null
  credential_id: string | null
  image_path: string | null
  image_alt: string | null
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

type EngagementOptionRow = {
  id: string
  slug: string
  title: string
  description: string
  items: string[]
  price_prefix: string
  price_label: string | null
  price_usd: number | null
  price_zmw: number | null
  currency: CurrencyMode
  recommended: boolean
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

type ProfileRow = {
  id: string
  email: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

/**
 * Columns the server may set on write.
 *
 * `id`, `created_at`, `updated_at` and `published_at` are all owned by the
 * database (defaults and triggers), so they are absent here — omitting them
 * from the insert and update types is what stops application code from
 * fighting the triggers in 0001_content_schema.sql.
 */
type Writable<T> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'published_at'>

type TableDef<Row, Insert = Partial<Writable<Row>>> = {
  Row: Row
  Insert: Insert
  Update: Partial<Writable<Row>>
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow>
      posts: TableDef<PostRow, Writable<PostRow>>
      projects: TableDef<ProjectRow, Writable<ProjectRow>>
      experience_entries: TableDef<ExperienceRow, Writable<ExperienceRow>>
      certifications: TableDef<CertificationRow, Writable<CertificationRow>>
      engagement_options: TableDef<EngagementOptionRow, Writable<EngagementOptionRow>>
    }
    Views: { [_ in never]: never }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      content_status: ContentStatus
      currency_mode: CurrencyMode
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type PostRecord = Tables<'posts'>
export type ProjectRecord = Tables<'projects'>
export type ExperienceRecord = Tables<'experience_entries'>
export type CertificationRecord = Tables<'certifications'>
export type EngagementOptionRecord = Tables<'engagement_options'>
export type ProfileRecord = Tables<'profiles'>
