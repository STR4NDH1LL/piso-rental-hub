-- Create demo maintenance requests for the landlord account
INSERT INTO maintenance_requests (
  id,
  title,
  description,
  priority,
  status,
  tenant_id,
  property_id,
  landlord_id,
  created_at,
  updated_at
) VALUES 
-- Demo maintenance requests
(
  gen_random_uuid(),
  'Leaking Faucet in Kitchen',
  'The kitchen faucet has been dripping constantly for the past few days. Water is pooling under the sink.',
  'medium',
  'pending',
  (SELECT user_id FROM profiles WHERE role = 'tenant' LIMIT 1),
  (SELECT id FROM properties LIMIT 1),
  (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1),
  now() - interval '2 days',
  now() - interval '2 days'
),
(
  gen_random_uuid(),
  'Broken Window Lock',
  'The lock on the bedroom window is broken and won''t close properly. This is a security concern.',
  'high',
  'in_progress',
  (SELECT user_id FROM profiles WHERE role = 'tenant' LIMIT 1),
  (SELECT id FROM properties LIMIT 1 OFFSET 1),
  (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1),
  now() - interval '5 days',
  now() - interval '1 day'
),
(
  gen_random_uuid(),
  'Heating Not Working',
  'The central heating system is not working. The house is very cold.',
  'urgent',
  'pending',
  (SELECT user_id FROM profiles WHERE role = 'tenant' LIMIT 1),
  (SELECT id FROM properties LIMIT 1 OFFSET 2),
  (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1),
  now() - interval '1 day',
  now() - interval '1 day'
),
(
  gen_random_uuid(),
  'Clogged Drain',
  'The bathroom sink drain is completely blocked. Water is not draining at all.',
  'medium',
  'completed',
  (SELECT user_id FROM profiles WHERE role = 'tenant' LIMIT 1),
  (SELECT id FROM properties LIMIT 1),
  (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1),
  now() - interval '10 days',
  now() - interval '3 days'
),
(
  gen_random_uuid(),
  'Flickering Light Fixture',
  'The light fixture in the living room keeps flickering on and off.',
  'low',
  'pending',
  (SELECT user_id FROM profiles WHERE role = 'tenant' LIMIT 1),
  (SELECT id FROM properties LIMIT 1 OFFSET 1),
  (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1),
  now() - interval '1 hour',
  now() - interval '1 hour'
);