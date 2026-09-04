# Assets

Everything under `public/` is served from the URL root, so a file at
`public/assets/projects/foo.png` is referenced in code as `/assets/projects/foo.png`.

Drop real images here to replace the placeholders. Sizes below are derived from
how each image is actually rendered — they already account for a 2× display.

---

## `projects/` — case-study covers

|                      |                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Aspect ratio**     | 16:9 (enforced by the card; anything else is cropped)                                      |
| **Recommended size** | 1600 × 900                                                                                 |
| **Format**           | WebP or PNG for UI screenshots, JPG for photography                                        |
| **Fit**              | `object-cover`, so the centre of the frame survives — keep the subject away from the edges |

Filenames must match the `coverImage` values in [`data/projects.ts`](../../data/projects.ts):

- `lmmu-governance-admissions.svg`
- `fase-plaza.svg`
- `uka-smart-home.svg`
- `loan-tracking.svg`

If you drop `.png`/`.webp` files instead, update the extensions in that file and
in the two fallback paths (`components/home/HomeSections.tsx`,
`components/projects/ProjectCard.tsx`).

The first featured project renders as a wide split card (image beside the text)
rather than a stacked one, so give it a cover that reads well at roughly 550 × 400.

## `portrait/` — hero portrait

|                      |                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **Aspect ratio**     | 720:860 (portrait, ~0.84)                                                                                 |
| **Recommended size** | 1080 × 1290                                                                                               |
| **Format**           | PNG or WebP                                                                                               |
| **Filename**         | `daniel-zimba-hero.png` — update the `src` in `components/hero/HeroPortrait.tsx` if the extension changes |

The frame uses `object-cover` inside a clipping wrapper, so the photo fills the
arch and is cropped to it. Framing is anchored centre; since the source is
slightly wider than the frame, the crop trims the sides rather than the top, so
keep some headroom and avoid placing anything essential near the left and right
edges.

A cut-out subject on a transparent background would want `object-contain` and
padding on the image instead — that is what the frame previously carried.

## `og/` — social share image

|              |                                                      |
| ------------ | ---------------------------------------------------- |
| **Size**     | 1200 × 630 (exact — this is the Open Graph standard) |
| **Format**   | PNG                                                  |
| **Filename** | `og-default.png`                                     |

Referenced by [`data/site.ts`](../../data/site.ts) and
[`lib/constants.ts`](../../lib/constants.ts). The Twitter card is
`summary_large_image`, so this crop is what appears on both. **Currently missing** —
links shared today render without a preview image.

## `blog/` — post covers

Ready but unused: blog posts have no cover-image field yet. Add one to
`data/blog.ts` before putting files here.

## `portrait/` — generated derivatives

The files here are **produced by `pnpm images:optimize`**, not edited by hand.
The full-resolution masters live in `assets-source/portrait/` — outside
`public/`, so they are not uploaded on every deploy.

| File                       | Purpose                          |
| -------------------------- | -------------------------------- |
| `daniel-zimba-hero.webp`   | Hero portrait (what the page loads) |
| `daniel-zimba-hero.avif`   | Smaller alternative               |
| `daniel-zimba-avatar.webp` | `/me` profile card               |
| `daniel-zimba-avatar.avif` | Smaller alternative               |
| `daniel-zimba-avatar.jpg`  | Original avatar (still the master) |

The hero previously shipped as a 3.39 MB PNG for a frame never wider than about
460 CSS pixels. The WebP is 56 KB. To change the sizes produced, edit `TARGETS`
in `scripts/optimize-images.mjs` and re-run.

## `logos/` — client and employer marks

Unused. SVG preferred so marks stay crisp and can inherit colour.

## `cv/` — downloadable CV

|                 |                                                       |
| --------------- | ----------------------------------------------------- |
| **Filename**    | `daniel-zimba-cv.pdf`                                 |
| **Linked from** | hero button, desktop nav, mobile menu, `data/site.ts` |

Replacing it is a straight overwrite — keep the filename and no code changes are
needed. `NEXT_PUBLIC_RESUME_URL` overrides this path if set, for pointing at an
externally hosted copy.

---

## Not here

**Favicons** are generated from source, not stored: `app/icon.svg` (browser tab)
and `app/apple-icon.tsx` (renders a PNG at build time). Edit those files rather
than adding icon files here.
