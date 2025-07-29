-- Create storage bucket for maintenance request photos
INSERT INTO storage.buckets (id, name, public) VALUES ('maintenance-photos', 'maintenance-photos', true);

-- Create storage policies for maintenance photos
CREATE POLICY "Users can upload maintenance photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'maintenance-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view maintenance photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'maintenance-photos');

CREATE POLICY "Users can update their maintenance photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'maintenance-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their maintenance photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'maintenance-photos' AND auth.uid()::text = (storage.foldername(name))[1]);