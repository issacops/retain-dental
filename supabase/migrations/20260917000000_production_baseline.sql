-- ============================================================================
-- RetainDental - Production Baseline
-- Created: 2026-09-17
--
-- Purpose:
--   1. Create the complete core schema expected by services/SupabaseService.ts
--   2. Remove every public/anon RLS policy (see 20260302000003 / ...000004)
--   3. Install tenant-isolated RLS + super-admin handling
--
-- Safe to run on a fresh Supabase project. Idempotent (uses IF NOT EXISTS and
-- drops the policies it recreates), so it can also be re-run.
--
-- Run in: Supabase Dashboard -> SQL Editor, or `supabase db push`.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------

create table if not exists public.clinics (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  primary_color     text default '#0d9488',
  theme_texture     text default 'minimal',
  owner_name        text,
  logo_url          text,
  admin_email       text,
  emergency_phone   text,
  subscription_tier text not null default 'STARTER'
                    check (subscription_tier in ('STARTER','PRO','ENTERPRISE')),
  loyalty_config    jsonb not null default
                    '{"defaultRate":10,"categoryRates":{},"redemptionRate":1}'::jsonb,
  admin_user_id     uuid,
  created_at        timestamptz not null default now()
);

create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  clinic_id        uuid references public.clinics(id) on delete set null,
  full_name        text,
  email            text,
  mobile           text,
  role             text not null default 'PATIENT'
                   check (role in ('PATIENT','ADMIN','SUPER_ADMIN')),
  status           text not null default 'ACTIVE'
                   check (status in ('PENDING','ACTIVE','SUSPENDED')),
  family_group_id  uuid,
  lifetime_spend   numeric not null default 0,
  current_tier     text not null default 'MEMBER'
                   check (current_tier in ('MEMBER','GOLD','PLATINUM')),
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists profiles_clinic_idx on public.profiles (clinic_id);
create unique index if not exists profiles_clinic_mobile_uidx
  on public.profiles (clinic_id, mobile)
  where mobile is not null and mobile <> 'DEPENDENT';

create table if not exists public.family_groups (
  id            uuid primary key default gen_random_uuid(),
  clinic_id     uuid references public.clinics(id) on delete cascade,
  head_user_id  uuid references public.profiles(id) on delete cascade,
  family_name   text,
  created_at    timestamptz not null default now()
);

create table if not exists public.wallets (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references public.profiles(id) on delete cascade,
  balance              numeric not null default 0,
  last_transaction_at  timestamptz not null default now()
);
create index if not exists wallets_user_idx on public.wallets (user_id);

create table if not exists public.transactions (
  id             uuid primary key default gen_random_uuid(),
  clinic_id      uuid references public.clinics(id) on delete cascade,
  wallet_id      uuid references public.wallets(id) on delete cascade,
  amount_paid    numeric not null default 0,
  points_earned  numeric not null default 0,
  category       text,
  type           text check (type in ('EARN','REDEEM')),
  description    text,
  care_plan_id   uuid,
  created_at     timestamptz not null default now()
);
create index if not exists transactions_clinic_idx
  on public.transactions (clinic_id, created_at desc);
create index if not exists transactions_wallet_idx
  on public.transactions (wallet_id);

create table if not exists public.care_plans (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references public.profiles(id) on delete cascade,
  clinic_id             uuid references public.clinics(id) on delete cascade,
  treatment_name        text,
  category              text,
  description           text,
  instructions          jsonb not null default '[]'::jsonb,
  checklist             jsonb not null default '[]'::jsonb,
  metadata              jsonb not null default '{}'::jsonb,
  is_active             boolean not null default true,
  status                text not null default 'ACTIVE'
                        check (status in ('ACTIVE','COMPLETED','CANCELLED')),
  last_checklist_reset  date,
  adherence_record      jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now()
);
create index if not exists care_plans_clinic_idx on public.care_plans (clinic_id);
create index if not exists care_plans_user_idx on public.care_plans (user_id);

