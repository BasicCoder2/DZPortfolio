/**
 * Tailwind CSS v4 Configuration
 *
 * In Tailwind v4, the primary configuration is CSS-first via globals.css.
 * This file provides TypeScript-level extensions for custom content paths,
 * plugin registration, and any config not expressible in CSS alone.
 *
 * Design tokens (colors, spacing, fonts) are defined as CSS variables
 * in app/globals.css and referenced here to keep them in sync.
 */
import type { Config } from 'tailwindcss'

const config: Config = {
  // Content paths for class scanning
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],

  // Dark mode via class strategy (controlled by next-themes)
  darkMode: 'class',

  theme: {
    extend: {
      // ── Color palette mapped to CSS variables ──
      colors: {
        bg: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          subtle: 'var(--color-surface-subtle)',
          muted: 'var(--color-surface-subtle)',
          raised: 'var(--color-surface-raised)',
          elevated: 'var(--color-surface-raised)',
          overlay: 'var(--color-surface-overlay)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          foreground: 'var(--color-accent-foreground)',
          green: 'var(--color-accent-green)',
          'green-dim': 'var(--color-accent-green-dim)',
          'green-glow': 'var(--color-accent-green-glow)',
          blue: 'var(--color-accent-blue)',
          'blue-dim': 'var(--color-accent-blue-dim)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },

        // Status colors — previously declared in globals.css but never mapped,
        // so `bg-danger` / `bg-success` / `bg-warning` compiled to nothing.
        danger: {
          DEFAULT: 'var(--danger)',
          foreground: 'var(--danger-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },
      },

      // ── Font families mapped to CSS variables ──
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-code)',
      },

      // ── Border radius mapped to CSS variables ──
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },

      // ── Box shadows ──
      // The elevation ladder lives in globals.css; every rung must be mapped
      // here or the utility silently compiles to nothing.
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        card: 'var(--shadow-card)',
        'card-elevated': 'var(--shadow-card-elevated)',
        floating: 'var(--shadow-floating)',
        overlay: 'var(--shadow-overlay)',
        glass: 'var(--shadow-glass)',
        inner: 'var(--shadow-inner)',
        glow: 'var(--shadow-glow)',
        'glow-green': 'var(--shadow-glow)',
        'glow-blue': 'var(--shadow-glow-blue)',
      },

      // ── Max width for site container ──
      maxWidth: {
        site: '1200px',
        prose: '720px',
      },

      // ── Custom keyframes for CSS animation utilities ──
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-out': 'fade-out 0.3s ease-in forwards',
        shimmer: 'shimmer 2s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },

  plugins: [],
}

export default config
