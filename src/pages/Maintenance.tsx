import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, Clock, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import MaintenanceRequestDialog from "@/components/MaintenanceRequestDialog";
import MaintenanceTicketChat from "@/components/MaintenanceTicketChat";

const Maintenance = () => {
  const [profile, setProfile] = useState<{ role: string; user_id: string } | null>(null);
  const navigate = useNavigate();
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showTicketChat, setShowTicketChat] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role, user_id")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setProfile(data);
        await fetchTickets(user.id, data.role);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchTickets = async (userId: string, userRole: string) => {
    try {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select(`
          *,
          properties (name, address),
          profiles!maintenance_requests_tenant_id_fkey (full_name)
        `)
        .eq(userRole === 'tenant' ? 'tenant_id' : 'landlord_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Fetched tickets:', data);
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
        </div>
        {profile.role === "tenant" && (
          <Button onClick={() => setShowRequestDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Urgent</h3>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.priority === 'urgent').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Pending</h3>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'Pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">In Progress</h3>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'In Progress').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Completed</h3>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'Completed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>
              {profile.role === "tenant" 
                ? "Your current maintenance requests" 
                : "Maintenance requests requiring attention"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.filter(t => t.status !== 'Completed').map((ticket) => (
                <div key={ticket.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                  ticket.priority === 'urgent' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : ''
                }`}>
                  <div className="flex items-center gap-3">
                    {ticket.priority === 'urgent' ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : ticket.status === 'In Progress' ? (
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className={`font-medium ${ticket.priority === 'urgent' ? 'text-red-800 dark:text-red-200' : ''}`}>
                        {ticket.title}
                      </p>
                      <p className={`text-sm ${ticket.priority === 'urgent' ? 'text-red-600 dark:text-red-300' : 'text-muted-foreground'}`}>
                        {ticket.properties?.name} • Reported {new Date(ticket.created_at).toLocaleDateString()} • {ticket.priority} Priority
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      ticket.priority === 'urgent' ? 'destructive' : 
                      ticket.status === 'In Progress' ? 'default' : 'secondary'
                    }>
                      {ticket.status}
                    </Badge>
                    <Button 
                      size="sm"
                      variant={ticket.priority === 'urgent' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedTicket({
                          id: ticket.id,
                          title: ticket.title,
                          description: ticket.description,
                          property: ticket.properties?.name || 'Unknown Property',
                          status: ticket.status,
                          priority: ticket.priority,
                          reportedDate: new Date(ticket.created_at).toLocaleDateString(),
                          tenant: ticket.profiles?.full_name || 'Unknown Tenant'
                        });
                        setShowTicketChat(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              {tickets.filter(t => t.status !== 'Completed').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active maintenance requests
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Completed */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Completed</CardTitle>
            <CardDescription>Maintenance requests completed in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.filter(t => t.status === 'Completed').map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.properties?.name} • Completed {new Date(ticket.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Completed</Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setSelectedTicket({
                          id: ticket.id,
                          title: ticket.title,
                          description: ticket.description,
                          property: ticket.properties?.name || 'Unknown Property',
                          status: ticket.status,
                          priority: ticket.priority,
                          reportedDate: new Date(ticket.created_at).toLocaleDateString(),
                          tenant: ticket.profiles?.full_name || 'Unknown Tenant'
                        });
                        setShowTicketChat(true);
                      }}
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
              {tickets.filter(t => t.status === 'Completed').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No completed maintenance requests
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MaintenanceRequestDialog 
        open={showRequestDialog} 
        onOpenChange={setShowRequestDialog}
        onRequestCreated={async () => {
          if (profile?.user_id && profile?.role) {
            await fetchTickets(profile.user_id, profile.role);
          }
        }}
      />
      {selectedTicket && (
        <MaintenanceTicketChat 
          open={showTicketChat} 
          onOpenChange={setShowTicketChat}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};

export default Maintenance;