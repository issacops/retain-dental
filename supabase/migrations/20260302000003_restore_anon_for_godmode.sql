-- Migration: Restore anon access for God Mode / Platform Dashboard
-- The God Mode login is frontend-only (hardcoded), so the Supabase client
-- operates with the anon key. These policies restore necessary access.

-- Clinics: Full CRUD for God Mode provisioning
CREATE POLICY IF NOT EXISTS "Allow anon to read clinics" ON public.clinics FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "Allow anon to insert clinics" ON public.clinics FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to update clinics" ON public.clinics FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon to delete clinics" ON public.clinics FOR DELETE TO anon USING (true);

-- Profiles: Read for dashboard + Insert for patient onboarding
CREATE POLICY IF NOT EXISTS "Allow anon to read profiles" ON public.profiles FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "Allow anon to insert profiles" ON public.profiles FOR INSERT TO anon WITH CHECK (true);

-- Transactions: Read for dashboard stats
CREATE POLICY IF NOT EXISTS "Allow anon to read transactions" ON public.transactions FOR SELECT TO anon USING (true);

-- Wallets: Read for dashboard + Insert for patient onboarding
CREATE POLICY IF NOT EXISTS "Allow anon to read wallets" ON public.wallets FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "Allow anon to insert wallets" ON public.wallets FOR INSERT TO anon WITH CHECK (true);

-- Care Plans: Read for dashboard
CREATE POLICY IF NOT EXISTS "Allow anon to read care_plans" ON public.care_plans FOR SELECT TO anon USING (true);

-- Appointments: Read for dashboard
CREATE POLICY IF NOT EXISTS "Allow anon to read appointments" ON public.appointments FOR SELECT TO anon USING (true);
