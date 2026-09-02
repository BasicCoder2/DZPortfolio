/**
 * DZPortfolio Design Tokens.
 *
 * Single source of truth for all design tokens. These mirror the CSS custom
 * properties defined in app/globals.css and are consumed by TypeScript utilities
 * and component logic.
 *
 * Use these when you need token values in JS (e.g. computed styles, inline
 * styles, or non-Tailwind contexts). For Tailwind classes, reference the
 * semantic utilities mapped in tailwind.config.ts.
 */

// ─── Color Tokens ──────────────────────────────────────────────────────────────

export const colors = {
  bg: 'var(--color-bg)',
  surface: {
    DEFAULT: 'var(--color-surface)',
    subtle: 'var(--color-surface-subtle)',
    raised: 'var(--color-surface-raised)',
    overlay: 'var(--color-surface-overlay)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    inverse: 'var(--color-text-inverse)',
  },
  primary: {
    DEFAULT: 'var(--color-primary)',
    foreground: 'var(--color-primary-foreground)',
    glow: 'var(--color-primary-glow)',
  },
  secondary: {
    DEFAULT: 'var(--color-secondary)',
    foreground: 'var(--color-secondary-foreground)',
    glow: 'var(--color-secondary-glow)',
  },
  accent: {
    DEFAULT: 'var(--color-accent)',
    foreground: 'var(--color-accent-foreground)',
  },
  muted: {
    DEFAULT: 'var(--color-muted)',
    foreground: 'var(--color-muted-foreground)',
  },
  success: {
    DEFAULT: 'var(--color-success)',
    foreground: 'var(--color-success-foreground)',
  },
  warning: {
    DEFAULT: 'var(--color-warning)',
    foreground: 'var(--color-warning-foreground)',
  },
  danger: {
    DEFAULT: 'var(--color-danger)',
    foreground: 'var(--color-danger-foreground)',
  },
  info: {
    DEFAULT: 'var(--color-info)',
    foreground: 'var(--color-info-foreground)',
  },
  border: {
    DEFAULT: 'var(--color-border)',
    strong: 'var(--color-border-strong)',
  },
  input: 'var(--color-input)',
  ring: 'var(--color-ring)',
  focus: 'var(--color-focus)',
  overlay: 'var(--color-overlay)',
  backdrop: 'var(--color-backdrop)',
  selection: {
    bg: 'var(--color-selection-bg)',
    fg: 'var(--color-selection-fg)',
  },
} as const

// ─── Spacing Tokens ────────────────────────────────────────────────────────────

export const space = {
  0: 'var(--space-0)',
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  7: 'var(--space-7)',
  8: 'var(--space-8)',
  9: 'var(--space-9)',
  10: 'var(--space-10)',
  11: 'var(--space-11)',
  12: 'var(--space-12)',
  14: 'var(--space-14)',
  16: 'var(--space-16)',
  20: 'var(--space-20)',
  24: 'var(--space-24)',
  32: 'var(--space-32)',
} as const

// ─── Radius Tokens ─────────────────────────────────────────────────────────────

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  full: 'var(--radius-full)',
  default: 'var(--radius)',
} as const

// ─── Shadow Tokens ─────────────────────────────────────────────────────────────

export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  card: 'var(--shadow-card)',
  'card-elevated': 'var(--shadow-card-elevated)',
  floating: 'var(--shadow-floating)',
  inner: 'var(--shadow-inner)',
  glow: 'var(--shadow-glow)',
  'glow-blue': 'var(--shadow-glow-blue)',
} as const

// ─── Typography Tokens ─────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    heading: 'var(--font-heading)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
  },
  fontSize: {
    display: 'clamp(3rem, 8vw, 6rem)',
    'display-lg': 'clamp(2.5rem, 6vw, 4.5rem)',
    h1: 'clamp(2.25rem, 5vw, 4rem)',
    h2: 'clamp(1.75rem, 3.5vw, 3rem)',
    h3: 'clamp(1.25rem, 2.5vw, 2rem)',
    h4: 'clamp(1.125rem, 2vw, 1.75rem)',
    h5: '1.125rem',
    h6: '1rem',
    lead: 'clamp(1.125rem, 2.5vw, 1.25rem)',
    'body-lg': '1.125rem',
    body: '1rem',
    'body-sm': '0.875rem',
    small: '0.8125rem',
    caption: '0.75rem',
    overline: '0.75rem',
    label: '0.75rem',
    quote: 'clamp(1.5rem, 3vw, 2.5rem)',
    code: '0.875rem',
    mono: '0.875rem',
  },
  lineHeight: {
    display: '1.05',
    'display-lg': '1.05',
    h1: '1.1',
    h2: '1.15',
    h3: '1.2',
    h4: '1.25',
    h5: '1.3',
    h6: '1.35',
    lead: '1.75',
    'body-lg': '1.75',
    body: '1.7',
    'body-sm': '1.6',
    small: '1.5',
    caption: '1.4',
    overline: '1.4',
    label: '1.4',
    quote: '1.1',
    code: '1.5',
    mono: '1.5',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

// ─── Transition Tokens ─────────────────────────────────────────────────────────

export const transitions = {
  fast: 'var(--transition-fast)',
  base: 'var(--transition-base)',
  slow: 'var(--transition-slow)',
} as const

export const durations = {
  50: 'var(--duration-50)',
  100: 'var(--duration-100)',
  150: 'var(--duration-150)',
  200: 'var(--duration-200)',
  250: 'var(--duration-250)',
  300: 'var(--duration-300)',
  400: 'var(--duration-400)',
  600: 'var(--duration-600)',
  700: 'var(--duration-700)',
} as const

export const easings = {
  out: 'var(--ease-out)',
  'in-out': 'var(--ease-in-out)',
  expo: 'var(--ease-expo)',
  'emphasized-out': 'var(--ease-emphasized-out)',
  'emphasized-in': 'var(--ease-emphasized-in)',
  'spring-snappy': 'var(--spring-snappy)',
} as const

// ─── Breakpoint Tokens ─────────────────────────────────────────────────────────

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// ─── Z-Index Tokens ────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const

// ─── Container Tokens ──────────────────────────────────────────────────────────

export const containers = {
  site: '1200px',
  prose: '720px',
} as const
