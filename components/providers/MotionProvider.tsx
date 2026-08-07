'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * MotionProvider reduces the initial bundle size by lazy-loading
 * Framer Motion's animation features.
 *
 * We use `domAnimation` which includes only the subset of features
 * needed for standard web animations (no drag or layout animations),
 * keeping the bundle lean.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion strict features={domAnimation}>
      {children}
    </LazyMotion>
  )
}
