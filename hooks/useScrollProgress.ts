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
    let frame = 0
    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const nextProgress = docHeight > 0 ? scrollTop / docHeight : 0
        setProgress((current) => (current === nextProgress ? current : nextProgress))
        frame = 0
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return progress
}
