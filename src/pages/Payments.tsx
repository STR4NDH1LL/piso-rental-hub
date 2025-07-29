import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Payments = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>View and manage your payments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payment management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;