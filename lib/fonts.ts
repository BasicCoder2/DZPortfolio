import { Geist, JetBrains_Mono } from 'next/font/google'

/**
 * Geist — the single sans face, used for both display and body text.
 *
 * Hierarchy comes from weight, size and colour rather than from a second sans.
 * The previous Geist/Inter pairing cost an extra download for two neo-grotesques
 * close enough to read as one family.
 */
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
  preload: true,
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
export const fontVariables = [geist.variable, jetBrainsMono.variable].join(' ')
