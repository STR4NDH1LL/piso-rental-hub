import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Properties = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      <Card>
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
          <CardDescription>View and manage your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Property management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Properties;