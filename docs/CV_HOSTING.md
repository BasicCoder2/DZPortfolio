# CV hosting in your existing Supabase project

1. Open the Supabase dashboard and select the project used by `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
2. Open **SQL Editor**, create a query, paste all of `supabase/migrations/0004_cv.sql`, and run as `postgres`. This requires the existing content migrations through `0003_storage.sql`. The script can be rerun.
3. The migration reuses your public `content-images` bucket and adds PDF support while preserving its image types and files. The app limits CVs to 3 MB and restricts uploads to your existing administrators. The migration also creates `public.site_cv` to track the current file. No new bucket is needed.
4. Keep the existing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `ADMIN_EMAIL`. No new credentials are needed. `NEXT_PUBLIC_RESUME_URL` is only a fallback before your first hosted upload.
5. Restart the dev server, open `/admin/cv`, sign in, choose your PDF, and click **Update CV**.
6. After the success message, click **Download current CV** and test a homepage download button.
7. Deploy these code changes with your existing environment variables. Future updates use **Admin > CV > Update CV**, without redeploying.

Upload through the admin page: uploading manually in Storage does not update the current file record. Each upload uses a unique path to avoid stale CDN downloads. Previous PDFs remain public in Storage until deleted. After confirming the replacement works, you can delete older files from Storage, keeping the path recorded in `public.site_cv`.

If setup fails, verify the migration ran in the correct project and your existing admin profile has `is_admin = true`. Do not add a service-role key to the app.

Before the first hosted upload, `/cv` uses the existing resume URL or bundled PDF. Database failures return a temporary-unavailable response instead of an old CV.

References: [Storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).
