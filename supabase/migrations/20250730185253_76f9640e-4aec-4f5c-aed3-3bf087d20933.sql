-- Fix the RLS policy to allow trigger-based profile creation
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a policy that allows both user inserts and trigger inserts
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  -- Allow if user is inserting their own profile
  user_id = auth.uid() 
  OR 
  -- Allow if this is a trigger insertion (auth.uid() is null but user_id matches a real user)
  (auth.uid() IS NULL AND user_id IN (SELECT id FROM auth.users))
);

-- Also ensure the trigger function uses SECURITY DEFINER properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile directly since we're using SECURITY DEFINER
  INSERT INTO public.profiles (user_id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'tenant'),
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't prevent user creation
  RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;