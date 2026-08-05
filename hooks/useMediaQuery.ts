'use client'

import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '@/lib/constants'

type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Returns true if the viewport width is at or above the given breakpoint.
 * Matches Tailwind's mobile-first breakpoint system.
 *
 * @param breakpoint - One of: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 *
 * @example
 * const isDesktop = useMediaQuery('lg')
 * // true when viewport >= 1024px
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const minWidth = BREAKPOINTS[breakpoint]
    const query = window.matchMedia(`(min-width: ${minWidth}px)`)

    setMatches(query.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    query.addEventListener('change', handler)

    return () => query.removeEventListener('change', handler)
  }, [breakpoint])

  return matches
}
