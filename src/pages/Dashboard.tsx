import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TenantDashboard from "@/components/TenantDashboard";
import LandlordDashboard from "@/components/LandlordDashboard";

interface Profile {
  role: "tenant" | "landlord";
  full_name: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        if (!data.role) {
          navigate("/role-selection");
          return;
        }
        setProfile(data as Profile);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-background">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">
                  {profile.role === "tenant" ? "Tenant Dashboard" : "Landlord Dashboard"}
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {profile.full_name}
                </p>
              </div>
            </div>
          </header>
          
          {profile.role === "tenant" ? <TenantDashboard /> : <LandlordDashboard />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;