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

  const isLinkActive = (href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      return activeSection === targetId
    }

    if (href === '/') return pathname === '/' && activeSection === ''

    return pathname.startsWith(href)
  }

  return (
    <nav aria-label="Primary navigation" className={cn('hidden items-center gap-6 md:flex', className)}>
      {NAV_LINKS.map((link) => {
        const isActive = isLinkActive(link.href)

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group relative text-sm font-medium transition-colors hover:text-text-primary',
              isActive ? 'text-accent-green' : 'text-text-secondary'
            )}
            href={link.href}
            key={link.label}
          >
            {link.label}
            <span
              aria-hidden="true"
              className={cn(
                'absolute -bottom-1 left-0 w-full h-[2px] bg-accent-green origin-left scale-x-0 transition-transform duration-300 ease-out',
                'transition-transform duration-300 ease-out group-hover:scale-x-100',
                isActive && 'scale-x-100'
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}
