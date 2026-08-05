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
export const DEFAULT_OG_IMAGE = '/og/og-default.png'

/** Contact email for the portfolio owner. */
export const CONTACT_EMAIL = 'daniel@zimba.dev'

/** GitHub base URL. */
export const GITHUB_BASE_URL = 'https://github.com'

/** LinkedIn base URL. */
export const LINKEDIN_BASE_URL = 'https://linkedin.com/in'
