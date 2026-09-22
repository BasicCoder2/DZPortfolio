import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'

/**
 * Geist — the body face. Carries paragraphs, UI copy and controls.
 */
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
  preload: true,
})

/**
 * Fraunces — the display face for every heading (h1–h6, .text-display*,
 * .text-h*, .text-quote — see --font-heading in globals.css).
 *
 * Replaces the earlier Geist-for-everything approach: pairing a characterful
 * soft-serif against Geist's body text gives headline vs. body a real,
 * legible contrast in weight and register rather than two grotesques at
 * different sizes. Loaded with the optical-size axis so display sizes get
 * the higher-contrast cut and small headings stay sturdy.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
  axes: ['opsz', 'SOFT'],
})

/**
 * JetBrains Mono — the contrasting voice.
 *
 * Carries every label, eyebrow, tag and code sample, so it is on the critical
 * path alongside Geist rather than lazily loaded.
 */
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
})

/**
 * Combined font variable class string for use in root layout.
 * Apply to <html> or <body> element.
 *
 * @example
 * <html className={fontVariables}>
 */
export const fontVariables = [geist.variable, fraunces.variable, jetBrainsMono.variable].join(
  ' ',
)
