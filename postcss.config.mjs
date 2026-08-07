// PostCSS configuration for Tailwind CSS v4.
//
// Next.js 16 + Turbopack does NOT reliably auto-engage Tailwind's v4 JIT
// compiler from `@import "tailwindcss"` alone (the auto-detection is flaky
// and only injects the base/preflight layer, leaving utility classes
// un-generated). Explicitly registering the dedicated v4 PostCSS plugin —
// `@tailwindcss/postcss` — ensures the full v4 engine runs: it processes
// `@import`, `@source`, `@utility`, `@apply`, `@variant`, AND generates the
// on-demand utility classes scanned from the `@source` paths in globals.css.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
