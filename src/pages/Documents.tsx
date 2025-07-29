import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Documents = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>View and manage your property documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Document management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;