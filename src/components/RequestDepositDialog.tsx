import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  rent_amount: number;
}

interface Tenancy {
  id: string;
  tenant_id: string;
  property_id: string;
  profiles: {
    full_name: string;
    email: string;
  };
  properties: Property;
}

interface RequestDepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDepositRequested?: () => void;
}

const RequestDepositDialog: React.FC<RequestDepositDialogProps> = ({
  open,
  onOpenChange,
  onDepositRequested
}) => {
  const [loading, setLoading] = useState(false);
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [selectedTenancy, setSelectedTenancy] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('GBP');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchTenancies();
    }
  }, [open]);

  const fetchTenancies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tenancies')
        .select(`
          id,
          tenant_id,
          property_id,
          profiles!tenancies_tenant_id_fkey (
            full_name,
            email
          ),
          properties (
            id,
            name,
            address,
            rent_amount
          )
        `)
        .eq('landlord_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      setTenancies(data || []);
    } catch (error) {
      console.error('Error fetching tenancies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenancies",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenancy || !amount) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const tenancy = tenancies.find(t => t.id === selectedTenancy);
      if (!tenancy) throw new Error('Tenancy not found');

      const { error } = await supabase
        .from('deposits')
        .insert({
          property_id: tenancy.property_id,
          tenant_id: tenancy.tenant_id,
          landlord_id: user.id,
          amount: parseFloat(amount),
          currency,
          status: 'requested'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deposit request sent to tenant",
      });

      setSelectedTenancy('');
      setAmount('');
      setCurrency('GBP');
      onOpenChange(false);
      onDepositRequested?.();
    } catch (error) {
      console.error('Error requesting deposit:', error);
      toast({
        title: "Error",
        description: "Failed to request deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Request Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Deposit from Tenant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenancy">Select Property & Tenant</Label>
            <Select value={selectedTenancy} onValueChange={setSelectedTenancy}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property..." />
              </SelectTrigger>
              <SelectContent>
                {tenancies.map((tenancy) => (
                  <SelectItem key={tenancy.id} value={tenancy.id}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{tenancy.properties.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {tenancy.profiles.full_name} - £{tenancy.properties.rent_amount}/month
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3 space-y-2">
              <Label htmlFor="amount">Deposit Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTenancy && (
            <Card>
              <CardContent className="p-3">
                <div className="text-sm">
                  <div className="font-medium">
                    {tenancies.find(t => t.id === selectedTenancy)?.profiles.full_name}
                  </div>
                  <div className="text-muted-foreground">
                    {tenancies.find(t => t.id === selectedTenancy)?.profiles.email}
                  </div>
                  <div className="text-muted-foreground">
                    {tenancies.find(t => t.id === selectedTenancy)?.properties.address}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedTenancy || !amount}
              className="flex-1"
            >
              {loading ? 'Requesting...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDepositDialog;