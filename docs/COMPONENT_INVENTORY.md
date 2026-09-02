# Component Inventory

## UI Primitives (`components/ui/`)

### Button

- **File**: `button.tsx`
- **Variants**: primary, secondary, outline, ghost, link, destructive, success
- **Sizes**: icon, xs, sm, md, lg, xl
- **Features**: Loading state, disabled state, asChild pattern, full width
- **Accessibility**: aria-busy for loading, focus-visible ring

### Icon

- **File**: `icon.tsx`
- **Sizes**: xs, sm, md, lg, xl
- **Features**: Wraps lucide-react icons, stroke width control, alignment
- **Accessibility**: aria-hidden for decorative, aria-label for meaningful

### Badge

- **File**: `badge.tsx`
- **Variants**: default, secondary, outline, destructive, success, warning, info
- **Sizes**: sm, md, lg

### Skeleton

- **File**: `skeleton.tsx`
- **Variants**: text, circular, rectangular
- **Accessibility**: Respects prefers-reduced-motion

### Spinner

- **File**: `spinner.tsx`
- **Sizes**: sm, md, lg
- **Features**: Uses Loader2 from lucide-react

### Progress

- **File**: `progress.tsx`
- **Variants**: default, success, warning, destructive
- **Dependencies**: @radix-ui/react-progress

### Divider

- **File**: `divider.tsx`
- **Variants**: horizontal, vertical
- **Features**: Optional label, role="separator"

### Spacer

- **File**: `spacer.tsx`
- **Sizes**: xs, sm, md, lg, xl, 2xl

### Card

- **File**: `card.tsx`
- **Variants**: default, elevated, outlined, filled
- **Sub-components**: CardHeader, CardBody, CardFooter, CardMedia, CardActions
- **Features**: Interactive hover state

### Text

- **File**: `text.tsx`
- **Semantic variants**: display, display-lg, h1–h6, lead, body-lg, body, body-sm, small, caption, overline, label, quote, code, mono
- **Color variants**: default, secondary, tertiary, primary, accent, success, warning, danger, info, inverse
- **Weight variants**: normal, medium, semibold, bold
- **Align variants**: left, center, right, justify
- **Features**: Truncate support, fluid typography

### Input

- **File**: `input.tsx`
- **Variants**: default, filled, underlined
- **States**: error, disabled, readOnly
- **Features**: Icon support (left/right)

### Textarea

- **File**: `textarea.tsx`
- **Variants**: default, filled
- **States**: error, disabled, readOnly
- **Features**: Resize support

### Select

- **File**: `select.tsx`
- **Dependencies**: @radix-ui/react-select
- **Features**: Compound components (Select, SelectItem), error state

### Checkbox

- **File**: `checkbox.tsx`
- **Dependencies**: @radix-ui/react-checkbox
- **Variants**: default, primary
- **States**: checked, unchecked, indeterminate, disabled, error

### Switch

- **File**: `switch.tsx`
- **Dependencies**: @radix-ui/react-switch
- **Variants**: default, primary
- **States**: checked, unchecked, disabled

### Radio

- **File**: `radio.tsx`
- **Dependencies**: @radix-ui/react-radio-group
- **Variants**: default, primary
- **Features**: Compound components (RadioGroup, RadioItem), orientation

### Label

- **File**: `label.tsx`
- **Dependencies**: @radix-ui/react-label
- **Variants**: default, error
- **Sizes**: sm, md, lg

### Field

- **File**: `field.tsx`
- **Features**: Composable layout, auto ARIA association, horizontal/vertical orientation
- **Sub-components**: FieldLabel, FieldDescription, FieldHelper, FieldError

### Description

- **File**: `description.tsx`
- **Features**: Accessible description/helper text

### ErrorMessage

- **File**: `error-message.tsx`
- **Features**: role="alert", AlertCircle icon

### HelperText

- **File**: `helper-text.tsx`
- **Features**: Accessible helper text

### Alert

- **File**: `alert.tsx`
- **Variants**: default, destructive, success, warning, info
- **Features**: Title, description, icon, dismissible

### Tooltip

- **File**: `tooltip.tsx`
- **Dependencies**: @radix-ui/react-tooltip
- **Variants**: default, primary, destructive
- **Features**: Side/align positioning, delay duration

### Popover

- **File**: `popover.tsx`
- **Dependencies**: @radix-ui/react-popover
- **Variants**: default, primary
- **Features**: Side/align positioning, controlled open state

### Toast

- **File**: `toast.tsx`
- **Variants**: default, success, warning, destructive, info
- **Features**: Auto-dismiss, action slot, stacked container

### EmptyState

- **File**: `empty-state.tsx`
- **Variants**: default, subtle
- **Features**: Icon, title, description, action slots

### AlertDialog

- **File**: `alert-dialog.tsx`
- **Dependencies**: @radix-ui/react-alert-dialog
- **Features**: Focus trapping, Escape-to-close, title, description, action, cancel

### ThemeToggle

- **File**: `theme-toggle.tsx`
- **Features**: Sun/Moon icons, smooth transition, sr-only label

## Layout Primitives (`components/layout/`)

### Existing (Refined)

- **AppLayout** — Application shell
- **Navigation** — Desktop + mobile navigation
- **Footer** — Site footer with brand, nav, socials, copyright
- **Container** — Centered content with responsive padding
- **Section** — Vertical rhythm wrapper
- **MaxWidth** — Max-width constraint without padding

### New

- **Page** — Top-level page wrapper (default, narrow, full)
- **Shell** — Header/main/footer slots
- **Surface** — Elevated surface (default, raised, overlay)
- **Panel** — Bordered panel with header/body/footer
- **AutoGrid** — Responsive auto-fill grid
- **Stack** — Vertical layout with gap control
- **Inline** — Horizontal layout with wrap
- **Cluster** — Tight horizontal grouping

## Providers (`components/providers/`)

- **ThemeProvider** — next-themes wrapper with class strategy
- **MotionProvider** — Framer Motion LazyMotion with domAnimation
- **Providers** — Composes all providers

## Hooks (`hooks/`)

- **useTheme** — Typed theme hook (light/dark/system)
- **useNavigationState** — Scroll tracking, active section detection
- **useScrollLock** — Body scroll lock for overlays
- **useMediaQuery** — Breakpoint-based media queries
- **useInView** — IntersectionObserver hook
- **useScrollProgress** — Page scroll progress (0-1)

## Design Tokens

### CSS Variables (`app/globals.css`)

- 50+ design tokens covering: colors, typography, spacing, radius, shadows, transitions, scrollbar, selection

### JS Tokens (`lib/tokens.ts`)

- Typed access to all CSS custom properties
- Organized by category: colors, space, radius, shadows, typography, transitions, breakpoints, zIndex, containers

## Documentation

- **docs/DESIGN_SYSTEM.md** — Complete design system guide
- **docs/ARCHITECTURE.md** — Updated with new structure

## Statistics

| Category          | Count |
| ----------------- | ----- |
| UI Primitives     | 28    |
| Layout Primitives | 12    |
| Hooks             | 6     |
| Providers         | 3     |
| Design Tokens     | 50+   |
| Total Components  | 49    |