create table if not exists public.appointments (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid references public.clinics(id) on delete cascade,
  patient_id  uuid references public.profiles(id) on delete cascade,
  doctor_id   uuid references public.profiles(id) on delete set null,
  start_time  timestamptz not null,
  end_time    timestamptz,
  type        text default 'CHECKUP',
  notes       text,
  status      text not null default 'SCHEDULED'
              check (status in ('SCHEDULED','CONFIRMED','COMPLETED','CANCELLED','NO_SHOW')),
  created_at  timestamptz not null default now()
);
create index if not exists appointments_clinic_idx
  on public.appointments (clinic_id, start_time);

-- Super admins are tracked here (independent of profiles.role) so the platform
-- owner is never tied to a tenant.
create table if not exists public.platform_admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Add columns that may be missing on a pre-existing install
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists status text not null default 'ACTIVE';
alter table public.profiles add column if not exists family_group_id uuid;
alter table public.profiles add column if not exists mobile text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists current_tier text not null default 'MEMBER';
alter table public.clinics  add column if not exists loyalty_config jsonb not null
  default '{"defaultRate":10,"categoryRates":{},"redemptionRate":1}'::jsonb;
alter table public.clinics  add column if not exists emergency_phone text;
alter table public.clinics  add column if not exists admin_email text;
alter table public.clinics  add column if not exists admin_user_id uuid;

-- ---------------------------------------------------------------------------
-- 3. Helper functions (SECURITY DEFINER so they can read profiles under RLS)
-- ---------------------------------------------------------------------------
create or replace function public.get_user_clinic_id()
returns uuid language sql stable security definer set search_path = public as $$
  select clinic_id from public.profiles where id = auth.uid();
$$;

create or replace function public.get_user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select
    exists (select 1 from public.profiles where id = auth.uid() and role = 'SUPER_ADMIN')
    or exists (select 1 from public.platform_admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- 4. Enable RLS on everything
-- ---------------------------------------------------------------------------
alter table public.clinics        enable row level security;
alter table public.profiles       enable row level security;
alter table public.family_groups  enable row level security;
alter table public.wallets        enable row level security;
alter table public.transactions   enable row level security;
alter table public.care_plans     enable row level security;
alter table public.appointments   enable row level security;
alter table public.platform_admins enable row level security;

-- ---------------------------------------------------------------------------
-- 5. Remove every legacy / public / anon policy
--    (20260302000003_restore_anon_for_godmode + 20260302000004_anon_write_policies
--     + permissive leftovers). This is the security-critical step.
-- ---------------------------------------------------------------------------
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and (
        policyname ilike '%anon%'
        or policyname ilike '%public%'
        or policyname ilike '%everyone%'
        or policyname in (
          'Enable read access for all users',
          'Authenticated users can create clinics',
          'Super admins can delete clinics'
        )
      )
  loop
    execute format('drop policy if exists %I on %I.%I',
                   p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- Explicit drops for the auth migrations so re-runs are clean
drop policy if exists "Clinics are viewable by assigned users or super admins" on public.clinics;
drop policy if exists "Clinics are updateable by their admins"                 on public.clinics;
drop policy if exists "Users can view profiles in their own clinic"            on public.profiles;
drop policy if exists "Users can update their own profile"                     on public.profiles;
drop policy if exists "Admins can update profiles in their clinic"             on public.profiles;
drop policy if exists "Users can insert their own profile"                     on public.profiles;
drop policy if exists "Users can update own profile"                           on public.profiles;
drop policy if exists "Tenant Isolation for Transactions"                      on public.transactions;
drop policy if exists "Tenant Isolation for Wallets"                           on public.wallets;
drop policy if exists "Tenant Isolation for Appointments"                      on public.appointments;
drop policy if exists "Tenant Isolation for Care Plans"                        on public.care_plans;

-- ---------------------------------------------------------------------------
-- 6. Tenant-isolated policies
-- ---------------------------------------------------------------------------

-- clinics: members can read their own clinic; only super admins can write
create policy clinics_select on public.clinics
  for select to authenticated
  using (public.is_super_admin() or id = public.get_user_clinic_id());

create policy clinics_super_write on public.clinics
  for all to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- profiles: self, same-clinic staff, or super admin
create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or public.is_super_admin()
    or (public.get_user_clinic_id() is not null and clinic_id = public.get_user_clinic_id())
  );

create policy profiles_self_insert on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.get_user_role() = 'ADMIN' and clinic_id = public.get_user_clinic_id())
  with check (public.get_user_role() = 'ADMIN' and clinic_id = public.get_user_clinic_id());

