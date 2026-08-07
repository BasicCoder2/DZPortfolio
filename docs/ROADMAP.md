# Roadmap

Phase 0 (Stabilization) is complete. Phases 1-3 are the forward plan.

## Phase 0 - Stabilization (done)

Goal: repo builds, lints, type-checks, and actually renders styles; zero
placeholder engineering debt.

- Fixed Tailwind v4 pipeline (plugin + @config + @source).
- Migrated ESLint to native flat config; removed crashing FlatCompat shim.
- Resolved `composes:` conflict; component utilities use plain CSS.
- Single source of truth for nav/socials; env-driven links + CTA.
- Removed dead/placeholder modules (motion shim, mdx stub, TooltipProvider).
- Fixed next.config.ts (MDX, removed invalid page base path).
- Installed missing prettier; added type-check/lint/format scripts.
- Documentation baseline (README, ARCHITECTURE, CHANGELOG, ROADMAP, DECISIONS).
- All gates green: type-check, lint, format:check, build.

## Phase 1 - Content Sections

Implement the deferred content sections on the home page + dedicated routes.

- Home hero: refine the home shell into a full hero (tagline, scroll cue).
- About (#about): bio, experience, skills (data/technologies.ts).
- What I Build / Services (#services): data/services.ts.
- Projects (#projects + /projects): cards from content/projects/*.mdx.
- Blog (/blog + /blog/[slug]): MDX via @next/mdx from content/blog/*.mdx.
- Contact (#contact): email form wired to Resend (RESEND_API_KEY).
- SEO: per-route metadata + OG images (public/og).

## Phase 2 - UX & Polish

- shadcn/ui-style component library (per docs/AI_RULES.md "Use shadcn/ui").
- Theme toggle (dark/light) persisted via next-themes.
- Motion: stagger + reveal choreography (lib/motion).
- BackToTop floating button (scroll-threshold reveal).
- Accessibility audit (WCAG AA).

## Phase 3 - Production Hardening

- Analytics + performance monitoring.
- Image optimization (next/image).
- Cache headers for static prerenders.
- Deploy target (Vercel) verification.

## Principles (docs/AI_RULES.md)

TypeScript everywhere; prefer Server Components; semantic HTML; WCAG AA;
no inline styles; Tailwind CSS + Framer Motion; no duplicated logic.
