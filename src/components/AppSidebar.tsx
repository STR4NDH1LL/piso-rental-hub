import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Calendar,
  FileText,
  Wrench,
  MessageCircle,
  CreditCard,
  Building2,
  Users,
  BarChart3,
  Wallet,
  PoundSterling,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  role: "tenant" | "landlord";
  full_name: string;
}

const AppSidebar = () => {
  const sidebar = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const currentPath = location.pathname;

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("user_id", user.id)
          .single();
        
        if (data) setProfile(data as Profile);
      }
    };

    getProfile();
  }, []);

  const tenantItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Upcoming Rent", url: "/rent", icon: Calendar },
    { title: "Documents", url: "/documents", icon: FileText },
    { title: "Maintenance", url: "/maintenance", icon: Wrench },
    { title: "Deposits", url: "/deposits", icon: PoundSterling },
    { title: "Verification", url: "/verification", icon: Shield },
    { title: "Chat", url: "/chat", icon: MessageCircle },
    { title: "Payments", url: "/payments", icon: CreditCard },
  ];

  const landlordItems = [
    { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
    { title: "Properties", url: "/properties", icon: Building2 },
    { title: "Tenants", url: "/tenants", icon: Users },
    { title: "Calendar", url: "/calendar", icon: Calendar },
    { title: "Documents", url: "/documents", icon: FileText },
    { title: "Payments", url: "/payments", icon: Wallet },
    { title: "Deposits", url: "/deposits", icon: PoundSterling },
    { title: "Verification", url: "/verification", icon: Shield },
    { title: "Maintenance", url: "/maintenance", icon: Wrench },
    { title: "Messaging", url: "/messaging", icon: MessageCircle },
  ];

  const items = profile?.role === "tenant" ? tenantItems : landlordItems;
  
  const isActive = (path: string) => currentPath === path;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!profile) return null;

  return (
    <Sidebar className="w-60" collapsible="icon">
      {/* Logo Section */}
      <div className="p-4 border-b">
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img 
            src="/lovable-uploads/7412162f-de95-47ed-9113-ff969ca9a62a.png" 
            alt="Piso Logo" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {profile.role === "tenant" ? "Tenant Portal" : "Landlord Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={isActive(item.url) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}
                  >
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <div className="mb-2 text-sm text-muted-foreground">
            {profile.full_name}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;