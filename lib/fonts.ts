import { Geist, Inter, JetBrains_Mono } from 'next/font/google'

/**
 * Geist — heading font.
 * Used for all display text, h1–h3, and UI labels.
 */
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
  preload: true,
})

/**
 * Inter — body font.
 * Used for paragraph text, descriptions, and UI copy.
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

/**
 * JetBrains Mono — monospace font.
 * Used for code blocks, tags, technical labels, and accent text.
 */
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false, // Not critical path
})

/**
 * Combined font variable class string for use in root layout.
 * Apply to <html> or <body> element.
 *
 * @example
 * <html className={fontVariables}>
 */
export const fontVariables = [geist.variable, inter.variable, jetBrainsMono.variable].join(' ')
