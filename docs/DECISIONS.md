# Decisions

Architecture/engineering decisions. Format: Context / Decision / Consequence.

## D1. Tailwind v4 pipeline (plugin + @config + @source)

- **Context:** The Phase 0 build diagnostics revealed Tailwind v4's JIT compiler
  was never running - the compiled CSS had v4 preflight/base but no generated
  utility classes (`.flex`, `.bg-bg` absent), and `@utility`/`@source`/`@config`
  were emitted verbatim with `Unknown at rule` warnings. Next.js 16 + Turbopack does
  not auto-engage v4 from `@import "tailwindcss"` alone.
- **Decision:** Add `postcss.config.mjs` registering the dedicated v4 plugin
  `@tailwindcss/postcss`; add `@config "../tailwind.config.ts"` in globals.css so
  the TypeScript theme loads; add explicit `@source` directives (Turbopack's
  auto-scan misses root-level `app/`/`components/` since there is no `src/`).
- **Consequence:** `next build` now emits all utility classes with zero CSS parse
  warnings. `tailwind.config.ts` is retained (theme, darkMode, content); `@source`
  is the authoritative scan root because Turbopack's watcher is unreliable
  without it (tailwindlabs#20006).

## D2. ESLint native flat config (no FlatCompat)

- **Context:** Next 16 removed `next lint`. The legacy config used `@eslint/eslintrc`
  `FlatCompat` to wrap `eslint-config-next`'s eslintrc presets, which crashed with
  `Converting circular structure to JSON` during schema validation (the `react`
  plugin is circular and the validator stringified the config).
- **Decision:** Rewrote `eslint.config.mjs` as a native ESLint 9 flat config
  (`tseslint.config(...)`) using `@next/eslint-plugin-next`, `typescript-eslint`,
  `@eslint/js`, `eslint-plugin-react` directly. No FlatCompat shim.
- **Consequence:** `npm run lint` runs `eslint .` cleanly (0 errors, 0 warnings).

## D3. Component utilities as plain CSS (`composes` -> inlining)

- **Context:** `app/globals.css` used `composes: btn-base;` / `composes: tag;` to
  share styles. `composes` is a CSS Modules feature and is invalid in a global
  stylesheet; it was silently dropped, leaving `.btn-primary` without base styles.
- **Decision:** Re-implemented shared button/tag base styles as inlined plain CSS
  inside `@layer utilities` (native `:hover`/`:active`), matching the existing
  `.text-h1` / `.container-site` pattern that already compiled correctly.
- **Consequence:** No CSS Modules dependency; shared styles are duplicated across
  `.btn-primary`, `.btn-ghost` and `.tag-accent`. Accepted explicit duplication.
  (`@utility`/`@apply`/`@variant` are also supported now that the v4 plugin runs,
  but plain CSS was chosen for robustness.)

## D4. Single source of truth for navigation & socials

- **Context:** Three overlapping copies existed: `lib/constants.ts` (NAV_LINKS,
  SOCIAL_LINKS), `data/navigation.ts` (navItems), and `data/socials.ts`.
- **Decision:** Keep `lib/constants.ts` as the single source; deleted the two
  `data/` duplicates. SOCIAL_LINKS is now env-driven
  (NEXT_PUBLIC_GITHUB_USERNAME, NEXT_PUBLIC_LINKEDIN_URL, CONTACT_EMAIL), gained an
  Email link, and dropped Twitter.
- **Consequence:** One place to edit nav/socials; profiles are environment-aware.

## D5. Env-driven CTA (no `href="#"`)

- **Context:** "Download CV" buttons hardcoded `href="#"` with a `// TODO` comment.
- **Decision:** Render the CTA only when `NEXT_PUBLIC_RESUME_URL` is set; pass it as
  the `href` (auto internal/external via CTAButton). Added the variable to
  `.env.example`.
- **Consequence:** No dead links or TODOs in production builds.
- **Superseded (content-platform release):** the CV is now bundled at
  `public/assets/cv/daniel-zimba-cv.pdf`, so the CTA always renders and
  `NEXT_PUBLIC_RESUME_URL` is an *override* for an externally hosted copy rather
  than the condition for showing the button. See `Navigation.tsx`,
  `MobileMenu.tsx` and `HeroActions.tsx`.

## D6. Remove placeholder/dead modules

- **Context:** `lib/mdx.ts` fabricated `BlogPost`/`Project` objects from slugs with
  no frontmatter parsing (fake data). `lib/motion.ts` was a shim re-exporting the
  `lib/motion/` barrel. `TooltipProvider.tsx` was a no-op passthrough.
- **Decision:** Deleted all three. `lib/mdx.ts` is not recreated; the real
  content-access layer is built in Phase 1 with `@next/mdx` frontmatter.
- **Consequence:** No fake data or dead code in the baseline.

## D7. `prettier` install (was missing)

- **Context:** `format` / `format:check` scripts referenced `prettier`, but the
  package was not installed - scripts failed with `prettier is not recognized`.
- **Decision:** Installed `prettier` as a devDependency.
- **Consequence:** `npm run format` / `format:check` work; codebase is formatted.

## D8. `next.config.ts` cleanup

- **Context:** `src: './pages.tsx'` (non-existent page base path) and
  `typedRoutes: true` were present despite no dynamic route params existing.
- **Decision:** Removed both; kept the `@next/mdx` `withMDX` wrapper and the `.mdx`
  page extension for the Phase 1 content layer.
- **Consequence:** Cleaner config; MDX still wired for future content.
