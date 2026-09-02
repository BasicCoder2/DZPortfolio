# DZPortfolio Design System

## Overview

DZPortfolio Design System is a production-grade UI foundation built on Next.js 16, Tailwind CSS v4, and shadcn/ui primitives. It provides a cohesive set of reusable components, design tokens, and conventions that ensure consistency, accessibility, and maintainability across the portfolio.

## Design Principles

Every decision in this system is guided by:

- **Senior Software Engineer** — Clean, idiomatic code that other engineers can read and extend
- **Modern** — Contemporary patterns, not legacy workarounds
- **Elegant** — Whitespace over decoration, typography carries hierarchy
- **Technical** — Precision in spacing, alignment, and interaction
- **Minimal** — Every element has purpose; nothing is arbitrary
- **Confident** — Strong typography, clear hierarchy, decisive interactions
- **Premium** — Subtle shadows, smooth transitions, refined details
- **Fast** — Optimized bundle, tree-shakeable, Server Components preferred
- **Accessible** — WCAG AA compliant by default

## Color Philosophy

### Semantic Token System

Colors are defined as CSS custom properties in `app/globals.css` and consumed via Tailwind utilities. Never hardcode hex values in components.

```
:root {
  --background: #ffffff;
  --foreground: #111827;
  --surface: #f7f7f8;
  --surface-raised: #ffffff;
  --primary: #22c55e;
  --secondary: #2563eb;
  --border: #e5e7eb;
  ...
}
```

### Theme Variants

| Theme | Background | Surface | Primary |
| ----- | ---------- | ------- | ------- |
| Light | #ffffff    | #f7f7f8 | #22c55e |
| Dark  | #0b0d10    | #14161a | #7cff4f |

### Usage

```tsx
<div className="bg-bg text-text-primary border-border">Content</div>
```

## Typography System

### Fluid Scaling

All typography uses `clamp()` for fluid scaling between viewport breakpoints, ensuring readability on all devices.

### Hierarchy

| Token           | Size                            | Weight | Line Height | Usage              |
| --------------- | ------------------------------- | ------ | ----------- | ------------------ |
| `text-display`  | clamp(3rem, 8vw, 6rem)          | 700    | 1.05        | Hero headlines     |
| `text-h1`       | clamp(2.25rem, 5vw, 4rem)       | 700    | 1.1         | Page titles        |
| `text-h2`       | clamp(1.75rem, 3.5vw, 3rem)     | 700    | 1.15        | Section headers    |
| `text-h3`       | clamp(1.25rem, 2.5vw, 2rem)     | 600    | 1.2         | Subsection headers |
| `text-lead`     | clamp(1.125rem, 2.5vw, 1.25rem) | 400    | 1.75        | Intro paragraphs   |
| `text-body`     | 1rem                            | 400    | 1.7         | Body text          |
| `text-small`    | 0.8125rem                       | 400    | 1.5         | Fine print         |
| `text-caption`  | 0.75rem                         | 400    | 1.4         | Captions           |
| `text-overline` | 0.75rem                         | 500    | 1.4         | Labels             |
| `text-code`     | 0.875rem                        | 400    | 1.5         | Code               |

### Usage

```tsx
import { Text } from '@/components/ui/text'

<Text as="h1" className="text-h1">Heading</Text>
<Text as="p" color="secondary">Body text</Text>
```

## Spacing System

### Base Unit

The spacing system uses an 8px base unit. All spacing variables are defined in `app/globals.css`.

| Token      | Value   | Usage                |
| ---------- | ------- | -------------------- |
| `space-1`  | 0.25rem | Tight gaps           |
| `space-2`  | 0.5rem  | Compact spacing      |
| `space-4`  | 1rem    | Default spacing      |
| `space-6`  | 1.5rem  | Section padding      |
| `space-8`  | 2rem    | Large gaps           |
| `space-12` | 3rem    | Component separation |
| `space-16` | 4rem    | Section spacing      |
| `space-20` | 5rem    | Large sections       |
| `space-32` | 8rem    | Hero spacing         |

