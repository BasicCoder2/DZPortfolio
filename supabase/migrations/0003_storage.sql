-- ============================================================================
-- DZPortfolio - content image storage
--
-- Creates the `content-images` bucket and its access policies.
--
-- The bucket is PUBLIC READ on purpose: cover images and project previews are
-- served straight to visitors through next/image, and a public bucket avoids
-- minting a signed URL on every render. Nothing private is ever uploaded here.
-- Writes are administrator-only.
--
-- Note: creating policies on storage.objects requires table-owner privileges.
-- Run this file as the `postgres` role - the Supabase dashboard SQL editor and
-- `supabase db push` both satisfy that. If you run it as a lesser role you
-- will see "must be owner of table objects"; see docs/DEPLOYMENT.md.
--
-- Requires 0002_rls.sql (for public.is_admin()).
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-images',
  'content-images',
  true,
  5242880, -- 5 MB, mirrored by MAX_IMAGE_BYTES in lib/media/images.ts
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- --- Policies ---------------------------------------------------------------

drop policy if exists content_images_public_read on storage.objects;
create policy content_images_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'content-images');

drop policy if exists content_images_admin_insert on storage.objects;
create policy content_images_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'content-images' and public.is_admin());

drop policy if exists content_images_admin_update on storage.objects;
create policy content_images_admin_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'content-images' and public.is_admin())
  with check (bucket_id = 'content-images' and public.is_admin());

drop policy if exists content_images_admin_delete on storage.objects;
create policy content_images_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'content-images' and public.is_admin());
