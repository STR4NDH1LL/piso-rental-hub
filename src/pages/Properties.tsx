import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, Eye, Edit, ArrowLeft } from "lucide-react";
import AddPropertyDialog from "@/components/AddPropertyDialog";
import PropertyDetailDialog from "@/components/PropertyDetailDialog";
import { useToast } from "@/hooks/use-toast";

const Properties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      await fetchProperties();
    };
    checkAuth();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: properties, error } = await supabase
        .from("properties")
        .select(`
          *,
          tenancies (
            id,
            tenant_id,
            status,
            lease_start_date,
            lease_end_date,
            rent_amount,
            profiles!tenancies_tenant_id_fkey (
              full_name,
              email,
              phone
            )
          )
        `)
        .eq("landlord_id", user.id);

      if (error) throw error;
      setProperties(properties || []);
    } catch (error: any) {
      toast({
        title: "Error fetching properties",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold">Properties</h1>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Property Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Total Properties</h3>
                  <p className="text-2xl font-bold">{properties.length}</p>
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
                  <h3 className="font-semibold">Occupied</h3>
                  <p className="text-2xl font-bold">
                    {properties.filter(p => p.tenancies?.some((t: any) => t.status === 'active')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Vacant</h3>
                  <p className="text-2xl font-bold">
                    {properties.filter(p => !p.tenancies?.some((t: any) => t.status === 'active')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Monthly Income</h3>
                  <p className="text-2xl font-bold">
                    £{properties.reduce((total, p) => {
                      const activeTenancy = p.tenancies?.find((t: any) => t.status === 'active');
                      return total + (activeTenancy ? Number(activeTenancy.rent_amount) : 0);
                    }, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>Manage your property portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No properties found. Add your first property to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => {
                  const activeTenancy = property.tenancies?.find((t: any) => t.status === 'active');
                  const tenant = activeTenancy?.profiles;
                  
                  return (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{property.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {property.address} • {property.bedrooms} bed, {property.bathrooms} bath
                          </p>
                          {tenant ? (
                            <p className="text-sm">Tenant: {tenant.full_name}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Available for rent</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">£{property.rent_amount}/month</p>
                          <Badge variant={activeTenancy ? "default" : "secondary"}>
                            {activeTenancy ? "Occupied" : "Vacant"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedProperty({
                                id: property.id,
                                name: property.name,
                                address: property.address,
                                rent: `£${property.rent_amount}/month`,
                                status: activeTenancy ? "Occupied" : "Vacant",
                                tenants: property.tenancies?.filter((t: any) => t.status === 'active').map((t: any) => ({
                                  name: t.profiles?.full_name || 'Unknown',
                                  email: t.profiles?.email || 'No email',
                                  phone: t.profiles?.phone || 'No phone',
                                  leaseStart: new Date(t.lease_start_date).toLocaleDateString(),
                                  leaseEnd: new Date(t.lease_end_date).toLocaleDateString(),
                                  rentStatus: "Current"
                                })) || [],
                                bedrooms: property.bedrooms,
                                bathrooms: property.bathrooms,
                                propertyType: property.property_type,
                                monthlyIncome: `£${activeTenancy?.rent_amount || property.rent_amount}`,
                                occupancyRate: activeTenancy ? "100%" : "0%",
                                lastInspection: "Not recorded",
                                nextInspection: "Not scheduled"
                              });
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AddPropertyDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onPropertyAdded={fetchProperties}
      />
      {selectedProperty && (
        <PropertyDetailDialog 
          open={showDetailDialog} 
          onOpenChange={setShowDetailDialog}
          property={selectedProperty}
        />
      )}
      {selectedProperty && (
        <AddPropertyDialog 
          open={showEditDialog} 
          onOpenChange={setShowEditDialog}
          onPropertyAdded={fetchProperties}
          editProperty={selectedProperty}
        />
      )}
    </div>
  );
};

export default Properties;