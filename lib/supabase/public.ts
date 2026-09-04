import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/env'
import type { Database } from '@/lib/supabase/types'
import type { DZSupabaseClient } from '@/lib/supabase/server'

/**
 * A session-less Supabase client for public page reads.
 *
 * Two reasons this exists instead of reusing the cookie-backed client from
 * lib/supabase/server.ts:
 *
 * 1. **It keeps the public site static.** The cookie client calls `cookies()`,
 *    which opts a route into dynamic rendering. Every public page would then
 *    render per request instead of being prerendered and revalidated on a
 *    schedule — a real cost for a portfolio that is overwhelmingly cache hits.
 *
 * 2. **It makes "published only" structural.** Requests carry no session, so
 *    PostgREST evaluates them as `anon`, and the only rows RLS will return are
 *    published ones. An administrator browsing their own site therefore sees
 *    exactly what a visitor sees — drafts cannot leak onto a public page even
 *    if a query forgets its `.eq('status', 'published')` filter. Draft preview
 *    is a separate, explicitly authenticated route.
 *
 * Returns `null` rather than throwing when Supabase is unconfigured, so a
 * fresh checkout can still build.
 */
export function createPublicClient(): DZSupabaseClient | null {
  const config = getSupabaseConfig()
  if (!config) return null

  return createSupabaseClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
