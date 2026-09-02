'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SCROLL_OFFSET } from '@/lib/constants'

interface NavigationState {
  pathname: string
  activeSection: string
  isScrolled: boolean
}

/**
 * Single source of truth for navigation state.
 * Returns the current route pathname, the currently active section ID (if any),
 * and whether the page has been scrolled down (for nav styling).
 *
 * Active section is resolved from scroll position rather than
 * `IntersectionObserver`. Sections here run two to five times the viewport
 * height, so `intersectionRatio` tops out around 0.2 and ratio thresholds never
 * fire — the observer only ever reported the initial edge crossing and then held
 * stale state. Comparing each section's top against a reading line just below
 * the header is independent of section height and always yields exactly one
 * answer.
 */
export function useNavigationState(): NavigationState {
  const pathname = usePathname() || ''
  const [activeSection, setActiveSection] = useState<string>('')
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }

    // Initialize on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track the active section against a reading line below the fixed header
  useEffect(() => {
    let frame = 0

    const compute = () => {
      frame = 0

      // Queried per pass rather than captured once: the page transition wrapper
      // replaces these nodes after mount, and references held from mount go
      // detached — a detached element reports a zero rect, which is what made
      // every section look like it started at the top of the page.
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-section]'))
      if (sections.length === 0) return

      const line = window.scrollY + SCROLL_OFFSET + 8

      // Sections are in document order, so the last one to start above the
      // reading line is the one being read.
      let current = ''
      for (const section of sections) {
        const top = section.getBoundingClientRect().top + window.scrollY
        if (top <= line) current = section.id
      }

      // A short final section may never reach the line, so hand it the last
      // scroll position outright.
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (atBottom) current = sections[sections.length - 1].id

      setActiveSection(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname]) // Re-run when pathname changes to pick up new sections

  return {
    pathname,
    activeSection,
    isScrolled,
  }
}
