# Design Language

## Design philosophy

The visual language is built around calm confidence, precision, and technical maturity. It should feel credible for a senior software engineer working at the intersection of systems design, product development, and AI delivery.

### Typography direction
- Use a crisp sans-serif for UI and a strong geometric heading face for emphasis.
- Keep headings compact and assertive with negative tracking and generous vertical rhythm.
- Favor readability over decorative flourishes, especially for prose and code.

### Whitespace philosophy
- Whitespace is structural, not ornamental. It should create calm and make important content feel deliberate.
- Dense layouts are avoided unless the content itself benefits from compression.
- Core spacing decisions should feel consistent, measured, and restrained.

### Spacing rhythm
- The system uses a formal 8px-based scale with additional steps for large sections.
- Section spacing is generous enough to feel premium while preserving scanability.
- Components use consistent internal spacing to maintain visual harmony.

### Elevation
- Elevation is subtle and semantic. Surfaces rise only when they need attention or grouping.
- Glass surfaces are used sparingly to suggest refinement without overusing blur.

### Surfaces
- Backgrounds are quiet and low-contrast.
- Elevated surfaces are slightly brighter and more structured than the page background.
- Dividers remain soft to preserve a premium feel.

### Visual hierarchy
- Headlines lead with confidence and weight.
- Supporting copy is quieter and less dominant.
- Color is used sparingly to signal interaction rather than to shout.

### Interaction philosophy
- Motion should be precise, modest, and purposeful.
- Hover and focus states should communicate state changes without feeling playful or noisy.
- The interaction model should feel polished and technically grounded.

### Accessibility philosophy
- Contrast and focus visibility are treated as core design requirements, not add-ons.
- Reduced motion is respected and motion is downgraded rather than removed entirely.
- The system remains readable in both light and dark themes.

## Semantic color system

The palette avoids brand-name colors and instead uses semantic tokens for surfaces, text, accents, status states, borders, and overlays.

### Token inventory
- Background
- Foreground
- Surface
- Surface muted
- Surface elevated
- Surface overlay
- Primary
- Secondary
- Accent
- Muted foreground
- Border
- Divider
- Overlay
- Focus ring
- Selection
- Success
- Warning
- Danger
- Info

## Typography guide

### Scale
- Display XL: large, confident headline scale for major moments
- Display: high-impact display text
- Heading 1–6: structured hierarchy for content sections
- Lead: extended introduction or summary text
- Body: primary reading copy
- Body small: supporting copy and metadata
- Caption: low-emphasis information
- Mono: code and technical labels
- Code: inline code and snippets
- Label: form and UI labels
- Quote: emphatic pull quotes or short statements
- Overline: compact uppercase labels

### Readability
- Body copy uses a relaxed line height with a comfortable maximum line length.
- Fluid sizing via clamp allows the system to scale elegantly across viewports.

## Spacing guide

### Scale
- 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Usage
- 2–8: compact spacing for chips and tight UI relationships
- 12–16: standard component padding and list spacing
- 20–24: section gaps and content spacing
- 32–48: major layout divisions and page-level separation
- 64–96: large empty-state and showcase spacing

## Radius guide

- xs: compact controls
- sm: small surfaces and inputs
- md: standard cards and buttons
- lg: larger cards and panels
- xl: section shells and elevated containers
- 2xl: oversized panels
- pill: pills, tags, and compact chips

## Elevation guide

- none: flat content
- sm: low emphasis surfaces
- md: standard card and panel elevation
- lg: larger interactive surfaces
- xl: prominent floating containers
- glass: translucent layered surfaces
- overlay: modal or full-screen overlay elevation

## Motion guide

- Duration: 150ms for quick feedback, 250ms for standard transitions, 400ms for page-level movement
- Easing: use a calm, precise curve rather than elastic motion
- Hover timing: fast and subtle
- Page transitions: understated and directional
- Micro interactions: short and decisive
- Reduced motion: disable non-essential animation and preserve clarity

## Accessibility summary

- Contrast targets remain aligned with WCAG AA expectations.
- Focus states are visible and consistent.
- Keyboard navigation order is preserved through the component system.
- Motion is reduced automatically when the user requests reduced motion.

## Screenshot checklist

- Typography hierarchy feels balanced and readable.
- Light and dark themes both feel polished.
- Surfaces have clear separation without harsh contrast.
- Buttons and interactive states look consistent.
- Focus ring is visible and not distracting.
- Spacing feels deliberate and calm.
