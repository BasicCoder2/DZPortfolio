'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { scaleInVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { PropsWithChildrenAndClassName } from '@/types'

interface ScaleInProps extends PropsWithChildrenAndClassName {
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number
}

/**
 * ScaleIn — scales children from 0.92 → 1 with a fade.
 * Ideal for cards, images, and modal dialogs.
 *
 * Respects `prefers-reduced-motion`.
 *
 * @example
 * <ScaleIn delay={0.1}>
 *   <ProjectCard />
 * </ScaleIn>
 */
export function ScaleIn({ children, className, delay = 0 }: ScaleInProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={scaleInVariants}
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

export default ScaleIn
