# Changelog

All notable changes to DZPortfolio. See <https://keepachangelog.com/> for format.

## [Unreleased] - Content platform

Converts the repository-managed static portfolio into a small full-stack
content platform with a single-administrator interface. See
[CONTENT_PLATFORM.md](./CONTENT_PLATFORM.md) and [DEPLOYMENT.md](./DEPLOYMENT.md).

### Added

- **Supabase-backed content.** Version-controlled migrations under
  `supabase/migrations/` for `posts`, `projects`, `experience_entries`,
  `certifications`, `engagement_options` and `profiles`, with Row-Level
  Security, timestamp triggers, validation constraints and a `content-images`
  storage bucket.
- **Admin area at `/admin`** — dashboard, list views, Markdown editor with live
  preview, image upload/replace/remove, slug generation with manual override,
  draft preview, publish/unpublish, delete behind confirmation. No link from the
  public navigation.
- **Single-administrator authentication.** Supabase Auth with server-managed
  session cookies, login throttling, safe redirect handling, and a two-key
  authorization check: the verified email must equal `ADMIN_EMAIL` *and* the
  matching `profiles` row must have `is_admin`.
- **Configurable Engagement pricing.** Tiers are editable, each showing a fixed
  amount in USD, in kwacha, in both, or free text. Current wording unchanged.
- **Vitest suite** — 200 tests covering authorization, open redirects, throttling,
  validation, slug collisions, Markdown sanitization, draft exclusion, the post
  lifecycle, image validation and sitemap contents. Supabase and Resend are
  mocked; no test contacts a real service.
- `pnpm content:import` — idempotent migration of the pre-database content.
- `pnpm images:optimize` — re-encodes bundled portraits to WebP and AVIF.

### Changed

- Public routes moved into an `app/(site)/` route group so the admin area can
  have its own shell. **Every public URL is unchanged** — route groups do not
  affect paths.
- Article and case-study bodies are Markdown rendered by `react-markdown`
  without `rehype-raw`, so embedded HTML is never parsed into elements.
- Public content routes are prerendered with a five-minute ISR window; every
  mutation additionally revalidates the paths it affects, so publishing does not
  require a deploy.
- `next.config.ts` allows exactly one remote image host — the configured
  Supabase project, scoped to the public object path of the content bucket.
- Hero portrait: **3.39 MB PNG → 56 KB WebP**. The full-resolution master moved
  to `assets-source/portrait/`, outside `public/`, so it is no longer uploaded
  on every deploy.
- `scripts/smoke-test.mjs` discovers content routes from the sitemap instead of
  a hardcoded list, and asserts that the admin interface is never rendered to an
  anonymous request.

### Fixed

- **Duplicate `<h1>` on the blog article.** The MDX file opened with
  `# Building Useful Systems` while the page rendered the same title in its own
  `<h1>`. Markdown headings are now shifted down one level, so an authored `#`
  becomes `<h2>` and the page owns the only `<h1>`.
- **`dynamic = 'force-static'` removed from the root layout.** On a layout it
  forces `cookies()` to return empty values for the whole subtree, which would
  have made every admin route see an anonymous session regardless of who was
  signed in.
- **`/admin` returned 500 when Supabase was unconfigured** (found by the smoke
  test). The client constructor threw before the layout could report anything;
  the gate now checks configuration first and explains what is missing.
- Project cards no longer fall back to the LMMU artwork when a project has no
  image — a card could advertise the wrong system entirely.
- Project card alt text is now the operator's description rather than the
  generated `"${title} project preview"`, which described the file rather than
  the picture.
- `robots.txt` disallows `/admin`.
- README: "Turbopant" → "Turbopack".
- Removed the tracked `build.log`, and added it to `.gitignore`.
- `.env.example` referenced a stale `/cv/daniel-zimba-cv.pdf`; the bundled asset
  is at `/assets/cv/daniel-zimba-cv.pdf`.
- `docs/DECISIONS.md` D5 marked superseded: the CV CTA always renders now,
  falling back to the bundled PDF, so `NEXT_PUBLIC_RESUME_URL` is an override
  rather than the condition for showing the button.

### Notes on migrated content

No placeholder text was carried into the database.

- Project case-study bodies are **empty**; the page renders "Detailed case-study
  documentation is being prepared" as its own empty state. Project metadata is
  real and stays published.
- The one blog post is imported as a **draft**, per its own content.
- Experience and certification dates are **null**, not invented.
  `experience_entries.start_date` was made nullable specifically so the
  migration would not have to fabricate dates for a CV.
- `data/*.ts` and `content/blog/*.mdx` are retained and annotated
  `SUPERSEDED`. Removing them is a separate, reviewable change, to be made once
  the database is populated and parity is confirmed.

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
