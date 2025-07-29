import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, MapPin, Calendar, DollarSign } from "lucide-react";

interface PropertyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: {
    name: string;
    address: string;
    rent: string;
    status: string;
    tenants?: Array<{
      name: string;
      email: string;
      phone: string;
      leaseStart: string;
      leaseEnd: string;
      rentStatus: string;
    }>;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    monthlyIncome: string;
    occupancyRate: string;
    lastInspection: string;
    nextInspection: string;
  };
}

const PropertyDetailDialog = ({ open, onOpenChange, property }: PropertyDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {property.name}
          </DialogTitle>
          <DialogDescription>Complete property overview and tenant information</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Property Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Monthly Rent:</span>
                    <p className="text-sm font-semibold">{property.rent}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {property.bedrooms && (
                    <div>
                      <span className="font-medium">Bedrooms:</span>
                      <p className="text-sm text-muted-foreground">{property.bedrooms}</p>
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div>
                      <span className="font-medium">Bathrooms:</span>
                      <p className="text-sm text-muted-foreground">{property.bathrooms}</p>
                    </div>
                  )}
                </div>
                
                {property.propertyType && (
                  <div>
                    <span className="font-medium">Property Type:</span>
                    <p className="text-sm text-muted-foreground">{property.propertyType}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Financial Overview</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <span className="font-medium">Monthly Income:</span>
                  <p className="text-lg font-semibold text-green-600">{property.monthlyIncome}</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <span className="font-medium">Occupancy Rate:</span>
                  <p className="text-lg font-semibold">{property.occupancyRate}</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <span className="font-medium">Status:</span>
                  <Badge variant={property.status === "Occupied" ? "default" : "secondary"} className="ml-2">
                    {property.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tenant Information */}
          {property.tenants && property.tenants.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Tenants ({property.tenants.length})
              </h3>
              <div className="space-y-3">
                {property.tenants.map((tenant, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="font-medium">Name:</span>
                        <p className="text-sm text-muted-foreground">{tenant.name}</p>
                        <span className="font-medium">Email:</span>
                        <p className="text-sm text-muted-foreground">{tenant.email}</p>
                      </div>
                      <div>
                        <span className="font-medium">Lease Period:</span>
                        <p className="text-sm text-muted-foreground">{tenant.leaseStart} - {tenant.leaseEnd}</p>
                        <span className="font-medium">Phone:</span>
                        <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant={tenant.rentStatus === "Current" ? "default" : "destructive"}>
                          {tenant.rentStatus}
                        </Badge>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">Contact</Button>
                          <Button size="sm" variant="ghost">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Property Management */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Property Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <span className="font-medium">Last Inspection:</span>
                <p className="text-sm text-muted-foreground">{property.lastInspection}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="font-medium">Next Inspection:</span>
                <p className="text-sm text-muted-foreground">{property.nextInspection}</p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button className="flex-1">Edit Property</Button>
            <Button variant="outline" className="flex-1">Schedule Inspection</Button>
            <Button variant="outline" className="flex-1">View Documents</Button>
            <Button variant="outline" className="flex-1">Financial Report</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailDialog;