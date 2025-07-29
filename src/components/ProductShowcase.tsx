import { MessageCircle, Shield, Clock } from "lucide-react";

const ProductShowcase = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Optimal
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Modern Apartment Complex
            </h2>
            
            <p className="text-gray-600 mb-6">
              Downtown Portland → New Tenant 🏠
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <MessageCircle className="w-5 h-5 mr-3 text-blue-600" />
                <span>Seamless communication between tenant and landlord</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Shield className="w-5 h-5 mr-3 text-green-600" />
                <span>Secure payments processed automatically</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-orange-600" />
                <span>Maintenance requests resolved quickly</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Lease signed</p>
                <p className="font-semibold text-gray-900">3 minutes</p>
              </div>
              <div>
                <p className="text-gray-500">Time to process</p>
                <p className="font-semibold text-gray-900">Instant approval</p>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-gray-500 font-mono">
              PROP1234567
            </div>
          </div>
          
          {/* Visual */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
              <div className="aspect-video bg-white rounded-xl shadow-inner flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/c58431a2-da7d-48ab-b44d-15118e4b9c7f.png" 
                      alt="Piso" 
                      className="w-8 h-8"
                    />
                  </div>
                  <p className="text-gray-600 font-medium">Rental Dashboard Preview</p>
                  <p className="text-sm text-gray-500 mt-2">Complete property management in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;