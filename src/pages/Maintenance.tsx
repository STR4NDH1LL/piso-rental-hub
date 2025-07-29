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
  const [profile, setProfile] = useState<{ role: string } | null>(null);
  const navigate = useNavigate();
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showTicketChat, setShowTicketChat] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      if (data) setProfile(data);
    };
    checkAuth();
  }, [navigate]);

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
                  <p className="text-2xl font-bold">2</p>
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
                  <p className="text-2xl font-bold">5</p>
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
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">18</p>
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
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Heating System Failure</p>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Victoria Street • Reported 2 days ago • High Priority
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Urgent</Badge>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedTicket({
                        id: "ticket-001",
                        title: "Heating System Failure",
                        description: "The heating system in the property has completely stopped working. It's been cold for the past two days and we need urgent assistance.",
                        property: "Victoria Street",
                        status: "Urgent",
                        priority: "Urgent",
                        reportedDate: "2 days ago",
                        tenant: "Sarah Johnson"
                      });
                      setShowTicketChat(true);
                    }}
                  >
                    {profile?.role === "tenant" ? "View Details" : "View Details"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Leaky Faucet in Kitchen</p>
                    <p className="text-sm text-muted-foreground">
                      Victoria Street • Reported 1 week ago • Medium Priority
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>In Progress</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTicket({
                        id: "ticket-002", 
                        title: "Leaky Faucet in Kitchen",
                        description: "Kitchen faucet is dripping constantly, needs repair.",
                        property: "Victoria Street",
                        status: "In Progress", 
                        priority: "Medium",
                        reportedDate: "1 week ago",
                        tenant: "Sarah Johnson"
                      });
                      setShowTicketChat(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Window Lock Repair</p>
                    <p className="text-sm text-muted-foreground">
                      Oak Avenue • Reported 3 days ago • Low Priority
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Pending</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTicket({
                        id: "ticket-003",
                        title: "Window Lock Repair", 
                        description: "Window lock mechanism is broken and needs replacement.",
                        property: "Oak Avenue",
                        status: "Pending",
                        priority: "Low", 
                        reportedDate: "3 days ago",
                        tenant: "Michael Brown"
                      });
                      setShowTicketChat(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
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
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Dishwasher Repair</p>
                    <p className="text-sm text-muted-foreground">
                      Victoria Street • Completed 1 week ago
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
                        id: "ticket-004",
                        title: "Dishwasher Repair",
                        description: "Dishwasher was not draining properly, has been fixed.",
                        property: "Victoria Street", 
                        status: "Completed",
                        priority: "Medium",
                        reportedDate: "1 week ago",
                        tenant: "Sarah Johnson"
                      });
                      setShowTicketChat(true);
                    }}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MaintenanceRequestDialog open={showRequestDialog} onOpenChange={setShowRequestDialog} />
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