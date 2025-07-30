-- Create demo tenant profiles
INSERT INTO public.profiles (user_id, email, full_name, role, phone) VALUES 
('11111111-1111-1111-1111-111111111111', 'john.smith@email.com', 'John Smith', 'tenant', '+44 7700 900001'),
('22222222-2222-2222-2222-222222222222', 'sarah.jones@email.com', 'Sarah Jones', 'tenant', '+44 7700 900002'),
('33333333-3333-3333-3333-333333333333', 'mike.wilson@email.com', 'Mike Wilson', 'tenant', '+44 7700 900003'),
('44444444-4444-4444-4444-444444444444', 'emma.brown@email.com', 'Emma Brown', 'tenant', '+44 7700 900004'),
('55555555-5555-5555-5555-555555555555', 'james.taylor@email.com', 'James Taylor', 'tenant', '+44 7700 900005');

-- Create demo tenancies (assuming there are properties already)
INSERT INTO public.tenancies (tenant_id, landlord_id, property_id, rent_amount, lease_start_date, lease_end_date, rent_due_date, status)
SELECT 
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 1 THEN '11111111-1111-1111-1111-111111111111'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 2 THEN '22222222-2222-2222-2222-222222222222'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 3 THEN '33333333-3333-3333-3333-333333333333'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 4 THEN '44444444-4444-4444-4444-444444444444'
    ELSE '55555555-5555-5555-5555-555555555555'
  END as tenant_id,
  landlord_id,
  id as property_id,
  rent_amount,
  CURRENT_DATE - INTERVAL '6 months' as lease_start_date,
  CURRENT_DATE + INTERVAL '6 months' as lease_end_date,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY id) <= 2 THEN CURRENT_DATE - INTERVAL '15 days' -- Overdue rent
    ELSE CURRENT_DATE + INTERVAL '5 days'
  END as rent_due_date,
  'active'
FROM public.properties 
LIMIT 5;

-- Create demo maintenance requests
INSERT INTO public.maintenance_requests (tenant_id, landlord_id, property_id, title, description, priority, status, created_at)
SELECT 
  t.tenant_id,
  t.landlord_id,
  t.property_id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 1 THEN 'Broken Boiler - No Hot Water'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 2 THEN 'Leaking Ceiling in Kitchen'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 3 THEN 'Faulty Light Switch in Bedroom'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 4 THEN 'Blocked Drain in Bathroom'
    ELSE 'Window Won''t Close Properly'
  END as title,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 1 THEN 'The boiler has completely stopped working. There''s been no hot water for 3 days now. This is urgent as we can''t shower or wash dishes properly.'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 2 THEN 'Water is dripping from the kitchen ceiling near the sink. It started yesterday and seems to be getting worse.'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 3 THEN 'The main bedroom light switch isn''t working. The light flickers when pressed and sometimes doesn''t turn on at all.'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 4 THEN 'The bathroom sink drain is completely blocked. Water takes forever to drain out.'
    ELSE 'The bedroom window handle is broken and the window won''t close completely. This is letting cold air in.'
  END as description,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) <= 2 THEN 'urgent'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 3 THEN 'high'
    ELSE 'medium'
  END as priority,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 1 THEN 'pending'
    WHEN ROW_NUMBER() OVER (ORDER BY t.id) = 2 THEN 'pending'
    ELSE 'in_progress'
  END as status,
  CURRENT_TIMESTAMP - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY t.id))
FROM public.tenancies t
LIMIT 5;