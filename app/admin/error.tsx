'use client'

import Link from 'next/link'
import { useEffect } from 'react'

/**
 * Error boundary for the admin area.
 *
 * Backstop for the guards that throw rather than render — `requireAdmin()`
 * inside a query, a Supabase outage, a migration that has not been applied. It
 * shows the digest rather than the message: React strips server error messages
 * in production anyway, and the digest is what correlates this screen with the
 * server log entry that has the real detail.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[admin] unhandled error', error)
  }, [error])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6 py-20 text-text-primary">
      <div className="w-full max-w-lg">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">Admin</p>
        <h1 className="mt-3 text-h3">Something went wrong</h1>
        <p className="mt-4 text-text-secondary">
          That screen could not be loaded. This is usually a Supabase connection or migration
          problem rather than something you did.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-xs text-text-tertiary">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-md bg-accent-green px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            type="button"
            onClick={reset}
          >
            Try again
          </button>
          <Link
            className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent-green hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            href="/admin"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
