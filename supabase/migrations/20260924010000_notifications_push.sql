-- ============================================================================
-- Patient messaging: templates, notifications, and PWA push subscriptions
-- ============================================================================
--   * notification_templates — clinic-authored message templates
--   * patient_notifications  — the in-app feed + delivery record
--   * push_subscriptions     — Web Push endpoints per device (no SMS provider)
-- Safe to re-run.
-- ============================================================================

-- 1. Templates ---------------------------------------------------------------
create table if not exists public.notification_templates (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid references public.clinics(id) on delete cascade,
  name        text not null,
  category    text not null default 'Appointment',
  title       text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists notification_templates_clinic_idx
  on public.notification_templates (clinic_id, created_at desc);

-- 2. Notifications (feed + delivery record) ----------------------------------
create table if not exists public.patient_notifications (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid references public.clinics(id) on delete cascade,
  patient_id  uuid references public.profiles(id) on delete cascade,
  title       text not null,
  body        text not null,
  category    text not null default 'Appointment',
  status      text not null default 'SENT'
              check (status in ('QUEUED','SENT','READ','FAILED')),
  sent_by     text,
  sent_at     timestamptz,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists patient_notifications_clinic_idx
  on public.patient_notifications (clinic_id, created_at desc);
create index if not exists patient_notifications_patient_idx
  on public.patient_notifications (patient_id, created_at desc);

-- 3. Push subscriptions (Web Push / PWA) -------------------------------------
create table if not exists public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  clinic_id   uuid references public.clinics(id) on delete cascade,
  endpoint    text not null unique,
  keys        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists push_subscriptions_clinic_idx
  on public.push_subscriptions (clinic_id);

-- 4. RLS ---------------------------------------------------------------------
alter table public.notification_templates enable row level security;
alter table public.patient_notifications  enable row level security;
alter table public.push_subscriptions     enable row level security;

drop policy if exists notification_templates_access on public.notification_templates;
create policy notification_templates_access on public.notification_templates
  for all to authenticated
  using (public.is_super_admin() or clinic_id = public.get_user_clinic_id())
  with check (public.is_super_admin() or clinic_id = public.get_user_clinic_id());

-- Patients read their own notifications; clinic staff read/write the whole clinic.
drop policy if exists patient_notifications_select on public.patient_notifications;
drop policy if exists patient_notifications_insert on public.patient_notifications;
create policy patient_notifications_select on public.patient_notifications
  for select to authenticated
  using (
    public.is_super_admin()
    or patient_id = auth.uid()
    or clinic_id = public.get_user_clinic_id()
  );
create policy patient_notifications_insert on public.patient_notifications
  for insert to authenticated
  with check (public.is_super_admin() or clinic_id = public.get_user_clinic_id());

-- A device may manage only its own subscription; staff may read their clinic's.
drop policy if exists push_subscriptions_self on public.push_subscriptions;
drop policy if exists push_subscriptions_clinic_read on public.push_subscriptions;
create policy push_subscriptions_self on public.push_subscriptions
  for all to authenticated
  using (user_id = auth.uid() or public.is_super_admin())
  with check (user_id = auth.uid() or public.is_super_admin());
create policy push_subscriptions_clinic_read on public.push_subscriptions
  for select to authenticated
  using (public.is_super_admin() or clinic_id = public.get_user_clinic_id());
