import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Users, Mail, Phone, Building } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface WaitlistSignup {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  user_type: string;
  company_name?: string;
  property_count?: number;
  referral_source?: string;
  message?: string;
  created_at: string;
}

const Admin = () => {
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [filteredSignups, setFilteredSignups] = useState<WaitlistSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [referralFilter, setReferralFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchSignups();
  }, []);

  useEffect(() => {
    filterSignups();
  }, [signups, searchTerm, userTypeFilter, referralFilter]);

  const fetchSignups = async () => {
    try {
      const { data, error } = await supabase
        .from("waitlist_signups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setSignups(data || []);
    } catch (error) {
      console.error("Error fetching signups:", error);
      toast({
        title: "Error",
        description: "Failed to fetch waitlist signups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSignups = () => {
    let filtered = signups;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (signup) =>
          signup.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          signup.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // User type filter
    if (userTypeFilter !== "all") {
      filtered = filtered.filter((signup) => signup.user_type === userTypeFilter);
    }

    // Referral source filter
    if (referralFilter !== "all") {
      filtered = filtered.filter((signup) => signup.referral_source === referralFilter);
    }

    setFilteredSignups(filtered);
  };

  const exportData = () => {
    const csv = [
      ["Name", "Email", "Phone", "User Type", "Company", "Properties", "Referral Source", "Message", "Signed Up"],
      ...filteredSignups.map((signup) => [
        signup.full_name,
        signup.email,
        signup.phone || "",
        signup.user_type,
        signup.company_name || "",
        signup.property_count || "",
        signup.referral_source || "",
        signup.message || "",
        new Date(signup.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-signups-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Waitlist data exported successfully",
    });
  };

  const getStats = () => {
    const total = signups.length;
    const landlords = signups.filter((s) => s.user_type === "landlord").length;
    const tenants = signups.filter((s) => s.user_type === "tenant").length;
    const totalProperties = signups.reduce((sum, s) => sum + (s.property_count || 0), 0);

    return { total, landlords, tenants, totalProperties };
  };

  const stats = getStats();
  const uniqueReferralSources = [...new Set(signups.map((s) => s.referral_source).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading waitlist data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Waitlist Dashboard</h1>
            <p className="text-muted-foreground">Manage your waitlist signups</p>
          </div>
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Property Managers</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.landlords}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tenants}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search through waitlist signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="landlord">Property Manager</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={referralFilter} onValueChange={setReferralFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Referral Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueReferralSources.map((source) => (
                    <SelectItem key={source} value={source!}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Signups Table */}
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Signups ({filteredSignups.length})</CardTitle>
            <CardDescription>All waitlist signups with their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Signed Up</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSignups.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">{signup.full_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          {signup.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {signup.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            {signup.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={signup.user_type === "landlord" ? "default" : "secondary"}>
                          {signup.user_type === "landlord" ? "Property Manager" : "Tenant"}
                        </Badge>
                      </TableCell>
                      <TableCell>{signup.company_name || "-"}</TableCell>
                      <TableCell>{signup.property_count || "-"}</TableCell>
                      <TableCell>
                        {signup.referral_source && (
                          <Badge variant="outline">{signup.referral_source}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(signup.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;