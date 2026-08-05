import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { fontVariables } from '@/lib/fonts'
import { defaultMetadata } from '@/lib/metadata'
import '@/app/globals.css'

export const metadata: Metadata = defaultMetadata

/**
 * Root layout — wraps every page in the application.
 *
 * Responsibilities:
 * - Applies CSS font variables to the HTML element
 * - Provides ThemeProvider for future dark/light mode
 * - Loads global CSS design system
 * - Sets viewport and metadata defaults
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
