import { AppLayout } from '@/components/layout'

/**
 * Public site shell — navigation, footer, page transitions, back-to-top.
 *
 * This moved down out of the root layout when the admin area arrived. The two
 * areas want genuinely different chrome: a visitor should meet the marketing
 * navigation and the CV call-to-action, and an operator editing a draft should
 * meet neither. A route group keeps every public URL exactly where it was —
 * `(site)` contributes nothing to the path.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
