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
          className="group relative text-sm font-medium text-text-secondary transition-colors hover:text-accent-green"
          href={link.href}
          key={link.label}
        >
          {link.label}
          <span aria-hidden="true" className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent-green transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      ))}
    </nav>
  )
}
