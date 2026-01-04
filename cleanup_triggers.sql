-- CLEANUP: REMOVE TRIGGER & ENABLE FRONTEND CREATION
-- We are moving logic to the Application Layer for better debugging.

-- 1. DROP the Trigger and Function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. ENABLE INSERT POLICY
-- Allow authenticated users to insert their *own* profile row.
-- The Check: The 'id' column of the new row must match their Auth UID.
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. ENSURE UPDATE POLICY
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 4. ENSURE SELECT POLICY (Access Vault Visibility)
DROP POLICY IF EXISTS "Allow All Access" ON profiles; -- Drop nuclear if exists
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

CREATE POLICY "Enable read access for all users"
ON profiles FOR SELECT
TO authenticated
USING (true);