### Primitives

| Component  | Purpose                              |
| ---------- | ------------------------------------ |
| `Stack`    | Vertical layout with controlled gaps |
| `Inline`   | Horizontal layout with wrap          |
| `Cluster`  | Tight horizontal grouping            |
| `AutoGrid` | Responsive auto-fill grid            |
| `Spacer`   | Quick vertical spacing               |

## Layout Primitives

### Container

Centered content with responsive horizontal padding and constrained max-width.

```tsx
import { Container } from '@/components/layout'

;<Container size="site">Content</Container>
```

Sizes: `sm`, `md`, `lg`, `xl`, `2xl`, `full`, `site` (1200px), `prose` (720px)

### Section

Vertical rhythm wrapper using the `.section` utility.

```tsx
import { Section } from '@/components/layout'

;<Section id="about">Content</Section>
```

### Page

Top-level page wrapper with consistent padding.

```tsx
import { Page } from '@/components/layout'

;<Page size="default">Content</Page>
```

### Shell

Application shell with header, main, and footer slots.

```tsx
import { Shell } from '@/components/layout'

;<Shell header={<Header />} footer={<Footer />}>
  <main>Content</main>
</Shell>
```

### Surface

Elevated surface with shadow variants.

```tsx
import { Surface } from '@/components/layout'

;<Surface variant="raised">Elevated content</Surface>
```

### Panel

Bordered panel with header, body, and footer slots.

```tsx
import { Panel } from '@/components/layout'

;<Panel header={<h3>Title</h3>} footer={<Button>Action</Button>}>
  Content
</Panel>
```

## Component Inventory

The component library now includes reusable primitives for layout, navigation, forms, feedback, motion, media, and utility patterns.

### Core

- Button
- IconButton
- LinkButton
- Card
- Surface
- Panel
- Badge
- Tag
- Chip
- Avatar
- Divider / Separator
- Container
- Section
- Stack
- Cluster
- Grid / AutoGrid
- EmptyState / Empty
- Spinner
- Skeleton
- Progress
- Tooltip
- Popover
- Alert
- Feedback

### Navigation

- DesktopNav
- MobileNav
- NavItem
- NavGroup
- ThemeSwitcher

### Forms

- Input
- Textarea
- Select
- Checkbox
- Switch
- RadioGroup / RadioItem
- Label / Field / Description / Error / Helper

### Media and utilities

- Image / ResponsiveImage
- Figure / CodeBlock
- CopyButton
- ExternalLink
- GradientText
- Highlight
- Metric

### Motion

- FadeIn
- SlideIn
- ScaleIn
- StaggerChildren
- RevealOnScroll
- HoverLift
- MagneticHover

## Component Conventions

### Naming

- Components use PascalCase: `Button`, `CardHeader`, `NavLinks`
- Props use camelCase: `onClick`, `className`, `ariaLabel`
- Variants use kebab-case: `size="sm"`, `variant="outline"`

### Composition

Prefer composition over prop explosion. Use slot patterns for flexibility.

```tsx
<Card>
  <CardHeader>
    <CardMedia aspectRatio="wide" />
  </CardHeader>
  <CardBody>
    <Text as="h3">Title</Text>
  </CardBody>
  <CardFooter>
    <CardActions>
      <Button variant="primary">Action</Button>
    </CardActions>
  </CardFooter>
</Card>
```

### ClassName

Every component accepts `className` for composition. Use `cn()` for merging.

```tsx
import { cn } from '@/lib/utils'

<div className={cn('base-classes', conditional && 'conditional-class', className)}>
```

## Button System

### Variants

