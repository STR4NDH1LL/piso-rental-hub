-- Create demo accounts with proper UUIDs
DO $$
DECLARE
    tenant_uuid UUID := gen_random_uuid();
    landlord_uuid UUID := gen_random_uuid();
    property_uuid UUID := gen_random_uuid();
    tenancy_uuid UUID := gen_random_uuid();
    maintenance_uuid UUID := gen_random_uuid();
BEGIN
    -- Insert demo tenant user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud
    ) VALUES (
        tenant_uuid,
        '00000000-0000-0000-0000-000000000000',
        'tenant@demo.com',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Demo Tenant"}',
        false,
        'authenticated',
        'authenticated'
    );

    -- Insert demo landlord user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud
    ) VALUES (
        landlord_uuid,
        '00000000-0000-0000-0000-000000000000',
        'landlord@demo.com',
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Demo Landlord"}',
        false,
        'authenticated',
        'authenticated'
    );

    -- Create demo profiles
    INSERT INTO public.profiles (user_id, email, full_name, role) VALUES 
    (tenant_uuid, 'tenant@demo.com', 'Demo Tenant', 'tenant'),
    (landlord_uuid, 'landlord@demo.com', 'Demo Landlord', 'landlord');

    -- Create demo property
    INSERT INTO public.properties (
        id,
        landlord_id,
        name,
        address,
        description,
        rent_amount,
        bedrooms,
        bathrooms,
        property_type
    ) VALUES (
        property_uuid,
        landlord_uuid,
        'Flat 2A, Victoria Street',
        'London, SW1E 5ND',
        'Modern 2-bedroom flat in central London with excellent transport links',
        1200.00,
        2,
        1,
        'Apartment'
    );

    -- Create demo tenancy
    INSERT INTO public.tenancies (
        id,
        tenant_id,
        property_id,
        landlord_id,
        rent_amount,
        rent_due_date,
        lease_start_date,
        lease_end_date,
        status
    ) VALUES (
        tenancy_uuid,
        tenant_uuid,
        property_uuid,
        landlord_uuid,
        1200.00,
        '2024-03-01',
        '2024-01-01',
        '2024-12-31',
        'active'
    );

    -- Create demo maintenance request
    INSERT INTO public.maintenance_requests (
        id,
        tenant_id,
        property_id,
        landlord_id,
        title,
        description,
        status,
        priority
    ) VALUES (
        maintenance_uuid,
        tenant_uuid,
        property_uuid,
        landlord_uuid,
        'Heating not working properly',
        'The central heating system is not heating the property adequately. Temperature is only reaching 15°C when set to 21°C.',
        'pending',
        'high'
    );
END $$;