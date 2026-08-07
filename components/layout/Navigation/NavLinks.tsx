'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'
import { useNavigationState } from '@/hooks/useNavigationState'

interface NavLinksProps {
  className?: string
}

/**
 * Desktop navigation links.
 * Highlights the active link based on scroll position or route.
 */
export function NavLinks({ className }: NavLinksProps) {
  const { pathname, activeSection } = useNavigationState()

  // Helper to determine if a link is active
  const isLinkActive = (href: string) => {
    // If it's a hash link, check active section
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      return activeSection === targetId
    }

    // Exact match for home
    if (href === '/') return pathname === '/'

    // Prefix match for other routes (e.g. /blog/post-1 matches /blog)
    return pathname.startsWith(href)
  }

  return (
    <div className={cn('hidden md:flex items-center gap-6', className)}>
      {NAV_LINKS.map((link) => {
        const isActive = isLinkActive(link.href)

        return (
          <Link
            className={cn(
              'relative text-sm font-medium transition-colors hover:text-text-primary',
              isActive ? 'text-accent-green' : 'text-text-secondary'
            )}
            href={link.href}
            key={link.label}
          >
            {link.label}
            {/* Hover reveal underline effect */}
            <span
              className={cn(
                'absolute -bottom-1 left-0 w-full h-[2px] bg-accent-green origin-left scale-x-0 transition-transform duration-300 ease-out',
                'hover:scale-x-100',
                isActive && 'scale-x-100' // Keep visible if active
              )}
            />
          </Link>
        )
      })}
    </div>
  )
}
