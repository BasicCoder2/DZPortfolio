# Motion Architecture Report

## Overview

DZPortfolio's motion system provides a centralized, consistent approach to animations using Framer Motion with strict conventions for timing, easing, and spring physics.

## Architecture

```
lib/motion/
  ├── index.ts          # Barrel export
  ├── constants.ts      # Spring presets, easing curves, stagger configs
  ├── transitions.ts    # Reusable transition config objects
  ├── variants.ts       # Named Framer Motion variant definitions
  └── presets.ts        # Ready-to-use prop objects
```

## Spring Presets

| Preset | Stiffness | Damping | Mass | Usage |
|--------|-----------|---------|------|-------|
| `SPRING_SMOOTH` | 300 | 30 | 1 | Cards, modals, drawers |
| `SPRING_SNAPPY` | 500 | 40 | 0.8 | Buttons, toggles, hover |
| `SPRING_GENTLE` | 180 | 28 | 1.2 | Hero elements, page transitions |

## Easing Presets

| Preset | Bezier | Usage |
|--------|--------|-------|
| `EASE_OUT` | [0, 0, 0.2, 1] | Standard entrance |
| `EASE_IN_OUT` | [0.4, 0, 0.2, 1] | Enter and exit |
| `EASE_EXPO` | [0.16, 1, 0.3, 1] | Dramatic reveals |

## Stagger Presets

| Preset | Stagger | Delay | Usage |
|--------|---------|-------|-------|
| `STAGGER_FAST` | 0.05s | 0.1s | Nav items, tag lists |
| `STAGGER_SLOW` | 0.1s | 0.2s | Section cards, grids |

## Transition Presets

| Preset | Duration | Easing | Usage |
|--------|----------|--------|-------|
| `transitionDefault` | spring | SPRING_SMOOTH | Default animated elements |
| `transitionFast` | spring | SPRING_SNAPPY | Micro-interactions |
| `transitionCinematic` | spring | SPRING_GENTLE | Hero / page-level |
| `transitionNav` | 0.25s | EASE_OUT | Nav background changes |
| `transitionPage` | 0.45s | EASE_EXPO | Page-level transitions |
| `transitionFooter` | 0.6s | EASE_EXPO | Footer fade-up |
| `transitionMobileMenu` | 0.35s | EASE_EXPO | Mobile menu slide |

## Animation Variants

### Scroll Reveal
- `fadeUpVariants` — Primary reveal (fade + slide up)
- `fadeDownVariants` — Fade from above
- `fadeLeftVariants` — Fade from left
- `fadeRightVariants` — Fade from right
- `scaleInVariants` — Scale from 0.92

### Stagger Containers
- `staggerContainerVariants` — Slow stagger (cards, grids)
- `staggerContainerFastVariants` — Fast stagger (nav, tags)

### Navigation
- `navVariants` — Fade + blur + slide down
- `navLinkVariants` — Individual link stagger

### Mobile Menu
- `mobileMenuVariants` — Slide in from left
- `mobileMenuBackdropVariants` — Backdrop fade
- `mobileMenuLinksVariants` — Link stagger
- `mobileMenuLinkVariants` — Individual link

### Page Transitions
- `pageVariants` — Fade + slide (route transitions)

### Footer
- `footerVariants` — Fade up on scroll

## Preset Objects

Ready-to-use bundles for common patterns:

| Preset | Purpose |
|--------|---------|
| `navPreset` | Navigation bar entrance |
| `pagePreset` | Full-page route transitions |
| `footerPreset` | Footer scroll-reveal |
| `mobileMenuPreset` | Mobile menu overlay |
| `mobileMenuBackdropPreset` | Backdrop fade |
| `fadeUpPreset` | Generic scroll-reveal fade up |
| `fadeDownPreset` | Scroll-reveal fade down |
| `fadeLeftPreset` | Scroll-reveal from left |
| `fadeRightPreset` | Scroll-reveal from right |
| `scaleInPreset` | Scale-in scroll reveal |

## Reduced Motion

Global CSS rule in `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Bundle Optimization

- `LazyMotion` with `domAnimation` feature set
- Reduces Framer Motion bundle by ~70%
- Only loads features needed for standard web animations
