/**
 * Safe redirect handling for the admin area.
 *
 * The login form remembers where you were headed. That "where" arrives as a
 * query parameter, which means it is attacker-controlled: a link like
 * `/admin/login?next=https://evil.example` would otherwise hand a freshly
 * authenticated administrator straight to a phishing page wearing the
 * momentum of a successful login.
 *
 * `sanitizeNextPath` is the only function allowed to turn that parameter into
 * a destination, and it is allowlist-based rather than deny-based.
 */

export const ADMIN_LOGIN_PATH = '/admin/login'
export const ADMIN_HOME_PATH = '/admin'

/** Query parameter carrying the post-login destination. */
export const NEXT_PARAM = 'next'

/**
 * True when the string contains a C0 control character or DEL.
 *
 * Written as a codepoint scan rather than a regex literal so the source file
 * stays plain ASCII — a regex character class holding raw control bytes is
 * invisible in review and easy to mangle in an editor.
 */
function hasControlCharacter(value: string): boolean {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0
    if (code < 0x20 || code === 0x7f) return true
  }
  return false
}

/**
 * Reduces an untrusted `next` value to a local admin path, or to the admin
 * dashboard when it is anything else.
 *
 * Rejects, in order:
 *  - non-strings and empties
 *  - anything not starting with a single `/` (absolute URLs, and `//host`
 *    which browsers resolve as protocol-relative and therefore off-site)
 *  - backslashes, which some parsers fold to `/` (`/\evil.example`)
 *  - control characters, which can truncate or smuggle headers
 *  - anything outside `/admin`
 *  - the login page itself, which would loop
 */
export function sanitizeNextPath(value: string | null | undefined): string {
  if (typeof value !== 'string') return ADMIN_HOME_PATH

  const candidate = value.trim()
  if (candidate === '') return ADMIN_HOME_PATH
  if (!candidate.startsWith('/')) return ADMIN_HOME_PATH
  if (candidate.startsWith('//')) return ADMIN_HOME_PATH
  if (candidate.includes('\\')) return ADMIN_HOME_PATH
  if (hasControlCharacter(candidate)) return ADMIN_HOME_PATH

  const pathname = candidate.split(/[?#]/)[0] ?? ''
  if (pathname !== ADMIN_HOME_PATH && !pathname.startsWith(`${ADMIN_HOME_PATH}/`)) {
    return ADMIN_HOME_PATH
  }
  if (pathname === ADMIN_LOGIN_PATH) return ADMIN_HOME_PATH

  return candidate
}

/**
 * Builds the login URL for a request that needs authentication, preserving the
 * intended destination.
 */
export function buildLoginRedirect(base: URL, intended: string): URL {
  const url = new URL(base.toString())
  url.pathname = ADMIN_LOGIN_PATH
  url.search = ''

  const next = sanitizeNextPath(intended)
  if (next !== ADMIN_HOME_PATH) url.searchParams.set(NEXT_PARAM, next)

  return url
}
