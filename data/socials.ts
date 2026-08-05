import type { SocialLink } from '@/types'

/**
 * Social media and professional profile links.
 * Icons are Lucide icon names resolved at component render time.
 * Update hrefs with real profile URLs before deployment.
 */
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    href: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'danielzimba'}`,
    icon: 'Github',
    ariaLabel: 'View Daniel Zimba on GitHub',
  },
  {
    name: 'LinkedIn',
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? 'https://linkedin.com/in/danielzimba',
    icon: 'Linkedin',
    ariaLabel: 'Connect with Daniel Zimba on LinkedIn',
  },
  {
    name: 'Email',
    href: 'mailto:daniel@zimba.dev',
    icon: 'Mail',
    ariaLabel: 'Send Daniel Zimba an email',
  },
]