| Variant       | Purpose                             |
| ------------- | ----------------------------------- |
| `primary`     | Main CTAs, form submission          |
| `secondary`   | Secondary actions                   |
| `outline`     | Tertiary actions, filters           |
| `ghost`       | Minimal actions, icon buttons       |
| `link`        | Text links styled as links          |
| `destructive` | Delete, remove, destructive actions |
| `success`     | Confirm, save, positive actions     |

### Sizes

| Size   | Height | Padding   | Text |
| ------ | ------ | --------- | ---- |
| `xs`   | 28px   | 8px 12px  | 12px |
| `sm`   | 32px   | 12px 16px | 14px |
| `md`   | 40px   | 16px 24px | 14px |
| `lg`   | 44px   | 24px 32px | 16px |
| `xl`   | 48px   | 32px 40px | 16px |
| `icon` | 36px   | 0         | —    |

### Usage

```tsx
import { Button } from '@/components/ui/button'

;<Button variant="primary" size="md" loading={isSubmitting}>
  Submit
</Button>
```

## Accessibility notes

- Use semantic elements such as `button`, `nav`, `section`, and `label`.
- Make focus rings visible and keep keyboard navigation logical.
- Respect reduced motion preferences for motion wrappers.
- Use `role="alert"` for important feedback and keep contrast aligned with WCAG AA.

## Motion notes

- Motion wrappers use centralized motion tokens and fall back to static rendering when reduced motion is preferred.
- Interactive movement should remain subtle and purposeful.
- Avoid coupling motion to decorative effects alone.

## Button System

### Variants

| Variant       | Purpose                             |
| ------------- | ----------------------------------- |
| `primary`     | Main CTAs, form submission          |
| `secondary`   | Secondary actions                   |
| `outline`     | Tertiary actions, filters           |
| `ghost`       | Minimal actions, icon buttons       |
| `link`        | Text links styled as links          |
| `destructive` | Delete, remove, destructive actions |
| `success`     | Confirm, save, positive actions     |

### Sizes

| Size   | Height | Padding   | Text |
| ------ | ------ | --------- | ---- |
| `xs`   | 28px   | 8px 12px  | 12px |
| `sm`   | 32px   | 12px 16px | 14px |
| `md`   | 40px   | 16px 24px | 14px |
| `lg`   | 44px   | 24px 32px | 16px |
| `xl`   | 48px   | 32px 40px | 16px |
| `icon` | 36px   | 0         | —    |

### Usage

```tsx
import { Button } from '@/components/ui/button'

;<Button variant="primary" size="md" loading={isSubmitting}>
  Submit
</Button>
```

## Form Components

### Field Pattern

Forms use a composable `Field` component that auto-associates labels and error messages.

```tsx
import { Field, Input, Label, ErrorMessage } from '@/components/ui'

;<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" />
  <FieldError>Invalid email</FieldError>
</Field>
```

### Accessibility

- All inputs have associated labels
- Error states use `aria-invalid` and `aria-describedby`
- Focus indicators are visible and consistent
- Reduced motion is respected

## Motion System

### Centralized Configuration

All motion values are defined in `lib/motion/` and referenced consistently.

| Constant        | Purpose                         |
| --------------- | ------------------------------- |
| `SPRING_SMOOTH` | Cards, modals, drawers          |
| `SPRING_SNAPPY` | Buttons, toggles, hover effects |
| `SPRING_GENTLE` | Hero elements, page transitions |
| `EASE_OUT`      | Standard entrance               |
| `EASE_EXPO`     | Dramatic reveals                |
| `STAGGER_FAST`  | Nav items, tag lists            |
| `STAGGER_SLOW`  | Section cards, grids            |

### Usage

```tsx
import { motion } from 'framer-motion'
import { fadeUpPreset } from '@/lib/motion'

;<motion.div {...fadeUpPreset}>Content</motion.div>
```

### Reduced Motion

All animations respect `prefers-reduced-motion` via the global CSS rule in `app/globals.css`.

## Icon System

### Usage

```tsx
import { Icon } from '@/components/ui/icon'
import { Mail } from 'lucide-react'

;<Icon icon={Mail} size="md" decorative />
```

