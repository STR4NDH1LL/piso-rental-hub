import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, AlertCircle } from "lucide-react";

const Rent = () => {
  const [profile, setProfile] = useState<{ role: string } | null>(null);
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
      <h1 className="text-3xl font-bold mb-6">
        {profile.role === "tenant" ? "Upcoming Rent" : "Rent Management"}
      </h1>
      
      {profile.role === "tenant" ? (
        <div className="space-y-6">
          {/* Next Payment Due */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Next Payment Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-primary">£1,200</p>
                  <p className="text-muted-foreground">Due: March 1, 2024</p>
                  <Badge variant="outline" className="mt-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    5 days remaining
                  </Badge>
                </div>
                <Button size="lg">Pay Now</Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent rent payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">February 2024</p>
                      <p className="text-sm text-muted-foreground">Paid on Feb 1, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£1,200</p>
                    <Badge>Paid</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">January 2024</p>
                      <p className="text-sm text-muted-foreground">Paid on Jan 1, 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£1,200</p>
                    <Badge>Paid</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Rent Collection Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Collected This Month</h3>
                    <p className="text-2xl font-bold">£16,800</p>
                    <p className="text-sm text-green-600">92% collection rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Outstanding</h3>
                    <p className="text-2xl font-bold">£1,600</p>
                    <p className="text-sm text-muted-foreground">2 properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Expected This Month</h3>
                    <p className="text-2xl font-bold">£18,400</p>
                    <p className="text-sm text-muted-foreground">From 24 tenants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Overdue Payments
              </CardTitle>
              <CardDescription>Payments that require immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200">John Smith - Victoria Street</h4>
                    <p className="text-sm text-red-600 dark:text-red-300">3 days overdue • £1,200</p>
                  </div>
                  <Button variant="destructive" size="sm">Contact Tenant</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Rent;