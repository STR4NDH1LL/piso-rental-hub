import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle, RotateCcw, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Invitation {
  id: string;
  email: string;
  invited_name: string | null;
  status: 'pending' | 'accepted' | 'expired';
  invited_at: string;
  accepted_at: string | null;
  expires_at: string;
  invitation_token: string;
  properties: {
    name: string;
    address: string;
  };
}

const TenantInvitesList = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("tenant_invitations")
        .select(`
          *,
          properties (
            name,
            address
          )
        `)
        .eq("landlord_id", user.id)
        .order("invited_at", { ascending: false });

      if (error) throw error;
      setInvitations((data || []) as Invitation[]);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    try {
      // TODO: Implement resend logic
      toast({
        title: "Feature Coming Soon",
        description: "Resend functionality will be available soon",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      });
    }
  };

  const copyInviteLink = async (token: string) => {
    const link = `${window.location.origin}/join/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Copied!",
        description: "Invitation link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === 'accepted') {
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Joined
      </Badge>;
    }
    
    if (isExpired || status === 'expired') {
      return <Badge variant="destructive">
        <Clock className="h-3 w-3 mr-1" />
        Expired
      </Badge>;
    }
    
    return <Badge variant="secondary">
      <Clock className="h-3 w-3 mr-1" />
      Pending
    </Badge>;
  };

  if (loading) {
    return <div className="text-center py-4">Loading invitations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Invitations</CardTitle>
        <CardDescription>
          Track the status of your tenant invitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No invitations sent yet</p>
            <p className="text-sm">Start by inviting tenants to your properties</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      {invitation.invited_name || invitation.email}
                    </p>
                    {getStatusBadge(invitation.status, invitation.expires_at)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {invitation.properties.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Invited {formatDistanceToNow(new Date(invitation.invited_at), { addSuffix: true })}
                    {invitation.accepted_at && (
                      <span> • Joined {formatDistanceToNow(new Date(invitation.accepted_at), { addSuffix: true })}</span>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {invitation.status === 'pending' && new Date(invitation.expires_at) > new Date() && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyInviteLink(invitation.invitation_token)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resendInvitation(invitation.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Remind
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantInvitesList;