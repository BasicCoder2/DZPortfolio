'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Moon, Sun, X } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

/**
 * One-time prompt telling first-time visitors the site defaults to dark, with
 * a one-click switch to light.
 *
 * "First time" means no theme has ever been saved (next-themes only writes its
 * `theme` key once a choice is made) and this prompt has not been answered or
 * dismissed before. Any answer, the close button, Escape, or using the nav's
 * theme toggle while it is open all retire it for good.
 *
 * It is a polite, non-modal notice: it never takes focus, so keyboard and
 * screen-reader users are not pulled away from the page to deal with it.
 */

const THEME_KEY = 'theme'
const PROMPT_KEY = 'dz-theme-prompt-seen'
const SHOW_DELAY_MS = 1500

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage blocked (private mode, site data cleared): the prompt may simply
    // show again next visit, which is harmless.
  }
}

export function ThemePrompt() {
  const { resolvedTheme, setTheme } = useTheme()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const themeWhenShown = useRef<string | undefined>(undefined)

  const retire = useCallback(() => {
    writeStorage(PROMPT_KEY, '1')
    setOpen(false)
  }, [])

  useEffect(() => {
    if (readStorage(THEME_KEY) !== null || readStorage(PROMPT_KEY) !== null) return
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  // Remember the theme at the moment the prompt appears; if the visitor flips
  // it with the nav toggle instead, they have found the control — retire.
  useEffect(() => {
    if (!open) return
    if (themeWhenShown.current === undefined) {
      themeWhenShown.current = resolvedTheme
    } else if (resolvedTheme !== themeWhenShown.current) {
      retire()
    }
  }, [open, resolvedTheme, retire])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') retire()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, retire])

  const choose = (theme: 'light' | 'dark') => {
    // Retire first so the theme change below is not mistaken for a nav toggle.
    retire()
    setTheme(theme)
  }

  return (
    <AnimatePresence>
      {open && (
        // Phones: full width along the bottom, clear of the hero buttons.
        // Larger screens: just under the nav, right-aligned with the site
        // container (same 1200px max width and side padding as Container) so
        // it sits beneath the theme toggle it refers to. The bottom left would
        // cover the hero's "View Projects" button.
        <m.aside
          animate={{ opacity: 1, scale: 1 }}
          aria-labelledby="theme-prompt-title"
          className="fixed inset-x-4 bottom-4 z-50 origin-top-right rounded-2xl border border-border bg-surface-elevated p-4 text-text-primary shadow-xl sm:bottom-auto sm:left-auto sm:right-6 sm:top-[calc(var(--nav-h)+0.75rem)] sm:w-[24rem] md:right-8 lg:right-[max(3rem,calc((100%-1200px)/2+3rem))]"
          exit={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
          role="status"
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-green-dim text-accent-green"
            >
              <Moon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium" id="theme-prompt-title">
                You&apos;re viewing the dark theme
              </p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Prefer light? Switch now, or any time with the theme button in the menu.
              </p>
            </div>
            <button
              aria-label="Dismiss"
              className="-mr-1 -mt-1 rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
              type="button"
              onClick={retire}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          {/* Full card width on phones so both buttons fit on one line;
              indented under the text from sm up. */}
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:pl-11">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-accent-green px-3 py-2 text-sm font-medium text-accent-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
              type="button"
              onClick={() => choose('light')}
            >
              <Sun aria-hidden="true" className="h-4 w-4" />
              Switch to light
            </button>
            <button
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
              type="button"
              onClick={() => choose('dark')}
            >
              Keep dark
            </button>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  )
}
