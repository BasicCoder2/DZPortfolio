import type { NavItem, SocialLink } from '@/types'

/**
 * Application-wide constants for DZPortfolio.
 * Import specific constants — avoid barrel re-exports of this file.
 */

/** Site-level breakpoints (matches Tailwind defaults). */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/** Maximum content width in pixels. */
export const MAX_CONTENT_WIDTH = 1200

/** Navigation scroll offset for anchor links (accounts for sticky nav). */
export const SCROLL_OFFSET = 80

/** Number of featured projects to display on homepage. */
export const FEATURED_PROJECTS_COUNT = 3

/** Number of recent blog posts to display on homepage. */
export const RECENT_POSTS_COUNT = 3

/** Default OG image path (relative to /public). */
export const DEFAULT_OG_IMAGE = '/assets/og/og-default.png'

/** Contact email for the portfolio owner. */
export const CONTACT_EMAIL = 'daniel@zimba.dev'

/** GitHub base URL. */
export const GITHUB_BASE_URL = 'https://github.com'

/** LinkedIn base URL. */
export const LINKEDIN_BASE_URL = 'https://linkedin.com/in'

/**
 * Main navigation links used in Header and Footer.
 */
export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'What I Build', href: '/#services' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

/**
 * Social media and external profile links.
 *
 * The single source of truth for social links. GitHub and LinkedIn are
 * resolved from environment variables (with local fallbacks) so the same
 * codebase can point at different profiles per environment.
 */
/**
 * Builds a profile URL from an environment value that may be either a bare
 * handle (`BasicCoder2`) or an already-absolute profile URL.
 *
 * These variables get filled in by hand, and both shapes are natural to paste —
 * one of them is even named `_URL` and the other `_USERNAME`. Blindly
 * concatenating the base onto a value that already carried one produced
 * `https://github.com/https://github.com/BasicCoder2`.
 */
function profileUrl(base: string, value: string | undefined, fallbackHandle: string): string {
  const raw = value?.trim().replace(/\/+$/, '') || fallbackHandle
  if (/^https?:\/\//i.test(raw)) return raw
  return `${base}/${raw.replace(/^\/+/, '')}`
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    href: profileUrl(GITHUB_BASE_URL, process.env.NEXT_PUBLIC_GITHUB_USERNAME, 'danielzimba'),
    icon: 'github',
    ariaLabel: 'Visit my GitHub profile',
  },
  {
    name: 'LinkedIn',
    href: profileUrl(LINKEDIN_BASE_URL, process.env.NEXT_PUBLIC_LINKEDIN_URL, 'danielzimba'),
    icon: 'linkedin',
    ariaLabel: 'Connect with me on LinkedIn',
  },
  {
    name: 'Email',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: 'mail',
    ariaLabel: 'Send me an email',
  },
]
