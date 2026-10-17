-- Run after 0006_storage_cleanup_policy.sql in this project's SQL Editor as postgres.
-- One-row table for site-wide switches edited from the admin area. Starts with
-- the Engagement section toggle; visible by default so applying this migration
-- changes nothing on the live site.
create table if not exists public.site_settings (
  id text primary key default 'current' check (id = 'current'),
  show_engagement boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values ('current') on conflict (id) do nothing;

alter table public.site_settings enable row level security;
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
drop policy if exists site_settings_read on public.site_settings;
create policy site_settings_read on public.site_settings for select to anon, authenticated using (true);
drop policy if exists site_settings_insert on public.site_settings;
create policy site_settings_insert on public.site_settings for insert to authenticated with check (public.is_admin());
drop policy if exists site_settings_update on public.site_settings;
create policy site_settings_update on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
