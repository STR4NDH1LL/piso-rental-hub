import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Link as LinkIcon, Copy } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
}

interface TenantInviteDialogProps {
  properties: Property[];
  onInviteSent: () => void;
}

const TenantInviteDialog = ({ properties, onInviteSent }: TenantInviteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [inviteMethod, setInviteMethod] = useState<"email" | "link">("email");
  const [generatedLink, setGeneratedLink] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    emails: "", // For bulk invites
  });
  const { toast } = useToast();

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const generateMagicLink = async () => {
    if (!selectedPropertyId) {
      toast({
        title: "Error",
        description: "Please select a property first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create invitation record
      const { data: invitation, error } = await supabase
        .from("tenant_invitations")
        .insert({
          landlord_id: user.id,
          property_id: selectedPropertyId,
          email: "magic-link-invite", // Placeholder for magic links
          invited_name: "Magic Link Invite",
        })
        .select()
        .single();

      if (error) throw error;

      // Generate the magic link
      const magicLink = `${window.location.origin}/join/${invitation.invitation_token}`;
      setGeneratedLink(magicLink);

      toast({
        title: "Success",
        description: "Magic link generated! You can now copy and share it.",
      });
    } catch (error) {
      console.error("Error generating magic link:", error);
      toast({
        title: "Error",
        description: "Failed to generate magic link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendEmailInvite = async () => {
    if (!selectedPropertyId || !formData.email) {
      toast({
        title: "Error",
        description: "Please select a property and enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create invitation record
      const { data: invitation, error } = await supabase
        .from("tenant_invitations")
        .insert({
          landlord_id: user.id,
          property_id: selectedPropertyId,
          email: formData.email,
          invited_name: formData.name || null,
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Call edge function to send email
      // For now, we'll show the invitation link
      const inviteLink = `${window.location.origin}/join/${invitation.invitation_token}`;
      
      toast({
        title: "Invitation Created",
        description: `Invitation created for ${formData.email}. Magic link: ${inviteLink}`,
      });

      // Reset form
      setFormData({ email: "", name: "", emails: "" });
      setOpen(false);
      onInviteSent();
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Tenants
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invite Tenants to Property</DialogTitle>
          <DialogDescription>
            Send invitations to tenants via email or generate a shareable magic link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Selection */}
          <div>
            <Label htmlFor="property">Select Property</Label>
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invitation Method Tabs */}
          <Tabs value={inviteMethod} onValueChange={(value) => setInviteMethod(value as "email" | "link")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Invite
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Magic Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Send Email Invitation</CardTitle>
                  <CardDescription>
                    Enter tenant details and we'll send them an invitation email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="tenant@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Tenant Name (Optional)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  {selectedProperty && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Preview invitation for:</p>
                      <p className="text-sm text-muted-foreground">{selectedProperty.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedProperty.address}</p>
                    </div>
                  )}

                  <Button 
                    onClick={sendEmailInvite} 
                    disabled={loading || !selectedPropertyId || !formData.email}
                    className="w-full"
                  >
                    {loading ? "Sending..." : "Send Invitation"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generate Magic Link</CardTitle>
                  <CardDescription>
                    Create a shareable link you can send via WhatsApp, SMS, or any other method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!generatedLink ? (
                    <Button 
                      onClick={generateMagicLink} 
                      disabled={loading || !selectedPropertyId}
                      className="w-full"
                    >
                      {loading ? "Generating..." : "Generate Magic Link"}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <Label className="text-sm font-medium">Shareable Link:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input 
                            value={generatedLink} 
                            readOnly 
                            className="text-xs"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(generatedLink)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-medium mb-2">Message template:</p>
                        <Textarea
                          value={`Hi! Your landlord invited you to join Piso to manage your tenancy at ${selectedProperty?.name}. Use this link to get started: ${generatedLink}

It only takes 2 minutes and keeps everything in one place — rent, repairs, and documents.`}
                          readOnly
                          className="text-xs"
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => copyToClipboard(`Hi! Your landlord invited you to join Piso to manage your tenancy at ${selectedProperty?.name}. Use this link to get started: ${generatedLink}\n\nIt only takes 2 minutes and keeps everything in one place — rent, repairs, and documents.`)}
                        >
                          Copy Message
                        </Button>
                      </div>

                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setGeneratedLink("");
                          setSelectedPropertyId("");
                        }}
                        className="w-full"
                      >
                        Generate Another Link
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantInviteDialog;