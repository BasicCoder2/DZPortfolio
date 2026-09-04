import 'server-only'

import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { getAdminEmail, isSupabaseConfigured, normalizeEmail } from '@/lib/env'
import { createClient, type DZSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_LOGIN_PATH, NEXT_PARAM, sanitizeNextPath } from '@/lib/auth/redirects'

/**
 * The authorization decision for the entire admin area.
 *
 * Two properties this module exists to guarantee:
 *
 * 1. **Authentication is never inferred from a cookie.** Every check goes
 *    through `supabase.auth.getUser()`, which validates the access token
 *    against the auth server. `getSession()` reads the cookie and believes it;
 *    that difference is the whole security boundary, so do not swap them.
 *
 * 2. **Being signed in is not being authorized.** Supabase will happily
 *    authenticate any account that exists in the project. Authorization is a
 *    separate step: the verified email must equal the server-only
 *    ADMIN_EMAIL. The database enforces the same rule independently through
 *    `public.is_admin()` and RLS, so a bug here still cannot leak drafts.
 */

export type AdminAuthState =
  /** Supabase itself is not configured, so there is nothing to authenticate against. */
  | { status: 'unavailable' }
  | { status: 'anonymous' }
  | { status: 'unconfigured' }
  | { status: 'forbidden'; email: string }
  | { status: 'authorized'; user: User; email: string; supabase: DZSupabaseClient }

/**
 * Resolves who the caller is without redirecting or throwing.
 *
 * Use this where the answer is rendered (the layout, the 403 screen). Use
 * {@link requireAdmin} everywhere a non-administrator must simply not proceed.
 */
export async function getAdminAuthState(): Promise<AdminAuthState> {
  // Checked before creating a client, because `createClient()` throws when the
  // Supabase URL or anon key is missing. Letting that throw would turn a
  // misconfigured preview deployment into an opaque 500 on every admin screen,
  // when the actual problem — two environment variables — is one sentence to
  // state.
  if (!isSupabaseConfigured()) return { status: 'unavailable' }

  const adminEmail = getAdminEmail()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { status: 'anonymous' }

  const email = normalizeEmail(user.email ?? '')

  // Fail closed. A deployment with no ADMIN_EMAIL authorizes nobody, rather
  // than authorizing the first person to sign up.
  if (!adminEmail) return { status: 'unconfigured' }
  if (email === '' || email !== adminEmail) return { status: 'forbidden', email }

  return { status: 'authorized', user, email, supabase }
}

/** Thrown by {@link requireAdmin} when a signed-in account is not the admin. */
export class AdminForbiddenError extends Error {
  constructor() {
    super('Not authorized for the admin area.')
    this.name = 'AdminForbiddenError'
  }
}

/** Thrown by {@link requireAdmin} when Supabase is not configured at all. */
export class AdminUnavailableError extends Error {
  constructor() {
    super('Supabase is not configured, so the admin area cannot authenticate anyone.')
    this.name = 'AdminUnavailableError'
  }
}

/** Thrown by {@link requireAdmin} when ADMIN_EMAIL is missing. */
export class AdminUnconfiguredError extends Error {
  constructor() {
    super('ADMIN_EMAIL is not configured, so no account can be authorized.')
    this.name = 'AdminUnconfiguredError'
  }
}

export interface AdminContext {
  user: User
  email: string
  supabase: DZSupabaseClient
}

/**
 * Gate for admin pages. Redirects anonymous callers to the login form and
 * throws for authenticated-but-unauthorized ones.
 *
 * `redirect()` works by throwing, so this must be called at the top of a
 * Server Component or Server Action, never inside a try/catch that would
 * swallow it.
 *
 * @param intendedPath where to return the user after a successful login
 */
export async function requireAdmin(intendedPath?: string): Promise<AdminContext> {
  const state = await getAdminAuthState()

  switch (state.status) {
    case 'authorized':
      return { user: state.user, email: state.email, supabase: state.supabase }
    case 'anonymous': {
      const next = sanitizeNextPath(intendedPath)
      const query = next === '/admin' ? '' : `?${NEXT_PARAM}=${encodeURIComponent(next)}`
      redirect(`${ADMIN_LOGIN_PATH}${query}`)
      break
    }
    case 'unavailable':
      throw new AdminUnavailableError()
    case 'unconfigured':
      throw new AdminUnconfiguredError()
    case 'forbidden':
      throw new AdminForbiddenError()
  }

  // Unreachable: redirect() throws. Present so the function has no implicit
  // return path under `noImplicitReturns`.
  throw new AdminForbiddenError()
}

/**
 * Gate for Server Actions.
 *
 * Actions return a result object rather than redirecting, so a denial can be
 * rendered in the form the user is already looking at. The message is
 * deliberately identical for "not signed in" and "signed in as someone else" —
 * a distinct message would confirm to an attacker that their credentials were
 * valid, just not privileged.
 */
export async function requireAdminForAction(): Promise<
  { ok: true; context: AdminContext } | { ok: false; message: string }
> {
  const state = await getAdminAuthState()

  if (state.status === 'authorized') {
    return { ok: true, context: { user: state.user, email: state.email, supabase: state.supabase } }
  }

  if (state.status === 'unavailable') {
    return {
      ok: false,
      message:
        'This deployment is not connected to Supabase, so nothing can be saved. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    }
  }

  if (state.status === 'unconfigured') {
    return {
      ok: false,
      message: 'The admin area is not configured. Set ADMIN_EMAIL and redeploy.',
    }
  }

  return { ok: false, message: 'Your session is not authorized. Sign in again to continue.' }
}

/** Pure predicate, extracted so it can be tested without a Supabase client. */
export function isAuthorizedEmail(candidate: string | null | undefined, adminEmail: string | null) {
  if (!adminEmail) return false
  if (typeof candidate !== 'string') return false
  const normalized = normalizeEmail(candidate)
  return normalized !== '' && normalized === adminEmail
}
