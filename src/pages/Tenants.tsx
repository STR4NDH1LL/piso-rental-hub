import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Tenants = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tenants</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>View and manage your tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tenant management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tenants;