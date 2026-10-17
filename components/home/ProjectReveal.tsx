'use client'

import { m, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { STAGGER_SLOW, transitionReveal } from '@/lib/motion'

/**
 * Scroll entrance for one row of the Work section.
 *
 * `ProjectReveal` owns the row's single viewport observer and plays once;
 * every `ProjectRevealItem` beneath it, however deeply nested, inherits the
 * `hidden` / `visible` state and is staggered in render order: the image
 * first, sliding in from the side it sits on, then the text line by line on
 * the same rhythm as the hero.
 *
 * Reduced motion keeps the same initial styles (so server and client markup
 * match) and only drops the movement: items appear in place with no offset
 * animation and no stagger.
 */

const MEDIA_DURATION = 0.7

export function ProjectReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const variants: Variants = {
    hidden: {},
    visible: { transition: reduce ? { staggerChildren: 0 } : STAGGER_SLOW },
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      variants={variants}
      viewport={{ once: true, amount: 0.2 }}
      whileInView="visible"
    >
      {children}
    </m.div>
  )
}

const ELEMENTS = { div: m.div, p: m.p, h3: m.h3, ul: m.ul } as const

const OFFSETS = {
  left: { x: -28 },
  right: { x: 28 },
  up: { y: 14 },
} as const

export function ProjectRevealItem({
  children,
  className,
  from = 'up',
  as = 'div',
  ...rest
}: {
  children: ReactNode
  className?: string
  /** Direction the item travels in from. Media uses its own side. */
  from?: keyof typeof OFFSETS
  as?: keyof typeof ELEMENTS
  'aria-label'?: string
}) {
  const reduce = useReducedMotion()
  const Element = ELEMENTS[as]
  const isMedia = from !== 'up'
  const variants: Variants = {
    hidden: { opacity: 0, ...OFFSETS[from] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: reduce
        ? { duration: 0 }
        : isMedia
          ? { ...transitionReveal, duration: MEDIA_DURATION }
          : transitionReveal,
    },
  }

  return (
    <Element className={className} variants={variants} {...rest}>
      {children}
    </Element>
  )
}
