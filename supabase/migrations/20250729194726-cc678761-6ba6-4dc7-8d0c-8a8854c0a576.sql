-- Fix the trigger to make role nullable temporarily, create demo accounts, then fix it
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;

-- Now create demo accounts
DO $$
BEGIN
    -- Delete any existing demo accounts
    DELETE FROM public.profiles WHERE email IN ('tenant@demo.com', 'landlord@demo.com');
    DELETE FROM auth.users WHERE email IN ('tenant@demo.com', 'landlord@demo.com');
    
    -- Create demo users (trigger will create profiles without roles)
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud
    ) VALUES (
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000000',
        'tenant@demo.com',
        crypt('password123', gen_salt('bf')),
        now(), now(), now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Demo Tenant"}',
        false, 'authenticated', 'authenticated'
    ), (
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000000',
        'landlord@demo.com',
        crypt('password123', gen_salt('bf')),
        now(), now(), now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Demo Landlord"}',
        false, 'authenticated', 'authenticated'
    );
    
    -- Update profiles with roles
    UPDATE public.profiles SET role = 'tenant' 
    WHERE user_id = '11111111-1111-1111-1111-111111111111';
    
    UPDATE public.profiles SET role = 'landlord' 
    WHERE user_id = '22222222-2222-2222-2222-222222222222';
    
END $$;

-- Add NOT NULL constraint back
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;