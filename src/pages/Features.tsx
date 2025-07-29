import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  CreditCard, 
  FileText, 
  MessageCircle, 
  Wrench, 
  Shield, 
  Smartphone, 
  BarChart3,
  Users,
  Calendar,
  Building2,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const tenantFeatures = [
    {
      icon: Home,
      title: "Property Management",
      description: "View all your rental properties, lease details, and important information in one place."
    },
    {
      icon: CreditCard,
      title: "Online Rent Payments",
      description: "Pay rent securely online with multiple payment options including card, bank transfer, and digital wallets."
    },
    {
      icon: Wrench,
      title: "Maintenance Requests",
      description: "Submit maintenance requests with photos, track progress, and communicate directly with your landlord."
    },
    {
      icon: FileText,
      title: "Digital Documents",
      description: "Access lease agreements, receipts, and other important documents anytime, anywhere."
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Chat directly with your landlord for quick questions and updates."
    },
    {
      icon: Calendar,
      title: "Rent Reminders",
      description: "Never miss a payment with automated reminders and due date notifications."
    }
  ];

  const landlordFeatures = [
    {
      icon: Building2,
      title: "Multi-Property Management",
      description: "Manage unlimited properties from a single dashboard with comprehensive property details."
    },
    {
      icon: Users,
      title: "Tenant Management",
      description: "Keep track of all tenants, their lease terms, contact information, and payment history."
    },
    {
      icon: BarChart3,
      title: "Financial Analytics",
      description: "Track rental income, expenses, and get detailed financial reports and insights."
    },
    {
      icon: Wrench,
      title: "Maintenance Tracking",
      description: "Manage maintenance requests, assign contractors, and track completion status."
    },
    {
      icon: FileText,
      title: "Document Builder",
      description: "Create professional lease agreements and contracts with our built-in document templates."
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Receive rent payments directly to your bank account with automatic receipt generation."
    }
  ];

  const sharedFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is protected with enterprise-grade security and encryption."
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Access Piso from any device - desktop, tablet, or mobile phone."
    },
    {
      icon: CheckCircle,
      title: "E-Signatures",
      description: "Sign documents digitally with legally binding electronic signatures."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Features That Work For You
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Whether you're a tenant or landlord, Piso provides all the tools you need 
              to manage your rental properties efficiently and professionally.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started Today
            </Button>
          </div>

          {/* Tenant Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Tenants</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to manage your rental experience
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenantFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Landlord Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Landlords</h2>
              <p className="text-lg text-muted-foreground">
                Powerful tools to streamline your property management
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landlordFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Shared Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Everyone</h2>
              <p className="text-lg text-muted-foreground">
                Core features that benefit all users
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {sharedFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of landlords and tenants who trust Piso to manage their rental properties. 
              Create your account today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;