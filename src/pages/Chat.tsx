import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Chat = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Chat with your landlord or tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chat features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;