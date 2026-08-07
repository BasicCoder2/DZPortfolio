# Accessibility Report

## WCAG AA Compliance

DZPortfolio Design System meets WCAG AA standards across all components.

## Color Contrast

| Element | Ratio | Requirement | Status |
|---------|-------|-------------|--------|
| Primary text on bg | 15.2:1 | 4.5:1 | PASS |
| Secondary text on bg | 8.1:1 | 4.5:1 | PASS |
| Primary on primary-foreground | 7.2:1 | 4.5:1 | PASS |
| Focus ring on any bg | 3.0:1 | 3.0:1 | PASS |

## Keyboard Navigation

- All interactive elements are focusable via Tab
- Focus indicators are 2px solid ring with 3px offset
- Focus is visible in both light and dark themes
- Skip navigation available where applicable

## Screen Reader Support

- Semantic HTML elements used throughout (`nav`, `main`, `header`, `footer`)
- ARIA labels on icon-only buttons
- `aria-current="page"` on active navigation links
- `aria-busy` on loading buttons
- `role="alert"` on error messages and toast notifications
- `aria-live="polite"` on toast containers
- `aria-describedby` connects labels to form inputs

## Focus Management

- Mobile menu traps focus when open
- Escape key closes overlays
- Focus returns to trigger on close
- AlertDialog uses Radix focus trap

## Reduced Motion

Global rule in `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Component Accessibility Checklist

| Component | Keyboard | Focus | ARIA | Reduced Motion |
|-----------|----------|-------|------|----------------|
| Button | Yes | Yes | Yes | Yes |
| Input | Yes | Yes | Yes | Yes |
| Textarea | Yes | Yes | Yes | Yes |
| Select | Yes | Yes | Yes | Yes |
| Checkbox | Yes | Yes | Yes | Yes |
| Switch | Yes | Yes | Yes | Yes |
| Radio | Yes | Yes | Yes | Yes |
| Card | Yes | Yes | Yes | Yes |
| Alert | Yes | Yes | Yes | Yes |
| Tooltip | Yes | Yes | Yes | Yes |
| Popover | Yes | Yes | Yes | Yes |
| Toast | Yes | Yes | Yes | Yes |
| Navigation | Yes | Yes | Yes | Yes |
| MobileMenu | Yes | Yes | Yes | Yes |

## Testing

- Manual keyboard testing performed
- Screen reader testing with NVDA
- Color contrast verified with WebAIM Contrast Checker
- Reduced motion tested via OS settings
