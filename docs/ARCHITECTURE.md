# Architecture

> **Content moved to a database.** Blog posts, projects, experience,
> certifications and the Engagement pricing tiers are no longer static files —
> they live in Supabase Postgres and are edited at `/admin`. The content flow,
> the two Supabase clients, the caching strategy, the authorization layers and
> the Markdown safety model are documented in
> [`CONTENT_PLATFORM.md`](./CONTENT_PLATFORM.md); this file covers the
> surrounding application structure.
>
> Two structural changes came with it and are easy to trip over:
>
> - Public routes moved into an `app/(site)/` route group so the admin area can
>   have its own shell. Route groups contribute nothing to the URL, so every
>   public path is unchanged.
> - `app/layout.tsx` no longer exports `dynamic = 'force-static'`. On a root
>   layout that forces `cookies()` to return empty values for the whole subtree,
>   which is incompatible with an authenticated admin area. Public pages are
>   still prerendered; content routes additionally opt into ISR.

## Overview

DZPortfolio is a Next.js 16 App Router portfolio with a small, single-
administrator content platform behind it. The architecture is split into
**infrastructure** (layout, navigation, styling, types), **public content**
(read from the database, prerendered with incremental revalidation) and the
**admin area** (dynamic, authenticated, authorized per request).

## Project Structure

```
.
├── app/                        # Next.js App Router
│   ├── (layout)                # Root layout (ThemeProvider, MotionProvider, Providers)
│   ├── page.tsx                # Home page (deferred-content shell)
│   └── globals.css             # Tailwind v4 entry: @import, @config, @source, tokens, utilities
├── components/
│   ├── animations/             # Framer Motion wrappers (MotionWrapper, RevealText, ScaleIn, StaggerChildren, BackToTop)
│   ├── layout/                 # Navigation (desktop + mobile), Container, Section, Footer, Wordmark, CTAButton
│   └── ui/                     # (future) shadcn/ui-style primitives
├── data/                       # Static content data schemas (awaiting component consumers)
│   ├── services.ts
│   ├── site.ts                 # siteConfig (author, title, description, OG)
│   └── technologies.ts
├── hooks/                      # Client hooks (useNavigationState, useScrollLock, useTheme, useIntersection)
├── lib/                        # Utilities
│   ├── constants.ts            # Single source of truth: NAV_LINKS, SOCIAL_LINKS, breakpoints, etc.
│   ├── motion/                 # Framer Motion variants/transitions/presets (barrel: lib/motion/index.ts)
│   └── utils.ts                # `cn` (clsx + tailwind-merge)
├── types/                      # Shared TypeScript interfaces
├── lib/actions/                # Server Actions (all admin mutations)
├── lib/auth/                   # Authorization + safe redirect handling
├── lib/content/                # Schemas, repositories, models, Markdown, cache
├── lib/media/                  # Image validation and storage URL resolution
├── lib/supabase/               # Three clients: public, server, proxy
├── supabase/migrations/        # Version-controlled schema, RLS, storage
├── tests/                      # Vitest suite
├── proxy.ts                    # Next 16 proxy (was middleware): session refresh
├── content/                    # Static MDX content (awaiting files)
│   ├── blog/
│   └── projects/
├── styles/                     # (future) global CSS modules
├── docs/                       # Architecture & decision docs
├── public/
│   └── assets/                 # Static assets
├── next.config.ts              # Next.js config (withMDX for .mdx)
├── tailwind.config.ts          # v4 theme (colors, fonts, spacing, keyframes, darkMode)
├── postcss.config.mjs          # v4 PostCSS pipeline (@tailwindcss/postcss)
├── eslint.config.mjs           # ESLint native flat config
├── .prettierrc                 # Prettier config
└── package.json
```

## Data Flow

1. `app/layout.tsx` imports `globals.css` and renders `Providers` (ThemeProvider +
   MotionProvider) around the page.
2. `components/layout/...` (Navigation, MobileMenu, Footer, Container, Section) consume
   `lib/constants` for nav links and social links.
3. `lib/motion/*` exposes Motion variants/presets via the `@/lib/motion` barrel;
   animation components wrap children with `framer-motion`, decoupled from content.
4. `data/site.ts` exports `siteConfig`; `data/services.ts` and `data/technologies.ts`
   define schemas consumed once the corresponding content sections are built.

## Tailwind CSS v4 Pipeline (the key fix)

**Problem (pre-Phase 0):** The build passed (exit 0) but produced **no Tailwind
utility classes**. Turbopack's Tailwind integration is not engaged by
`@import "tailwindcss"` alone on Next 16 — it emits the base/preflight layer but
never runs the JIT scanner, so classes like `flex`, `bg-bg` produce nothing.
Diagnostics confirmed: the compiled CSS contained preflight + hand-written
`@layer base`/`@layer utilities` but **no generated utilities**, and v4 directives
(`@utility`, `@apply`, `@source`, `@config`) were emitted verbatim and warned
`Unknown at rule`.

**Fix:**

1. **`postcss.config.mjs`** — explicitly register the dedicated v4 plugin:
   ```js
   export default { plugins: { '@tailwindcss/postcss': {} } }
   ```
   This is the package the v4 docs use (not `tailwindcss` directly as a PostCSS
   plugin). Next.js 16 does not auto-apply it without this file.
2. **`app/globals.css`** — declare explicit source-scan roots and theme config:
   ```css
   @import 'tailwindcss';
   @config "../tailwind.config.ts"; /* load the TS theme (Turbopack skips auto-detect) */
   @source './app/**/*.{ts,tsx}';
   @source './components/**/*.{ts,tsx}';
   @source './content/**/*.{md,mdx}';
   ```
3. **Component utilities** are plain CSS inside `@layer utilities` (see
   `docs/DECISIONS.md#d3`). `composes:` (a CSS Modules feature) is not valid in a
   global stylesheet, so shared button/tag base styles are inlined.

Verified: production build emits `.flex`, `.bg-bg`, `.btn-primary`, `.text-h1`, etc.,
with **zero** CSS parse warnings.

## ESLint

Native ESLint 9 **flat config** (`eslint.config.mjs`). Next 16 removed `next lint`, so
`npm run lint` runs `eslint .` directly. The config uses `@next/eslint-plugin-next`,
`typescript-eslint`, `@eslint/js`, and `eslint-plugin-react`. **No `@eslint/eslintrc`
FlatCompat shim** — the previous FlatCompat config crashed with a circular-JSON error
during config validation (see `docs/DECISIONS.md#d2`).

## Build

- **Type-check:** `tsc --noEmit` — strict, zero errors.
- **Lint:** `eslint .` — zero errors and zero warnings.
- **Format:** `prettier --check .` — clean.
- **Build:** `next build` — prerenders `/` and `/_not-found`; compiles Tailwind v4
  with all utilities.

## Environment

- `NEXT_PUBLIC_*` vars are inlined at build time and used by `lib/constants` for
  env-driven social links and the resume CTA.
- Server Components by default; `use client` only in interactive components
  (Navigation state, animations, theme toggle).
