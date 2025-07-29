import { CreditCard, MessageCircle, Wrench, FileText, Bell, Shield } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Easy & Secure Payments",
    description: "Accept rent payments through Apple Pay, Visa, Mastercard, and Revolut with bank-level security.",
    color: "text-green-600"
  },
  {
    icon: MessageCircle,
    title: "In-App Communication",
    description: "Stay connected with tenants and landlords through our built-in chat system.",
    color: "text-blue-600"
  },
  {
    icon: Wrench,
    title: "Maintenance Requests",
    description: "Submit and track maintenance requests with photo uploads for faster resolution.",
    color: "text-orange-600"
  },
  {
    icon: FileText,
    title: "Digital Document Storage",
    description: "Store lease agreements and important documents securely in the cloud. Go paperless.",
    color: "text-purple-600"
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Never miss important dates with intelligent reminders for rent, inspections, and renewals.",
    color: "text-red-600"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Your data is protected with enterprise-grade security and full compliance standards.",
    color: "text-indigo-600"
  }
];

const FeaturesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto container-padding">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-h2 mb-4">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              modern rental management
            </span>
          </h2>
          <p className="text-large text-muted-foreground max-w-2xl mx-auto">
            Streamline your rental experience with our comprehensive suite of tools designed for both landlords and tenants.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group bg-gradient-card p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <div className={`inline-flex p-3 rounded-lg bg-muted ${feature.color}`}>
                  <feature.icon size={24} />
                </div>
              </div>
              <h3 className="text-h3 mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;