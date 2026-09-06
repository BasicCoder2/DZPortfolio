-- Run in the Supabase SQL Editor as postgres after 0002_rls.sql.
-- Restores the app's administrator-only upload rule for the existing bucket.
-- Does not change bucket settings, files, or administrator membership.
begin;

drop policy if exists content_images_admin_insert on storage.objects;
create policy content_images_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'content-images' and public.is_admin());

commit;

-- Check that the signed-in account has a matching admin profile.
select u.email, p.is_admin
from auth.users u
left join public.profiles p on p.id = u.id
order by u.email;
