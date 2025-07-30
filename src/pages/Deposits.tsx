import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PoundSterling, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import RequestDepositDialog from '@/components/RequestDepositDialog';
import DepositReturnDialog from '@/components/DepositReturnDialog';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  role: 'tenant' | 'landlord';
  full_name: string;
}

interface Deposit {
  id: string;
  amount: number;
  currency: string;
  status: string;
  requested_at: string;
  paid_at: string | null;
  return_proposed_at: string | null;
  return_proposed_amount: number | null;
  return_reason: string | null;
  tenant_response: string | null;
  tenant_responded_at: string | null;
  returned_at: string | null;
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

const Deposits: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData as Profile);
      
      await fetchDeposits(user.id);
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeposits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select(`
          *,
          properties (
            name,
            address
          ),
          profiles!deposits_tenant_id_fkey (
            full_name,
            email
          )
        `)
        .or(`tenant_id.eq.${userId},landlord_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits((data as unknown as Deposit[]) || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deposits",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { label: 'Requested', variant: 'secondary' as const },
      paid: { label: 'Paid', variant: 'default' as const },
      return_proposed: { label: 'Return Proposed', variant: 'outline' as const },
      return_accepted: { label: 'Return Accepted', variant: 'default' as const },
      return_disputed: { label: 'Return Disputed', variant: 'destructive' as const },
      returned: { label: 'Returned', variant: 'default' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleTenantResponse = async (depositId: string, response: 'accept' | 'dispute') => {
    try {
      const newStatus = response === 'accept' ? 'return_accepted' : 'return_disputed';
      
      const { error } = await supabase
        .from('deposits')
        .update({
          status: newStatus,
          tenant_response: response,
          tenant_responded_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deposit return ${response}ed`,
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchDeposits(user.id);
      }
    } catch (error) {
      console.error('Error responding to deposit return:', error);
      toast({
        title: "Error",
        description: "Failed to respond to deposit return",
        variant: "destructive",
      });
    }
  };

  const markAsPaid = async (depositId: string) => {
    try {
      const { error } = await supabase
        .from('deposits')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deposit marked as paid",
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchDeposits(user.id);
      }
    } catch (error) {
      console.error('Error marking deposit as paid:', error);
      toast({
        title: "Error",
        description: "Failed to mark deposit as paid",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">No profile found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Deposits</h1>
        </div>

        {profile.role === 'landlord' && (
          <div className="mb-6">
            <RequestDepositDialog
              open={requestDialogOpen}
              onOpenChange={setRequestDialogOpen}
              onDepositRequested={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  await fetchDeposits(user.id);
                }
              }}
            />
          </div>
        )}

        <div className="grid gap-4">
          {deposits.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <PoundSterling className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No deposits found</h3>
                <p className="text-muted-foreground">
                  {profile.role === 'landlord' 
                    ? 'Start by requesting a deposit from your tenants'
                    : 'No deposit requests at this time'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            deposits.map((deposit) => (
              <Card key={deposit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{deposit.properties.name}</CardTitle>
                    {getStatusBadge(deposit.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{deposit.properties.address}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{deposit.currency}{deposit.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.role === 'landlord' ? 'From' : 'To'}: {deposit.profiles.full_name}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Requested: {new Date(deposit.requested_at).toLocaleDateString()}
                        </div>
                        {deposit.paid_at && (
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle className="h-3 w-3" />
                            Paid: {new Date(deposit.paid_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {deposit.status === 'return_proposed' && (
                      <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Return Proposal</h4>
                          <p className="text-sm mb-2">
                            <strong>Return Amount:</strong> {deposit.currency}{deposit.return_proposed_amount}
                          </p>
                          <p className="text-sm mb-3">
                            <strong>Reason:</strong> {deposit.return_reason}
                          </p>
                          
                          {profile.role === 'tenant' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleTenantResponse(deposit.id, 'accept')}
                                className="flex-1"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleTenantResponse(deposit.id, 'dispute')}
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Dispute
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex gap-2">
                      {profile.role === 'landlord' && deposit.status === 'requested' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsPaid(deposit.id)}
                        >
                          Mark as Paid
                        </Button>
                      )}
                      
                      {profile.role === 'landlord' && deposit.status === 'paid' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedDeposit(deposit);
                            setReturnDialogOpen(true);
                          }}
                        >
                          Propose Return
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <DepositReturnDialog
          open={returnDialogOpen}
          onOpenChange={setReturnDialogOpen}
          deposit={selectedDeposit}
          onReturnProposed={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await fetchDeposits(user.id);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Deposits;