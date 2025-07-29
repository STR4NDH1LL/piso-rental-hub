-- Temporarily disable the trigger to insert demo users manually
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Insert demo users with simple approach
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'tenant@demo.com',
    crypt('password123', gen_salt('bf')),
    now(),
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
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Demo Landlord"}',
    false,
    'authenticated',
    'authenticated'
)
ON CONFLICT (email) DO NOTHING;

-- Create profiles manually with roles
INSERT INTO public.profiles (user_id, email, full_name, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'tenant@demo.com', 'Demo Tenant', 'tenant'),
('22222222-2222-2222-2222-222222222222', 'landlord@demo.com', 'Demo Landlord', 'landlord')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create demo data
INSERT INTO public.properties (
    id,
    landlord_id,
    name,
    address,
    description,
    rent_amount,
    bedrooms,
    bathrooms,
    property_type
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Flat 2A, Victoria Street',
    'London, SW1E 5ND',
    'Modern 2-bedroom flat in central London with excellent transport links',
    1200.00,
    2,
    1,
    'Apartment'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tenancies (
    id,
    tenant_id,
    property_id,
    landlord_id,
    rent_amount,
    rent_due_date,
    lease_start_date,
    lease_end_date,
    status
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    1200.00,
    '2024-03-01',
    '2024-01-01',
    '2024-12-31',
    'active'
) ON CONFLICT (id) DO NOTHING;