create policy profiles_super_all on public.profiles
  for all to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- family_groups
create policy family_groups_access on public.family_groups
  for all to authenticated
  using (public.is_super_admin() or clinic_id = public.get_user_clinic_id())
  with check (public.is_super_admin() or clinic_id = public.get_user_clinic_id());

-- wallets: owner or clinic staff/admin
create policy wallets_select on public.wallets
  for select to authenticated
  using (
    public.is_super_admin()
    or user_id = auth.uid()
    or user_id in (
      select p.id from public.profiles p
      where p.clinic_id = public.get_user_clinic_id()
    )
  );

create policy wallets_staff_write on public.wallets
  for all to authenticated
  using (public.is_super_admin() or public.get_user_role() = 'ADMIN')
  with check (public.is_super_admin() or public.get_user_role() = 'ADMIN');

-- transactions / care_plans / appointments: clinic-scoped
create policy transactions_access on public.transactions
  for all to authenticated
  using (public.is_super_admin() or clinic_id = public.get_user_clinic_id())
  with check (public.is_super_admin() or clinic_id = public.get_user_clinic_id());

create policy care_plans_access on public.care_plans
  for all to authenticated
  using (public.is_super_admin() or clinic_id = public.get_user_clinic_id())
  with check (public.is_super_admin() or clinic_id = public.get_user_clinic_id());

create policy appointments_access on public.appointments
  for all to authenticated
  using (public.is_super_admin() or clinic_id = public.get_user_clinic_id())
  with check (public.is_super_admin() or clinic_id = public.get_user_clinic_id());

-- platform_admins: readable by super admins only
create policy platform_admins_select on public.platform_admins
  for select to authenticated
  using (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- 7. Public form tables (landing page)
--    - leads: anon INSERT only (no open UPDATE), read by super admins
--    - waitlist: anon INSERT only, read by super admins
--    Create them if they do not exist, then (re)install policies.
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text,
  email         text,
  phone         text,
  country_code  text default '+1',
  clinic_name   text,
  practice_type text,
  locations     int,
  source        text default 'landing-page',
  status        text default 'incomplete',
  form_data     jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create table if not exists public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  clinic_name  text,
  mobile       text not null,
  email        text not null,
  status       text default 'PENDING',
  created_at   timestamptz not null default now()
);

alter table public.leads    enable row level security;
alter table public.waitlist enable row level security;

drop policy if exists "anon_insert_leads"             on public.leads;
drop policy if exists "anon_update_leads"             on public.leads;
drop policy if exists "authenticated_read_leads"      on public.leads;
drop policy if exists "Allow public insert to waitlist" on public.waitlist;
drop policy if exists "Allow admin read waitlist"       on public.waitlist;

create policy leads_anon_insert on public.leads
  for insert to anon with check (true);
create policy leads_super_select on public.leads
  for select to authenticated using (public.is_super_admin());

create policy waitlist_anon_insert on public.waitlist
  for insert to anon with check (true);
create policy waitlist_super_select on public.waitlist
  for select to authenticated using (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- 8. Notes
-- ---------------------------------------------------------------------------
-- * Patient / admin auth users are created server-side with the SERVICE ROLE
--   key (see functions/api/create-patient.js), which bypasses RLS by design.
-- * After running this file, create your platform owner:
--     1. Authentication -> Users -> Add user  (e.g. owner@retaindental.com)
--     2. insert into public.platform_admins (user_id, email)
--        select id, email from auth.users where email = 'owner@retaindental.com';
-- * The RPCs process_transaction / set_user_password_by_email from older
--   migrations expect auth.uid(); re-apply the fixed versions if you use them.
-- ============================================================================
