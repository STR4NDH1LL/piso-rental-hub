-- Add more demo tenant profiles for the landlord to manage
INSERT INTO profiles (user_id, email, full_name, role, phone) VALUES
('bbbbbbbb-1111-1111-1111-111111111111', 'sarah.johnson@demo.com', 'Sarah Johnson', 'tenant', '+44 7700 900123'),
('bbbbbbbb-2222-2222-2222-222222222222', 'john.smith@demo.com', 'John Smith', 'tenant', '+44 7700 900124'),
('bbbbbbbb-3333-3333-3333-333333333333', 'michael.brown@demo.com', 'Michael Brown', 'tenant', '+44 7700 900125'),
('bbbbbbbb-4444-4444-4444-444444444444', 'emma.wilson@demo.com', 'Emma Wilson', 'tenant', '+44 7700 900126'),
('bbbbbbbb-5555-5555-5555-555555555555', 'david.jones@demo.com', 'David Jones', 'tenant', '+44 7700 900127'),
('bbbbbbbb-6666-6666-6666-666666666666', 'lisa.davis@demo.com', 'Lisa Davis', 'tenant', '+44 7700 900128'),
('bbbbbbbb-7777-7777-7777-777777777777', 'james.miller@demo.com', 'James Miller', 'tenant', '+44 7700 900129'),
('bbbbbbbb-8888-8888-8888-888888888888', 'sophie.taylor@demo.com', 'Sophie Taylor', 'tenant', '+44 7700 900130'),
('bbbbbbbb-9999-9999-9999-999999999999', 'alex.anderson@demo.com', 'Alex Anderson', 'tenant', '+44 7700 900131'),
('bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'rachel.white@demo.com', 'Rachel White', 'tenant', '+44 7700 900132')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;