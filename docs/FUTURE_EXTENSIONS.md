# Future Extension Guidelines

## Adding New Components

When adding new components to the design system, follow these guidelines:

### 1. Check Primitives First

Before creating a new component, ask:
- Can this be composed from existing primitives?
- Does a similar component already exist?

Example: A `ProjectCard` should compose `Card` + `Badge` + `Button`, not create a new card type.

### 2. Use Design Tokens

All visual properties must reference CSS custom properties:

```tsx
// Good
<div className="bg-surface text-text-primary border-border">

// Bad
<div className="bg-white text-gray-900 border-gray-200">
```

### 3. Follow Naming Conventions

| Type | Convention |
|------|-----------|
| Component file | `kebab-case.tsx` |
| Component name | `PascalCase` |
| Props interface | `XxxProps` |
| Variants | `kebab-case` values |

### 4. Support Composition

Every component should accept `className` and forward refs where appropriate:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  // ...
}
```

### 5. Accessibility by Default

- Use semantic HTML elements
- Add ARIA labels for icon-only buttons
- Ensure keyboard navigation works
- Add `role` attributes where needed
- Support `prefers-reduced-motion`

### 6. Performance Considerations

- Default to Server Components (no `'use client'`)
- Only add `'use client'` when using hooks or browser APIs
- Use `React.memo` for expensive components
- Avoid inline function definitions in render
- Prefer CSS transitions over JS animations

### 7. Testing Requirements

Before merging a new component:
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Dark mode tested
- [ ] Responsive breakpoints tested

## Extending the Theme

### Adding New Tokens

1. Define the CSS variable in `app/globals.css`
2. Add the JS export in `lib/tokens.ts`
3. Map to Tailwind utility in `tailwind.config.ts`
4. Document in `docs/DESIGN_SYSTEM.md`

### Adding New Variants

When adding variants to existing components:

1. Add the variant to the CVA config
2. Define the CSS classes using design tokens
3. Update the TypeScript type if needed
4. Add to documentation

## Migration Path

When updating existing components:

1. Ensure backward compatibility where possible
2. Add deprecation warnings before removing features
3. Update all usages in the codebase
4. Document breaking changes

## Package Updates

When updating dependencies:

1. Test with `npm install`
2. Run full verification suite
3. Check for breaking changes in release notes
4. Update shadcn/ui config if components change

## Code Review Checklist

- [ ] Component uses design tokens
- [ ] Accessibility attributes present
- [ ] No hardcoded values
- [ ] TypeScript types exported
- [ ] Barrel export updated
- [ ] Documentation added
- [ ] Tests pass
