-- ============================================================================
-- DZPortfolio - content schema
--
-- Creates the administrator profile table and the content tables that back the
-- public site. Every table carries its own timestamps, a display order where
-- ordering is editorially meaningful, and validation constraints so bad rows
-- cannot be written even if an application-level check is bypassed.
--
-- Run order: 0001 (this file) -> 0002_rls.sql -> 0003_storage.sql
-- ============================================================================

-- --- Shared types -----------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('draft', 'published');
  end if;
end
$$;

-- Which price an engagement card renders. 'label' means the free-text override
-- wins (e.g. "Custom Quote"); the rest format the numeric columns.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'currency_mode') then
    create type public.currency_mode as enum ('label', 'USD', 'ZMW', 'BOTH');
  end if;
end
$$;

-- --- Shared helpers ---------------------------------------------------------

-- Keeps updated_at honest regardless of what the caller supplies.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Stamps published_at the first time a row reaches 'published', and clears it
-- again on unpublish, so the column can never disagree with the status.
create or replace function public.sync_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  elsif new.status = 'draft' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

-- --- profiles ---------------------------------------------------------------
-- One row per auth user. `is_admin` is the database half of the two-key
-- authorization check; the application independently verifies the account
-- email against the server-only ADMIN_EMAIL. Both must agree.
--
-- There is deliberately no INSERT/UPDATE/DELETE policy on this table (see
-- 0002_rls.sql). Rows arrive through the security-definer trigger below, and
-- `is_admin` is granted out of band via supabase/seed/grant-admin.sql. That
-- leaves no API surface through which a signed-in user could escalate.

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_normalized check (email = lower(btrim(email))),
  constraint profiles_email_present check (btrim(email) <> '')
);

create unique index if not exists profiles_email_key on public.profiles (email);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, lower(btrim(new.email)))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill for accounts created before this migration ran.
insert into public.profiles (id, email)
select u.id, lower(btrim(u.email))
from auth.users u
where u.email is not null
on conflict (id) do nothing;

-- --- posts ------------------------------------------------------------------

create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null,
  excerpt          text not null default '',
  content          text not null default '',
  cover_image_path text,
  cover_image_alt  text,
  status           public.content_status not null default 'draft',
  seo_title        text,
  seo_description  text,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint posts_title_present check (btrim(title) <> ''),
  constraint posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint posts_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  constraint posts_seo_description_length
    check (seo_description is null or char_length(seo_description) <= 200),
  constraint posts_cover_image_needs_alt
    check (cover_image_path is null or btrim(coalesce(cover_image_alt, '')) <> ''),
  constraint posts_published_has_timestamp
    check (status <> 'published' or published_at is not null)
);

create unique index if not exists posts_slug_key on public.posts (slug);
create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc nulls last);

drop trigger if exists posts_sync_published_at on public.posts;
create trigger posts_sync_published_at
  before insert or update on public.posts
  for each row execute function public.sync_published_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- --- projects ---------------------------------------------------------------

create table if not exists public.projects (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null,
  category           text not null default '',
  summary            text not null default '',
  content            text not null default '',
  technologies       text[] not null default '{}',
  preview_image_path text,
  preview_image_alt  text,
  external_url       text,
  repository_url     text,
  featured           boolean not null default false,
  display_order      integer not null default 0,
  status             public.content_status not null default 'draft',
  seo_title          text,
  seo_description    text,
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint projects_title_present check (btrim(title) <> ''),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint projects_external_url_scheme
    check (external_url is null or external_url ~* '^https?://'),
  constraint projects_repository_url_scheme
    check (repository_url is null or repository_url ~* '^https?://'),
  constraint projects_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  constraint projects_seo_description_length
    check (seo_description is null or char_length(seo_description) <= 200),
  constraint projects_preview_image_needs_alt
    check (preview_image_path is null or btrim(coalesce(preview_image_alt, '')) <> ''),
  constraint projects_published_has_timestamp
    check (status <> 'published' or published_at is not null)
);

create unique index if not exists projects_slug_key on public.projects (slug);
create index if not exists projects_status_order_idx
  on public.projects (status, display_order, created_at desc);
create index if not exists projects_featured_idx
  on public.projects (featured) where featured;

