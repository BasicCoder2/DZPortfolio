import type { Metadata } from 'next'

/**
 * Outermost admin segment.
 *
 * Two jobs, both of which must apply to the login page as well as to the
 * protected screens beneath it:
 *
 * - **Dynamic rendering.** Everything here reads the session cookie. Without
 *   this, Next would try to prerender the login form at build time, where
 *   there is no request to read.
 * - **Keep it out of search engines.** `noindex, nofollow` plus the absence of
 *   any link from the public navigation. Neither is a security control — the
 *   authorization checks are — but an admin login form in search results is an
 *   invitation nobody needs to send.
 *
 * The authorization gate itself lives one level down, in
 * app/admin/(protected)/layout.tsx, because /admin/login must stay reachable
 * to exactly the people who cannot pass it.
 */

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
