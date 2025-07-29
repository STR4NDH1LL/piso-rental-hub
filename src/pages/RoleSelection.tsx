import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Home, Building2 } from "lucide-react";

const RoleSelection = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelection = async (role: "tenant" | "landlord") => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Role selected!",
        description: `You're now set up as a ${role}.`,
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Navigation Header */}
      <nav className="w-full p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="/lovable-uploads/7412162f-de95-47ed-9113-ff969ca9a62a.png" 
              alt="Piso Logo" 
              className="h-16 w-auto"
            />
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Home
          </Button>
        </div>
      </nav>
      
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Choose Your Role</h1>
            <p className="text-xl text-muted-foreground">
              How will you be using Piso?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">I am a Tenant</CardTitle>
                <CardDescription className="text-base">
                  Looking for a place to rent or managing your current rental
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>• View your rental properties</li>
                  <li>• Pay rent online</li>
                  <li>• Submit maintenance requests</li>
                  <li>• Chat with your landlord</li>
                  <li>• Access lease documents</li>
                </ul>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleRoleSelection("tenant")}
                  disabled={loading}
                >
                  {loading ? "Setting up..." : "Continue as Tenant"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">I am a Landlord</CardTitle>
                <CardDescription className="text-base">
                  Managing rental properties and tenants
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>• Manage multiple properties</li>
                  <li>• Track rental payments</li>
                  <li>• Handle maintenance requests</li>
                  <li>• Communicate with tenants</li>
                  <li>• Generate lease agreements</li>
                </ul>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleRoleSelection("landlord")}
                  disabled={loading}
                >
                  {loading ? "Setting up..." : "Continue as Landlord"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;