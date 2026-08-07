import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
  className?: string
}

/**
 * MainContent wrapper.
 * Renders the semantic `<main>` tag and applies the necessary top padding
 * to offset the sticky navigation bar, ensuring content isn't hidden beneath it.
 */
export function MainContent({ children, className }: MainContentProps) {
  return (
    <main
      className={cn(
        // pt-24 provides 96px top padding (nav is usually ~80px + some breathing room)
        'flex-1 w-full pt-24',
        className
      )}
    >
      {children}
    </main>
  )
}
