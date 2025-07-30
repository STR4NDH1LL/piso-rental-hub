import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Building2, CreditCard, Users, Wrench, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import PropertyMap from "@/components/PropertyMap";

interface DashboardStats {
  totalProperties: number;
  occupiedProperties: number;
  totalTenants: number;
  monthlyIncome: number;
  pendingMaintenance: number;
  incomeChange: number;
}

interface Property {
  id: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  rent_currency: string;
  property_type: string;
  tenancies: Array<{
    tenant: {
      full_name: string;
    };
    status: string;
  }>;
}

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    occupiedProperties: 0,
    totalTenants: 0,
    monthlyIncome: 0,
    pendingMaintenance: 0,
    incomeChange: 0,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [urgentActions, setUrgentActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUrgentActionsExpanded, setIsUrgentActionsExpanded] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all properties for stats - simplified query
      const { data: allProperties, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .eq("landlord_id", user.id);

      if (propertiesError) {
        console.error("Properties error:", propertiesError);
        setLoading(false);
        return;
      }

      // Fetch tenancies separately
      const { data: tenancies, error: tenanciesError } = await supabase
        .from("tenancies")
        .select("*, profiles!tenancies_tenant_id_fkey(full_name)")
        .eq("landlord_id", user.id)
        .eq("status", "active");

      if (tenanciesError) {
        console.error("Tenancies error:", tenanciesError);
      }

      // Fetch previous month's tenancies for income comparison
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const { data: previousTenancies } = await supabase
        .from("tenancies")
        .select("rent_amount")
        .eq("landlord_id", user.id)
        .eq("status", "active")
        .lte("lease_start_date", lastMonth.toISOString().split('T')[0]);

      // Fetch maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from("maintenance_requests")
        .select("*, properties(name, address)")
        .eq("landlord_id", user.id)
        .eq("status", "pending");

      if (maintenanceError) {
        console.error("Maintenance error:", maintenanceError);
      }

      console.log("All maintenance data:", maintenanceData);
      console.log("Urgent maintenance:", maintenanceData?.filter(req => req.priority === 'urgent'));

      // Fetch overdue rent tenancies
      const { data: overdueRent, error: overdueError } = await supabase
        .from("tenancies")
        .select("*, profiles!tenancies_tenant_id_fkey(full_name), properties(name)")
        .eq("landlord_id", user.id)
        .eq("status", "active")
        .lt("rent_due_date", new Date().toISOString());

      if (overdueError) {
        console.error("Overdue rent error:", overdueError);
      }

      // Calculate stats safely
      const totalProperties = allProperties?.length || 0;
      const occupiedProperties = tenancies?.length || 0;
      const totalIncome = tenancies?.reduce((sum, tenancy) => sum + (tenancy.rent_amount || 0), 0) || 0;
      
      // Calculate income change from previous month
      const previousIncome = previousTenancies?.reduce((sum, tenancy) => sum + (tenancy.rent_amount || 0), 0) || 0;
      const incomeChange = previousIncome > 0 ? ((totalIncome - previousIncome) / previousIncome) * 100 : 0;

      setStats({
        totalProperties,
        occupiedProperties,
        totalTenants: occupiedProperties,
        monthlyIncome: totalIncome,
        pendingMaintenance: maintenanceData?.length || 0,
        incomeChange,
      });

      // Set urgent actions
      const actions = [];
      
      // Add overdue rent actions
      if (overdueRent?.length) {
        console.log("Overdue rent data:", overdueRent);
        overdueRent.forEach(tenancy => {
          if (tenancy.properties) {
            const daysDiff = Math.floor((new Date().getTime() - new Date(tenancy.rent_due_date).getTime()) / (1000 * 3600 * 24));
            const tenantName = tenancy.profiles?.full_name || 'Unknown Tenant';
            actions.push({
              type: 'overdue_rent',
              title: 'Overdue Rent',
              description: `${tenantName} - £${tenancy.rent_amount} (${daysDiff} days overdue)`,
              action: 'Contact',
              tenantId: tenancy.tenant_id,
              tenantName: tenantName,
              amount: tenancy.rent_amount,
              daysDiff,
              propertyName: tenancy.properties.name
            });
          }
        });
      }

      // Add urgent maintenance actions
      if (maintenanceData?.length) {
        maintenanceData.filter(req => req.priority === 'urgent' || req.priority === 'high').forEach(request => {
          if (request.properties) {
            actions.push({
              type: 'urgent_maintenance',
              title: `${request.priority === 'urgent' ? 'Urgent' : 'High Priority'} Maintenance`,
              description: `${request.title} at ${request.properties.name}`,
              action: 'View',
              maintenanceId: request.id,
              requestTitle: request.title,
              propertyName: request.properties.name
            });
          }
        });
      }

      setUrgentActions(actions);

      // Create properties for display with proper null checking
      const propertiesForDisplay = (allProperties || []).slice(0, 2).map(property => {
        const tenancy = tenancies?.find(t => t.property_id === property.id);
        return {
          ...property,
          tenancies: tenancy && tenancy.profiles ? [{
            tenant: {
              full_name: tenancy.profiles.full_name || 'Unknown Tenant'
            },
            status: tenancy.status
          }] : []
        };
      });

      setProperties(propertiesForDisplay);
      
      // Create simplified properties for map component
      const mapProperties = (allProperties || []).map(property => ({
        id: property.id,
        name: property.name,
        address: property.address,
        rent_amount: property.rent_amount,
        rent_currency: property.rent_currency,
        property_type: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
      }));
      setAllProperties(mapProperties);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUrgentAction = (action: any) => {
    if (action.type === 'overdue_rent') {
      // Navigate to tenants page and show contact info
      navigate('/tenants', { state: { highlightTenant: action.tenantId, showBalance: true } });
    } else if (action.type === 'urgent_maintenance') {
      // Navigate to maintenance page and open the specific ticket
      navigate('/maintenance', { state: { openTicket: action.maintenanceId } });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Properties</h3>
                <p className="text-2xl font-bold">{stats.totalProperties}</p>
                <p className="text-sm text-muted-foreground">{stats.totalProperties - stats.occupiedProperties} vacant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Tenants</h3>
                <p className="text-2xl font-bold">{stats.totalTenants}</p>
                <p className="text-sm text-muted-foreground">All active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Monthly Income</h3>
                <p className="text-2xl font-bold">£{stats.monthlyIncome.toLocaleString()}</p>
                <p className={`text-sm flex items-center ${
                  stats.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.incomeChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.incomeChange >= 0 ? '+' : ''}{stats.incomeChange.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Maintenance</h3>
                <p className="text-2xl font-bold">{stats.pendingMaintenance}</p>
                <p className="text-sm text-muted-foreground">Pending requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Map */}
      <div className="grid md:grid-cols-3 gap-6">
        <PropertyMap 
          properties={allProperties || []} 
          className="md:col-span-1" 
        />
        
        {/* Recent Activity & Alerts */}
        <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle>Urgent Actions</CardTitle>
                {urgentActions.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {urgentActions.length}
                  </Badge>
                )}
              </div>
              {urgentActions.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUrgentActionsExpanded(!isUrgentActionsExpanded)}
                  className="flex items-center gap-1"
                >
                  {isUrgentActionsExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show All ({urgentActions.length})
                    </>
                  )}
                </Button>
              )}
            </div>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {urgentActions.length > 0 ? (
              <ScrollArea className={isUrgentActionsExpanded ? "h-80" : "h-auto"}>
                <div className="space-y-4">
                  {(isUrgentActionsExpanded ? urgentActions : urgentActions.slice(0, 2)).map((action, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        action.type === 'overdue_rent' 
                          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                          : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${
                          action.type === 'overdue_rent' 
                            ? 'text-red-800 dark:text-red-200'
                            : 'text-amber-800 dark:text-amber-200'
                        }`}>
                          {action.title}
                        </p>
                        <p className={`text-sm truncate ${
                          action.type === 'overdue_rent' 
                            ? 'text-red-600 dark:text-red-300'
                            : 'text-amber-600 dark:text-amber-300'
                        }`}>
                          {action.description}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant={action.type === 'overdue_rent' ? "destructive" : "outline"}
                        onClick={() => handleUrgentAction(action)}
                        className="ml-3 flex-shrink-0"
                      >
                        {action.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No urgent actions at this time</p>
                <p className="text-xs mt-2">Demo data will appear when you have tenants with overdue rent or urgent maintenance requests</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Occupancy Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${stats.totalProperties > 0 ? (stats.occupiedProperties / stats.totalProperties) * 100 : 0}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold">{stats.totalProperties > 0 ? Math.round((stats.occupiedProperties / stats.totalProperties) * 100) : 0}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Collection</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">92%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Maintenance Response</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">88%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Overview
          </CardTitle>
          <CardDescription>Your most recent properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{property.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {property.address} • {property.bedrooms} bed, {property.bathrooms} bath
                    </p>
                    {property.tenancies.length > 0 ? (
                      <p className="text-sm">Tenant: {property.tenancies[0].tenant.full_name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Available</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£{property.rent_amount.toLocaleString()}/month</p>
                    <Badge variant={property.tenancies.length > 0 ? "default" : "secondary"}>
                      {property.tenancies.length > 0 ? "Occupied" : "Vacant"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No properties found
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button className="w-full" onClick={() => navigate("/properties")}>View All Properties</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandlordDashboard;