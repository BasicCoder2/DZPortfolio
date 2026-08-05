'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SPRING_SMOOTH } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { WithClassName } from '@/types'

interface RevealTextProps extends WithClassName {
  /** The text string to reveal word by word. */
  text: string
  /** HTML heading level or paragraph. Default: 'p' */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  /** Delay before first word animates (seconds). Default: 0 */
  delay?: number
  /** Per-word stagger interval (seconds). Default: 0.05 */
  stagger?: number
}

/**
 * RevealText — splits a text string into words and reveals them
 * one by one with a staggered fade-up animation.
 *
 * Best used for hero headings and section titles.
 * Respects `prefers-reduced-motion` — renders full text statically.
 *
 * @example
 * <RevealText
 *   as="h1"
 *   text="Building enterprise software that scales."
 *   delay={0.3}
 * />
 */
export function RevealText({
  text,
  as: Tag = 'p',
  className,
  delay = 0,
  stagger = 0.05,
}: RevealTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const words = text.split(' ')

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={cn('flex flex-wrap gap-x-[0.25em]', className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: '100%' }}
            whileInView={{ opacity: 1, y: '0%' }}
            viewport={{ once: true }}
            transition={{
              delay: delay + i * stagger,
              ...SPRING_SMOOTH,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export default RevealText
