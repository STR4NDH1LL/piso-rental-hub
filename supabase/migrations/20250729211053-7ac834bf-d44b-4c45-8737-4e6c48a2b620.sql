-- Add demo properties for the landlord
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

-- Add more demo tenant profiles
INSERT INTO profiles (user_id, email, full_name, role, phone) VALUES
('bbbbbbbb-1111-1111-1111-111111111111', 'sarah.johnson@demo.com', 'Sarah Johnson', 'tenant', '+44 7700 900123'),
('bbbbbbbb-2222-2222-2222-222222222222', 'john.smith@demo.com', 'John Smith', 'tenant', '+44 7700 900124'),
('bbbbbbbb-3333-3333-3333-333333333333', 'michael.brown@demo.com', 'Michael Brown', 'tenant', '+44 7700 900125'),
('bbbbbbbb-4444-4444-4444-444444444444', 'emma.wilson@demo.com', 'Emma Wilson', 'tenant', '+44 7700 900126'),
('bbbbbbbb-5555-5555-5555-555555555555', 'david.jones@demo.com', 'David Jones', 'tenant', '+44 7700 900127'),
('bbbbbbbb-6666-6666-6666-666666666666', 'lisa.davis@demo.com', 'Lisa Davis', 'tenant', '+44 7700 900128'),
('bbbbbbbb-7777-7777-7777-777777777777', 'james.miller@demo.com', 'James Miller', 'tenant', '+44 7700 900129'),
('bbbbbbbb-8888-8888-8888-888888888888', 'sophie.taylor@demo.com', 'Sophie Taylor', 'tenant', '+44 7700 900130')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- Create tenancies for some of the properties
INSERT INTO tenancies (id, tenant_id, property_id, landlord_id, rent_amount, lease_start_date, lease_end_date, rent_due_date, status) VALUES
('cccccccc-1111-1111-1111-111111111111', 'bbbbbbbb-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1200.00, '2024-01-01', '2024-12-31', '2024-01-01', 'active'),
('cccccccc-2222-2222-2222-222222222222', 'bbbbbbbb-2222-2222-2222-222222222222', 'aaaaaaaa-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 850.00, '2024-02-01', '2024-12-31', '2024-02-01', 'active'),
('cccccccc-3333-3333-3333-333333333333', 'bbbbbbbb-3333-3333-3333-333333333333', 'aaaaaaaa-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1100.00, '2024-01-15', '2024-12-31', '2024-01-15', 'active'),
('cccccccc-4444-4444-4444-444444444444', 'bbbbbbbb-4444-4444-4444-444444444444', 'aaaaaaaa-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 1350.00, '2024-03-01', '2024-12-31', '2024-03-01', 'active')
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
('dddddddd-1111-1111-1111-111111111111', 'bbbbbbbb-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Heating Issue', 'The heating system is not working properly in the living room', 'high', 'pending'),
('dddddddd-2222-2222-2222-222222222222', 'bbbbbbbb-3333-3333-3333-333333333333', 'aaaaaaaa-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Leaky Faucet', 'Kitchen faucet is dripping constantly', 'medium', 'in_progress'),
('dddddddd-3333-3333-3333-333333333333', 'bbbbbbbb-4444-4444-4444-444444444444', 'aaaaaaaa-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Broken Window', 'Bedroom window latch is broken', 'low', 'pending')
ON CONFLICT (id) DO UPDATE SET
  tenant_id = EXCLUDED.tenant_id,
  property_id = EXCLUDED.property_id,
  landlord_id = EXCLUDED.landlord_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  priority = EXCLUDED.priority,
  status = EXCLUDED.status;