-- First, let's check and clean up any existing demo users
DELETE FROM auth.users WHERE email = 'landlord@demo.com';

-- Create a fresh landlord demo user with the correct password
-- Note: This creates the user in raw SQL, but in production you'd use the Supabase Dashboard
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_sent_at,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Static UUID for demo landlord
  'authenticated',
  'authenticated',
  'landlord@demo.com',
  crypt('password123', gen_salt('bf')), -- Encrypted password
  now(),
  now(),
  '',
  null,
  '',
  '',
  '',
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo Landlord"}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Update or insert the profile for this user
INSERT INTO public.profiles (user_id, email, full_name, role)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'landlord@demo.com',
  'Demo Landlord',
  'landlord'
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;