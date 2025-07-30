-- First, let's create demo tenant profiles with unique IDs that won't conflict
INSERT INTO public.profiles (user_id, email, full_name, role, phone) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'alice.cooper@demo.com', 'Alice Cooper', 'tenant', '+44 7700 900101'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bob.martin@demo.com', 'Bob Martin', 'tenant', '+44 7700 900102'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'charlie.davis@demo.com', 'Charlie Davis', 'tenant', '+44 7700 900103'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'diana.wilson@demo.com', 'Diana Wilson', 'tenant', '+44 7700 900104'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'edward.brown@demo.com', 'Edward Brown', 'tenant', '+44 7700 900105')
ON CONFLICT (user_id) DO NOTHING;

-- Create demo tenancies for existing properties
WITH property_assignments AS (
  SELECT 
    p.id as property_id,
    p.landlord_id,
    p.rent_amount,
    CASE ROW_NUMBER() OVER (ORDER BY p.created_at)
      WHEN 1 THEN 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      WHEN 2 THEN 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'  
      WHEN 3 THEN 'cccccccc-cccc-cccc-cccc-cccccccccccc'
      WHEN 4 THEN 'dddddddd-dddd-dddd-dddd-dddddddddddd'
      WHEN 5 THEN 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
    END as tenant_id,
    CASE ROW_NUMBER() OVER (ORDER BY p.created_at)
      WHEN 1 THEN CURRENT_DATE - INTERVAL '20 days' -- Overdue rent
      WHEN 2 THEN CURRENT_DATE - INTERVAL '10 days' -- Overdue rent
      ELSE CURRENT_DATE + INTERVAL '5 days'
    END as rent_due_date
  FROM public.properties p
  WHERE p.landlord_id IS NOT NULL
  LIMIT 5
)
INSERT INTO public.tenancies (tenant_id, landlord_id, property_id, rent_amount, lease_start_date, lease_end_date, rent_due_date, status)
SELECT 
  tenant_id,
  landlord_id,
  property_id,
  rent_amount,
  CURRENT_DATE - INTERVAL '6 months' as lease_start_date,
  CURRENT_DATE + INTERVAL '6 months' as lease_end_date,
  rent_due_date,
  'active'
FROM property_assignments
WHERE tenant_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create demo maintenance requests
WITH tenancy_data AS (
  SELECT 
    t.tenant_id,
    t.landlord_id,
    t.property_id,
    ROW_NUMBER() OVER (ORDER BY t.created_at) as rn
  FROM public.tenancies t
  WHERE t.status = 'active'
  LIMIT 5
)
INSERT INTO public.maintenance_requests (tenant_id, landlord_id, property_id, title, description, priority, status, created_at)
SELECT 
  tenant_id,
  landlord_id,
  property_id,
  CASE rn
    WHEN 1 THEN 'Broken Boiler - No Hot Water'
    WHEN 2 THEN 'Leaking Ceiling in Kitchen'
    WHEN 3 THEN 'Faulty Electrical Socket'
    WHEN 4 THEN 'Blocked Bathroom Drain'
    WHEN 5 THEN 'Broken Window Lock'
  END as title,
  CASE rn
    WHEN 1 THEN 'The boiler has completely stopped working. There has been no hot water for 3 days now. This is urgent as we cannot shower or wash dishes properly. Please arrange immediate repair.'
    WHEN 2 THEN 'Water is dripping from the kitchen ceiling near the sink. It started yesterday and seems to be getting worse. There might be a leak from the flat above.'
    WHEN 3 THEN 'The electrical socket in the main bedroom is not working. When I plug anything in, it trips the circuit breaker. This could be a safety hazard.'
    WHEN 4 THEN 'The bathroom sink drain is completely blocked. Water takes forever to drain out and sometimes overflows. Tried basic drain cleaner but no luck.'
    WHEN 5 THEN 'The window lock in the living room is broken and the window won''t close completely. This is letting cold air in and is a security concern.'
  END as description,
  CASE rn
    WHEN 1 THEN 'urgent'
    WHEN 2 THEN 'urgent'
    WHEN 3 THEN 'high'
    WHEN 4 THEN 'medium'
    WHEN 5 THEN 'medium'
  END as priority,
  CASE rn
    WHEN 1 THEN 'pending'
    WHEN 2 THEN 'pending'
    WHEN 3 THEN 'in_progress'
    WHEN 4 THEN 'in_progress'
    WHEN 5 THEN 'completed'
  END as status,
  CURRENT_TIMESTAMP - INTERVAL '1 day' * rn
FROM tenancy_data;