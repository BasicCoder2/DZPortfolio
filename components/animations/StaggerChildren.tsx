'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  fadeLeftVariants,
  fadeRightVariants,
  fadeUpVariants,
  STAGGER_FAST,
  STAGGER_SLOW,
  staggerContainerFastVariants,
  staggerContainerVariants,
} from '@/lib/motion'
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

type StaggerItemVariant = 'fadeUp' | 'fadeLeft' | 'fadeRight'

interface StaggerItemProps extends PropsWithChildrenAndClassName {
  /** Entrance direction inherited from the nearest StaggerChildren parent. */
  variant?: StaggerItemVariant
  /** Use list-item semantics when animating items inside a list. */
  as?: 'div' | 'li'
  /** Optionally stagger nested StaggerItem children without another observer. */
  staggerChildren?: 'fast' | 'slow'
}

const itemVariants = {
  fadeUp: fadeUpVariants,
  fadeLeft: fadeLeftVariants,
  fadeRight: fadeRightVariants,
} as const

/**
 * A child of StaggerChildren. It owns no viewport observer: the parent reveals
 * the group once, then controls this item's delay through its stagger variant.
 */
export function StaggerItem({
  children,
  className,
  variant = 'fadeUp',
  as: Tag = 'div',
  staggerChildren,
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return <Tag className={className}>{children}</Tag>

  const MotionItem = Tag === 'li' ? motion.li : motion.div
  const childStagger =
    staggerChildren === 'fast'
      ? STAGGER_FAST
      : staggerChildren === 'slow'
        ? STAGGER_SLOW
        : undefined
  return (
    <MotionItem
      className={cn(className)}
      transition={childStagger}
      variants={itemVariants[variant]}
    >
      {children}
    </MotionItem>
  )
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
