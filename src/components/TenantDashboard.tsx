import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, FileText, Home, MessageCircle, Wrench } from "lucide-react";

const TenantDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Next Rent Due</h3>
                <p className="text-2xl font-bold text-primary">£1,200</p>
                <p className="text-sm text-muted-foreground">Due in 5 days</p>
                <Button size="sm" className="mt-2">Pay Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Maintenance</h3>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Active requests</p>
                <Button size="sm" variant="outline" className="mt-2">View All</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Messages</h3>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Unread message</p>
                <Button size="sm" variant="outline" className="mt-2">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Current Properties
          </CardTitle>
          <CardDescription>Properties you're currently renting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Flat 2A, Victoria Street</h4>
                <p className="text-sm text-muted-foreground">London, SW1E 5ND</p>
                <p className="text-sm">Landlord: Sarah Johnson</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">£1,200/month</p>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Documents
          </CardTitle>
          <CardDescription>Your latest property documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tenancy Agreement</p>
                  <p className="text-sm text-muted-foreground">Uploaded 2 weeks ago</p>
                </div>
              </div>
              <Badge>Signed</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Property Inventory</p>
                  <p className="text-sm text-muted-foreground">Uploaded 1 month ago</p>
                </div>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Rent Payment Due</p>
                <p className="text-sm text-muted-foreground">March 1, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded">
                <Wrench className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Maintenance Inspection</p>
                <p className="text-sm text-muted-foreground">March 5, 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboard;