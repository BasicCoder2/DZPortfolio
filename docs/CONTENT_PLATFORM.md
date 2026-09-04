# Content platform architecture

How content gets from a database row to a rendered page, and what stops the
wrong content getting there.

---

## 1. Content flow

```
                     ┌──────────────────────────────────────────┐
                     │  Supabase Postgres                       │
                     │  posts · projects · experience_entries   │
                     │  certifications · engagement_options     │
                     │  + Row-Level Security                    │
                     └───────────┬──────────────────┬───────────┘
                                 │                  │
                  anon, no cookie│                  │administrator's session
                                 ▼                  ▼
                 lib/supabase/public.ts    lib/supabase/server.ts
                 (session-less client)     (cookie-backed client)
                                 │                  │
                                 ▼                  ▼
                lib/content/repositories.ts   lib/content/admin-queries.ts
                 published rows only           every row, drafts included
                                 │                  │
              ┌──────────────────┴───┐              ├──────────────┐
              ▼                      ▼              ▼              ▼
        app/(site)/…            app/sitemap.ts  app/admin/…   /admin/preview/…
        prerendered + ISR       published URLs  dashboards    draft preview
```

Writes go the other way, through Server Actions in `lib/actions/`, each of which
re-authorizes, validates with the shared Zod schema, writes through the
cookie-backed client, and then revalidates the affected public routes.

## 2. The two clients, and why there are two

|                 | `lib/supabase/public.ts`       | `lib/supabase/server.ts`      |
| --------------- | ------------------------------ | ----------------------------- |
| Session         | none                           | the caller's cookie           |
| Postgres role   | `anon`                         | `authenticated`               |
| Can see drafts  | no — RLS refuses               | yes, if the user is the admin |
| Reads cookies   | no                             | yes                           |
| Route rendering | stays static / ISR             | forces dynamic                |
| Used by         | every public page, the sitemap | every admin page and mutation |

Splitting them buys two things at once.

**Published-only becomes structural.** Public pages carry no session at all, so
PostgREST evaluates their queries as `anon` and RLS returns published rows and
nothing else. An administrator browsing their own site sees exactly what a
visitor sees. Even a query that forgot its `.eq('status', 'published')` filter
could not leak a draft. (The filters are still written, as documentation and as
a second line — see `lib/content/repositories.ts`.)

**Public pages stay static.** `cookies()` opts a route into dynamic rendering.
A cookie-free client means the whole public site can be prerendered and served
from the CDN.

There is **no service-role client in the application**. The one place that key
appears is `scripts/import-content.mjs`, the one-off content migration, which
runs locally and never in Vercel.

## 3. Rendering and caching

| Route                                                         | Strategy                        |
| ------------------------------------------------------------- | ------------------------------- |
| `/`, `/blog`, `/blog/[slug]`, `/projects`, `/projects/[slug]` | Prerendered, `revalidate = 300` |
| `/sitemap.xml`                                                | Prerendered, `revalidate = 300` |
| `/me`, `/design-system`                                       | Static                          |
| `/admin/**`                                                   | `dynamic = 'force-dynamic'`     |
| `/api/contact`                                                | Route handler, always dynamic   |

The five-minute figure is written as a literal `export const revalidate = 300`
in each of those six route files. It cannot be shared from a constant: Next
statically analyses route segment config at build time and rejects an imported
value with _"Invalid segment configuration export detected"_. The six files are
`app/(site)/page.tsx`, `app/(site)/blog/page.tsx`,
`app/(site)/blog/[slug]/page.tsx`, `app/(site)/projects/page.tsx`,
`app/(site)/projects/[slug]/page.tsx` and `app/sitemap.ts`.

The timer is a **fallback**, not the mechanism. Every mutation calls
`revalidatePosts()`, `revalidateProjects()` or `revalidateHomeSections()`, which
invalidate the specific rendered routes a change can affect — including the
homepage, the index, the record's own page, the dynamic route pattern (so a
renamed slug stops resolving at its old URL) and the sitemap. Publishing is
visible immediately.

Path revalidation rather than tag revalidation, because `revalidateTag` operates
on Next's _fetch_ cache and these reads go through `@supabase/supabase-js`,
whose requests the app does not annotate. Tagging them would require wrapping
every repository call in `unstable_cache`, which cannot be combined with code
that touches cookies.

### A removed line worth knowing about

`app/layout.tsx` used to export `dynamic = 'force-static'`. On a root layout
that forces `cookies()` to return empty values for the entire subtree, so every
admin route would have seen an anonymous session no matter who was signed in.
It was removed. The public pages lost nothing: they use no dynamic APIs, so
Next still prerenders them, and the content routes additionally opt into ISR.

## 4. Route structure

Public routes moved into a `(site)` route group so the admin area could have a
different shell. Route groups contribute nothing to the URL — every public path
is unchanged.

```
app/
├── layout.tsx                 root: fonts, providers, globals.css
├── (site)/
│   ├── layout.tsx             public chrome: nav, footer, transitions
│   ├── page.tsx  blog/  projects/  me/  design-system/
├── admin/
│   ├── layout.tsx             force-dynamic + noindex (wraps login too)
│   ├── login/page.tsx         outside the gate, by necessity
│   └── (protected)/
│       ├── layout.tsx         THE AUTHORIZATION GATE
│       ├── page.tsx           dashboard
│       ├── blog/ projects/ experience/ certifications/ engagement/
│       └── preview/           draft preview, admin-only
├── sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx
└── api/contact/route.ts
```

