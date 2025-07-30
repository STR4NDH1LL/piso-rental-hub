-- Add some demo properties for the landlord account
INSERT INTO public.properties (
  landlord_id,
  name,
  address,
  description,
  property_type,
  bedrooms,
  bathrooms,
  rent_amount,
  rent_currency
) VALUES 
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Demo landlord UUID
  'Victoria Gardens Apartment',
  '123 Victoria Street, London, SW1V 4RB, UK',
  'Modern 2-bedroom apartment in prime Victoria location with excellent transport links.',
  'apartment',
  2,
  2,
  2500,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Camden Town House',
  '45 Camden High Street, London, NW1 7JN, UK', 
  'Stylish 3-bedroom Victorian house in vibrant Camden with garden.',
  'house',
  3,
  2,
  3200,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Shoreditch Loft',
  '78 Brick Lane, London, E1 6RL, UK',
  'Contemporary 1-bedroom loft in trendy Shoreditch area.',
  'apartment', 
  1,
  1,
  1800,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Kensington Studio',
  '156 Kensington High Street, London, W8 7RG, UK',
  'Luxury studio apartment in prestigious Kensington location.',
  'studio',
  0,
  1,
  1500,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Greenwich Riverside Flat',
  '89 Greenwich Park Road, London, SE10 9JA, UK',
  'Beautiful 2-bedroom flat with river views in historic Greenwich.',
  'apartment',
  2,
  1,
  2200,
  '£'
);

-- Also add some demo tenants for a few properties
INSERT INTO public.profiles (user_id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@demo.com', 'Sarah Johnson', 'tenant'),
('550e8400-e29b-41d4-a716-446655440002', 'mike.chen@demo.com', 'Mike Chen', 'tenant'),
('550e8400-e29b-41d4-a716-446655440003', 'emma.wilson@demo.com', 'Emma Wilson', 'tenant')
ON CONFLICT (user_id) DO NOTHING;

-- Add some tenancies to show occupied properties
INSERT INTO public.tenancies (
  landlord_id,
  tenant_id, 
  property_id,
  rent_amount,
  status,
  lease_start_date,
  lease_end_date,
  rent_due_date
) 
SELECT 
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '550e8400-e29b-41d4-a716-446655440001',
  p.id,
  p.rent_amount,
  'active',
  '2024-01-15'::date,
  '2025-01-14'::date,
  '2024-02-01'::date
FROM public.properties p 
WHERE p.name = 'Victoria Gardens Apartment' 
AND p.landlord_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
LIMIT 1;

INSERT INTO public.tenancies (
  landlord_id,
  tenant_id,
  property_id, 
  rent_amount,
  status,
  lease_start_date,
  lease_end_date,
  rent_due_date
)
SELECT
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '550e8400-e29b-41d4-a716-446655440002', 
  p.id,
  p.rent_amount,
  'active',
  '2024-03-01'::date,
  '2025-02-28'::date,
  '2024-04-01'::date
FROM public.properties p
WHERE p.name = 'Camden Town House'
AND p.landlord_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
LIMIT 1;