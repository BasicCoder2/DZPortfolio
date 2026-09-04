import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAdminAuthState } from '@/lib/auth/admin'
import { sanitizeNextPath } from '@/lib/auth/redirects'
import { isSupabaseConfigured } from '@/lib/env'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * Administrator sign-in.
 *
 * Sits outside the `(protected)` group, so the gate that sends people here
 * does not also guard it. An already-authorized visitor is bounced straight on
 * to their destination rather than being shown a form they do not need.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const destination = sanitizeNextPath(next)

  const configured = isSupabaseConfigured()
  if (configured) {
    const state = await getAdminAuthState()
    if (state.status === 'authorized') redirect(destination)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6 py-16 text-text-primary">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
          DZ / Admin
        </p>
        <h1 className="mt-3 text-h3">Sign in</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Content management for danielzimba.dev. This area is for the site administrator.
        </p>

        {configured ? (
          <LoginForm next={destination} />
        ) : (
          <p
            className="mt-8 rounded-md border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]"
            role="alert"
          >
            Supabase is not configured on this deployment, so sign-in is unavailable. Set{' '}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </p>
        )}

        <Link
          className="mt-10 inline-block text-sm text-text-tertiary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
          href="/"
        >
          ← Back to the site
        </Link>
      </div>
    </main>
  )
}
