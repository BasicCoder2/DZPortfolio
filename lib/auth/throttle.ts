import 'server-only'

/**
 * Login throttling.
 *
 * Layered, because no single layer is sufficient on Vercel:
 *
 * 1. **Supabase Auth** is the durable limit and the one that actually protects
 *    the account. It rate-limits `/token?grant_type=password` per IP
 *    server-side, across every instance, and cannot be bypassed by hitting a
 *    different serverless region. Configure it under
 *    Authentication -> Rate Limits. This is the strategy of record.
 *
 * 2. **This module** is a cheap in-process backstop that absorbs a burst
 *    against one warm instance without a network round trip, and — more
 *    usefully — gives the operator a clear "wait N seconds" message instead of
 *    an opaque provider error.
 *
 * The honest limitation: serverless instances do not share memory, so a
 * distributed attacker gets one bucket per instance. That is exactly why
 * layer 1 is the real control and this is described as a backstop. Swapping
 * this for Upstash/Redis is the upgrade path if the site ever needs one; it
 * would not change any call site.
 */

interface Attempt {
  count: number
  firstAttemptAt: number
  blockedUntil: number
}

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
const BLOCK_MS = 15 * 60 * 1000

const attempts = new Map<string, Attempt>()

/** Bounds memory on a long-lived instance; the map is tiny either way. */
function evictExpired(now: number): void {
  for (const [key, attempt] of attempts) {
    if (now > attempt.blockedUntil && now - attempt.firstAttemptAt > WINDOW_MS) {
      attempts.delete(key)
    }
  }
}

export interface ThrottleDecision {
  allowed: boolean
  /** Whole seconds the caller must wait. Zero when allowed. */
  retryAfterSeconds: number
}

/**
 * Checks whether a login attempt may proceed. Does not record the attempt —
 * call {@link recordFailedLogin} only when the credentials were actually wrong,
 * so a legitimate operator with a slow password manager is never locked out by
 * their own successful logins.
 */
export function checkLoginThrottle(key: string, now = Date.now()): ThrottleDecision {
  evictExpired(now)

  const attempt = attempts.get(key)
  if (!attempt) return { allowed: true, retryAfterSeconds: 0 }

  if (now < attempt.blockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((attempt.blockedUntil - now) / 1000),
    }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

/** Records one failed attempt and blocks the key once the limit is reached. */
export function recordFailedLogin(key: string, now = Date.now()): void {
  const attempt = attempts.get(key)

  if (!attempt || now - attempt.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now, blockedUntil: 0 })
    return
  }

  attempt.count += 1
  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.blockedUntil = now + BLOCK_MS
    attempt.count = 0
    attempt.firstAttemptAt = now
  }
}

/** Clears the counter after a successful sign-in. */
export function clearLoginThrottle(key: string): void {
  attempts.delete(key)
}

/**
 * Bucket key for an attempt.
 *
 * Includes the submitted email so one attacker guessing against a made-up
 * address cannot lock the real administrator out of their own site, and the
 * client address so a single email cannot be hammered from everywhere.
 */
export function loginThrottleKey(clientAddress: string, email: string): string {
  return `${clientAddress}:${email.trim().toLowerCase()}`
}

/** Test seam. Not exported through any barrel. */
export function __resetLoginThrottle(): void {
  attempts.clear()
}
