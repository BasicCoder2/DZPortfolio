# Deployment

First-time setup for the Supabase-backed content platform, from an empty
Supabase project to a live site on Vercel.

Steps 1–6 are Supabase. Steps 7–12 are Vercel and DNS. Steps 13–14 are
verification. Step 15 is how to get back if something goes wrong.

Nothing in this document contains a credential. Every value in `< >` is
something you supply.

---

## 1. Create a Supabase project

1. <https://supabase.com/dashboard> → **New project**.
2. Name it (e.g. `dzportfolio`), set a strong database password, and pick the
   region closest to your visitors — for Zambia, `eu-central-1` (Frankfurt)
   generally beats the US regions.
3. Wait for provisioning to finish.
4. Go to **Settings → API** and keep this tab open. You need:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`, for step 6 only

> The anon key is public by design and safe in the browser bundle. The
> service_role key bypasses every Row-Level Security policy — treat it like the
> database password. It is never set in Vercel.

## 2. Apply the migrations

Run the three files in `supabase/migrations/` **in numerical order**.

**Dashboard route (no tooling needed).** Open **SQL Editor → New query**, paste
the contents of each file, and run them one at a time:

1. `0001_content_schema.sql` — tables, enums, triggers, indexes, constraints
2. `0002_rls.sql` — `public.is_admin()` and every Row-Level Security policy
3. `0003_storage.sql` — the `content-images` bucket and its policies

**CLI route**, if you have the Supabase CLI:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Each file is idempotent (`create ... if not exists`, `drop policy if exists`),
so re-running one is safe.

> If `0003_storage.sql` fails with `must be owner of table objects`, you are not
> running as `postgres`. The dashboard SQL editor is, so use that.

**Verify** in **Table Editor**: `posts`, `projects`, `experience_entries`,
`certifications`, `engagement_options` and `profiles` all exist, and each shows
an **RLS enabled** badge.

## 3. Create the administrator account

**Authentication → Users → Add user → Create new user.**

- Email: the address that will administer the site
- Password: a strong, unique one
- Tick **Auto Confirm User** — there is no signup flow to confirm through

Only ever create **one** user. There is no signup route, no invitation flow, and
no role hierarchy; this is a single-administrator system by design.

## 4. Grant admin rights and set `ADMIN_EMAIL`

Authorization is a two-key check. Both keys must name the same address.

**Key 1 — the database.** Open `supabase/seed/grant-admin.sql`, replace both
occurrences of `REPLACE_WITH_ADMIN_EMAIL` with the address from step 3, and run
it in the SQL editor. The final `select` should return exactly one row with
`is_admin = true`.

**Key 2 — the application.** Set `ADMIN_EMAIL` to the same address (step 8 for
Vercel; `.env.local` for local development).

If only one is set, nobody is authorized. That is the intended failure
direction — an unconfigured deployment must not admit whoever signs in first.

## 5. Configure storage

`0003_storage.sql` already created the bucket. Confirm under **Storage**:

- A bucket named `content-images` exists and is marked **Public**
- File size limit: 5 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`,
  `image/gif`

The bucket is public-read on purpose: cover images are served straight to
visitors through `next/image`, and a public bucket avoids minting a signed URL
on every render. Nothing private is ever uploaded to it. Writes are
administrator-only.

## 6. Import the existing content

One-off, local, idempotent. Run it twice and the database is identical.

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAIL

pnpm content:import --dry-run   # report only, writes nothing
pnpm content:import             # apply
```

This imports four projects, one blog post, two experience entries, three
certifications and three engagement tiers from
`scripts/legacy-content.json` — a frozen snapshot of what `data/*.ts` held
before the migration.

What it deliberately does **not** do:

- **The blog post is imported as a draft.** Its body is still marked as
  placeholder editorial content, so `/blog` will be empty until you finish and
  publish it.
- **Project case-study bodies are empty.** The public page renders its own
  "documentation is being prepared" empty state, so nothing regresses — but no
  placeholder prose is written to the database. Write the real case studies in
  the admin editor.
- **Experience and certification dates are blank**, because the source recorded
  none. Add them at `/admin/experience` and `/admin/certifications`.

Re-running never overwrites `status`, `published`, `featured` or `display_order`
on rows that already exist — once you have made a publishing decision, a
re-import will not undo it.

**When you are done, remove `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`.** No
application code reads it.

## 7. Connect the repository to Vercel

1. <https://vercel.com/new> → import `BasicCoder2/DZPortfolio`.
2. Framework preset: **Next.js** (detected automatically).
3. Build command, output directory and install command: leave as detected.
   Vercel reads the `packageManager` field and uses pnpm.
4. **Do not deploy yet** — add the environment variables first (step 8), or the
   first build will succeed but the site will render empty.

## 8. Add environment variables

**Settings → Environment Variables.** Add each to **Production**, **Preview**
and **Development** unless noted.

| Variable                        | Value                   | Notes                         |
| ------------------------------- | ----------------------- | ----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL from step 1 |                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key from step 1    |                               |
| `ADMIN_EMAIL`                   | address from step 3     | Server-only                   |
| `NEXT_PUBLIC_SITE_URL`          | `https://<your-domain>` | Production only — see step 12 |
| `NEXT_PUBLIC_GITHUB_USERNAME`   | e.g. `BasicCoder2`      | Handle, not a URL             |
| `NEXT_PUBLIC_LINKEDIN_URL`      | full profile URL        |                               |
| `RESEND_API_KEY`                | from step 9             | Server-only                   |
| `CONTACT_TO_EMAIL`              | where enquiries go      | Server-only                   |
| `CONTACT_FROM_EMAIL`            | verified sender         | Server-only                   |

**Do not add `SUPABASE_SERVICE_ROLE_KEY`.** Nothing in the deployed application
reads it, and adding it would put a policy-bypassing credential in the runtime
environment for no benefit.

Leave `NEXT_PUBLIC_SITE_URL` unset on Preview: the app falls back to
`VERCEL_URL`, so preview deployments get correct canonical URLs automatically.

## 9. Configure Resend

1. <https://resend.com> → **API Keys → Create API Key**, sending permission
   only.
2. Set it as `RESEND_API_KEY`.
3. Set `CONTACT_TO_EMAIL` to the inbox that should receive enquiries.
4. Set `CONTACT_FROM_EMAIL` to an address on a domain you will verify next,
   e.g. `contact@<your-domain>`.

All three must be present together — the contact endpoint returns 503 if any is
missing, and logs a message without echoing the key.

## 10. Verify the sender domain

In Resend: **Domains → Add Domain**, enter your domain, and add the DKIM, SPF
and (optionally) DMARC records it shows to your DNS provider. Wait for the
status to reach **Verified**.

Until this is done, delivery from `CONTACT_FROM_EMAIL` will fail or land in
spam. Sending from an unverified domain is the single most common cause of a
contact form that silently does not arrive.

## 11. Set the production domain

**Vercel → Settings → Domains → Add.** Follow the DNS instructions:

- Apex (`example.com`) → `A` record to Vercel's address
- Subdomain (`www`) → `CNAME` to `cname.vercel-dns.com`

Wait for the certificate to be issued.

## 12. Update `NEXT_PUBLIC_SITE_URL`

Set it to the final origin, no trailing slash, e.g. `https://danielzimba.dev`,
then **redeploy**. It is read at build time and baked into canonical links, Open
Graph tags, `robots.txt` and the sitemap; a stale value here means every
canonical URL points at the wrong host.

## 13. Test authentication and CRUD

1. `https://<your-domain>/admin` → should redirect to `/admin/login`.
2. Sign in with the step-3 credentials → the dashboard, showing counts.
3. **Blog**: create a post, save it as a draft, preview it, publish it, confirm
   it appears at `/blog`, then unpublish and confirm it disappears.
4. **Projects**: same cycle; check a featured project appears on the homepage.
5. **Experience / Certifications / Engagement**: add, edit, hide, show, delete.
6. **Engagement pricing**: switch a tier between USD, kwacha and both, and
   confirm the card preview matches the public section.
7. **Images**: upload a cover image, confirm it renders, replace it, remove it.
8. **Slugs**: try to save two posts with the same slug — the second should be
   refused with a message on the slug field.
9. Sign out; confirm `/admin` redirects again.

**Authorization check.** Temporarily create a second Supabase user, sign in as
them, and confirm `/admin` shows the 403 screen with no navigation and no data.
Delete that user afterwards.

## 14. Test the public site

- `/`, `/blog`, `/blog/<slug>`, `/projects`, `/projects/<slug>`, `/me`
- Navigation on desktop and mobile; theme toggle; hero signature rotation;
  technology-ring rotation
- `/sitemap.xml` — published URLs only, no drafts, no `/admin`
- `/robots.txt` — disallows `/admin`
- The CV download button → `/assets/cv/daniel-zimba-cv.pdf`
- The contact form → a real message arrives
- Browser console: no errors
- **Confirm no secrets in the client bundle.** In DevTools, search the loaded
  JavaScript for your `ADMIN_EMAIL` and for `service_role`. Both must return
  nothing.

## 15. Rollback

**A bad deploy.** Vercel → **Deployments** → the last good one → **⋯ →
Promote to Production**. Instant; no rebuild.

```bash
# or, from the CLI
vercel rollback <deployment-url>
```

**A bad content change.** Unpublish rather than delete: `/admin` → the record →
**Unpublish** / **Hide**. It leaves the public site immediately and the content
is still there.

**A bad migration.** The migrations are additive and idempotent, so re-running
them is safe. To undo schema changes, use Supabase's point-in-time restore
(**Database → Backups**), which is available on paid plans; on the free plan
take a `pg_dump` before running anything destructive.

**A compromised administrator account.** In order:

1. Supabase → **Authentication → Users** → the account → **Reset password**
2. Rotate the anon key: **Settings → API → JWT Settings**, then update
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel and redeploy
3. Confirm exactly one row in `public.profiles` has `is_admin = true`:

```sql
select email, is_admin from public.profiles order by is_admin desc;
```

**Emergency lockout of the admin area.** Remove `ADMIN_EMAIL` from Vercel and
redeploy. Every admin page and every mutation fails closed; the public site is
unaffected.

---

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local     # then fill it in
pnpm dev
```

The site runs without Supabase configured — content reads degrade to empty
results and the public pages render their empty states — so a fresh clone works
before you have credentials.

## Verification suite

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm type-check
pnpm test
pnpm build
```
