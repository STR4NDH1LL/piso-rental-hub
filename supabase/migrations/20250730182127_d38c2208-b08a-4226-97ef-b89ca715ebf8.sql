-- Create demo tenancies using existing tenant profiles and properties
INSERT INTO public.tenancies (tenant_id, landlord_id, property_id, rent_amount, lease_start_date, lease_end_date, rent_due_date, status)
VALUES 
-- Assign Demo Tenant to Victoria Gardens Apartment with overdue rent
('11111111-1111-1111-1111-111111111111', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '38a4c1ba-b065-47ea-bbac-3a130a2a9c83', 2500.00, CURRENT_DATE - INTERVAL '8 months', CURRENT_DATE + INTERVAL '4 months', CURRENT_DATE - INTERVAL '15 days', 'active'),

-- Assign other tenant to Camden House with overdue rent
('367aee03-9fb7-4dc1-95bc-3cb4097430c7', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'ecf8ed05-3164-4245-b2fe-784a2a3ea9d3', 3200.00, CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE + INTERVAL '6 months', CURRENT_DATE - INTERVAL '8 days', 'active')
ON CONFLICT DO NOTHING;

-- Create demo maintenance requests
INSERT INTO public.maintenance_requests (tenant_id, landlord_id, property_id, title, description, priority, status, created_at)
VALUES 
-- Urgent maintenance for Demo Tenant
('11111111-1111-1111-1111-111111111111', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '38a4c1ba-b065-47ea-bbac-3a130a2a9c83', 'Broken Boiler - No Hot Water', 'The boiler has completely stopped working. There has been no hot water for 3 days now. This is urgent as we cannot shower or wash dishes properly. Please arrange immediate repair.', 'urgent', 'pending', CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Another urgent maintenance 
('367aee03-9fb7-4dc1-95bc-3cb4097430c7', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'ecf8ed05-3164-4245-b2fe-784a2a3ea9d3', 'Leaking Ceiling in Kitchen', 'Water is dripping from the kitchen ceiling near the sink. It started yesterday and seems to be getting worse. There might be a leak from the flat above.', 'urgent', 'pending', CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- Some regular maintenance requests
('11111111-1111-1111-1111-111111111111', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '38a4c1ba-b065-47ea-bbac-3a130a2a9c83', 'Faulty Light Switch', 'The main bedroom light switch is not working properly. Sometimes it doesn''t turn on the light.', 'medium', 'in_progress', CURRENT_TIMESTAMP - INTERVAL '3 days'),

('367aee03-9fb7-4dc1-95bc-3cb4097430c7', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'ecf8ed05-3164-4245-b2fe-784a2a3ea9d3', 'Blocked Bathroom Drain', 'The bathroom sink drain is completely blocked. Water takes forever to drain out.', 'high', 'completed', CURRENT_TIMESTAMP - INTERVAL '5 days')
ON CONFLICT DO NOTHING;