-- Check if demo accounts exist and create them properly
-- First check existing users
DO $$
BEGIN
    -- Delete any existing demo accounts to start fresh
    DELETE FROM public.profiles WHERE email IN ('tenant@demo.com', 'landlord@demo.com');
    DELETE FROM auth.users WHERE email IN ('tenant@demo.com', 'landlord@demo.com');
    
    -- Create tenant user
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
        '11111111-1111-1111-1111-111111111111',
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
    
    -- Create landlord user  
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
        '22222222-2222-2222-2222-222222222222',
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
    
    -- Wait a moment for any triggers to complete, then insert profiles with roles
    PERFORM pg_sleep(0.1);
    
    -- Update the profiles that were created by the trigger to have roles
    UPDATE public.profiles 
    SET role = 'tenant' 
    WHERE user_id = '11111111-1111-1111-1111-111111111111';
    
    UPDATE public.profiles 
    SET role = 'landlord' 
    WHERE user_id = '22222222-2222-2222-2222-222222222222';
    
    -- If profiles don't exist, create them
    INSERT INTO public.profiles (user_id, email, full_name, role) 
    VALUES ('11111111-1111-1111-1111-111111111111', 'tenant@demo.com', 'Demo Tenant', 'tenant')
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
    
    INSERT INTO public.profiles (user_id, email, full_name, role) 
    VALUES ('22222222-2222-2222-2222-222222222222', 'landlord@demo.com', 'Demo Landlord', 'landlord')
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
    
END $$;