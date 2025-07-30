-- Create demo maintenance requests for existing tenancies
-- First, let's see if we have any existing tenancies to work with
INSERT INTO public.maintenance_requests (tenant_id, landlord_id, property_id, title, description, priority, status, created_at)
SELECT 
  t.tenant_id,
  t.landlord_id,
  t.property_id,
  'Demo: Broken Boiler - No Hot Water',
  'The boiler has completely stopped working. There has been no hot water for 3 days now. This is urgent as we cannot shower or wash dishes properly. Please arrange immediate repair.',
  'urgent',
  'pending',
  CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM public.tenancies t
WHERE t.status = 'active'
LIMIT 1

UNION ALL

SELECT 
  t.tenant_id,
  t.landlord_id,
  t.property_id,
  'Demo: Leaking Ceiling in Kitchen',
  'Water is dripping from the kitchen ceiling near the sink. It started yesterday and seems to be getting worse. There might be a leak from the flat above.',
  'urgent',
  'pending',
  CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM public.tenancies t
WHERE t.status = 'active'
LIMIT 1 OFFSET 1

UNION ALL

SELECT 
  t.tenant_id,
  t.landlord_id,
  t.property_id,
  'Demo: Faulty Electrical Socket',
  'The electrical socket in the main bedroom is not working. When I plug anything in, it trips the circuit breaker. This could be a safety hazard.',
  'high',
  'in_progress',
  CURRENT_TIMESTAMP - INTERVAL '3 days'
FROM public.tenancies t
WHERE t.status = 'active'
LIMIT 1

UNION ALL

SELECT 
  t.tenant_id,
  t.landlord_id,
  t.property_id,
  'Demo: Blocked Bathroom Drain',
  'The bathroom sink drain is completely blocked. Water takes forever to drain out and sometimes overflows. Tried basic drain cleaner but no luck.',
  'medium',
  'in_progress',
  CURRENT_TIMESTAMP - INTERVAL '5 days'
FROM public.tenancies t
WHERE t.status = 'active'
LIMIT 1;