import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, Calendar, DollarSign } from "lucide-react";

const Payments = () => {
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
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      
      <div className="space-y-6">
        {/* Payment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {profile.role === "tenant" ? "Total Paid" : "Total Received"}
                  </h3>
                  <p className="text-2xl font-bold">
                    {profile.role === "tenant" ? "£14,400" : "£184,800"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.role === "tenant" ? "This year" : "This year"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">This Month</h3>
                  <p className="text-2xl font-bold">
                    {profile.role === "tenant" ? "£1,200" : "£16,800"}
                  </p>
                  <p className="text-sm text-green-600">
                    {profile.role === "tenant" ? "On time" : "+8.2% vs last month"}
                  </p>
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
                  <h3 className="font-semibold">
                    {profile.role === "tenant" ? "Next Due" : "Expected"}
                  </h3>
                  <p className="text-2xl font-bold">
                    {profile.role === "tenant" ? "£1,200" : "£18,400"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.role === "tenant" ? "March 1" : "March 2024"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription>
              {profile.role === "tenant" 
                ? "Your payment transaction history" 
                : "Recent payment transactions from tenants"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {profile.role === "tenant" 
                        ? "Rent Payment - February 2024" 
                        : "Sarah Johnson - Victoria Street"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.role === "tenant" 
                        ? "Paid via Bank Transfer" 
                        : "February rent payment"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">£1,200</p>
                  <Badge>Completed</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {profile.role === "tenant" 
                        ? "Rent Payment - January 2024" 
                        : "John Smith - Oak Avenue"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.role === "tenant" 
                        ? "Paid via Bank Transfer" 
                        : "January rent payment"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {profile.role === "tenant" ? "£1,200" : "£950"}
                  </p>
                  <Badge>Completed</Badge>
                </div>
              </div>

              {profile.role === "landlord" && (
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded">
                      <CreditCard className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Michael Brown - Park Lane
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        February rent - 3 days overdue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£1,100</p>
                    <Badge variant="destructive">Overdue</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods (for tenants) */}
        {profile.role === "tenant" && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Lloyds Bank •••• 1234</p>
                    </div>
                  </div>
                  <Badge>Primary</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  + Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Payments;