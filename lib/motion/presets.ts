/**
 * Motion presets — named preset objects that bundle variant + transition config
 * for common UI patterns.
 *
 * Use these as a shorthand when constructing `MotionWrapper` or `motion.*` props.
 *
 * Import from '@/lib/motion' (barrel) rather than directly from this file.
 */

import {
  navVariants,
  pageVariants,
  footerVariants,
  mobileMenuVariants,
  mobileMenuBackdropVariants,
  fadeUpVariants,
  fadeDownVariants,
  fadeLeftVariants,
  fadeRightVariants,
  scaleInVariants,
  heroEyebrowVariants,
  heroTitleVariants,
  heroStatementVariants,
  heroBodyVariants,
  heroActionsVariants,
  heroPortraitVariants,
  codeMarkFloatVariants,
} from './variants'

/** Preset for the sticky navigation bar entrance. */
export const navPreset = {
  initial: 'hidden',
  animate: 'visible',
  variants: navVariants,
} as const

/** Preset for full-page route transitions. */
export const pagePreset = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: pageVariants,
} as const

/** Preset for footer scroll-reveal. */
export const footerPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-60px' },
  variants: footerVariants,
} as const

/** Preset for mobile menu slide-in overlay. */
export const mobileMenuPreset = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: mobileMenuVariants,
} as const

/** Preset for mobile menu backdrop fade. */
export const mobileMenuBackdropPreset = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: mobileMenuBackdropVariants,
} as const

/** Preset for generic scroll-reveal fade up (most common). */
export const fadeUpPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-60px' },
  variants: fadeUpVariants,
} as const

/** Preset for scroll-reveal fade down. */
export const fadeDownPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-60px' },
  variants: fadeDownVariants,
} as const

/** Preset for scroll-reveal fade from left. */
export const fadeLeftPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-60px' },
  variants: fadeLeftVariants,
} as const

/** Preset for scroll-reveal fade from right. */
export const fadeRightPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-60px' },
  variants: fadeRightVariants,
} as const

/** Preset for scale-in scroll reveal. */
export const scaleInPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-60px' },
  variants: scaleInVariants,
} as const

const heroPreset = (variants: typeof heroEyebrowVariants) => ({
  initial: 'hidden',
  animate: 'visible',
  variants,
}) as const

export const heroEyebrowPreset = heroPreset(heroEyebrowVariants)
export const heroTitlePreset = heroPreset(heroTitleVariants)
export const heroStatementPreset = heroPreset(heroStatementVariants)
export const heroBodyPreset = heroPreset(heroBodyVariants)
export const heroActionsPreset = heroPreset(heroActionsVariants)
export const heroPortraitPreset = heroPreset(heroPortraitVariants)

export const codeMarkFloatPreset = {
  initial: 'hidden',
  animate: 'visible',
  variants: codeMarkFloatVariants,
} as const

export const codeMarkRotatePreset = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
  transition: { duration: 21, ease: 'linear', repeat: Infinity },
} as const
