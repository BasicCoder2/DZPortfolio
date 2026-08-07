# Theme Architecture Report

## Overview

DZPortfolio implements a production-grade theme system supporting Light, Dark, and System preferences with hydration-safe rendering.

## Technology

- **next-themes** v0.4.6 — Handles theme persistence, system preference detection, and class-based switching
- **CSS Custom Properties** — Single source of truth for all theme values
- **Tailwind v4** — Dark mode via class strategy

## Architecture

```
app/layout.tsx
  └── html (suppressHydrationWarning + fontVariables)
      └── body
          └── Providers
              └── ThemeProvider (next-themes)
                  └── AppLayout
```

## Theme Flow

1. **Server**: HTML renders with default theme class
2. **Client**: `next-themes` detects stored preference or system preference
3. **Hydration**: `suppressHydrationWarning` prevents mismatch flash
4. **Runtime**: Theme toggles update `class` on `<html>` element

## Token Structure

### Light Theme (`:root`)
- 30 CSS custom properties for colors, spacing, typography, shadows, transitions
- All colors defined as semantic tokens (e.g., `--primary`, `--surface-raised`)

### Dark Theme (`.dark`)
- Overrides the same 30 properties with dark values
- Shadows are darker for contrast against dark backgrounds

## Persistence

- Stored in `localStorage` as `theme`
- Options: `'light'`, `'dark'`, `'system'`
- Default: `'dark'` (matches project aesthetic)

## System Preference

- `useTheme` hook exposes `systemTheme` (light/dark/undefined)
- Automatic detection via `next-themes`
- Respects OS-level preference when theme is `'system'`

## Hydration Safety

- `suppressHydrationWarning` on `<html>` prevents mismatch errors
- Theme toggle renders after mount to avoid flash
- `useTheme` hook provides `isMounted()` for conditional rendering

## Integration

- All components consume tokens via CSS variables (e.g., `bg-bg`, `text-text-primary`)
- No component hardcodes colors
- Theme toggle uses `useTheme` hook for reactive updates
