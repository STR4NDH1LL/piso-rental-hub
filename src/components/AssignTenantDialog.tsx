import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search } from "lucide-react";

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
  const [availableTenants, setAvailableTenants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [formData, setFormData] = useState({
    propertyId: "",
    rentAmount: "",
    leaseStartDate: "",
    leaseEndDate: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchAvailableTenants();
    }
  }, [open]);

  const fetchAvailableTenants = async () => {
    try {
      // Get all tenant profiles that are not currently assigned to active tenancies
      const { data: tenants, error } = await supabase
        .from("profiles")
        .select(`
          user_id,
          full_name,
          email,
          phone,
          tenancies!tenancies_tenant_id_fkey(status)
        `)
        .eq("role", "tenant");

      if (error) {
        console.error("Error fetching tenants:", error);
        return;
      }

      // Filter out tenants who already have active tenancies
      const availableTenants = tenants?.filter(tenant => 
        !tenant.tenancies?.some(tenancy => tenancy.status === 'active')
      ) || [];

      setAvailableTenants(availableTenants);
    } catch (error) {
      console.error("Error fetching available tenants:", error);
    }
  };

  const filteredTenants = availableTenants.filter(tenant =>
    tenant.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTenantId || !formData.propertyId || !formData.leaseStartDate || !formData.leaseEndDate) {
      toast({
        title: "Validation Error",
        description: "Please select a tenant, property, and provide lease dates",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to assign tenants",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const selectedProperty = properties.find(p => p.id === formData.propertyId);
      const selectedTenant = availableTenants.find(t => t.user_id === selectedTenantId);
      
      if (!selectedProperty || !selectedTenant) {
        toast({
          title: "Error",
          description: "Please select a valid tenant and property",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create the tenancy record
      const { error: tenancyError } = await supabase
        .from("tenancies")
        .insert({
          tenant_id: selectedTenantId,
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
          title: "Database Error",
          description: `Failed to create tenancy: ${tenancyError.message}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: `${selectedTenant.full_name} has been assigned to ${selectedProperty.name}`,
      });

      // Reset form
      setFormData({
        propertyId: "",
        rentAmount: "",
        leaseStartDate: "",
        leaseEndDate: "",
      });
      setSelectedTenantId("");
      setSearchTerm("");

      setOpen(false);
      onTenantAssigned();
      
    } catch (error) {
      console.error("Error assigning tenant:", error);
      toast({
        title: "Error",
        description: `Failed to assign tenant: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          {/* Tenant Search and Selection */}
          <div>
            <Label>Search and Select Tenant</Label>
            <div className="space-y-2 mt-2">
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              {searchTerm && (
                <div className="max-h-40 overflow-y-auto border rounded-lg">
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => (
                      <div
                        key={tenant.user_id}
                        className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted ${
                          selectedTenantId === tenant.user_id ? 'bg-muted' : ''
                        }`}
                        onClick={() => {
                          setSelectedTenantId(tenant.user_id);
                          setSearchTerm(tenant.full_name || '');
                        }}
                      >
                        <div className="font-medium">{tenant.full_name}</div>
                        <div className="text-sm text-muted-foreground">{tenant.email}</div>
                        {tenant.phone && (
                          <div className="text-sm text-muted-foreground">{tenant.phone}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      No available tenants found
                    </div>
                  )}
                </div>
              )}
              
              {!searchTerm && availableTenants.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No available tenants found. All tenants may already be assigned to properties.
                </div>
              )}
            </div>
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