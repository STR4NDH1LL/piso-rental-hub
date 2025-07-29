import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Maintenance = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Maintenance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
          <CardDescription>View and manage maintenance requests</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Maintenance management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;