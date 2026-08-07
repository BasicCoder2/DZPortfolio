'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { MotionProvider } from './MotionProvider'

/**
 * Global Providers composer.
 * Wraps the application in all necessary client-side context providers.
 * Keeps app/layout.tsx clean and acts as a single point of entry for contexts.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider disableTransitionOnChange attribute="class" defaultTheme="dark">
      <MotionProvider>{children}</MotionProvider>
    </ThemeProvider>
  )
}
