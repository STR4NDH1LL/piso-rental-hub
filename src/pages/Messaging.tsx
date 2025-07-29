import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Plus, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const Messaging = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Message Center</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
            <CardDescription>Recent messages with tenants</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer border-l-4 border-l-primary bg-muted/50">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Victoria Street • Thanks for the quick...</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">3</Badge>
                  <p className="text-xs text-muted-foreground mt-1">2m ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">John Smith</h4>
                  <p className="text-sm text-muted-foreground">Park Lane • I'll have the payment...</p>
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
                  <h4 className="font-medium">Michael Brown</h4>
                  <p className="text-sm text-muted-foreground">Royal Gardens • Good morning! Just...</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">3h ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Emma Wilson</h4>
                  <p className="text-sm text-muted-foreground">City Centre • The heating issue...</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">1</Badge>
                  <p className="text-xs text-muted-foreground mt-1">5h ago</p>
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
                <CardTitle>Sarah Johnson</CardTitle>
                <CardDescription>Tenant at Victoria Street</CardDescription>
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
                <p className="text-sm">Hi! I wanted to follow up on the maintenance request I submitted yesterday for the leaky faucet.</p>
                <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                <p className="text-sm">Hello Sarah! I've received your request and contacted our plumber. He'll be there tomorrow between 9-11 AM.</p>
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
                <p className="text-sm">Perfect! Thanks for arranging that so quickly. I'll make sure someone is home to let him in.</p>
                <p className="text-xs text-muted-foreground mt-1">10:38 AM</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                <p className="text-sm">Excellent! The plumber's name is Tom and he'll call 10 minutes before arriving. Please let me know if there are any issues.</p>
                <p className="text-xs opacity-80 mt-1">10:40 AM</p>
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
                <p className="text-sm">Will do! Thanks again for your help.</p>
                <p className="text-xs text-muted-foreground mt-1">10:42 AM</p>
              </div>
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input placeholder="Type your message to Sarah..." className="flex-1" />
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

export default Messaging;