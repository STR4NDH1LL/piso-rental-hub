-- Create demo maintenance requests for existing tenancies
WITH demo_requests AS (
  SELECT 
    t.tenant_id,
    t.landlord_id,
    t.property_id,
    ROW_NUMBER() OVER (ORDER BY t.created_at) as rn
  FROM public.tenancies t
  WHERE t.status = 'active'
  LIMIT 4
)
INSERT INTO public.maintenance_requests (tenant_id, landlord_id, property_id, title, description, priority, status, created_at)
SELECT 
  tenant_id,
  landlord_id,
  property_id,
  CASE rn
    WHEN 1 THEN 'Demo: Broken Boiler - No Hot Water'
    WHEN 2 THEN 'Demo: Leaking Ceiling in Kitchen'
    WHEN 3 THEN 'Demo: Faulty Electrical Socket'
    WHEN 4 THEN 'Demo: Blocked Bathroom Drain'
  END as title,
  CASE rn
    WHEN 1 THEN 'The boiler has completely stopped working. There has been no hot water for 3 days now. This is urgent as we cannot shower or wash dishes properly. Please arrange immediate repair.'
    WHEN 2 THEN 'Water is dripping from the kitchen ceiling near the sink. It started yesterday and seems to be getting worse. There might be a leak from the flat above.'
    WHEN 3 THEN 'The electrical socket in the main bedroom is not working. When I plug anything in, it trips the circuit breaker. This could be a safety hazard.'
    WHEN 4 THEN 'The bathroom sink drain is completely blocked. Water takes forever to drain out and sometimes overflows. Tried basic drain cleaner but no luck.'
  END as description,
  CASE rn
    WHEN 1 THEN 'urgent'
    WHEN 2 THEN 'urgent'
    WHEN 3 THEN 'high'
    WHEN 4 THEN 'medium'
  END as priority,
  CASE rn
    WHEN 1 THEN 'pending'
    WHEN 2 THEN 'pending'
    WHEN 3 THEN 'in_progress'
    WHEN 4 THEN 'in_progress'
  END as status,
  CURRENT_TIMESTAMP - INTERVAL '1 day' * rn
FROM demo_requests;