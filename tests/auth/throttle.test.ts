import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetLoginThrottle,
  checkLoginThrottle,
  clearLoginThrottle,
  loginThrottleKey,
  recordFailedLogin,
} from '@/lib/auth/throttle'

/**
 * Login throttling.
 *
 * All timing is injected rather than faked with timers, so these assert the
 * arithmetic directly and do not depend on the runner's clock.
 */
describe('login throttle', () => {
  const key = loginThrottleKey('203.0.113.10', 'owner@example.com')

  beforeEach(() => {
    __resetLoginThrottle()
  })

  it('allows an untouched key', () => {
    expect(checkLoginThrottle(key)).toEqual({ allowed: true, retryAfterSeconds: 0 })
  })

  it('allows attempts up to the limit', () => {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      recordFailedLogin(key)
      expect(checkLoginThrottle(key).allowed).toBe(true)
    }
  })

  it('blocks after five failures, and says for how long', () => {
    for (let attempt = 0; attempt < 5; attempt += 1) recordFailedLogin(key)

    const decision = checkLoginThrottle(key)
    expect(decision.allowed).toBe(false)
    expect(decision.retryAfterSeconds).toBeGreaterThan(0)
    expect(decision.retryAfterSeconds).toBeLessThanOrEqual(15 * 60)
  })

  it('lets the block expire', () => {
    const now = 1_000_000
    for (let attempt = 0; attempt < 5; attempt += 1) recordFailedLogin(key, now)

    expect(checkLoginThrottle(key, now + 60_000).allowed).toBe(false)
    expect(checkLoginThrottle(key, now + 15 * 60_000 + 1).allowed).toBe(true)
  })

  it('forgets stale failures instead of accumulating them forever', () => {
    const now = 1_000_000
    recordFailedLogin(key, now)
    recordFailedLogin(key, now)

    // Well outside the 15-minute window: the counter restarts, so these two
    // do not combine with three fresh ones to trip the limit.
    const later = now + 20 * 60_000
    recordFailedLogin(key, later)
    recordFailedLogin(key, later)
    recordFailedLogin(key, later)

    expect(checkLoginThrottle(key, later).allowed).toBe(true)
  })

  it('clears on a successful sign-in', () => {
    for (let attempt = 0; attempt < 5; attempt += 1) recordFailedLogin(key)
    expect(checkLoginThrottle(key).allowed).toBe(false)

    clearLoginThrottle(key)
    expect(checkLoginThrottle(key).allowed).toBe(true)
  })

  it('scopes buckets per address and per email', () => {
    // Otherwise one attacker guessing a made-up address could lock the real
    // administrator out of their own site.
    const other = loginThrottleKey('203.0.113.10', 'someone-else@example.com')
    const otherAddress = loginThrottleKey('198.51.100.7', 'owner@example.com')

    for (let attempt = 0; attempt < 5; attempt += 1) recordFailedLogin(other)

    expect(checkLoginThrottle(other).allowed).toBe(false)
    expect(checkLoginThrottle(key).allowed).toBe(true)
    expect(checkLoginThrottle(otherAddress).allowed).toBe(true)
  })

  it('normalizes the email into the key', () => {
    expect(loginThrottleKey('1.2.3.4', ' Owner@Example.com ')).toBe(
      loginThrottleKey('1.2.3.4', 'owner@example.com')
    )
  })
})
