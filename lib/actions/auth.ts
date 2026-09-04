'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminEmail, normalizeEmail } from '@/lib/env'
import { loginSchema } from '@/lib/content/schemas'
import { errorState, toFieldErrors, type FormState } from '@/lib/actions/state'
import { ADMIN_LOGIN_PATH, sanitizeNextPath } from '@/lib/auth/redirects'
import {
  checkLoginThrottle,
  clearLoginThrottle,
  loginThrottleKey,
  recordFailedLogin,
} from '@/lib/auth/throttle'

/**
 * Sign-in and sign-out for the single administrator.
 *
 * ## One failure message
 *
 * Wrong password, unknown account, and "correct password but not the
 * administrator" all return the same sentence. Distinguishing them would let
 * an attacker enumerate valid accounts and confirm when they had found working
 * credentials. The operator loses a little diagnostic precision; the honest
 * trade is that they know their own password.
 *
 * ## Authorization after authentication
 *
 * `signInWithPassword` succeeding only proves the account exists in this
 * Supabase project. If the verified email is not ADMIN_EMAIL the session is
 * immediately signed out again, so no admin cookie is ever left behind for an
 * unauthorized account to reuse.
 */

const GENERIC_FAILURE = 'That email and password combination was not accepted.'

/** Best-effort client address for throttling. Spoofable; see lib/auth/throttle.ts. */
async function clientAddress(): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown'
}

export async function signInAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next'),
  })

  if (!parsed.success) {
    return errorState('Check the highlighted fields.', toFieldErrors(parsed.error))
  }

  const { email, password, next } = parsed.data
  const destination = sanitizeNextPath(next)
  const throttleKey = loginThrottleKey(await clientAddress(), email)

  const throttle = checkLoginThrottle(throttleKey)
  if (!throttle.allowed) {
    const minutes = Math.ceil(throttle.retryAfterSeconds / 60)
    return errorState(
      `Too many failed attempts. Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`
    )
  }

  const adminEmail = getAdminEmail()
  if (!adminEmail) {
    // Fail closed and say so plainly: this is a deployment fault, not a
    // credential fault, and the operator is the only person who sees it.
    return errorState(
      'ADMIN_EMAIL is not set on this deployment, so no account can sign in. ' +
        'Add it to the environment and redeploy.'
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    recordFailedLogin(throttleKey)
    return errorState(GENERIC_FAILURE)
  }

  if (normalizeEmail(data.user.email ?? '') !== adminEmail) {
    // Authenticated, but not the administrator. Drop the session so the
    // account cannot linger with a valid cookie against /admin.
    await supabase.auth.signOut()
    recordFailedLogin(throttleKey)
    return errorState(GENERIC_FAILURE)
  }

  clearLoginThrottle(throttleKey)

  // Outside any try/catch: redirect() signals by throwing, and catching it
  // would turn a successful login into a silent no-op.
  redirect(destination)
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(ADMIN_LOGIN_PATH)
}
