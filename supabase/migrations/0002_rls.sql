-- ============================================================================
-- DZPortfolio - Row-Level Security
--
-- Defence in depth. The application already refuses every admin page and
-- mutation to anyone whose verified email is not ADMIN_EMAIL; these policies
-- mean that even a leaked anon key, a mis-wired route, or a hand-rolled
-- PostgREST call cannot read a draft or write a row.
--
-- Model:
--   * anon + authenticated  -> SELECT of published rows only
--   * the administrator     -> full read/write on everything
--   * nobody                -> writes to public.profiles through the API
--
-- Requires 0001_content_schema.sql.
-- ============================================================================

-- --- Authorization predicate ------------------------------------------------
-- security definer so the lookup itself is not subject to the profiles policy
-- below (which would otherwise recurse). search_path is pinned so the function
-- cannot be redirected by a caller-controlled search_path.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- --- profiles ---------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

-- No insert/update/delete policies: with RLS enabled and no permissive write
-- policy, every API write is denied. Rows are created by the security-definer
-- trigger; `is_admin` is set out of band. This is what stops privilege
-- escalation by a signed-in non-admin.

-- --- posts ------------------------------------------------------------------

alter table public.posts enable row level security;
alter table public.posts force row level security;

drop policy if exists posts_select_published on public.posts;
create policy posts_select_published
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists posts_admin_select on public.posts;
create policy posts_admin_select
  on public.posts
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists posts_admin_insert on public.posts;
create policy posts_admin_insert
  on public.posts
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists posts_admin_update on public.posts;
create policy posts_admin_update
  on public.posts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists posts_admin_delete on public.posts;
create policy posts_admin_delete
  on public.posts
  for delete
  to authenticated
  using (public.is_admin());

-- --- projects ---------------------------------------------------------------

alter table public.projects enable row level security;
alter table public.projects force row level security;

drop policy if exists projects_select_published on public.projects;
create policy projects_select_published
  on public.projects
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists projects_admin_select on public.projects;
create policy projects_admin_select
  on public.projects
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists projects_admin_insert on public.projects;
create policy projects_admin_insert
  on public.projects
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists projects_admin_update on public.projects;
create policy projects_admin_update
  on public.projects
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists projects_admin_delete on public.projects;
create policy projects_admin_delete
  on public.projects
  for delete
  to authenticated
  using (public.is_admin());

-- --- experience_entries -----------------------------------------------------

alter table public.experience_entries enable row level security;
alter table public.experience_entries force row level security;

drop policy if exists experience_select_published on public.experience_entries;
create policy experience_select_published
  on public.experience_entries
  for select
  to anon, authenticated
  using (published);

drop policy if exists experience_admin_select on public.experience_entries;
create policy experience_admin_select
  on public.experience_entries
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists experience_admin_insert on public.experience_entries;
create policy experience_admin_insert
  on public.experience_entries
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists experience_admin_update on public.experience_entries;
create policy experience_admin_update
  on public.experience_entries
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists experience_admin_delete on public.experience_entries;
create policy experience_admin_delete
  on public.experience_entries
  for delete
  to authenticated
  using (public.is_admin());

-- --- certifications ---------------------------------------------------------

alter table public.certifications enable row level security;
alter table public.certifications force row level security;

drop policy if exists certifications_select_published on public.certifications;
create policy certifications_select_published
  on public.certifications
  for select
  to anon, authenticated
  using (published);

drop policy if exists certifications_admin_select on public.certifications;
create policy certifications_admin_select
  on public.certifications
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists certifications_admin_insert on public.certifications;
create policy certifications_admin_insert
  on public.certifications
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists certifications_admin_update on public.certifications;
create policy certifications_admin_update
  on public.certifications
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists certifications_admin_delete on public.certifications;
create policy certifications_admin_delete
  on public.certifications
  for delete
  to authenticated
  using (public.is_admin());

-- --- engagement_options -----------------------------------------------------

alter table public.engagement_options enable row level security;
alter table public.engagement_options force row level security;

drop policy if exists engagement_select_published on public.engagement_options;
create policy engagement_select_published
  on public.engagement_options
  for select
  to anon, authenticated
  using (published);

drop policy if exists engagement_admin_select on public.engagement_options;
create policy engagement_admin_select
  on public.engagement_options
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists engagement_admin_insert on public.engagement_options;
create policy engagement_admin_insert
  on public.engagement_options
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists engagement_admin_update on public.engagement_options;
create policy engagement_admin_update
  on public.engagement_options
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists engagement_admin_delete on public.engagement_options;
create policy engagement_admin_delete
  on public.engagement_options
  for delete
  to authenticated
  using (public.is_admin());
