import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, Eye, Edit, ArrowLeft } from "lucide-react";
import AddPropertyDialog from "@/components/AddPropertyDialog";
import PropertyDetailDialog from "@/components/PropertyDetailDialog";

const Properties = () => {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

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
                  <p className="text-2xl font-bold">12</p>
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
                  <p className="text-2xl font-bold">9</p>
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
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">£18,400</p>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Flat 2A, Victoria Street</h4>
                    <p className="text-sm text-muted-foreground">London, SW1E 5ND • 2 bed, 1 bath</p>
                    <p className="text-sm">Tenant: Sarah Johnson</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">£1,200/month</p>
                    <Badge>Occupied</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedProperty({
                          name: "Flat 2A, Victoria Street",
                          address: "London, SW1E 5ND",
                          rent: "£1,200/month",
                          status: "Occupied",
                          tenants: [
                            {
                              name: "Sarah Johnson",
                              email: "sarah.johnson@email.com",
                              phone: "+44 7700 900123",
                              leaseStart: "Jan 2023",
                              leaseEnd: "Jan 2025",
                              rentStatus: "Current"
                            }
                          ],
                          bedrooms: 2,
                          bathrooms: 1,
                          propertyType: "Flat",
                          monthlyIncome: "£1,200",
                          occupancyRate: "100%",
                          lastInspection: "Dec 2023",
                          nextInspection: "Mar 2024"
                        });
                        setShowDetailDialog(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">House 15, Oak Avenue</h4>
                    <p className="text-sm text-muted-foreground">Manchester, M1 2AB • 3 bed, 2 bath</p>
                    <p className="text-sm text-muted-foreground">Available for rent</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">£950/month</p>
                    <Badge variant="secondary">Vacant</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Apartment 4B, Royal Gardens</h4>
                    <p className="text-sm text-muted-foreground">Birmingham, B1 1AA • 1 bed, 1 bath</p>
                    <p className="text-sm">Tenant: Michael Brown</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">£800/month</p>
                    <Badge>Occupied</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddPropertyDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      {selectedProperty && (
        <PropertyDetailDialog 
          open={showDetailDialog} 
          onOpenChange={setShowDetailDialog}
          property={selectedProperty}
        />
      )}
    </div>
  );
};

export default Properties;