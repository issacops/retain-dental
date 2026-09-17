-- Migration: 20260317000001_security_hardening.sql
-- PURPOSE: Revoke open anonymous write policies and enforce auth check on sensitive RPCs.

-- 1. Drop insecure anonymous policies from 20260302000004_anon_write_policies
DROP POLICY IF EXISTS "Allow anon to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon to delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon to update wallets" ON public.wallets;
DROP POLICY IF EXISTS "Allow anon to delete wallets" ON public.wallets;
DROP POLICY IF EXISTS "Allow anon to insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow anon to update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow anon to insert care_plans" ON public.care_plans;
DROP POLICY IF EXISTS "Allow anon to update care_plans" ON public.care_plans;
DROP POLICY IF EXISTS "Allow anon to delete care_plans" ON public.care_plans;
DROP POLICY IF EXISTS "Allow anon to insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow anon to update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow anon to delete appointments" ON public.appointments;

-- 2. Enforce authentication and role checks on set_user_password_by_email RPC
CREATE OR REPLACE FUNCTION set_user_password_by_email(email_input TEXT, password_input TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
  caller_role TEXT;
BEGIN
  -- Verify caller is authenticated and holds SUPER_ADMIN role
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Authentication required';
  END IF;

  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role != 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin role required';
  END IF;

  -- Find Target User ID
  SELECT id INTO target_user_id FROM auth.users WHERE email = email_input;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Update Password securely
  UPDATE auth.users
  SET encrypted_password = crypt(password_input, gen_salt('bf'))
  WHERE id = target_user_id;

END;
$$;
