-- Create demo tenant profiles (using specific UUIDs to avoid conflicts)
INSERT INTO public.profiles (id, user_id, email, full_name, role, phone) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'sarah.johnson@demo.com', 'Sarah Johnson', 'tenant', '+44 7700 900123'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'michael.smith@demo.com', 'Michael Smith', 'tenant', '+44 7700 900124'),
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'emma.wilson@demo.com', 'Emma Wilson', 'tenant', '+44 7700 900125'),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'james.brown@demo.com', 'James Brown', 'tenant', '+44 7700 900126'),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'olivia.davis@demo.com', 'Olivia Davis', 'tenant', '+44 7700 900127')
ON CONFLICT (id) DO NOTHING;

-- Get existing properties from the landlord account for demo tenancies
-- We'll use the first few properties available
WITH landlord_properties AS (
  SELECT id, rent_amount 
  FROM properties 
  WHERE landlord_id = (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1)
  LIMIT 5
),
demo_tenancies AS (
  SELECT 
    gen_random_uuid() as id,
    CASE 
      WHEN row_number() OVER () = 1 THEN '11111111-1111-1111-1111-111111111111'::uuid
      WHEN row_number() OVER () = 2 THEN '22222222-2222-2222-2222-222222222222'::uuid
      WHEN row_number() OVER () = 3 THEN '33333333-3333-3333-3333-333333333333'::uuid
      WHEN row_number() OVER () = 4 THEN '44444444-4444-4444-4444-444444444444'::uuid
      WHEN row_number() OVER () = 5 THEN '55555555-5555-5555-5555-555555555555'::uuid
    END as tenant_id,
    p.id as property_id,
    (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1) as landlord_id,
    p.rent_amount,
    CASE 
      WHEN row_number() OVER () <= 3 THEN 'active'
      ELSE 'pending'
    END as status,
    CURRENT_DATE - INTERVAL '6 months' as lease_start_date,
    CURRENT_DATE + INTERVAL '6 months' as lease_end_date,
    CASE 
      WHEN row_number() OVER () = 1 THEN CURRENT_DATE - INTERVAL '5 days' -- Overdue
      WHEN row_number() OVER () = 2 THEN CURRENT_DATE + INTERVAL '5 days'
      ELSE CURRENT_DATE + INTERVAL '10 days'
    END as rent_due_date
  FROM landlord_properties p
)
INSERT INTO public.tenancies (id, tenant_id, property_id, landlord_id, rent_amount, status, lease_start_date, lease_end_date, rent_due_date)
SELECT * FROM demo_tenancies
ON CONFLICT DO NOTHING;

-- Create demo maintenance requests for the active tenancies
WITH active_tenancies AS (
  SELECT 
    t.id as tenancy_id,
    t.tenant_id,
    t.property_id,
    t.landlord_id
  FROM tenancies t
  WHERE t.status = 'active' 
    AND t.tenant_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')
  LIMIT 3
),
demo_maintenance AS (
  SELECT 
    gen_random_uuid() as id,
    t.tenant_id,
    t.property_id,
    t.landlord_id,
    CASE 
      WHEN row_number() OVER () = 1 THEN 'Urgent: Heating System Not Working'
      WHEN row_number() OVER () = 2 THEN 'Kitchen Sink Leaking'
      WHEN row_number() OVER () = 3 THEN 'Bedroom Window Won''t Close Properly'
    END as title,
    CASE 
      WHEN row_number() OVER () = 1 THEN 'The heating system has completely stopped working. The house is getting very cold and we have no hot water. This needs immediate attention as it''s affecting our daily life.'
      WHEN row_number() OVER () = 2 THEN 'The kitchen sink has been leaking underneath for the past week. The leak is getting worse and may cause damage to the cabinet below.'
      WHEN row_number() OVER () = 3 THEN 'The window in the main bedroom won''t close properly, leaving a gap that lets in cold air and rain. The locking mechanism seems to be broken.'
    END as description,
    CASE 
      WHEN row_number() OVER () = 1 THEN 'urgent'
      WHEN row_number() OVER () = 2 THEN 'high'
      WHEN row_number() OVER () = 3 THEN 'medium'
    END as priority,
    CASE 
      WHEN row_number() OVER () = 1 THEN 'pending'
      WHEN row_number() OVER () = 2 THEN 'in_progress'
      WHEN row_number() OVER () = 3 THEN 'pending'
    END as status,
    CASE 
      WHEN row_number() OVER () = 1 THEN CURRENT_TIMESTAMP - INTERVAL '2 days'
      WHEN row_number() OVER () = 2 THEN CURRENT_TIMESTAMP - INTERVAL '1 day'
      WHEN row_number() OVER () = 3 THEN CURRENT_TIMESTAMP - INTERVAL '3 hours'
    END as created_at
  FROM active_tenancies t
)
INSERT INTO public.maintenance_requests (id, tenant_id, property_id, landlord_id, title, description, priority, status, created_at, updated_at)
SELECT id, tenant_id, property_id, landlord_id, title, description, priority, status, created_at, created_at FROM demo_maintenance
ON CONFLICT DO NOTHING;