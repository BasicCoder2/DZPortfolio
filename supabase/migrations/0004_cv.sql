-- Run after 0003_storage.sql in this project's SQL Editor as postgres.
-- Reuses the existing public content-images bucket without changing its files.
create table if not exists public.site_cv (
  id text primary key default 'current' check (id = 'current'),
  path text not null check (path ~ '^[0-9a-f-]{36}\.pdf$'),
  filename text not null,
  updated_at timestamptz not null default now()
);
alter table public.site_cv enable row level security;
grant select on public.site_cv to anon, authenticated;
grant insert, update on public.site_cv to authenticated;
drop policy if exists site_cv_read on public.site_cv;
create policy site_cv_read on public.site_cv for select to anon, authenticated using (true);
drop policy if exists site_cv_insert on public.site_cv;
create policy site_cv_insert on public.site_cv for insert to authenticated with check (public.is_admin());
drop policy if exists site_cv_update on public.site_cv;
create policy site_cv_update on public.site_cv for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Keep existing image MIME types and any unrestricted settings. Raise a smaller
-- bucket limit only as needed; CV uploads themselves are limited to 3 MB in app.
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'content-images' and public = true) then
    raise exception 'The public content-images bucket must exist before running this migration.';
  end if;
end $$;

update storage.buckets
set allowed_mime_types = case
      when allowed_mime_types is null then null
      when 'application/pdf' = any(allowed_mime_types) then allowed_mime_types
      else array_append(allowed_mime_types, 'application/pdf')
    end,
    file_size_limit = case
      when file_size_limit is null then null
      else greatest(file_size_limit, 3145728)
    end
where id = 'content-images';

drop policy if exists cv_admin_read on storage.objects;
create policy cv_admin_read on storage.objects for select to authenticated using (bucket_id = 'content-images' and public.is_admin());
drop policy if exists cv_admin_insert on storage.objects;
create policy cv_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'content-images' and public.is_admin());
drop policy if exists cv_admin_delete on storage.objects;
create policy cv_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'content-images' and public.is_admin());
