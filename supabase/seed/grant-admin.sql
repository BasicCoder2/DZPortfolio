-- ============================================================================
-- Grant administrator rights to exactly one account.
--
-- Run this ONCE, in the Supabase dashboard SQL editor, after you have created
-- the administrator user (Authentication -> Users -> Add user). Replace the
-- placeholder with the same address you set as ADMIN_EMAIL in the application
-- environment - the app and the database each check independently, and both
-- must agree before any admin page or mutation is allowed.
--
-- This lives in a seed file rather than a migration because the address is
-- deployment-specific and must never be committed.
-- ============================================================================

-- 1. Promote the account.
update public.profiles
   set is_admin = true
 where email = lower(btrim('REPLACE_WITH_ADMIN_EMAIL'));

-- 2. Demote everyone else. Keeps the "single administrator" guarantee true
--    even if this file is run twice with different addresses.
update public.profiles
   set is_admin = false
 where email <> lower(btrim('REPLACE_WITH_ADMIN_EMAIL'))
   and is_admin;

-- 3. Verify. Expect exactly one row, with is_admin = true.
select email, is_admin, created_at
  from public.profiles
 order by is_admin desc, email;
