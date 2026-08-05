'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks the page scroll progress as a value from 0 to 1.
 * Useful for scroll-driven progress bars and parallax effects.
 *
 * @example
 * const progress = useScrollProgress()
 * <div style={{ width: `${progress * 100}%` }} />
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}
