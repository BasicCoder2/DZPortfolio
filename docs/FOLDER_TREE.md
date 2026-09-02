# Folder Tree

```
dz-portfolio/
├── app/
│   ├── globals.css              # Design tokens, base styles, utilities
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page placeholder
├── components/
│   ├── ui/                      # shadcn/ui primitives (28 components)
│   │   ├── index.ts             # Barrel export
│   │   ├── alert.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── description.tsx
│   │   ├── divider.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-message.tsx
│   │   ├── field.tsx
│   │   ├── helper-text.tsx
│   │   ├── icon.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── spacer.tsx
│   │   ├── spinner.tsx
│   │   ├── switch.tsx
│   │   ├── text.tsx
│   │   ├── textarea.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── toast.tsx
│   │   ├── tooltip.tsx
│   │   └── ...
│   ├── layout/                  # Application shell
│   │   ├── AppLayout.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ├── Page.tsx
│   │   ├── Shell.tsx
│   │   ├── Surface.tsx
│   │   ├── Panel.tsx
│   │   ├── AutoGrid.tsx
│   │   ├── Stack.tsx
│   │   ├── Inline.tsx
│   │   ├── Cluster.tsx
│   │   ├── MaxWidth.tsx
│   │   ├── MainContent.tsx
│   │   ├── TransitionLayout.tsx
│   │   ├── Navigation/
│   │   │   ├── Navigation.tsx
│   │   │   ├── NavLinks.tsx
│   │   │   ├── Wordmark.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── CTAButton.tsx
│   │   └── Footer/
│   │       ├── Footer.tsx
│   │       ├── Brand.tsx
│   │       ├── Navigation.tsx
│   │       ├── Socials.tsx
│   │       └── Copyright.tsx
│   ├── providers/
│   │   ├── Providers.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── MotionProvider.tsx
│   └── animations/
│       ├── MotionWrapper.tsx
│       ├── RevealText.tsx
│       ├── ScaleIn.tsx
│       ├── StaggerChildren.tsx
│       └── BackToTop.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── useNavigationState.ts
│   ├── useScrollLock.ts
│   ├── useMediaQuery.ts
│   ├── useInView.ts
│   └── useScrollProgress.ts
├── lib/
│   ├── tokens.ts                # Design token JS exports
│   ├── utils.ts                 # cn() helper
│   ├── fonts.ts                 # Font configuration
│   ├── constants.ts             # Site constants
│   ├── metadata.ts              # SEO metadata
│   └── motion/
│       ├── index.ts
│       ├── constants.ts         # Spring/easing/stagger values
│       ├── transitions.ts       # Transition configs
│       ├── variants.ts          # Framer Motion variants
│       └── presets.ts           # Ready-to-use presets
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
├── docs/
│   ├── DESIGN_SYSTEM.md         # Complete design system guide
│   ├── COMPONENT_INVENTORY.md   # Component reference
│   ├── THEME_ARCHITECTURE.md    # Theme system report
│   ├── MOTION_ARCHITECTURE.md   # Motion system report
│   ├── ACCESSIBILITY.md         # A11y compliance report
│   ├── ARCHITECTURE.md          # Project architecture
│   ├── DECISIONS.md             # ADR-style decisions
│   ├── CHANGELOG.md             # Change log
│   └── ROADMAP.md               # Project roadmap
├── tailwind.config.ts           # Tailwind v4 theme config
├── postcss.config.mjs           # PostCSS pipeline
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── components.json              # shadcn/ui config
├── next.config.ts               # Next.js config
└── eslint.config.mjs            # ESLint flat config
```

## Statistics

| Category             | Count |
| -------------------- | ----- |
| UI Primitives        | 28    |
| Layout Primitives    | 12    |
| Providers            | 3     |
| Animation Components | 5     |
| Hooks                | 6     |
| Design Tokens        | 50+   |
| Documentation Files  | 9     |
