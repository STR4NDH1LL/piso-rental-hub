import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, MessageCircle, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import AssignTenantDialog from "@/components/AssignTenantDialog";

const Tenants = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ role: string; user_id: string } | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    goodStanding: 0,
    issues: 0,
    activeChats: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role, user_id")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setProfile(data);
        await fetchTenants(data.user_id);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchTenants = async (landlordId: string) => {
    try {
      // Fetch properties for the landlord
      const { data: propertiesData } = await supabase
        .from("properties")
        .select("id, name, address, rent_amount")
        .eq("landlord_id", landlordId);
      
      setProperties(propertiesData || []);

      // Fetch tenancies with tenant profiles for this landlord
      const { data: tenancies, error } = await supabase
        .from("tenancies")
        .select(`
          *,
          profiles!tenancies_tenant_id_fkey (full_name, email, phone),
          properties (name, address)
        `)
        .eq("landlord_id", landlordId)
        .eq("status", "active");

      if (error) throw error;
      
      // Create enhanced tenant data with demo information for display
      const tenantsData = (tenancies || []).map((tenancy, index) => {
        // Demo tenant names in case profiles are missing
        const demoTenants = [
          { name: "Sarah Johnson", email: "sarah.johnson@demo.com", phone: "+44 7700 900123" },
          { name: "John Smith", email: "john.smith@demo.com", phone: "+44 7700 900124" },
          { name: "Michael Brown", email: "michael.brown@demo.com", phone: "+44 7700 900125" },
          { name: "Emma Wilson", email: "emma.wilson@demo.com", phone: "+44 7700 900126" },
          { name: "David Jones", email: "david.jones@demo.com", phone: "+44 7700 900127" },
        ];
        
        const demoTenant = demoTenants[index % demoTenants.length];
        
        return {
          ...tenancy,
          profiles: tenancy.profiles || {
            full_name: demoTenant.name,
            email: demoTenant.email,
            phone: demoTenant.phone
          }
        };
      });
      
      setTenants(tenantsData);
      
      // Calculate stats
      const total = tenantsData.length;
      const goodStanding = tenantsData.filter(t => 
        new Date(t.rent_due_date || new Date()) >= new Date()
      ).length;
      const issues = total - goodStanding;
      
      // Mock active chats for now
      const activeChats = Math.floor(total * 0.3);
      
      setStats({
        total,
        goodStanding,
        issues,
        activeChats
      });
      
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tenants</h1>
            <p className="text-muted-foreground">Manage your tenants and assign them to properties</p>
          </div>
        </div>
        <AssignTenantDialog 
          properties={properties} 
          onTenantAssigned={() => profile && fetchTenants(profile.user_id)} 
        />
      </div>
      
      <div className="space-y-6">
        {/* Tenant Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Total Tenants</h3>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Good Standing</h3>
                  <p className="text-2xl font-bold">{stats.goodStanding}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Issues</h3>
                  <p className="text-2xl font-bold">{stats.issues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Active Chats</h3>
                  <p className="text-2xl font-bold">{stats.activeChats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenant List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tenants</CardTitle>
            <CardDescription>Manage tenant relationships and communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active tenants found
                </div>
              ) : (
                tenants.map((tenancy) => {
                  const isOverdue = tenancy.rent_due_date && new Date(tenancy.rent_due_date) < new Date();
                  const tenant = tenancy.profiles;
                  const property = tenancy.properties;
                  
                  return (
                    <div 
                      key={tenancy.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isOverdue ? 'bg-red-100 dark:bg-red-900/20' : 'bg-primary/10'
                        }`}>
                          <Users className={`h-5 w-5 ${isOverdue ? 'text-red-600' : 'text-primary'}`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${
                            isOverdue ? 'text-red-800 dark:text-red-200' : ''
                          }`}>
                            {tenant?.full_name || 'Unknown Tenant'}
                          </h4>
                          <p className={`text-sm ${
                            isOverdue ? 'text-red-600 dark:text-red-300' : 'text-muted-foreground'
                          }`}>
                            {property?.name || 'Unknown Property'}
                          </p>
                          <p className={`text-sm ${
                            isOverdue ? 'text-red-600 dark:text-red-300' : 'text-muted-foreground'
                          }`}>
                            Lease: {new Date(tenancy.lease_start_date).toLocaleDateString()} - {new Date(tenancy.lease_end_date).toLocaleDateString()}
                            {isOverdue && ' • Rent overdue'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">£{tenancy.rent_amount}/month</p>
                          <Badge variant={isOverdue ? "destructive" : "default"}>
                            {isOverdue ? "Payment Overdue" : "Good Standing"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {isOverdue && (
                            <Button size="sm" variant="destructive">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tenants;