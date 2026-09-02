'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'

/**
 * Theme hook — typed wrapper around next-themes for the DZPortfolio design system.
 *
 * Features:
 * - Returns the resolved theme (not just the attribute)
 * - Provides setTheme with valid options
 * - Exposes system preference
 * - Handles mounted state to prevent hydration mismatch
 */
export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme, themes } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isMounted = useCallback(() => mounted, [mounted])

  const toggleTheme = useCallback(() => {
    if (resolvedTheme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }, [resolvedTheme, setTheme])

  return {
    theme: (theme ?? 'system') as Theme,
    resolvedTheme: resolvedTheme as 'light' | 'dark' | undefined,
    systemTheme: systemTheme as 'light' | 'dark' | undefined,
    themes: themes as Theme[],
    setTheme,
    toggleTheme,
    isMounted,
    mounted,
  }
}
