-- Fix demo accounts by setting all required auth fields properly
DO $$
BEGIN
    -- Delete existing demo accounts completely
    DELETE FROM public.profiles WHERE email IN ('tenant@demo.com', 'landlord@demo.com');
    DELETE FROM auth.users WHERE email IN ('tenant@demo.com', 'landlord@demo.com');
    
    -- Create tenant user with all required fields
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        email_change_confirm_status,
        banned_until,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        last_sign_in_at
    ) VALUES (
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000000',
        'tenant@demo.com',
        crypt('password123', gen_salt('bf')),
        now(),
        0,
        NULL,
        '',
        NULL,
        '',
        NULL,
        '',
        '',
        NULL,
        NULL,
        '',
        '',
        NULL,
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Demo Tenant"}',
        false,
        'authenticated',
        'authenticated',
        NULL
    );
    
    -- Create landlord user with all required fields
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        email_change_confirm_status,
        banned_until,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        last_sign_in_at
    ) VALUES (
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000000',
        'landlord@demo.com',
        crypt('password123', gen_salt('bf')),
        now(),
        0,
        NULL,
        '',
        NULL,
        '',
        NULL,
        '',
        '',
        NULL,
        NULL,
        '',
        '',
        NULL,
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Demo Landlord"}',
        false,
        'authenticated',
        'authenticated',
        NULL
    );
    
    -- Update profiles created by trigger with proper roles
    UPDATE public.profiles SET role = 'tenant' 
    WHERE user_id = '11111111-1111-1111-1111-111111111111';
    
    UPDATE public.profiles SET role = 'landlord' 
    WHERE user_id = '22222222-2222-2222-2222-222222222222';
    
END $$;