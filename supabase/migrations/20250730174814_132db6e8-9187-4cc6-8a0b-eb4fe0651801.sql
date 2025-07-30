-- Create ID verification table
CREATE TABLE public.id_verifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'verified', 'rejected')),
  id_document_url text,
  selfie_url text,
  document_type text,
  verification_notes text,
  verified_at timestamp with time zone,
  rejected_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.id_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for ID verifications
CREATE POLICY "Users can view their own verification" 
ON public.id_verifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own verification" 
ON public.id_verifications 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own verification" 
ON public.id_verifications 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_id_verifications_updated_at
BEFORE UPDATE ON public.id_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for ID verification documents
INSERT INTO storage.buckets (id, name, public) VALUES ('id-verification', 'id-verification', false);

-- Create storage policies for ID verification
CREATE POLICY "Users can upload their own ID documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'id-verification' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own ID documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'id-verification' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own ID documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'id-verification' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ID documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'id-verification' AND auth.uid()::text = (storage.foldername(name))[1]);