/**
 * Environment access for the Supabase-backed content platform.
 *
 * Two rules shape this file:
 *
 * 1. **The build must not fail before Supabase is connected.** `next build`
 *    prerenders the public routes, and those routes read content. So the
 *    public accessors return `null` when configuration is absent and the
 *    repositories degrade to empty results, rather than throwing and taking
 *    the whole build down. A portfolio that renders its empty states is a
 *    better failure mode than a red deploy.
 *
 * 2. **Anything that writes must fail loudly.** Admin pages, server actions
 *    and the import script call the `require*` accessors, which throw a
 *    message naming the missing variable. Never the value.
 *
 * No function here logs, returns, or interpolates a secret.
 */

/** Reads a variable and treats whitespace-only as unset. */
function read(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

export interface SupabaseConfig {
  url: string
  anonKey: string
}

/**
 * Public Supabase credentials, or `null` when either is missing.
 *
 * The anon key is a public credential by design — it is safe in the client
 * bundle, and every table it can reach is guarded by RLS (see
 * supabase/migrations/0002_rls.sql).
 */
export function getSupabaseConfig(): SupabaseConfig | null {
  const url = read('NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = read('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!url || !anonKey) return null
  return { url, anonKey }
}

/** True when the app has enough configuration to talk to Supabase at all. */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null
}

/** Same as {@link getSupabaseConfig}, but throws instead of returning null. */
export function requireSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig()
  if (config) return config

  const missing = [
    read('NEXT_PUBLIC_SUPABASE_URL') ? null : 'NEXT_PUBLIC_SUPABASE_URL',
    read('NEXT_PUBLIC_SUPABASE_ANON_KEY') ? null : 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ].filter(Boolean)

  throw new Error(
    `Supabase is not configured. Missing: ${missing.join(', ')}. ` +
      'Copy .env.example to .env.local and fill in the values from your ' +
      'Supabase project (Settings -> API), then restart the dev server.'
  )
}

/**
 * The single authorized administrator address, normalized for comparison.
 *
 * Server-only: `ADMIN_EMAIL` has no `NEXT_PUBLIC_` prefix, so it is never
 * inlined into a client bundle. Reading it from a client component yields
 * `undefined`, which fails closed.
 */
export function getAdminEmail(): string | null {
  const value = read('ADMIN_EMAIL')
  return value ? normalizeEmail(value) : null
}

/** Same as {@link getAdminEmail}, but throws instead of returning null. */
export function requireAdminEmail(): string {
  const email = getAdminEmail()
  if (email) return email
  throw new Error(
    'ADMIN_EMAIL is not set. The admin area refuses every request until it ' +
      'names the address of the single authorized administrator.'
  )
}

/**
 * Canonical form used on both sides of every authorization comparison.
 *
 * Lowercase and trimmed only. Deliberately *not* clever: stripping dots or
 * `+tags` would be Gmail-specific folding that silently widens who counts as
 * the administrator on providers that treat those as distinct mailboxes.
 */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * The hostname Supabase serves storage objects from, or `null` when
 * unconfigured. Used by next.config.ts to scope `images.remotePatterns` to
 * exactly this project rather than opening the optimizer to the internet.
 */
export function getSupabaseHostname(): string | null {
  const url = read('NEXT_PUBLIC_SUPABASE_URL')
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

/** Public site origin, no trailing slash. */
export function getSiteUrl(): string {
  const explicit = read('NEXT_PUBLIC_SITE_URL')
  if (explicit) return explicit.replace(/\/+$/, '')

  // Vercel injects this for preview deployments, where no stable domain
  // exists to hardcode. Production should always set NEXT_PUBLIC_SITE_URL.
  const vercel = read('VERCEL_URL')
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}
