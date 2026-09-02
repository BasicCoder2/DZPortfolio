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
        // Offset matches the fixed header exactly (--nav-h). Sections that want
        // to run their background under the nav pull back up by the same token.
        'flex-1 w-full pt-[var(--nav-h)]',
        className
      )}
    >
      {children}
    </main>
  )
}
