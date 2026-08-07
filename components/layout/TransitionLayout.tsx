'use client'

import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { pagePreset } from '@/lib/motion'
import { useEffect, useState, type ReactNode } from 'react'

interface TransitionLayoutProps {
  children: ReactNode
}

/**
 * TransitionLayout wraps page routes to animate them in and out.
 * Triggers animation whenever the Next.js `pathname` changes.
 *
 * Uses `m.div` from Framer Motion's LazyMotion for optimized bundle size.
 * Respects `prefers-reduced-motion` settings.
 */
export function TransitionLayout({ children }: TransitionLayoutProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="w-full h-full flex flex-col min-h-screen">{children}</div>
  }

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      <m.div key={pathname} {...pagePreset} className="w-full h-full flex flex-col min-h-screen">
        {children}
      </m.div>
    </AnimatePresence>
  )
}
