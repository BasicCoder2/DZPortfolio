import type { Variants } from 'framer-motion'
import { SPRING_SMOOTH, STAGGER_FAST, STAGGER_SLOW } from './constants'
import {
  transitionDefault,
  transitionPage,
  transitionFooter,
  transitionMobileMenu,
  transitionNav,
} from './transitions'

/**
 * Motion variants — named Framer Motion variant definitions.
 *
 * Convention: `hidden` = initial / exit state, `visible` = animate state.
 * All variants use the `hidden` / `visible` naming for consistency with
 * `staggerContainerVariants` and `MotionWrapper`.
 *
 * Import from '@/lib/motion' (barrel) rather than directly from this file.
 */

// ─── Scroll Reveal Variants ───────────────────────────────────────────────────

/** Fade in from below — primary scroll-reveal variant. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionDefault,
  },
}

/** Fade in from above. */
export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionDefault,
  },
}

/** Fade in from left. */
export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionDefault,
  },
}

/** Fade in from right. */
export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionDefault,
  },
}

/** Scale in from slightly below 1. */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionDefault,
  },
}

/** Hero entrance choreography. Kept as named presets so the opening sequence is tunable in one place. */
export const heroEyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { ...transitionDefault, delay: 0.12 } },
}

export const heroTitleVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { ...transitionDefault, delay: 0.22 } },
}

export const heroStatementVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { ...transitionDefault, delay: 0.36 } },
}

export const heroBodyVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { ...transitionDefault, delay: 0.48 } },
}

export const heroActionsVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { ...transitionDefault, delay: 0.6 } },
}

export const heroPortraitVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, x: 20 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { ...transitionDefault, delay: 0.3 } },
}

/** Ambient CodeMark layers: separate float and rotation transforms. */
export const codeMarkFloatVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: -3, transition: { duration: 5.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } },
}


// ─── Stagger Container Variants ───────────────────────────────────────────────

/** Stagger container — slow (section cards, project grids). */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ...STAGGER_SLOW },
  },
}

/** Stagger container — fast (nav items, tag rows, icon lists). */
export const staggerContainerFastVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ...STAGGER_FAST },
  },
}

// ─── Navigation Variants ──────────────────────────────────────────────────────

/**
 * Navigation bar entrance — fade + slight downward slide.
 * Applied to the `<header>` element on initial mount.
 */
export const navVariants: Variants = {
  hidden: { opacity: 0, y: -16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transitionNav,
  },
}

/**
 * Individual nav link stagger child — fade up.
 * Used inside `staggerContainerFastVariants`.
 */
export const navLinkVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_SMOOTH },
  },
}

// ─── Mobile Menu Variants ─────────────────────────────────────────────────────

/** Mobile menu overlay — slide in from left. */
export const mobileMenuVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: transitionMobileMenu,
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { ...transitionMobileMenu, duration: 0.25 },
  },
}

/** Mobile menu backdrop — fade. */
export const mobileMenuBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

/** Stagger container for mobile menu links. */
export const mobileMenuLinksVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
}

/** Individual mobile menu link. */
export const mobileMenuLinkVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING_SMOOTH },
  },
}

// ─── Page Transition Variants ─────────────────────────────────────────────────

/** Page-level fade — used by TransitionLayout. */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPage,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2 },
  },
}

// ─── Footer Variants ──────────────────────────────────────────────────────────

/** Footer fade-up on scroll into view. */
export const footerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionFooter,
  },
}

// ─── BackToTop Variants ───────────────────────────────────────────────────────

/** Back-to-top button — fade + scale when visible. */
export const backToTopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_SMOOTH },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 8,
    transition: { duration: 0.15 },
  },
}
