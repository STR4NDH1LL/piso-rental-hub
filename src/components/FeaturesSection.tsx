import { CreditCard, MessageCircle, Wrench, FileText, Bell } from "lucide-react";

const ProcessSection = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Easy & Secure Payments",
      description: "Accept rent payments through Apple Pay, Visa, Mastercard, and Revolut with bank-level security."
    },
    {
      icon: MessageCircle,
      title: "In-App Communication", 
      description: "Stay connected with tenants and landlords through our built-in chat system for seamless communication."
    },
    {
      icon: Wrench,
      title: "Maintenance Requests",
      description: "Submit and track maintenance requests with photo uploads for faster resolution and better documentation."
    },
    {
      icon: FileText,
      title: "Digital Document Storage",
      description: "Store lease agreements and important documents securely in the cloud. Go completely paperless."
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Never miss important dates with intelligent reminders for rent, inspections, lease renewals, and more."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Rental management that just works. 
            <span className="block text-gray-600 text-xl mt-2 font-normal">
              Communication, payments, and maintenance—all sorted. 🎯
            </span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                  <feature.icon size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;