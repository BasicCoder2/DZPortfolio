import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig, requireSupabaseConfig } from '@/lib/env'
import type { Database } from '@/lib/supabase/types'

export type DZSupabaseClient = SupabaseClient<Database>

/**
 * Request-scoped Supabase client backed by the session cookie.
 *
 * `server-only` at the top of this module is load-bearing: importing it from a
 * client component is a build error, not a runtime surprise, which is what
 * keeps the cookie plumbing off the browser.
 *
 * Every query made through this client runs as the signed-in user (or as
 * `anon` when there is no session), so Row-Level Security applies. There is no
 * service-role client anywhere in the application — see lib/supabase/admin.ts
 * for the one script that needs elevated access and why it stays out of the
 * app.
 */
export async function createClient(): Promise<DZSupabaseClient> {
  const { url, anonKey } = requireSupabaseConfig()
  const cookieStore = await cookies()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server Components cannot mutate cookies. Refresh still happens in
          // proxy.ts, which runs before render and *can* write, so a rotated
          // token is never lost — this branch only swallows the redundant
          // second write.
        }
      },
    },
  })
}

/**
 * Same client, but `null` when Supabase is unconfigured instead of throwing.
 *
 * Public pages use this so `next build` can prerender a portfolio that has not
 * been connected to a database yet; the repositories turn `null` into empty
 * results and the existing empty states render.
 */
export async function createClientOrNull(): Promise<DZSupabaseClient | null> {
  if (!getSupabaseConfig()) return null
  return createClient()
}
