-- Migration: Add full anon CRUD permissions for God Mode platform operations
-- The God Mode uses the anon key (no Supabase auth session), so all write
-- operations need anon-level policies.

-- Profiles: UPDATE and DELETE
CREATE POLICY IF NOT EXISTS "Allow anon to update profiles" ON public.profiles FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to delete profiles" ON public.profiles FOR DELETE TO anon USING (true);

-- Wallets: UPDATE and DELETE
CREATE POLICY IF NOT EXISTS "Allow anon to update wallets" ON public.wallets FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to delete wallets" ON public.wallets FOR DELETE TO anon USING (true);

-- Transactions: INSERT and UPDATE
CREATE POLICY IF NOT EXISTS "Allow anon to insert transactions" ON public.transactions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to update transactions" ON public.transactions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Care Plans: full CRUD
CREATE POLICY IF NOT EXISTS "Allow anon to insert care_plans" ON public.care_plans FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to update care_plans" ON public.care_plans FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to delete care_plans" ON public.care_plans FOR DELETE TO anon USING (true);

-- Appointments: full CRUD
CREATE POLICY IF NOT EXISTS "Allow anon to insert appointments" ON public.appointments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to update appointments" ON public.appointments FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to delete appointments" ON public.appointments FOR DELETE TO anon USING (true);
