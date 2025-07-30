-- Create demo tenancies using proper UUID format for tenant_id
WITH landlord_properties AS (
  SELECT 
    p.id as property_id,
    p.landlord_id,
    p.rent_amount,
    ROW_NUMBER() OVER (ORDER BY p.created_at) as rn
  FROM public.properties p
  WHERE p.landlord_id IS NOT NULL
  LIMIT 5
)
INSERT INTO public.tenancies (tenant_id, landlord_id, property_id, rent_amount, lease_start_date, lease_end_date, rent_due_date, status)
SELECT 
  CASE rn
    WHEN 1 THEN 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'::uuid
    WHEN 2 THEN 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'::uuid
    WHEN 3 THEN 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'::uuid
    WHEN 4 THEN 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4'::uuid
    WHEN 5 THEN 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5'::uuid
  END as tenant_id,
  landlord_id,
  property_id,
  rent_amount,
  CURRENT_DATE - INTERVAL '6 months' as lease_start_date,
  CURRENT_DATE + INTERVAL '6 months' as lease_end_date,
  CASE rn
    WHEN 1 THEN CURRENT_DATE - INTERVAL '20 days' -- Overdue rent
    WHEN 2 THEN CURRENT_DATE - INTERVAL '10 days' -- Overdue rent
    ELSE CURRENT_DATE + INTERVAL '5 days'
  END as rent_due_date,
  'active'
FROM landlord_properties
ON CONFLICT DO NOTHING;

-- Create demo maintenance requests based on the demo tenancies
WITH demo_tenancies AS (
  SELECT 
    t.tenant_id,
    t.landlord_id,
    t.property_id,
    CASE t.tenant_id::text
      WHEN 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1' THEN 1
      WHEN 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2' THEN 2
      WHEN 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3' THEN 3
      WHEN 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4' THEN 4
      WHEN 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5' THEN 5
    END as rn
  FROM public.tenancies t
  WHERE t.tenant_id::text IN (
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
    'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
    'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4',
    'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5'
  )
    AND t.status = 'active'
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
FROM demo_tenancies
WHERE rn IS NOT NULL;