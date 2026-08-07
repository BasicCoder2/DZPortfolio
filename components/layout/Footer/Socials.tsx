import { SOCIAL_LINKS } from '@/lib/constants'

/**
 * Footer Socials component.
 * Renders the social media links using the global SOCIAL_LINKS constant.
 */
export function Socials() {
  return (
    <div className="flex items-center gap-6">
      {SOCIAL_LINKS.map((social) => (
        <a
          aria-label={social.ariaLabel}
          className="text-sm font-mono uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors"
          href={social.href}
          key={social.name}
          rel="noopener noreferrer"
          target="_blank"
        >
          {social.name}
        </a>
      ))}
    </div>
  )
}
