import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Deposit {
  id: string;
  amount: number;
  currency: string;
  tenant_id: string;
  property_id: string;
  properties: {
    name: string;
    address: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

interface DepositReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deposit: Deposit | null;
  onReturnProposed?: () => void;
}

const DepositReturnDialog: React.FC<DepositReturnDialogProps> = ({
  open,
  onOpenChange,
  deposit,
  onReturnProposed
}) => {
  const [loading, setLoading] = useState(false);
  const [returnAmount, setReturnAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (deposit && open) {
      setReturnAmount(deposit.amount.toString());
      setReason('Full deposit return - property in good condition');
    }
  }, [deposit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deposit || !returnAmount) return;

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('deposits')
        .update({
          status: 'return_proposed',
          return_proposed_amount: parseFloat(returnAmount),
          return_reason: reason,
          return_proposed_at: new Date().toISOString()
        })
        .eq('id', deposit.id);

      if (updateError) throw updateError;

      // Send a message to the tenant
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const messageContent = `Deposit Return Proposal

Property: ${deposit.properties.name}
Original Deposit: ${deposit.currency}${deposit.amount}
Proposed Return: ${deposit.currency}${returnAmount}

Reason: ${reason}

Please review and respond to accept or dispute this proposal.`;

        await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            recipient_id: deposit.tenant_id,
            property_id: deposit.property_id,
            content: messageContent
          });
      }

      toast({
        title: "Success",
        description: "Deposit return proposal sent to tenant",
      });

      onOpenChange(false);
      onReturnProposed?.();
    } catch (error) {
      console.error('Error proposing deposit return:', error);
      toast({
        title: "Error",
        description: "Failed to propose deposit return",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!deposit) return null;

  const deductionAmount = deposit.amount - parseFloat(returnAmount || '0');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Propose Deposit Return</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div><strong>Property:</strong> {deposit.properties.name}</div>
              <div><strong>Tenant:</strong> {deposit.profiles.full_name}</div>
              <div><strong>Original Deposit:</strong> {deposit.currency}{deposit.amount}</div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="returnAmount">Return Amount ({deposit.currency})</Label>
            <Input
              id="returnAmount"
              type="number"
              step="0.01"
              min="0"
              max={deposit.amount}
              value={returnAmount}
              onChange={(e) => setReturnAmount(e.target.value)}
              placeholder="0.00"
              required
            />
            {deductionAmount > 0 && (
              <p className="text-sm text-muted-foreground">
                Deduction: {deposit.currency}{deductionAmount.toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Return Amount</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for the return amount..."
              rows={3}
              required
            />
          </div>

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
              disabled={loading || !returnAmount}
              className="flex-1"
            >
              {loading ? 'Sending...' : 'Send Proposal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositReturnDialog;