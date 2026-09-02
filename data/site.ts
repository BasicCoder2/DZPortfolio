import type { SiteConfig } from '@/types'

/**
 * Global site configuration.
 * Single source of truth for site-wide metadata and author information.
 * Update NEXT_PUBLIC_SITE_URL in .env for production deployment.
 */
export const siteConfig: SiteConfig = {
  name: 'Daniel Zimba',
  title: 'Daniel Zimba — Software Developer',
  description:
    'Software Developer building enterprise systems, AI-powered applications and digital products.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://danielzimba.dev',
  author: {
    name: 'Daniel Zimba',
    email: 'daniel@zimba.dev',
    role: 'Software Developer',
  },
  keywords: [
    'Software Developer',
    'Enterprise Systems',
    'TypeScript',
    'Next.js',
    'React',
    'System Architecture',
  ],
  ogImage: '/assets/og/og-default.png',
  cvPath: '/assets/cv/daniel-zimba-cv.pdf',
}
