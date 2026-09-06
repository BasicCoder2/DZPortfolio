-- Allows the existing administrator to remove replaced content images.
-- Run as postgres after 0002_rls.sql. Does not delete any existing objects.
begin;
drop policy if exists content_images_admin_select on storage.objects;
create policy content_images_admin_select on storage.objects
  for select to authenticated
  using (bucket_id = 'content-images' and public.is_admin());

drop policy if exists content_images_admin_delete on storage.objects;
create policy content_images_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'content-images' and public.is_admin());
commit;
