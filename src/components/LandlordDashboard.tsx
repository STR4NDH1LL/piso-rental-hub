import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Building2, CreditCard, Users, Wrench, TrendingUp, AlertTriangle } from "lucide-react";

const LandlordDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Properties</h3>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">3 vacant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Tenants</h3>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">All active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Monthly Income</h3>
                <p className="text-2xl font-bold">£18,400</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Maintenance</h3>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Pending requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Urgent Actions
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">Overdue Rent</p>
                  <p className="text-sm text-red-600 dark:text-red-300">John Smith - £1,200 (3 days overdue)</p>
                </div>
                <Button size="sm" variant="destructive">Contact</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">Urgent Maintenance</p>
                  <p className="text-sm text-amber-600 dark:text-amber-300">Heating issue at Victoria Street</p>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Occupancy Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">75%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Collection</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">92%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Maintenance Response</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">88%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Overview
          </CardTitle>
          <CardDescription>Your most recent properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Flat 2A, Victoria Street</h4>
                <p className="text-sm text-muted-foreground">London, SW1E 5ND • 2 bed, 1 bath</p>
                <p className="text-sm">Tenant: Sarah Johnson</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">£1,200/month</p>
                <Badge>Occupied</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">House 15, Oak Avenue</h4>
                <p className="text-sm text-muted-foreground">Manchester, M1 2AB • 3 bed, 2 bath</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">£950/month</p>
                <Badge variant="secondary">Vacant</Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button className="w-full">View All Properties</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandlordDashboard;