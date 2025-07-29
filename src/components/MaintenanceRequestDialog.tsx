import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Wrench, Upload, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MaintenanceRequestDialog = ({ open, onOpenChange }: MaintenanceRequestDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    property: ""
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Please select only image files",
        variant: "destructive"
      });
    }
    
    setPhotos(prev => [...prev, ...imageFiles].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const uploadPromises = photos.map(async (photo, index) => {
      const fileName = `${userId}/${Date.now()}-${index}-${photo.name}`;
      
      const { error } = await supabase.storage
        .from('maintenance-photos')
        .upload(fileName, photo);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('maintenance-photos')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let photoUrls: string[] = [];
      if (photos.length > 0) {
        photoUrls = await uploadPhotos(user.id);
      }

      // TODO: Create maintenance request in database
      console.log("Creating maintenance request:", {
        ...formData,
        photos: photoUrls,
        userId: user.id
      });

      toast({
        title: "Request submitted",
        description: "Your maintenance request has been submitted successfully"
      });

      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "",
        property: ""
      });
      setPhotos([]);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            New Maintenance Request
          </DialogTitle>
          <DialogDescription>Report a maintenance issue with your property</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Leaky faucet in kitchen"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setFormData({...formData, priority: value})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property">Property</Label>
              <Select onValueChange={(value) => setFormData({...formData, property: value})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="victoria-street">Flat 2A, Victoria Street</SelectItem>
                  <SelectItem value="oak-avenue">House 15, Oak Avenue</SelectItem>
                  <SelectItem value="royal-gardens">Apartment 4B, Royal Gardens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Please describe the issue in detail..."
              rows={4}
              required
            />
          </div>
          
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photos (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <div className="flex flex-col items-center gap-2">
                <Image className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Upload photos to help us understand the issue better
                </p>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Photos
                </Button>
                <p className="text-xs text-muted-foreground">Max 5 photos, up to 10MB each</p>
              </div>
            </div>
            
            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={uploading} className="flex-1">
              {uploading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceRequestDialog;