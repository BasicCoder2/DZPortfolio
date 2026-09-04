# DZPortfolio

A modern, performance-focused developer portfolio built with **Next.js 16 (App Router, Turbopack)**, **Tailwind CSS v4**, **TypeScript**, and **Framer Motion**, with content managed from a private admin area backed by **Supabase**.

> Dark, glassy, motion-rich. Fully typed, lint-clean, and statically rendered
> with incremental revalidation — publishing content does not require a deploy.

## Tech Stack

| Layer      | Tool                                            |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 16.3 (App Router, Turbopack by default) |
| Language   | TypeScript 6                                    |
| Styling    | Tailwind CSS v4 (`@tailwindcss/postcss` plugin) |
| Animations | Framer Motion                                   |
| Icons      | Lucide React                                    |
| Theme      | next-themes (class-based dark mode)             |
| Content    | Supabase Postgres + Storage, Markdown bodies    |
| Auth       | Supabase Auth, single administrator             |
| Email      | Resend (contact form)                           |
| Tests      | Vitest                                          |
| Linting    | ESLint 9 (native flat config)                   |
| Formatting | Prettier 3                                      |

## Getting Started

Use Node.js 24.20.0 and pnpm 11.24.0. The expected Node version is recorded in
`.node-version`, and pnpm is pinned through the `packageManager` field.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Build & Verify

```bash
pnpm build         # production build
pnpm lint          # eslint .
pnpm type-check    # tsc --noEmit
pnpm test          # vitest run
pnpm format:check  # prettier --check .
```

> Next.js 16 removed `next lint`; linting now runs ESLint directly (`pnpm lint`).

Use [http://localhost:3000](http://localhost:3000) on this computer. Devices on
the same network can use `http://192.168.21.37:3000`; that development origin is
allowed in `next.config.ts` so Next.js development assets and HMR are not blocked.

## Tailwind CSS v4 Setup

This project uses the **CSS-first** v4 pipeline. Key files:

- `app/globals.css` — entry CSS. Starts with:
  ```css
  @import 'tailwindcss';
  @config "../tailwind.config.ts";
  @source './app/**/*.{ts,tsx}';
  @source './components/**/*.{ts,tsx}';
  @source './content/**/*.{md,mdx}';
  ```
- `postcss.config.mjs` — registers the dedicated v4 PostCSS plugin:
  ```js
  export default { plugins: { '@tailwindcss/postcss': {} } }
  ```
- `tailwind.config.ts` — extends the v4 theme (custom color tokens, fonts, spacing,
  keyframes, `darkMode: 'class'`) and declares content paths.

> **Note (Phase 0 finding):** Next.js 16 + Turbopack does **not** reliably engage
> Tailwind v4 from `@import "tailwindcss"` alone — it injects the base/preflight
> layer but skips the JIT compiler, so no utility classes are generated. The fix is
> the explicit `@tailwindcss/postcss` plugin (postcss config), the `@config`
> directive (loads the TS theme), and explicit `@source` paths (Turbopack's
> auto-scan misses root-level `app/`/`components/`). See
> [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and
> [`docs/DECISIONS.md#d1-tailwind-v4-pipeline) for details.

## Content management

Blog posts, projects, experience, certifications and the Engagement pricing
tiers live in Supabase and are edited at `/admin`. There is no link to it from
the public navigation.

| Command               | What it does                                                      |
| --------------------- | ----------------------------------------------------------------- |
| `pnpm content:import` | One-off import of the pre-database static content (idempotent)    |
| `pnpm images:optimize`| Re-encodes the bundled portraits to WebP and AVIF                 |

Database schema, Row-Level Security and the storage bucket are version
controlled under [`supabase/migrations/`](./supabase/migrations). See
[`docs/CONTENT_PLATFORM.md`](./docs/CONTENT_PLATFORM.md) for how content flows
from the database to a rendered page, and
[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for first-time setup.

## Environment Variables

| Variable                        | Purpose                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Site origin — canonical URLs, OG metadata, sitemap             |
| `NEXT_PUBLIC_GITHUB_USERNAME`   | GitHub profile username                                        |
| `NEXT_PUBLIC_LINKEDIN_URL`      | Full LinkedIn profile URL                                      |
| `NEXT_PUBLIC_RESUME_URL`        | Overrides the bundled `/assets/cv/daniel-zimba-cv.pdf`         |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public; guarded by RLS)                     |
| `ADMIN_EMAIL`                   | Server-only. The single account allowed into `/admin`          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Optional, script-only. Used by `pnpm content:import`; never set it in Vercel |
| `RESEND_API_KEY`                | Resend API key for the contact form                            |
| `CONTACT_TO_EMAIL`              | Where contact submissions are delivered                        |
| `CONTACT_FROM_EMAIL`            | Sender address, on a domain verified in Resend                 |

Copy `.env.example` → `.env.local` to configure. Every variable is documented
inline there.

Without the Supabase variables the site still builds and runs: content reads
degrade to empty results, the public pages render their empty states, and the
admin area reports that it is unconfigured.

## License

Private — Daniel Zimba.
