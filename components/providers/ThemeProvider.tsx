'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * ThemeProvider wraps the application to provide dark/light mode support.
 * We use next-themes to handle the heavy lifting and prevent hydration mismatch.
 */
export function ThemeProvider({ children, scriptProps, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        ...scriptProps,
        // Run before first paint in server HTML. On client renders, next-themes
        // applies the theme through effects; React must treat this as data.
        type: typeof window === 'undefined' ? 'text/javascript' : 'text/plain',
      }}
    >
      {children}
    </NextThemesProvider>
  )
}
