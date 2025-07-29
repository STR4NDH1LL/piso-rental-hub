-- Create demo tenant account
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
) VALUES (
  'demo-tenant-001',
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
) ON CONFLICT (id) DO NOTHING;

-- Create demo landlord account
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
) VALUES (
  'demo-landlord-001',
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
) ON CONFLICT (id) DO NOTHING;

-- Create demo profiles with roles
INSERT INTO public.profiles (user_id, email, full_name, role) VALUES 
('demo-tenant-001', 'tenant@demo.com', 'Demo Tenant', 'tenant'),
('demo-landlord-001', 'landlord@demo.com', 'Demo Landlord', 'landlord')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Create demo property for the landlord
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
  'demo-property-001',
  'demo-landlord-001',
  'Flat 2A, Victoria Street',
  'London, SW1E 5ND',
  'Modern 2-bedroom flat in central London with excellent transport links',
  1200.00,
  2,
  1,
  'Apartment'
) ON CONFLICT (id) DO NOTHING;

-- Create demo tenancy linking tenant to property
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
  'demo-tenancy-001',
  'demo-tenant-001',
  'demo-property-001',
  'demo-landlord-001',
  1200.00,
  '2024-03-01',
  '2024-01-01',
  '2024-12-31',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Create demo maintenance request
INSERT INTO public.maintenance_requests (
  id,
  tenant_id,
  property_id,
  landlord_id,
  title,
  description,
  status,
  priority
) VALUES (
  'demo-maintenance-001',
  'demo-tenant-001',
  'demo-property-001',
  'demo-landlord-001',
  'Heating not working properly',
  'The central heating system is not heating the property adequately. Temperature is only reaching 15°C when set to 21°C.',
  'pending',
  'high'
) ON CONFLICT (id) DO NOTHING;