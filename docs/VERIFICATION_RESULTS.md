# Verification Results

Last run: **2026-09-04**, on `daniel-branch`, for the Supabase content-platform
release.

Commands are exactly those in the README. Node 24.20.0, pnpm 11.24.0,
Next.js 16.3.4.

## Automated

| Check      | Command            | Result                                    |
| ---------- | ------------------ | ----------------------------------------- |
| Lint       | `pnpm lint`        | **PASS** — 0 errors, 0 warnings           |
| TypeScript | `pnpm type-check`  | **PASS** — 0 errors                       |
| Tests      | `pnpm test`        | **PASS** — 200 tests, 12 files            |
| Build      | `pnpm build`       | **PASS** — 14 static pages, 0 errors      |
| Smoke      | `pnpm smoke`       | **PASS** — 11 checks                      |

### Known failure: `pnpm format:check`

`prettier --check .` reports style issues in **185 files**. This is
**pre-existing and repo-wide**, not introduced by this work: stashing every
change from this release and re-running it still reports **166 files**.

The cause is `endOfLine: "lf"` in `.prettierrc` against a working tree checked
out with CRLF line endings (`core.autocrlf=true` on Windows). Because git
normalises to LF on commit, the *committed* files are fine — only the local
check fails.

Files added by this release were formatted individually, so the count did not
grow beyond what the new file count accounts for. Repo-wide `prettier --write`
was **not** run: it would rewrite 166 files unrelated to this change and bury
the diff. Fixing this properly means either adding a `.gitattributes` with
`* text=auto eol=lf` or relaxing `endOfLine` to `"auto"`, and belongs in its own
commit.

## Build output

```
Route (app)                         Revalidate  Expire
┌ ○ /                                       5m      1y
├ ○ /blog                                   5m      1y
├ ● /blog/[slug]
├ ○ /projects                               5m      1y
├ ● /projects/[slug]
├ ○ /sitemap.xml                            5m      1y
├ ○ /me, /design-system, /robots.txt, /manifest.webmanifest, icons
├ ƒ /admin, /admin/login, /admin/blog, /admin/blog/new,
│   /admin/blog/[id]/edit, /admin/projects, /admin/projects/new,
│   /admin/projects/[id]/edit, /admin/experience, /admin/certifications,
│   /admin/engagement, /admin/preview/blog/[slug],
│   /admin/preview/projects/[slug]
└ ƒ /api/contact

ƒ Proxy (Middleware)
```

Every public content route is prerendered with a five-minute ISR window; every
admin route is dynamic. That is the intended split.

## Runtime verification

Performed against `pnpm build && pnpm exec next start`, in two configurations.

### A — Supabase not configured

The state of a fresh clone or an unfilled preview deployment.

| Check | Result |
| --- | --- |
| `pnpm build` completes | PASS — repositories log a warning and return empty |
| `/`, `/projects`, `/blog`, `/me` render | PASS — empty states, no errors |
| `/robots.txt`, `/sitemap.xml` | PASS |
| `/admin` does not expose the interface | PASS — renders "Not connected to Supabase" |

> **Defect found and fixed here.** Before the fix, `/admin` answered **500**:
> `createClient()` threw on the missing URL before the layout could report
> anything. `getAdminAuthState()` now returns an `unavailable` state, checked
> before any client is constructed. Covered by a regression test in
> `tests/auth/admin.test.ts`.

### B — Supabase configured, unreachable host, no session

Verifies the authentication path without needing a live project.

| Check | Result |
| --- | --- |
| `pnpm build` completes despite `fetch failed` | PASS — degrades, does not abort |
| `GET /admin` | PASS — `307 → /admin/login` |
| `GET /admin/blog` | PASS — `307 → /admin/login?next=%2Fadmin%2Fblog` |
| `GET /admin/blog/new` | PASS — destination preserved and encoded |
| `GET /admin/login?next=https://evil.example` | PASS — form carries `value="/admin"`; the off-site destination is discarded |
| Admin shell never rendered anonymously | PASS — smoke test greps for the shell marker |

### Client bundle secret scan

`grep -r` over `.next/static`:

| Needle | Result |
| --- | --- |
| `ADMIN_EMAIL` | absent |
| the configured admin address | absent |
| `service_role` / `SUPABASE_SERVICE_ROLE` | absent |

The Supabase **anon** key is public by design and safe to inline; every table
it can reach is guarded by Row-Level Security.

### Git history

`git log --all --diff-filter=A --name-only` finds no `.env`, `.env.local`,
`*.pem` or service-role-shaped file ever committed. `.env.example` is tracked
and contains no values.

## Test coverage

200 tests across 12 files.

| File | Covers |
| --- | --- |
| `tests/auth/admin.test.ts` | anonymous / authenticated-unauthorized / authorized; fail-closed on missing `ADMIN_EMAIL`; unconfigured Supabase; identical denial messages |
| `tests/auth/redirects.test.ts` | open-redirect rejection — absolute, protocol-relative, backslash-folded, control characters, outside `/admin` |
| `tests/auth/throttle.test.ts` | login throttling, window expiry, per-address and per-email bucketing |
| `tests/content/schemas.test.ts` | validation failures, publish-time completeness, alt-text requirement, URL schemes, currency rules |
| `tests/content/slug.test.ts` | slug generation, accent folding, collision suffixing, length limits |
| `tests/content/markdown.test.tsx` | script tags, raw HTML, event handlers, `javascript:` and `data:` URLs, heading demotion |
| `tests/content/repositories.test.ts` | drafts excluded from every public read *and* the filter actually sent |
| `tests/content/repositories-unconfigured.test.ts` | graceful degradation with no database |
| `tests/content/models.test.ts` | engagement price formatting (USD / ZMW / both), experience period, timezone correctness |
| `tests/actions/posts.test.ts` | full post lifecycle, authorization on every mutation, slug collision, image replacement ordering, revalidation calls |
| `tests/media/images.test.ts` | MIME allowlist, magic numbers, size limits, path building, deletion guard |
| `tests/sitemap.test.ts` | inclusion of published URLs, exclusion of `/admin`, `lastModified` |

No test contacts Supabase or Resend. Both boundaries are mocked.

## Not verified here

These need live Supabase, Resend and Vercel access, which this environment does
not have. See §13–14 of [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the checklist.

- Migrations applied against a real Postgres instance
- Row-Level Security policies enforcing under real JWTs
- Sign-in with real credentials; the authenticated-but-unauthorized 403 screen
- Blog and project CRUD end to end
- Image upload to Supabase Storage
- `pnpm content:import` against a real project
- Contact form delivery through Resend
- Visual/motion checks: theme switching, hero signature rotation,
  technology-ring rotation, mobile navigation

## History

The results below this line predate the content platform and are retained for
context. They described a build with two routes (`/`, `/_not-found`) and no
database, and the "Routes" line in particular is long out of date.

<details>
<summary>Phase 1 (static portfolio)</summary>

| Check      | Command        | Result                      |
| ---------- | -------------- | --------------------------- |
| TypeScript | `tsc --noEmit` | PASS (0 errors)             |
| Lint       | `eslint .`     | PASS (0 errors, 0 warnings) |
| Build      | `next build`   | PASS                        |

Issues resolved during that phase: duplicate type exports, missing type
exports, backtick corruption from a PowerShell script, CVA type conflicts,
unused imports, prop sorting.

</details>
