import Link from 'next/link'
import { NAV_LINKS } from '@/lib/constants'

/**
 * Footer Navigation component.
 * Renders the primary navigation links in a horizontal row.
 */
export function Navigation() {
  return (
    <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6">
      {NAV_LINKS.map((link) => (
        <Link
          className="text-sm font-medium text-text-secondary hover:text-accent-green transition-colors"
          href={link.href}
          key={link.label}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
