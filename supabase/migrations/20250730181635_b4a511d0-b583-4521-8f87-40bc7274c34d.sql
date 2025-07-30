-- Let's check what existing tenant profiles we have and create demo data based on them
-- First, create some demo tenancies using simple string IDs (not referencing auth.users)
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
    WHEN 1 THEN 'demo-tenant-alice-cooper'
    WHEN 2 THEN 'demo-tenant-bob-martin'  
    WHEN 3 THEN 'demo-tenant-charlie-davis'
    WHEN 4 THEN 'demo-tenant-diana-wilson'
    WHEN 5 THEN 'demo-tenant-edward-brown'
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
    CASE 
      WHEN t.tenant_id = 'demo-tenant-alice-cooper' THEN 1
      WHEN t.tenant_id = 'demo-tenant-bob-martin' THEN 2
      WHEN t.tenant_id = 'demo-tenant-charlie-davis' THEN 3
      WHEN t.tenant_id = 'demo-tenant-diana-wilson' THEN 4
      WHEN t.tenant_id = 'demo-tenant-edward-brown' THEN 5
    END as rn
  FROM public.tenancies t
  WHERE t.tenant_id LIKE 'demo-tenant-%'
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