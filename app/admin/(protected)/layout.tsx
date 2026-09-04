import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminAuthState } from '@/lib/auth/admin'
import { signOutAction } from '@/lib/actions/auth'
import { AdminShell } from '@/components/admin/AdminShell'

/**
 * The authorization gate for every admin screen.
 *
 * A layout, so no page beneath it can forget to opt in. It is not, however,
 * the only check — each Server Action re-authorizes independently, because
 * actions are reachable by POST without this layout ever running.
 *
 * The four states are handled distinctly on purpose:
 *
 * - **unavailable** — Supabase is not configured, so there is nothing to
 *   authenticate against. Says so, rather than throwing a 500 from deep inside
 *   the client constructor.
 * - **anonymous** — redirect to the login form. Nothing rendered.
 * - **unconfigured** — ADMIN_EMAIL is missing, so nobody can be authorized.
 *   Says so plainly; only the deployer can be looking at this.
 * - **forbidden** — signed in, but not the administrator. Renders a bare 403
 *   with a sign-out button and *no shell*, so no navigation, no counts, and no
 *   content ever reach an unauthorized session.
 * - **authorized** — the real interface.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const state = await getAdminAuthState()

  if (state.status === 'unavailable') {
    return (
      <AdminNotice title="Not connected to Supabase">
        <p>
          This deployment has no <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</code>{' '}
          or <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, so there is
          no database to sign in against. Add both and redeploy.
        </p>
        <p>The public site is unaffected — it renders its empty states.</p>
      </AdminNotice>
    )
  }

  if (state.status === 'anonymous') redirect('/admin/login')

  if (state.status === 'unconfigured') {
    return (
      <AdminNotice title="Admin access is not configured">
        <p>
          This deployment has no <code className="font-mono text-sm">ADMIN_EMAIL</code> set, so no
          account can be authorized. Add it to the environment and redeploy.
        </p>
      </AdminNotice>
    )
  }

  if (state.status === 'forbidden') {
    return (
      <AdminNotice title="You do not have access to this area">
        <p>
          This account is signed in but is not the site administrator. If that is unexpected, sign
          out and try the administrator address.
        </p>
        <form action={signOutAction}>
          <button
            className="mt-6 rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent-green hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </AdminNotice>
    )
  }

  return <AdminShell email={state.email}>{children}</AdminShell>
}

/** Bare denial screen. Deliberately shares nothing with the admin shell. */
function AdminNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6 py-20 text-text-primary">
      <div className="w-full max-w-lg">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
          Restricted
        </p>
        <h1 className="mt-3 text-h3">{title}</h1>
        <div className="mt-4 space-y-4 text-text-secondary">{children}</div>
        <Link
          className="mt-8 inline-block text-sm text-text-secondary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
          href="/"
        >
          Back to the site
        </Link>
      </div>
    </main>
  )
}
