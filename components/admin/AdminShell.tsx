import Link from 'next/link'
import { signOutAction } from '@/lib/actions/auth'
import { AdminNav } from '@/components/admin/AdminNav'

/**
 * Frame for every authenticated admin screen.
 *
 * Deliberately quieter than the public site: no motion, no marketing
 * navigation, no footer. An operator here is doing chores, and the interface
 * should get out of the way of the work rather than perform. It keeps the
 * site's tokens — the same borders, the same mono eyebrows, the same green
 * accent — so it reads as part of DZPortfolio, not a bolted-on dashboard.
 */
export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-text-primary">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-green focus:px-4 focus:py-2 focus:text-accent-foreground"
        href="#admin-main"
      >
        Skip to content
      </a>

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4 lg:px-10">
          <Link
            className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            href="/admin"
          >
            DZ / Admin
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-text-tertiary sm:inline" title={email}>
              {email}
            </span>
            <Link
              className="text-sm text-text-secondary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              href="/"
              rel="noopener noreferrer"
              target="_blank"
            >
              View site
            </Link>
            <form action={signOutAction}>
              <button
                className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-accent-green hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8 lg:flex-row lg:gap-12 lg:px-10 lg:py-12">
        <AdminNav />
        <main className="min-w-0 flex-1" id="admin-main">
          {children}
        </main>
      </div>
    </div>
  )
}
