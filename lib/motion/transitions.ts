/**
 * Motion transitions — reusable transition config objects.
 *
 * These compose constants into ready-to-use `transition` props for
 * Framer Motion components.
 *
 * Import from '@/lib/motion' (barrel) rather than directly from this file.
 */

import { SPRING_SMOOTH, SPRING_SNAPPY, SPRING_GENTLE, EASE_OUT, EASE_EXPO } from './constants'

/** Default transition for most animated elements entering the viewport. */
export const transitionDefault = {
  ...SPRING_SMOOTH,
} as const

/** Fast micro-interaction transition. */
export const transitionFast = {
  ...SPRING_SNAPPY,
} as const

/** Slow cinematic transition for hero / page-level elements. */
export const transitionCinematic = {
  ...SPRING_GENTLE,
} as const

/** Standard tween for nav background changes. */
export const transitionNav = {
  duration: 0.25,
  ease: EASE_OUT,
} as const

/** Page-level transition — slightly longer to feel deliberate. */
export const transitionPage = {
  duration: 0.45,
  ease: EASE_EXPO,
} as const

/** Footer fade-up transition. */
export const transitionFooter = {
  duration: 0.6,
  ease: EASE_EXPO,
} as const

/** Mobile menu slide — snappy slide-in. */
export const transitionMobileMenu = {
  duration: 0.35,
  ease: EASE_EXPO,
} as const
