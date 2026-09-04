import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Access control for the admin area.
 *
 * The three cases this file exists for:
 *
 *   1. no session at all                -> anonymous
 *   2. a valid session, wrong account   -> forbidden
 *   3. a valid session, the admin       -> authorized
 *
 * Case 2 is the one worth guarding with tests. It is the failure mode where
 * "is the user logged in?" gets mistaken for "is the user allowed?", and it
 * would hand every draft, every price and every delete button to anyone who
 * could create an account in the Supabase project.
 */

const getUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser } }),
}))

const ORIGINAL_ADMIN_EMAIL = process.env.ADMIN_EMAIL

function signedInAs(email: string | null) {
  getUser.mockResolvedValue({
    data: { user: email === null ? null : { id: 'user-1', email } },
    error: null,
  })
}

const ORIGINAL_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ORIGINAL_SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

beforeEach(() => {
  vi.resetModules()
  process.env.ADMIN_EMAIL = 'owner@example.com'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
})

afterEach(() => {
  if (ORIGINAL_ADMIN_EMAIL === undefined) delete process.env.ADMIN_EMAIL
  else process.env.ADMIN_EMAIL = ORIGINAL_ADMIN_EMAIL
  if (ORIGINAL_SUPABASE_URL === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
  else process.env.NEXT_PUBLIC_SUPABASE_URL = ORIGINAL_SUPABASE_URL
  if (ORIGINAL_SUPABASE_KEY === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ORIGINAL_SUPABASE_KEY
})

describe('getAdminAuthState', () => {
  it('reports anonymous when there is no session', async () => {
    signedInAs(null)
    const { getAdminAuthState } = await import('@/lib/auth/admin')
    expect((await getAdminAuthState()).status).toBe('anonymous')
  })

  it('reports forbidden for an authenticated account that is not the admin', async () => {
    signedInAs('someone.else@example.com')
    const { getAdminAuthState } = await import('@/lib/auth/admin')

    const state = await getAdminAuthState()
    expect(state.status).toBe('forbidden')
    // Critically: no Supabase client is handed back, so a caller that ignores
    // the status still cannot query anything.
    expect(state).not.toHaveProperty('supabase')
  })

  it('authorizes the configured administrator', async () => {
    signedInAs('owner@example.com')
    const { getAdminAuthState } = await import('@/lib/auth/admin')

    const state = await getAdminAuthState()
    expect(state.status).toBe('authorized')
  })

  it('matches the email case-insensitively and ignores surrounding space', async () => {
    process.env.ADMIN_EMAIL = '  Owner@Example.COM '
    signedInAs('OWNER@example.com')
    const { getAdminAuthState } = await import('@/lib/auth/admin')

    expect((await getAdminAuthState()).status).toBe('authorized')
  })

  it('fails closed when ADMIN_EMAIL is not configured', async () => {
    delete process.env.ADMIN_EMAIL
    signedInAs('anyone@example.com')
    const { getAdminAuthState } = await import('@/lib/auth/admin')

    // Not 'authorized'. An unconfigured deployment must authorize nobody,
    // rather than admitting the first account that signs in.
    expect((await getAdminAuthState()).status).toBe('unconfigured')
  })

  it('reports unavailable when Supabase itself is not configured', async () => {
    // Found by the smoke test: without this branch, createClient() threw and
    // every admin screen answered 500 instead of naming the missing variables.
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const { getAdminAuthState } = await import('@/lib/auth/admin')

    expect((await getAdminAuthState()).status).toBe('unavailable')
  })

  it('refuses a session whose account has no email', async () => {
    signedInAs('')
    const { getAdminAuthState } = await import('@/lib/auth/admin')
    expect((await getAdminAuthState()).status).toBe('forbidden')
  })
})

describe('requireAdminForAction', () => {
  it('refuses an anonymous caller', async () => {
    signedInAs(null)
    const { requireAdminForAction } = await import('@/lib/auth/admin')

    const result = await requireAdminForAction()
    expect(result.ok).toBe(false)
  })

  it('gives an unauthorized account the same message as an anonymous one', async () => {
    const { requireAdminForAction } = await import('@/lib/auth/admin')

    signedInAs(null)
    const anonymous = await requireAdminForAction()
    signedInAs('intruder@example.com')
    const forbidden = await requireAdminForAction()

    expect(anonymous.ok).toBe(false)
    expect(forbidden.ok).toBe(false)
    // Identical wording on purpose: a distinct message would confirm to an
    // attacker that their credentials worked and only privilege was missing.
    if (!anonymous.ok && !forbidden.ok) {
      expect(forbidden.message).toBe(anonymous.message)
    }
  })

  it('refuses, with a usable message, when Supabase is unconfigured', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    const { requireAdminForAction } = await import('@/lib/auth/admin')

    const result = await requireAdminForAction()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(/NEXT_PUBLIC_SUPABASE_URL/)
  })

  it('admits the administrator with a usable client', async () => {
    signedInAs('owner@example.com')
    const { requireAdminForAction } = await import('@/lib/auth/admin')

    const result = await requireAdminForAction()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.context.email).toBe('owner@example.com')
  })
})

describe('isAuthorizedEmail', () => {
  it('rejects when no administrator is configured', async () => {
    const { isAuthorizedEmail } = await import('@/lib/auth/admin')
    expect(isAuthorizedEmail('owner@example.com', null)).toBe(false)
  })

  it('rejects near-misses', async () => {
    const { isAuthorizedEmail } = await import('@/lib/auth/admin')
    expect(isAuthorizedEmail('owner@example.com.evil.test', 'owner@example.com')).toBe(false)
    expect(isAuthorizedEmail('owner+admin@example.com', 'owner@example.com')).toBe(false)
    expect(isAuthorizedEmail('', 'owner@example.com')).toBe(false)
    expect(isAuthorizedEmail(null, 'owner@example.com')).toBe(false)
  })
})