drop trigger if exists projects_sync_published_at on public.projects;
create trigger projects_sync_published_at
  before insert or update on public.projects
  for each row execute function public.sync_published_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- --- experience_entries -----------------------------------------------------

create table if not exists public.experience_entries (
  id            uuid primary key default gen_random_uuid(),
  organization  text not null,
  role          text not null,
  location      text not null default '',
  -- Nullable on purpose. The CV data this schema was migrated from recorded
  -- roles without dates, and a nullable column is the honest representation of
  -- "not known yet" -- inventing a start date to satisfy NOT NULL would put
  -- fiction in a CV. An entry with no start date simply renders without a
  -- period line.
  start_date    date,
  end_date      date,
  is_current    boolean not null default false,
  summary       text not null default '',
  technologies  text[] not null default '{}',
  display_order integer not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint experience_organization_present check (btrim(organization) <> ''),
  constraint experience_role_present check (btrim(role) <> ''),
  constraint experience_dates_ordered
    check (end_date is null or start_date is null or end_date >= start_date),
  constraint experience_end_needs_start check (end_date is null or start_date is not null),
  constraint experience_current_has_no_end check (not is_current or end_date is null)
);

-- coalesce, not the bare column: NULL never equals NULL in a unique index, so
-- without it two dateless entries for the same role would both insert and the
-- content import would stop being idempotent.
create unique index if not exists experience_org_role_start_key
  on public.experience_entries (
    lower(btrim(organization)),
    lower(btrim(role)),
    coalesce(start_date, '0001-01-01'::date)
  );
create index if not exists experience_published_order_idx
  on public.experience_entries (published, display_order, start_date desc);

drop trigger if exists experience_set_updated_at on public.experience_entries;
create trigger experience_set_updated_at
  before update on public.experience_entries
  for each row execute function public.set_updated_at();

-- --- certifications ---------------------------------------------------------

create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null,
  issue_date     date,
  credential_url text,
  credential_id  text,
  image_path     text,
  image_alt      text,
  display_order  integer not null default 0,
  published      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint certifications_title_present check (btrim(title) <> ''),
  constraint certifications_issuer_present check (btrim(issuer) <> ''),
  constraint certifications_credential_url_scheme
    check (credential_url is null or credential_url ~* '^https?://'),
  constraint certifications_image_needs_alt
    check (image_path is null or btrim(coalesce(image_alt, '')) <> '')
);

create unique index if not exists certifications_title_issuer_key
  on public.certifications (lower(btrim(title)), lower(btrim(issuer)));
create index if not exists certifications_published_order_idx
  on public.certifications (published, display_order);

drop trigger if exists certifications_set_updated_at on public.certifications;
create trigger certifications_set_updated_at
  before update on public.certifications
  for each row execute function public.set_updated_at();

-- --- engagement_options -----------------------------------------------------
-- Backs the public "Engagement" pricing section. A tier either shows a
-- free-text label ("Custom Quote") or one or both numeric amounts, chosen by
-- `currency`. Keeping both amounts in their own columns means switching a tier
-- between USD, ZMW and both is an edit, not a re-key.

create table if not exists public.engagement_options (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  title         text not null,
  description   text not null default '',
  items         text[] not null default '{}',
  price_prefix  text not null default '',
  price_label   text,
  price_usd     numeric(12, 2),
  price_zmw     numeric(12, 2),
  currency      public.currency_mode not null default 'label',
  recommended   boolean not null default false,
  display_order integer not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint engagement_title_present check (btrim(title) <> ''),
  constraint engagement_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint engagement_amounts_non_negative
    check (coalesce(price_usd, 0) >= 0 and coalesce(price_zmw, 0) >= 0),
  -- Whatever the currency mode promises to render must actually be present.
  constraint engagement_price_source_present check (
    case currency
      when 'label' then btrim(coalesce(price_label, '')) <> ''
      when 'USD'   then price_usd is not null
      when 'ZMW'   then price_zmw is not null
      when 'BOTH'  then price_usd is not null and price_zmw is not null
    end
  )
);

create unique index if not exists engagement_options_slug_key on public.engagement_options (slug);
create index if not exists engagement_published_order_idx
  on public.engagement_options (published, display_order);

drop trigger if exists engagement_set_updated_at on public.engagement_options;
create trigger engagement_set_updated_at
  before update on public.engagement_options
  for each row execute function public.set_updated_at();
