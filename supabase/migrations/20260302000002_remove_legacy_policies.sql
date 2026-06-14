-- Migration: Remove Legacy Permissive Policies that bypass tenant isolation
-- These old policies grant unrestricted access to the 'public' role, 
-- which negates our new tenant-isolation RLS policies.

-- ========================================
-- CLINICS: Remove overly permissive policies
-- ========================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clinics;
DROP POLICY IF EXISTS "Enable insert for all" ON public.clinics;
DROP POLICY IF EXISTS "Enable update for all" ON public.clinics;
DROP POLICY IF EXISTS "Enable delete for all" ON public.clinics;
DROP POLICY IF EXISTS "Public clinics are viewable by everyone" ON public.clinics;

-- Allow authenticated users to insert clinics (needed for provisioning)
CREATE POLICY "Authenticated users can create clinics"
ON public.clinics FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow super admins to delete clinics
CREATE POLICY "Super admins can delete clinics"
ON public.clinics FOR DELETE
TO authenticated
USING (public.get_user_role() = 'SUPER_ADMIN');

-- ========================================
-- PROFILES: Remove overly permissive policies
-- ========================================
DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view clinic profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ========================================
-- TRANSACTIONS: Remove overly permissive policies  
-- ========================================
DROP POLICY IF EXISTS "Public Transactions Access" ON public.transactions;
DROP POLICY IF EXISTS "Admins View Clinic Transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users view own txs" ON public.transactions;

-- ========================================
-- WALLETS: Remove overly permissive policies
-- ========================================
DROP POLICY IF EXISTS "Public Wallets Access" ON public.wallets;
DROP POLICY IF EXISTS "Access Wallets" ON public.wallets;

-- ========================================
-- CARE_PLANS: Remove overly permissive policies
-- ========================================
DROP POLICY IF EXISTS "Public CarePlans Access" ON public.care_plans;
DROP POLICY IF EXISTS "Admins View Clinic Plans" ON public.care_plans;
DROP POLICY IF EXISTS "Admins can update care_plans" ON public.care_plans;
DROP POLICY IF EXISTS "Patients can view own care_plans" ON public.care_plans;

-- ========================================
-- APPOINTMENTS: Remove overly permissive policies
-- ========================================
DROP POLICY IF EXISTS "Public Appointments Access" ON public.appointments;
