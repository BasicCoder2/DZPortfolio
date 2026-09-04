'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Section navigation for the admin area.
 *
 * A client component only because it needs `usePathname` to mark the current
 * section. `aria-current="page"` carries that state for assistive technology;
 * the colour and left rule are the visual half of the same signal, never the
 * only one.
 */

interface AdminSection {
  href: string
  label: string
  /** Dashboard lives at the prefix every other section extends, so it alone
      must match exactly or it would light up on every screen. */
  exact?: boolean
}

const SECTIONS: readonly AdminSection[] = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/experience', label: 'Experience' },
  { href: '/admin/certifications', label: 'Certifications' },
  { href: '/admin/engagement', label: 'Engagement' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin sections" className="lg:w-52 lg:shrink-0">
      <ul className="flex flex-wrap gap-x-1 gap-y-1 lg:sticky lg:top-12 lg:flex-col">
        {SECTIONS.map((section) => {
          const isActive = section.exact
            ? pathname === section.href
            : pathname === section.href || pathname.startsWith(`${section.href}/`)

          return (
            <li key={section.href}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
                  'lg:rounded-none lg:border-l-2 lg:pl-4',
                  isActive
                    ? 'bg-surface font-medium text-accent-green lg:border-accent-green lg:bg-transparent'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary lg:border-border lg:hover:bg-transparent'
                )}
                href={section.href}
              >
                {section.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
