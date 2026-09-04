# Source assets

Full-resolution originals that are **not** served to visitors.

Everything under `public/` is uploaded verbatim on every deploy and is publicly
addressable. These files are neither: they are the masters that
`pnpm images:optimize` re-encodes from, kept in version control so the
optimized derivatives can always be regenerated.

| File                             | Derived assets in `public/assets/portrait/`        |
| -------------------------------- | -------------------------------------------------- |
| `portrait/daniel-zimba-hero.png` | `daniel-zimba-hero.webp`, `daniel-zimba-hero.avif` |

The hero portrait lived at `public/assets/portrait/daniel-zimba-hero.png` until
the content-platform release. It was 3.39 MB — roughly sixty times the size of
the 56 KB WebP the page actually loads — and nothing referenced it once the
re-encode existed, so it was shipping in every deploy artifact for no reason.
Moving rather than deleting keeps the only high-resolution copy.

To change which sizes are produced, edit the `TARGETS` table in
`scripts/optimize-images.mjs` and re-run `pnpm images:optimize`.
