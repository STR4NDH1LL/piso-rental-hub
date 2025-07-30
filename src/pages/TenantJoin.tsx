import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Home, CheckCircle, AlertCircle } from "lucide-react";

interface InvitationData {
  id: string;
  email: string;
  invited_name: string | null;
  status: string;
  expires_at: string;
  landlord_id: string;
  property_id: string;
  properties: {
    name: string;
    address: string;
  };
  profiles: {
    full_name: string;
  };
}

const TenantJoin = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from("tenant_invitations")
        .select(`
          *,
          properties (
            name,
            address
          ),
          profiles!tenant_invitations_landlord_id_fkey (
            full_name
          )
        `)
        .eq("invitation_token", token)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError("Invalid or expired invitation link");
        } else {
          throw error;
        }
        return;
      }

      // Check if invitation is expired
      if (new Date(data.expires_at) < new Date()) {
        setError("This invitation has expired");
        return;
      }

      // Check if already accepted
      if (data.status === 'accepted') {
        setError("This invitation has already been used");
        return;
      }

      setInvitation(data);
      // Pre-fill email if it's not a magic link invite
      if (data.email !== "magic-link-invite") {
        setFormData(prev => ({ ...prev, email: data.email }));
      }
    } catch (error) {
      console.error("Error fetching invitation:", error);
      setError("Failed to load invitation details");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitation) return;

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setSigningUp(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'tenant',
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Wait a moment for the auth process to complete and trigger to run
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create tenancy record
      const { error: tenancyError } = await supabase
        .from("tenancies")
        .insert({
          tenant_id: authData.user.id,
          landlord_id: invitation.landlord_id,
          property_id: invitation.property_id,
          rent_amount: 0, // Will be set by landlord
          lease_start_date: new Date().toISOString().split('T')[0],
          lease_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
          rent_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          status: "active",
        });

      if (tenancyError) throw tenancyError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from("tenant_invitations")
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);

      if (updateError) throw updateError;

      toast({
        title: "Welcome to Piso!",
        description: "Your account has been created successfully",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setSigningUp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>You're joining {invitation?.properties.name}</CardTitle>
          <CardDescription>
            {invitation?.profiles.full_name} invited you to manage your tenancy on Piso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-3 bg-muted rounded-lg">
            <p className="font-medium text-sm">{invitation?.properties.name}</p>
            <p className="text-xs text-muted-foreground">{invitation?.properties.address}</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Smith"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                required
                disabled={invitation?.email !== "magic-link-invite"}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+44 7700 900000"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                required
              />
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                By signing up, you'll have access to rent payments, maintenance requests, and important documents - all in one place.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={signingUp}>
              {signingUp ? "Creating Account..." : "Join Piso"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantJoin;