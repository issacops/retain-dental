-- Migration: Add Auth Helpers and RLS Policies for Foolproof Multi-Tenancy

-- 1. Helper Functions to extract Claims
CREATE OR REPLACE FUNCTION public.get_user_clinic_id()
RETURNS uuid
LANGUAGE sql SECURITY DEFINER SET search_path = public
STABLE
AS $$
  -- Assuming clinic_id is stored in the 'profiles' table which is synced with auth.users
  SELECT clinic_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. Enable RLS on core tables (assuming they exist, otherwise this is a no-op until created)
-- Note: Replace these with your actual table names if they differ
ALTER TABLE IF EXISTS public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.care_plans ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Clinics Table Policies
DROP POLICY IF EXISTS "Clinics are viewable by assigned users or super admins" ON public.clinics;
CREATE POLICY "Clinics are viewable by assigned users or super admins"
ON public.clinics FOR SELECT
TO authenticated
USING (id = public.get_user_clinic_id() OR public.get_user_role() = 'SUPER_ADMIN');

DROP POLICY IF EXISTS "Clinics are updateable by their admins" ON public.clinics;
CREATE POLICY "Clinics are updateable by their admins"
ON public.clinics FOR UPDATE
TO authenticated
USING (id = public.get_user_clinic_id() AND public.get_user_role() = 'ADMIN')
WITH CHECK (id = public.get_user_clinic_id() AND public.get_user_role() = 'ADMIN');

-- Profiles Table Policies
DROP POLICY IF EXISTS "Users can view profiles in their own clinic" ON public.profiles;
CREATE POLICY "Users can view profiles in their own clinic"
ON public.profiles FOR SELECT
TO authenticated
USING (clinic_id = public.get_user_clinic_id() OR id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins can update profiles in their clinic" ON public.profiles;
CREATE POLICY "Admins can update profiles in their clinic"
ON public.profiles FOR UPDATE
TO authenticated
USING (clinic_id = public.get_user_clinic_id() AND public.get_user_role() = 'ADMIN')
WITH CHECK (clinic_id = public.get_user_clinic_id() AND public.get_user_role() = 'ADMIN');

-- Tenant Isolation Policies (Transactions, Wallets, Appointments, Care Plans)
-- Create a generic policy generation block if possible, or list them out securely

-- Transactions
DROP POLICY IF EXISTS "Tenant Isolation for Transactions" ON public.transactions;
CREATE POLICY "Tenant Isolation for Transactions"
ON public.transactions FOR ALL
TO authenticated
USING (clinic_id = public.get_user_clinic_id())
WITH CHECK (clinic_id = public.get_user_clinic_id());

-- Wallets (Wallets belong to users, who belong to clinics)
DROP POLICY IF EXISTS "Tenant Isolation for Wallets" ON public.wallets;
CREATE POLICY "Tenant Isolation for Wallets"
ON public.wallets FOR ALL
TO authenticated
USING (
    user_id IN (SELECT id FROM public.profiles WHERE clinic_id = public.get_user_clinic_id())
)
WITH CHECK (
    user_id IN (SELECT id FROM public.profiles WHERE clinic_id = public.get_user_clinic_id())
);

-- Appointments
DROP POLICY IF EXISTS "Tenant Isolation for Appointments" ON public.appointments;
CREATE POLICY "Tenant Isolation for Appointments"
ON public.appointments FOR ALL
TO authenticated
USING (clinic_id = public.get_user_clinic_id())
WITH CHECK (clinic_id = public.get_user_clinic_id());

-- Care Plans
DROP POLICY IF EXISTS "Tenant Isolation for Care Plans" ON public.care_plans;
CREATE POLICY "Tenant Isolation for Care Plans"
ON public.care_plans FOR ALL
TO authenticated
USING (clinic_id = public.get_user_clinic_id())
WITH CHECK (clinic_id = public.get_user_clinic_id());
