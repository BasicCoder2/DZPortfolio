'use client'

import { m, useReducedMotion } from 'framer-motion'
import type { ElementType, ComponentPropsWithoutRef } from 'react'
import {
  fadeUpPreset,
  fadeDownPreset,
  fadeLeftPreset,
  fadeRightPreset,
  scaleInPreset,
  footerPreset,
} from '@/lib/motion'

const PRESETS = {
  fadeUp: fadeUpPreset,
  fadeDown: fadeDownPreset,
  fadeLeft: fadeLeftPreset,
  fadeRight: fadeRightPreset,
  scaleIn: scaleInPreset,
  footer: footerPreset,
}

type MotionVariant = keyof typeof PRESETS

interface MotionWrapperProps<T extends ElementType> {
  /** The type of animation preset to apply. Default: 'fadeUp' */
  variant?: MotionVariant
  /** The HTML element to render (e.g., 'div', 'section', 'span'). Default: 'div' */
  as?: T
}

type Props<T extends ElementType> = MotionWrapperProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof MotionWrapperProps<T>>

/**
 * A generic client-side wrapper for scroll-reveal animations.
 * Uses Framer Motion's `m` component and our predefined motion presets.
 * Falls back to static rendering if the user prefers reduced motion.
 */
export function MotionWrapper<T extends ElementType = 'div'>({
  variant = 'fadeUp',
  as,
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'div'
  const prefersReducedMotion = useReducedMotion()

  // If user prefers reduced motion, render without animation wrappers
  if (prefersReducedMotion) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    )
  }

  // Index Framer Motion's `m` by element name (e.g. m.div, m.section).
  // Cast to a plain record keyed by element name so TypeScript resolves a single
  // component type (typeof m.div) instead of the deeply-nested union that
  // `m[keyof typeof m]` produces; fall back to m.div when the element has no
  // motion variant. (typeof m.div is Framer Motion's MotionComponent, which
  // accepts arbitrary motion props — no `any` written here.)
  const MotionComponent =
    (m as unknown as Record<string, typeof m.div>)[Component as string] ?? m.div
  const preset = PRESETS[variant]

  return (
    <MotionComponent className={className} {...preset} {...props}>
      {children}
    </MotionComponent>
  )
}
