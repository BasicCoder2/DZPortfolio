import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseConfig } from '@/lib/env'
import type { Database } from '@/lib/supabase/types'
import { ADMIN_LOGIN_PATH, buildLoginRedirect } from '@/lib/auth/redirects'

/**
 * Refreshes the Supabase session cookie and turns away obviously-anonymous
 * requests to `/admin` before a page is ever rendered.
 *
 * This is an **optimistic** gate, not the authorization decision. It only
 * knows whether a token exists and can be refreshed; it does not check whether
 * the account is *the* administrator. Every admin page and every mutation
 * independently calls `requireAdmin()` (lib/auth/admin.ts), which re-verifies
 * the user against Supabase and compares the email to ADMIN_EMAIL. Deleting
 * this file would cost a redirect, not the security model.
 *
 * Its real job is cookie rotation: Server Components cannot write cookies, so
 * without a refresh here a long-lived admin session would expire mid-edit.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const config = getSupabaseConfig()

  // Unconfigured deployment: let the request through so the admin pages can
  // render their own "Supabase is not configured" error, which is far easier
  // to act on than a redirect loop into a login form that cannot work.
  if (!config) return NextResponse.next({ request })

  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  // getUser() rather than getSession(): it revalidates the token with the auth
  // server instead of trusting whatever the cookie claims. Do not "optimize"
  // this into getSession() — a forged cookie would pass.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (!user && pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_PATH) {
    return NextResponse.redirect(
      buildLoginRedirect(request.nextUrl, `${pathname}${request.nextUrl.search}`)
    )
  }

  return response
}
