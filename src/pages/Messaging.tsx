import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Messaging = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messaging</h1>
      <Card>
        <CardHeader>
          <CardTitle>Message Center</CardTitle>
          <CardDescription>Send and receive messages</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Messaging features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messaging;