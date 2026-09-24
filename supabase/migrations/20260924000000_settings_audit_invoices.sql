-- ============================================================================
-- Clinic settings, invoice numbers, and a compliance audit trail
-- ============================================================================
-- Adds:
--   * clinics.settings        jsonb — address, opening hours, notification config
--   * transactions.invoice_no text  — human-readable receipt number
--   * public.audit_logs              — clinic-scoped, RLS-protected activity trail
-- Safe to re-run.
-- ============================================================================

-- 1. Clinic settings ---------------------------------------------------------
alter table public.clinics
  add column if not exists settings jsonb not null default '{}'::jsonb;

-- 2. Invoice numbers ---------------------------------------------------------
alter table public.transactions
  add column if not exists invoice_no text;

create index if not exists transactions_invoice_idx
  on public.transactions (clinic_id, invoice_no)
  where invoice_no is not null;

-- 3. Audit trail -------------------------------------------------------------
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid references public.clinics(id) on delete cascade,
  actor_id    uuid,
  actor_name  text,
  action      text not null,
  detail      text,
  type        text not null default 'INFO'
              check (type in ('INFO','SUCCESS','SECURITY','CLINICAL','FINANCE')),
  created_at  timestamptz not null default now()
);

create index if not exists audit_logs_clinic_idx
  on public.audit_logs (clinic_id, created_at desc);

alter table public.audit_logs enable row level security;

-- Members read and write only their own clinic's trail; super admins see all.
drop policy if exists audit_logs_select on public.audit_logs;
drop policy if exists audit_logs_insert on public.audit_logs;

create policy audit_logs_select on public.audit_logs
  for select to authenticated
  using (public.is_super_admin() or clinic_id = public.get_user_clinic_id());

create policy audit_logs_insert on public.audit_logs
  for insert to authenticated
  with check (public.is_super_admin() or clinic_id = public.get_user_clinic_id());
