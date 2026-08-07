# Changelog

All notable changes to DZPortfolio. See <https://keepachangelog.com/> for format.

## [0.1.0] - 2026-08-07 (Phase 0: Stabilization)

### Fixed

- Tailwind CSS v4 pipeline fully engaged. Next.js 16 + Turbopack was shipping a CSS
  bundle with no generated utility classes (`.flex`, `.bg-bg` absent) and un-processed
  v4 directives (`@utility`, `@source`, `@config` emitted verbatim with
  `Unknown at rule` warnings). Turbopack does not auto-engage the v4 JIT without an
  explicit PostCSS plugin and source boundaries. (See docs/DECISIONS.md#d1.)
  - Added postcss.config.mjs registering `@tailwindcss/postcss`.
  - Added `@config "../tailwind.config.ts"` + explicit `@source` to app/globals.css.
- ESLint migrated to native flat config (no FlatCompat shim, which crashed with a
  circular-JSON error).
- `composes:` conflict resolved in app/globals.css (invalid in global CSS;
  component button/tag base styles inlined as plain CSS).
- `next.config.ts`: removed invalid `src: './pages.tsx'` and `typedRoutes: true`.
- ESM import hygiene in lib/motion/variants.ts (`import type { Variants }`).

### Changed

- Social links consolidated into lib/constants.ts (single source of truth);
  GitHub/LinkedIn env-driven, Twitter replaced by Email, CTA driven by
  NEXT_PUBLIC_RESUME_URL.
- "Download CV" CTA is env-driven and conditionally rendered (was `href="#"` + TODO).
- Scripts aligned for Next 16 (`npm run lint` -> `eslint .`).

### Removed

- data/navigation.ts, data/socials.ts (duplicates of lib/constants.ts).
- lib/motion.ts (dead shim re-exporting lib/motion/ barrel).
- lib/mdx.ts (fake-data content stub).
- components/providers/TooltipProvider.tsx (no-op passthrough).
- Stray `// eslint-disable` comments.

### Added

- @tailwindcss/postcss (v4 PostCSS plugin) and prettier (was referenced by scripts
  but never installed).
- .env.example entry: NEXT_PUBLIC_RESUME_URL=.
- docs: README, ARCHITECTURE, ROADMAP, DECISIONS.

### Verification (all green)

- tsc --noEmit -> 0 errors
- eslint . -> 0 errors, 0 warnings
- prettier --check . -> all files clean
- next build -> 0 errors, 0 warnings, all utility classes present in output CSS
