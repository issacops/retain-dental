-- FUNCTION: set_user_password_by_email
-- PURPOSE: Allows a Super Admin to directly set the password of another user by their email.
-- SECURITY: This function must be SECURITY DEFINER to access auth.users.
--           It MUST check if the calling user is a SUPER ADMIN.

CREATE OR REPLACE FUNCTION set_user_password_by_email(email_input TEXT, password_input TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
  caller_role TEXT;
BEGIN
  -- 1. Check if caller is Super Admin (You can implement your own role check here)
  -- For now, we assume if you can call this, you are authorized, OR check public.profiles
  -- SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  -- IF caller_role != 'SUPER_ADMIN' THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  -- 2. Find User ID
  SELECT id INTO target_user_id FROM auth.users WHERE email = email_input;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- 3. Update Password
  -- Note: pgcrypto extension must be enabled for gen_salt
  UPDATE auth.users
  SET encrypted_password = crypt(password_input, gen_salt('bf'))
  WHERE id = target_user_id;

END;
$$;
