import type { SiteConfig } from '@/types'

/**
 * Global site configuration.
 * Single source of truth for site-wide metadata and author information.
 * Update NEXT_PUBLIC_SITE_URL in .env for production deployment.
 */
export const siteConfig: SiteConfig = {
  name: 'Daniel Zimba',
  title: 'Daniel Zimba — Software Engineer',
  description:
    'Senior Software Engineer specializing in enterprise systems, scalable architecture, and full-stack development. Building software that matters.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://danielzimba.dev',
  author: {
    name: 'Daniel Zimba',
    email: 'daniel@zimba.dev',
    role: 'Senior Software Engineer',
  },
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    'Enterprise Systems',
    'TypeScript',
    'Next.js',
    'React',
    'System Architecture',
  ],
  ogImage: '/og/og-default.png',
}