`proxy.ts` at the repository root refreshes the session cookie for `/admin/**`.
In Next.js 16 the `middleware` convention is deprecated and renamed to `proxy`.

## 5. Authorization

Three independent layers. Any one of them failing does not open the door.

1. **`proxy.ts`** — optimistic. Redirects requests to `/admin` with no valid
   token, and rotates the session cookie (Server Components cannot write
   cookies, so without this a long edit would expire mid-session). It does not
   know _which_ account is signed in.

2. **`app/admin/(protected)/layout.tsx`** — calls `getAdminAuthState()` and
   renders one of four outcomes: redirect (anonymous), a configuration notice
   (no `ADMIN_EMAIL`), a bare 403 with a sign-out button (authenticated but not
   the admin — no navigation, no counts, no data), or the real interface.

3. **Every Server Action and every admin query** — `requireAdminForAction()` /
   `requireAdmin()`. This is the layer that matters most: a Server Action is a
   public POST endpoint reachable without ever rendering that layout.

Underneath all three, **Row-Level Security**. `public.is_admin()` checks the
`is_admin` flag on the caller's `profiles` row; policies permit anonymous SELECT
of published rows only, and reserve every write to the administrator.

**Authorization is a two-key check.** The application compares the verified
account email to `ADMIN_EMAIL`; the database checks `profiles.is_admin`. Both
must name the same account. Setting one without the other authorizes nobody,
which is the correct failure direction.

Two details that are easy to undo by accident:

- Every check calls `supabase.auth.getUser()`, which revalidates the token with
  the auth server. `getSession()` reads the cookie and believes it. Swapping
  them would make a forged cookie sufficient.
- "Not signed in" and "signed in as the wrong person" return the _same_ message.
  A distinct one would confirm to an attacker that their credentials worked.

## 6. Markdown safety

Bodies are Markdown, rendered by `react-markdown` in `lib/content/markdown.tsx`.

- **No `rehype-raw`**, so embedded HTML is never parsed into elements —
  `<script>alert(1)</script>` renders as visible text. There is no
  `dangerouslySetInnerHTML` in the render path. Adding `rehype-raw` would undo
  the entire guarantee.
- **URLs are filtered** through react-markdown's allowlist (http, https, mailto,
  tel, relative, fragments), which drops `javascript:` and `data:text/html`.
- **External links** get `rel="noopener noreferrer"`.
- **Headings shift down one level**, so an author writing `# Section` produces
  an `<h2>`. The page owns the only `<h1>`. This is the fix for the duplicate
  H1 the old MDX article shipped with.

The admin preview renders through the same component, so what is approved is
what ships.

## 7. Images

Uploads go to the public `content-images` bucket. Validation
(`lib/media/images.ts`) is an allowlist of five MIME types — **SVG is
deliberately excluded**, since it is an XML document that can carry script and
would execute from the storage origin — a 5 MB ceiling mirroring the bucket's
own limit, and a **magic-number check against the file's leading bytes**. The
declared MIME type is a claim; the header is evidence.

Object paths are `folder/YYYY/MM/uuid.ext`. The original filename is discarded
rather than sanitized: nothing user-controlled reaches the storage key, which
removes traversal, case-folding collisions and unicode-lookalike problems by
construction.

Rows store the bucket-relative path, not a URL, so the database carries no
environment-specific hostname. `resolveImageUrl()` builds the public URL at
render time and passes absolute URLs and `/public` assets through unchanged.

A replaced file is deleted **after** the database update succeeds. The other
order leaves a published record pointing at a file that no longer exists.

`next.config.ts` allows exactly one remote image host — the configured Supabase
project — scoped to the public object path of that one bucket.

## 8. Validation

`lib/content/schemas.ts` holds one Zod schema per content type, imported by both
the admin form and the Server Action that writes it. A field cannot be relaxed
in the UI without relaxing it on the server.

Rules that matter are stated **twice**: in Zod, which produces a message
attached to the offending field, and as a `CHECK` constraint or unique index in
`supabase/migrations/0001_content_schema.sql`, which produces a guarantee. The
duplication is intentional. `lib/actions/db-errors.ts` maps constraint
violations back onto form fields, so a genuine race — two saves claiming one
slug — still surfaces as "another post already uses that slug" rather than a
crash.

Publishing carries a higher bar than saving a draft: a post needs a body and an
excerpt, a project needs a summary, and an attached image needs alt text.
Drafts stay cheap to save, because a draft that is expensive to save does not
get saved.

## 9. Placeholder content

The static content this replaced was full of placeholders — `period: 'Details
pending confirmation'`, nine case-study fields all reading "Detailed case-study
documentation is being prepared", a blog post explicitly labelled a draft. None
of it was carried across as text:

- **Project case-study bodies are empty.** `ProjectCaseStudy` renders "Detailed
  case-study documentation is being prepared" as its _empty state_, so the
  public page is unchanged while the database holds no fake prose. Project
  metadata is real and stays published.
- **The blog post is imported as a draft**, per its own content.
- **Experience and certification dates are `null`**, not invented.
  `start_date` was made nullable specifically so the migration would not have to
  fabricate dates for a CV. An entry with no start date renders without a period
  line.

See `scripts/legacy-content.json` for the frozen snapshot and the reasoning
recorded alongside it.
