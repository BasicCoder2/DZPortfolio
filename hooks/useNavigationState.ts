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
 * It uses `IntersectionObserver` to track which section is currently in view
 * and updates `activeSection` accordingly.
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

  // Track active section via IntersectionObserver
  useEffect(() => {
    // Only track sections on the homepage for now, or generally sections with ids
    const sectionElements = document.querySelectorAll<HTMLElement>('[data-nav-section]')

    if (sectionElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the intersection entry that is currently intersecting
        // If multiple are intersecting, take the one with the highest intersection ratio
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      {
        // Adjust the root margin to account for the sticky header (SCROLL_OFFSET)
        // and trigger slightly before the section hits the exact top.
        rootMargin: `-${SCROLL_OFFSET}px 0px -40% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    sectionElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [pathname]) // Re-run when pathname changes to pick up new sections

  return {
    pathname,
    activeSection,
    isScrolled,
  }
}
