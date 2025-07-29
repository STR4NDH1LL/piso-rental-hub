import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const Chat = () => {
  const [profile, setProfile] = useState<{ role: string; full_name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("user_id", user.id)
        .single();
      
      if (data) setProfile(data);
    };
    checkAuth();
  }, [navigate]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer border-l-4 border-l-primary bg-muted/50">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {profile.role === "tenant" ? "Sarah Johnson (Landlord)" : "Sarah Johnson (Tenant)"}
                  </h4>
                  <p className="text-sm text-muted-foreground">Thanks for the quick response...</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">2</Badge>
                  <p className="text-xs text-muted-foreground mt-1">2m ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {profile.role === "tenant" ? "Property Manager" : "John Smith (Tenant)"}
                  </h4>
                  <p className="text-sm text-muted-foreground">The maintenance request has been...</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">1h ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {profile.role === "tenant" ? "Maintenance Team" : "Michael Brown (Tenant)"}
                  </h4>
                  <p className="text-sm text-muted-foreground">Good morning! Just wanted to...</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">3h ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {profile.role === "tenant" ? "Sarah Johnson (Landlord)" : "Sarah Johnson (Tenant)"}
                </CardTitle>
                <CardDescription>
                  {profile.role === "tenant" ? "Victoria Street Property" : "Tenant at Victoria Street"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 p-4 space-y-4 max-h-[400px] overflow-y-auto">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-lg max-w-xs">
                <p className="text-sm">Hi! I wanted to follow up on the maintenance request I submitted yesterday.</p>
                <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                <p className="text-sm">Hello! I've received your request and have scheduled it for tomorrow morning. The contractor will be there between 9-11 AM.</p>
                <p className="text-xs opacity-80 mt-1">10:35 AM</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-lg max-w-xs">
                <p className="text-sm">Perfect! Thanks for the quick response. I'll make sure someone is available.</p>
                <p className="text-xs text-muted-foreground mt-1">10:38 AM</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                <p className="text-sm">Great! If you have any other questions, feel free to reach out.</p>
                <p className="text-xs opacity-80 mt-1">10:40 AM</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;