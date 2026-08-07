/**
 * Motion constants — spring presets, easing curves, stagger configs.
 *
 * Import from '@/lib/motion' (barrel) rather than directly from this file.
 */

// ─── Spring Presets ───────────────────────────────────────────────────────────

/**
 * Smooth, natural spring — use for most UI transitions.
 * Good for: cards, modals, drawers.
 */
export const SPRING_SMOOTH = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
} as const

/**
 * Fast, snappy spring — use for micro-interactions.
 * Good for: buttons, toggles, hover effects.
 */
export const SPRING_SNAPPY = {
  type: 'spring',
  stiffness: 500,
  damping: 40,
  mass: 0.8,
} as const

/**
 * Slow, cinematic spring — use for hero elements and page transitions.
 * Good for: hero text, large images, page-level transitions.
 */
export const SPRING_GENTLE = {
  type: 'spring',
  stiffness: 180,
  damping: 28,
  mass: 1.2,
} as const

// ─── Easing Presets ───────────────────────────────────────────────────────────

/** Standard ease-out — use for elements entering the viewport. */
export const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const

/** Ease in-out — use for elements that enter and exit. */
export const EASE_IN_OUT = [0.4, 0.0, 0.2, 1.0] as const

/** Expo ease-out — dramatic deceleration for impactful reveals. */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const

// ─── Stagger Presets ──────────────────────────────────────────────────────────

/**
 * Fast stagger — 0.05s between children.
 * Good for: navigation items, tag lists, icon rows.
 */
export const STAGGER_FAST = {
  staggerChildren: 0.05,
  delayChildren: 0.1,
} as const

/**
 * Slow stagger — 0.1s between children.
 * Good for: section cards, project grids, experience entries.
 */
export const STAGGER_SLOW = {
  staggerChildren: 0.1,
  delayChildren: 0.2,
} as const
