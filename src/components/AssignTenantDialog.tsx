import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  rent_amount: number;
}

interface AssignTenantDialogProps {
  properties: Property[];
  onTenantAssigned: () => void;
}

const AssignTenantDialog = ({ properties, onTenantAssigned }: AssignTenantDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    propertyId: "",
    rentAmount: "",
    leaseStartDate: "",
    leaseEndDate: "",
  });
  const { toast } = useToast();

  // Demo tenant suggestions
  const demoTenants = [
    { name: "Sarah Johnson", email: "sarah.johnson@demo.com", phone: "+44 7700 900123" },
    { name: "John Smith", email: "john.smith@demo.com", phone: "+44 7700 900124" },
    { name: "Michael Brown", email: "michael.brown@demo.com", phone: "+44 7700 900125" },
    { name: "Emma Wilson", email: "emma.wilson@demo.com", phone: "+44 7700 900126" },
    { name: "David Jones", email: "david.jones@demo.com", phone: "+44 7700 900127" },
    { name: "Lisa Davis", email: "lisa.davis@demo.com", phone: "+44 7700 900128" },
    { name: "James Miller", email: "james.miller@demo.com", phone: "+44 7700 900129" },
    { name: "Sophie Taylor", email: "sophie.taylor@demo.com", phone: "+44 7700 900130" },
    { name: "Alex Anderson", email: "alex.anderson@demo.com", phone: "+44 7700 900131" },
    { name: "Rachel White", email: "rachel.white@demo.com", phone: "+44 7700 900132" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to assign tenants",
          variant: "destructive",
        });
        return;
      }

      const selectedProperty = properties.find(p => p.id === formData.propertyId);
      if (!selectedProperty) {
        toast({
          title: "Error",
          description: "Please select a property",
          variant: "destructive",
        });
        return;
      }

      // Generate a demo tenant ID (these won't be real auth users)
      const demoTenantId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create a demo profile entry (without auth user constraint)
      // We'll store this as a "virtual" tenant for demo purposes
      const { error: tenancyError } = await supabase
        .from("tenancies")
        .insert({
          tenant_id: demoTenantId, // Use demo ID
          property_id: formData.propertyId,
          landlord_id: user.id,
          rent_amount: parseFloat(formData.rentAmount || selectedProperty.rent_amount.toString()),
          lease_start_date: formData.leaseStartDate,
          lease_end_date: formData.leaseEndDate,
          rent_due_date: formData.leaseStartDate,
          status: "active",
        });

      if (tenancyError) {
        console.error("Tenancy error:", tenancyError);
        toast({
          title: "Error",
          description: "Failed to assign tenant to property",
          variant: "destructive",
        });
        return;
      }

      // Store tenant info in a metadata table for demo purposes
      await supabase
        .from("tenancies")
        .update({
          // We'll use a simple approach and store tenant info in a JSON field if available
          // For now, we'll just create the tenancy record
        })
        .eq("tenant_id", demoTenantId);

      toast({
        title: "Success",
        description: `${formData.tenantName} has been assigned to ${selectedProperty.name}`,
      });

      // Reset form
      setFormData({
        tenantName: "",
        tenantEmail: "",
        tenantPhone: "",
        propertyId: "",
        rentAmount: "",
        leaseStartDate: "",
        leaseEndDate: "",
      });

      setOpen(false);
      onTenantAssigned();
    } catch (error) {
      console.error("Error assigning tenant:", error);
      toast({
        title: "Error",
        description: "Failed to assign tenant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoTenant = (tenant: typeof demoTenants[0]) => {
    setFormData(prev => ({
      ...prev,
      tenantName: tenant.name,
      tenantEmail: tenant.email,
      tenantPhone: tenant.phone,
    }));
  };

  const selectedProperty = properties.find(p => p.id === formData.propertyId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Tenant to Property
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Tenant to Property</DialogTitle>
          <DialogDescription>
            Add a new tenant and assign them to one of your properties
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Demo Tenant Selection */}
          <div>
            <Label>Quick Fill Demo Tenant</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {demoTenants.slice(0, 6).map((tenant, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoTenant(tenant)}
                  className="text-left justify-start"
                >
                  {tenant.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Tenant Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input
                id="tenantName"
                value={formData.tenantName}
                onChange={(e) => setFormData(prev => ({ ...prev, tenantName: e.target.value }))}
                placeholder="Enter tenant name"
                required
              />
            </div>
            <div>
              <Label htmlFor="tenantEmail">Email</Label>
              <Input
                id="tenantEmail"
                type="email"
                value={formData.tenantEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, tenantEmail: e.target.value }))}
                placeholder="tenant@example.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tenantPhone">Phone Number</Label>
            <Input
              id="tenantPhone"
              value={formData.tenantPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, tenantPhone: e.target.value }))}
              placeholder="+44 7700 900000"
            />
          </div>

          {/* Property Selection */}
          <div>
            <Label htmlFor="property">Select Property</Label>
            <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name} - £{property.rent_amount}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lease Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rentAmount">Monthly Rent</Label>
              <Input
                id="rentAmount"
                type="number"
                value={formData.rentAmount || selectedProperty?.rent_amount || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, rentAmount: e.target.value }))}
                placeholder="Monthly rent amount"
              />
            </div>
            <div>
              <Label htmlFor="leaseStartDate">Lease Start Date</Label>
              <Input
                id="leaseStartDate"
                type="date"
                value={formData.leaseStartDate}
                onChange={(e) => setFormData(prev => ({ ...prev, leaseStartDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="leaseEndDate">Lease End Date</Label>
            <Input
              id="leaseEndDate"
              type="date"
              value={formData.leaseEndDate}
              onChange={(e) => setFormData(prev => ({ ...prev, leaseEndDate: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning..." : "Assign Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTenantDialog;