'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainerVariants, staggerContainerFastVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { PropsWithChildrenAndClassName } from '@/types'

interface StaggerChildrenProps extends PropsWithChildrenAndClassName {
  /** Stagger speed. Default: 'slow' (0.1s per child) */
  speed?: 'fast' | 'slow'
  /** Additional delay before first child animates (seconds). Default: 0 */
  delayChildren?: number
  /** HTML element to render as. Default: 'div' */
  as?: 'div' | 'ul' | 'ol' | 'section'
}

/**
 * StaggerChildren — wraps a list of children in a Framer Motion container
 * that staggers their entrance animations.
 *
 * Child elements should use FadeIn, ScaleIn, or their own motion variants
 * with `initial="hidden"` and `animate="visible"` or `whileInView`.
 *
 * Respects `prefers-reduced-motion`.
 *
 * @example
 * <StaggerChildren speed="fast">
 *   {items.map(item => (
 *     <FadeIn key={item.id}><Card {...item} /></FadeIn>
 *   ))}
 * </StaggerChildren>
 */
export function StaggerChildren({
  children,
  className,
  speed = 'slow',
  as: Tag = 'div',
}: StaggerChildrenProps) {
  const prefersReducedMotion = useReducedMotion()

  const variants = speed === 'fast' ? staggerContainerFastVariants : staggerContainerVariants

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      variants={variants}
      viewport={{ once: true, margin: '-50px' }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  )
}

export default StaggerChildren
