'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { fadeUpVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { PropsWithChildrenAndClassName } from '@/types'

interface FadeInProps extends PropsWithChildrenAndClassName {
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number
  /** Animation duration (seconds). Default: driven by spring preset */
  duration?: number
  /** Direction to fade in from. Default: 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Custom Framer Motion variants override. */
  variants?: Variants
}

const directionVariants: Record<NonNullable<FadeInProps['direction']>, Variants> = {
  up: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

/**
 * FadeIn — wraps children in a Framer Motion div that fades in on mount
 * or when triggered by a parent StaggerChildren container.
 *
 * Respects `prefers-reduced-motion` — renders statically when motion is reduced.
 *
 * @example
 * <FadeIn delay={0.2} direction="up">
 *   <h1>Hello World</h1>
 * </FadeIn>
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  variants,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion()

  const resolvedVariants = variants ?? directionVariants[direction]

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={resolvedVariants}
      transition={{
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  )
}

// Named export only — no anonymous default exports per code quality rules
export default FadeIn
