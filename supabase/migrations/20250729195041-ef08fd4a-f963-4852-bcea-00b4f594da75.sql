-- Disable trigger and create demo accounts manually
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Make role temporarily nullable
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;

-- Clear existing demo data
DELETE FROM public.profiles WHERE email IN ('tenant@demo.com', 'landlord@demo.com');
DELETE FROM auth.users WHERE email IN ('tenant@demo.com', 'landlord@demo.com');

-- Insert demo users without the problematic trigger
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, phone_change_token, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'tenant@demo.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Demo Tenant"}',
    false,
    'authenticated',
    'authenticated'
),
(
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'landlord@demo.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Demo Landlord"}',
    false,
    'authenticated',
    'authenticated'
);

-- Manually create profiles with roles
INSERT INTO public.profiles (user_id, email, full_name, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'tenant@demo.com', 'Demo Tenant', 'tenant'),
('22222222-2222-2222-2222-222222222222', 'landlord@demo.com', 'Demo Landlord', 'landlord');

-- Restore NOT NULL constraint
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Recreate the trigger but modify it to handle role properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Only insert if user doesn't already have a profile
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = new.id) THEN
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
      'tenant' -- Default role for new signups
    );
  END IF;
  RETURN new;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();