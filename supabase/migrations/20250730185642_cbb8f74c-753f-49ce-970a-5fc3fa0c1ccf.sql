-- Create waitlist signups table to capture potential user information
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('landlord', 'tenant', 'both')) NOT NULL,
  property_count INTEGER,
  message TEXT,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public signups)
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist_signups 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading own signup (optional, for confirmation)
CREATE POLICY "Users can view own waitlist signup" 
ON public.waitlist_signups 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_waitlist_signups_updated_at
BEFORE UPDATE ON public.waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();