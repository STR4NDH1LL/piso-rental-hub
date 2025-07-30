-- Create deposits table for simplified deposit management
CREATE TABLE public.deposits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  landlord_id uuid NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'paid', 'return_proposed', 'return_accepted', 'return_disputed', 'returned')),
  requested_at timestamp with time zone NOT NULL DEFAULT now(),
  paid_at timestamp with time zone,
  return_proposed_at timestamp with time zone,
  return_proposed_amount numeric,
  return_reason text,
  tenant_response text,
  tenant_responded_at timestamp with time zone,
  returned_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Create policies for deposits
CREATE POLICY "Users can view relevant deposits" 
ON public.deposits 
FOR SELECT 
USING ((tenant_id = auth.uid()) OR (landlord_id = auth.uid()));

CREATE POLICY "Landlords can create deposit requests" 
ON public.deposits 
FOR INSERT 
WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Users can update relevant deposits" 
ON public.deposits 
FOR UPDATE 
USING ((tenant_id = auth.uid()) OR (landlord_id = auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_deposits_updated_at
BEFORE UPDATE ON public.deposits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create some demo deposit data
INSERT INTO deposits (
  property_id,
  tenant_id,
  landlord_id,
  amount,
  status,
  requested_at,
  paid_at
) VALUES 
(
  (SELECT id FROM properties LIMIT 1),
  (SELECT user_id FROM profiles WHERE role = 'tenant' LIMIT 1),
  (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1),
  1200.00,
  'paid',
  now() - interval '30 days',
  now() - interval '25 days'
),
(
  (SELECT id FROM properties LIMIT 1 OFFSET 1),
  (SELECT user_id FROM profiles WHERE role = 'tenant' LIMIT 1),
  (SELECT user_id FROM profiles WHERE role = 'landlord' LIMIT 1),
  800.00,
  'requested',
  now() - interval '2 days',
  NULL
);