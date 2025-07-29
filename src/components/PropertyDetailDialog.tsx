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
    tenant?: string;
    bedrooms?: number;
    bathrooms?: number;
  };
}

const PropertyDetailDialog = ({ open, onOpenChange, property }: PropertyDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {property.name}
          </DialogTitle>
          <DialogDescription>Property details and information</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Address</span>
              </div>
              <p className="text-sm text-muted-foreground">{property.address}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Rent</span>
              </div>
              <p className="text-sm font-semibold">{property.rent}</p>
            </div>
            
            {property.bedrooms && (
              <div className="space-y-2">
                <span className="font-medium">Bedrooms</span>
                <p className="text-sm text-muted-foreground">{property.bedrooms}</p>
              </div>
            )}
            
            {property.bathrooms && (
              <div className="space-y-2">
                <span className="font-medium">Bathrooms</span>
                <p className="text-sm text-muted-foreground">{property.bathrooms}</p>
              </div>
            )}
          </div>
          
          {/* Status and Tenant */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Current Status</p>
                <p className="text-sm text-muted-foreground">
                  {property.tenant || "Available for rent"}
                </p>
              </div>
            </div>
            <Badge variant={property.status === "Occupied" ? "default" : "secondary"}>
              {property.status}
            </Badge>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">Edit Property</Button>
            <Button variant="outline" className="flex-1">Contact Tenant</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailDialog;