# DZPortfolio

A modern, performance-focused developer portfolio built with **Next.js 16 (App Router, Turbopack)**, **Tailwind CSS v4**, **TypeScript**, and **Framer Motion**.

> Dark, glassy, motion-rich. Zero-runtime JS for static content, fully typed, lint-clean.

## Tech Stack

| Layer      | Tool                                            |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 16.3 (App Router, Turbopant by default) |
| Language   | TypeScript 6                                    |
| Styling    | Tailwind CSS v4 (`@tailwindcss/postcss` plugin) |
| Animations | Framer Motion                                   |
| Icons      | Lucide React                                    |
| Theme      | next-themes (class-based dark mode)             |
| Linting    | ESLint 9 (native flat config)                   |
| Formatting | Prettier 3                                      |

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Build & Verify

```bash
npm run build    # production build
npm run lint     # eslint .
npm run type-check   # tsc --noEmit
npm run format:check  # prettier --check .
```

> Next.js 16 removed `next lint`; linting now runs ESLint directly (`npm run lint`).

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

## Environment Variables

| Variable                      | Purpose                                             |
| ----------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | Site URL (OG metadata)                              |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub profile username                             |
| `NEXT_PUBLIC_LINKEDIN_URL`    | Full LinkedIn profile URL                           |
| `NEXT_PUBLIC_RESUME_URL`      | Resume/CV asset URL (renders the "Download CV" CTA) |
| `RESEND_API_KEY`              | Resend (email) for the Contact form (Phase 1)       |

Copy `.env.example` → `.env.local` to configure.

## License

Private — Daniel Zimba.
