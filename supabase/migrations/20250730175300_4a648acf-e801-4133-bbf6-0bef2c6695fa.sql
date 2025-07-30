-- Create demo user accounts by inserting into profiles table
-- Note: These users need to be created through Supabase Auth, but we can check if they exist first

DO $$
BEGIN
  -- Check if we need to create demo accounts
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email LIKE '%demo%') THEN
    -- Insert demo profiles (these will be linked when users sign up)
    INSERT INTO profiles (user_id, email, full_name, role) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'landlord@demo.com', 'Demo Landlord', 'landlord'),
    ('22222222-2222-2222-2222-222222222222', 'tenant@demo.com', 'Demo Tenant', 'tenant');
  END IF;
END $$;