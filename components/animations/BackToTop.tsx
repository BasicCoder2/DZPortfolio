'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { backToTopVariants } from '@/lib/motion'

/**
 * A floating button that scrolls the page back to the top.
 * Appears only when the user has scrolled down past a threshold.
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 400px
      setIsVisible(window.scrollY > 400)
    }

    // Initialize state
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          animate="visible"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 p-3 bg-surface-raised border border-border rounded-full text-text-secondary shadow-lg hover:text-accent-green hover:border-accent-green-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green md:bottom-8 md:right-8"
          exit="exit"
          initial="hidden"
          variants={backToTopVariants}
          onClick={scrollToTop}
        >
          <ArrowUp className="w-5 h-5" />
        </m.button>
      )}
    </AnimatePresence>
  )
}
