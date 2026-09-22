import type { ComponentPropsWithoutRef } from 'react'

/**
 * Hand-drawn, two-tone marks for the "What I work on" cards — one per
 * service in data/services.ts, keyed by service id rather than the Lucide
 * icon name that field still carries (kept there for the admin dashboard's
 * icon picker; the public cards no longer read it).
 *
 * Each mark pairs a solid accent shape with a lighter tint of the same
 * colour, so they read as a small illustration rather than a stock outline
 * glyph. All are drawn on a 40×40 grid and take `currentColor` for the solid
 * fill so `text-accent-*` on the wrapper controls their colour.
 */

type IconProps = ComponentPropsWithoutRef<'svg'>

function EnterpriseSystemsIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="40" viewBox="0 0 40 40" width="40" {...props}>
      <rect fill="currentColor" height="26" opacity="0.18" rx="2" width="12" x="6" y="8" />
      <rect fill="currentColor" height="18" rx="2" width="12" x="22" y="16" />
      <rect fill="currentColor" height="3" opacity="0.55" width="6" x="9" y="13" />
      <rect fill="currentColor" height="3" opacity="0.55" width="6" x="9" y="20" />
      <rect fill="currentColor" height="3" opacity="0.55" width="6" x="9" y="27" />
      <rect className="dark:fill-[color:var(--surface-elevated)]" fill="white" height="2.5" width="6" x="25" y="20" />
      <rect className="dark:fill-[color:var(--surface-elevated)]" fill="white" height="2.5" width="6" x="25" y="26" />
    </svg>
  )
}

function WebApplicationsIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="40" viewBox="0 0 40 40" width="40" {...props}>
      <rect fill="currentColor" height="24" opacity="0.18" rx="3" width="30" x="5" y="8" />
      <rect fill="currentColor" height="6" rx="3" width="30" x="5" y="8" />
      <circle className="dark:fill-[color:var(--surface-elevated)]" cx="9.5" cy="11" fill="white" r="0.9" />
      <circle className="dark:fill-[color:var(--surface-elevated)]" cx="12.5" cy="11" fill="white" r="0.9" />
      <path d="M11 26 L18 18 L23 23 L29 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
    </svg>
  )
}

function AiSolutionsIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="40" viewBox="0 0 40 40" width="40" {...props}>
      <path
        d="M20 5 L23.2 16.8 L35 20 L23.2 23.2 L20 35 L16.8 23.2 L5 20 L16.8 16.8 Z"
        fill="currentColor"
      />
      <circle cx="31" cy="9" fill="currentColor" opacity="0.45" r="3" />
      <circle cx="9" cy="30" fill="currentColor" opacity="0.45" r="2.25" />
    </svg>
  )
}

function MobileApplicationsIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="40" viewBox="0 0 40 40" width="40" {...props}>
      <rect fill="currentColor" height="30" opacity="0.18" rx="4" width="17" x="11.5" y="5" />
      <rect fill="currentColor" height="21" rx="1.5" width="13" x="13.5" y="8.5" />
      <circle cx="20" cy="31.5" fill="currentColor" r="1.6" />
    </svg>
  )
}

export const serviceIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  'enterprise-systems': EnterpriseSystemsIcon,
  'web-applications': WebApplicationsIcon,
  'ai-solutions': AiSolutionsIcon,
  'mobile-applications': MobileApplicationsIcon,
}
