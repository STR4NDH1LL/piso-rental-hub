-- Add demo properties for the landlord (using existing user)
INSERT INTO properties (id, name, address, description, property_type, bedrooms, bathrooms, rent_amount, rent_currency, landlord_id) VALUES
('aaaaaaaa-1111-1111-1111-111111111111', 'Flat 2A, Victoria Street', 'Victoria Street, London, SW1E 5ND', 'Modern 2-bedroom flat in central London', 'apartment', 2, 1, 1200.00, 'GBP', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-2222-2222-2222-222222222222', 'House 15, Oak Avenue', 'Oak Avenue, Manchester, M1 2AB', 'Spacious 3-bedroom house with garden', 'house', 3, 2, 950.00, 'GBP', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-3333-3333-3333-333333333333', 'Studio 7B, Park Lane', 'Park Lane, Birmingham, B1 3XX', 'Modern studio apartment near city center', 'studio', 1, 1, 850.00, 'GBP', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-4444-4444-4444-444444444444', 'Flat 12, Riverside Court', 'Riverside Court, Leeds, LS1 4AB', 'Luxury 2-bedroom flat with river views', 'apartment', 2, 2, 1100.00, 'GBP', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-5555-5555-5555-555555555555', 'House 3, Garden Street', 'Garden Street, Bristol, BS1 5CD', '4-bedroom family house with large garden', 'house', 4, 3, 1350.00, 'GBP', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  description = EXCLUDED.description,
  property_type = EXCLUDED.property_type,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  rent_amount = EXCLUDED.rent_amount,
  rent_currency = EXCLUDED.rent_currency;

-- Create tenancies for some properties (using existing tenant user)
INSERT INTO tenancies (id, tenant_id, property_id, landlord_id, rent_amount, lease_start_date, lease_end_date, rent_due_date, status) VALUES
('cccccccc-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1200.00, '2024-01-01', '2024-12-31', '2024-01-01', 'active'),
('cccccccc-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1100.00, '2024-01-15', '2024-12-31', '2024-01-15', 'active')
ON CONFLICT (id) DO UPDATE SET
  tenant_id = EXCLUDED.tenant_id,
  property_id = EXCLUDED.property_id,
  landlord_id = EXCLUDED.landlord_id,
  rent_amount = EXCLUDED.rent_amount,
  lease_start_date = EXCLUDED.lease_start_date,
  lease_end_date = EXCLUDED.lease_end_date,
  rent_due_date = EXCLUDED.rent_due_date,
  status = EXCLUDED.status;

-- Add some maintenance requests
INSERT INTO maintenance_requests (id, tenant_id, property_id, landlord_id, title, description, priority, status) VALUES
('dddddddd-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Heating Issue', 'The heating system is not working properly in the living room', 'high', 'pending'),
('dddddddd-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Broken Window', 'Bedroom window latch is broken', 'low', 'pending')
ON CONFLICT (id) DO UPDATE SET
  tenant_id = EXCLUDED.tenant_id,
  property_id = EXCLUDED.property_id,
  landlord_id = EXCLUDED.landlord_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  priority = EXCLUDED.priority,
  status = EXCLUDED.status;