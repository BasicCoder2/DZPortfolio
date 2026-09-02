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
    email: 'dzimba180@gmail.com',
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
  cvPath: '/assets/cv/daniel-zimba-cv.pdf',

  profile: {
    avatar: '/assets/portrait/daniel-zimba-avatar.jpg',
    summary:
      'I build enterprise systems, AI-powered applications and digital products for businesses and institutions.',
    // Mirrors the wording already used in the contact section.
    availability: 'Open to opportunities and collaborations',
    // Left blank deliberately — fill this in and the card shows it.
    location: '',
  },
}