### Sizes

| Size | Dimensions |
| ---- | ---------- |
| `xs` | 12px       |
| `sm` | 16px       |
| `md` | 20px       |
| `lg` | 24px       |
| `xl` | 32px       |

### Accessibility

- Decorative icons: `aria-hidden="true"`, `role="presentation"`
- Meaningful icons: `aria-label` provided
- Stroke width: 2px default, configurable

## Accessibility Rules

### WCAG AA Compliance

Every component must satisfy:

1. **Color Contrast** — 4.5:1 minimum for normal text, 3:1 for large text
2. **Keyboard Navigation** — All interactive elements focusable via Tab
3. **Visible Focus** — 2px ring offset from element
4. **Semantic HTML** — Use native elements (`button`, `nav`, `main`, etc.)
5. **ARIA Labels** — Descriptive labels for non-text content
6. **Reduced Motion** — `prefers-reduced-motion: reduce` respected
7. **Screen Readers** — Live regions, roles, and descriptions where needed

### Focus Management

```tsx
// Focus-visible ring applied globally
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 3px;
}
```

## Performance

### Bundle Optimization

- **Tree-shaking**: All UI primitives are individually exportable
- **Server Components**: Default to RSC; `'use client'` only where needed
- **Lazy Motion**: Framer Motion uses `LazyMotion` with `domAnimation` feature set
- **Font Loading**: `display: swap` with preload for critical fonts

### Best Practices

- Avoid importing entire component libraries
- Use `React.memo` for expensive components
- Prefer CSS transitions over JavaScript animations
- Use `loading="lazy"` for images below the fold

## Naming Conventions

| Type        | Convention                  | Example                          |
| ----------- | --------------------------- | -------------------------------- |
| Components  | PascalCase                  | `Button`, `CardHeader`           |
| Props       | camelCase                   | `onClick`, `ariaLabel`           |
| Variants    | kebab-case                  | `size="sm"`, `variant="outline"` |
| CSS Classes | kebab-case                  | `text-h1`, `bg-surface`          |
| Hooks       | camelCase with `use` prefix | `useTheme`, `useNavigationState` |
| Constants   | UPPER_SNAKE_CASE            | `NAV_LINKS`, `BREAKPOINTS`       |
| Types       | PascalCase                  | `ButtonProps`, `Theme`           |

## File Structure

```
components/
  ui/                    # shadcn/ui primitives
    button.tsx
    input.tsx
    card.tsx
    ...
  layout/                # Application shell
    Navigation/
    Footer/
    Container.tsx
    Section.tsx
    ...
  animations/            # Motion wrappers
    MotionWrapper.tsx
    RevealText.tsx
    ...
lib/
  tokens.ts              # Design token JS exports
  motion/                # Motion system
    constants.ts
    transitions.ts
    variants.ts
    presets.ts
  utils.ts               # cn() helper
hooks/
  useTheme.ts            # Theme hook
  useNavigationState.ts  # Navigation state
  ...
app/
  globals.css            # Design tokens + base styles
```

## Usage Guidelines

### Do

- Use design tokens for all colors, spacing, and typography
- Prefer composition over configuration
- Add `className` to every component for flexibility
- Test with keyboard navigation and screen readers
- Respect `prefers-reduced-motion`

### Don't

- Hardcode hex colors or pixel values
- Create one-off components when a primitive works
- Add unnecessary `'use client'` directives
- Inline complex styles
- Skip accessibility attributes

## Future Extension Guidelines

When adding new components:

1. **Check primitives first** — Can it be composed from existing components?
2. **Use tokens** — All visual properties reference CSS variables
3. **Follow conventions** — Naming, file structure, export patterns
4. **Accessibility by default** — Keyboard nav, ARIA, focus indicators
5. **Document usage** — Add examples to this file
6. **Test thoroughly** — Type-check, lint, build, and manual testing
