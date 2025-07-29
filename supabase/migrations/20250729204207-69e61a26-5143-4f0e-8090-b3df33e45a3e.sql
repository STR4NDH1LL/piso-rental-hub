-- First, let's check what the status constraint allows and fix it
-- Drop the existing constraint and recreate with correct values
ALTER TABLE maintenance_requests DROP CONSTRAINT IF EXISTS maintenance_requests_status_check;

-- Add constraint with correct status values 
ALTER TABLE maintenance_requests ADD CONSTRAINT maintenance_requests_status_check 
CHECK (status IN ('pending', 'urgent', 'In Progress', 'Completed'));

-- Insert sample properties for the demo landlord
INSERT INTO properties (
  id,
  name,
  address,
  description,
  property_type,
  bedrooms,
  bathrooms,
  rent_amount,
  rent_currency,
  landlord_id
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Sunset Apartments',
  '123 Main Street, London, SW1A 1AA',
  'Modern 2-bedroom apartment in central location',
  'apartment',
  2,
  1,
  1500.00,
  'GBP',
  '22222222-2222-2222-2222-222222222222'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Garden View House',
  '456 Oak Avenue, Manchester, M1 2AB',
  'Spacious family house with garden',
  'house',
  3,
  2,
  1800.00,
  'GBP',
  '22222222-2222-2222-2222-222222222222'
),
(
  '33333333-3333-3333-3333-333333333333',
  'City Center Studio',
  '789 High Street, Birmingham, B1 1AA',
  'Compact studio apartment in city center',
  'studio',
  1,
  1,
  900.00,
  'GBP',
  '22222222-2222-2222-2222-222222222222'
);

-- Insert sample tenancies
INSERT INTO tenancies (
  id,
  tenant_id,
  landlord_id,
  property_id,
  status,
  lease_start_date,
  lease_end_date,
  rent_amount,
  rent_due_date
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'active',
  '2024-01-01',
  '2024-12-31',
  1500.00,
  '2024-08-01'
);

-- Insert sample maintenance requests with correct status values
INSERT INTO maintenance_requests (
  id,
  tenant_id,
  landlord_id,
  property_id,
  title,
  description,
  status,
  priority
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Leaking Kitchen Faucet',
  'The kitchen faucet has been dripping constantly for the past week. It needs repair or replacement.',
  'pending',
  'medium'
),
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Broken Heating System',
  'The heating system is not working properly. Temperature is very low throughout the apartment.',
  'urgent',
  'urgent'
),
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Light Bulb Replacement',
  'Several light bulbs in the living room need replacement.',
  'Completed',
  'low'
);