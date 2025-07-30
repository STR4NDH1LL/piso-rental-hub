import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, User, Building, Phone, MessageSquare } from "lucide-react";

interface WaitlistDialogProps {
  trigger: React.ReactNode;
}

const WaitlistDialog = ({ trigger }: WaitlistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    company_name: "",
    phone: "",
    user_type: "",
    property_count: "",
    message: "",
    referral_source: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("waitlist_signups")
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          company_name: formData.company_name || null,
          phone: formData.phone || null,
          user_type: formData.user_type,
          property_count: formData.property_count ? parseInt(formData.property_count) : null,
          message: formData.message || null,
          referral_source: formData.referral_source || null,
        });

      if (error) {
        if (error.code === '23505') { // Unique violation (email already exists)
          toast({
            title: "Already on the waitlist!",
            description: "This email is already registered for our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the waitlist! 🎉",
          description: "We'll notify you as soon as Piso is ready for you.",
        });
        setFormData({
          full_name: "",
          email: "",
          company_name: "",
          phone: "",
          user_type: "",
          property_count: "",
          message: "",
          referral_source: "",
        });
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error submitting waitlist signup:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join the Waitlist</DialogTitle>
          <DialogDescription>
            Be the first to know when Piso launches. Get early access and exclusive updates.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            {/* User Type */}
            <div className="space-y-2">
              <Label htmlFor="user_type">I am a... *</Label>
              <Select value={formData.user_type} onValueChange={(value) => handleInputChange("user_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landlord">Landlord / Property Owner</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="both">Both Landlord & Tenant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company_name" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company / Organization (Optional)
              </Label>
              <Input
                id="company_name"
                type="text"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                placeholder="Property Management Co."
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Property Count */}
            {(formData.user_type === "landlord" || formData.user_type === "both") && (
              <div className="space-y-2">
                <Label htmlFor="property_count">Number of Properties</Label>
                <Select value={formData.property_count} onValueChange={(value) => handleInputChange("property_count", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 property</SelectItem>
                    <SelectItem value="2">2-5 properties</SelectItem>
                    <SelectItem value="6">6-10 properties</SelectItem>
                    <SelectItem value="11">11-25 properties</SelectItem>
                    <SelectItem value="26">26+ properties</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Referral Source */}
            <div className="space-y-2">
              <Label htmlFor="referral_source">How did you hear about us?</Label>
              <Select value={formData.referral_source} onValueChange={(value) => handleInputChange("referral_source", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="search">Google Search</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="referral">Friend/Colleague Referral</SelectItem>
                  <SelectItem value="advertising">Online Advertising</SelectItem>
                  <SelectItem value="property_management">Property Management Network</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tell us about your current challenges or what features you're most excited about..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !formData.full_name || !formData.email || !formData.user_type}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              "Join the Waitlist"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistDialog;