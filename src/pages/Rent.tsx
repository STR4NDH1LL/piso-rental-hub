import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Rent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Rent</h1>
      <Card>
        <CardHeader>
          <CardTitle>Rent Management</CardTitle>
          <CardDescription>View and manage your rent payments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Rent management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rent;