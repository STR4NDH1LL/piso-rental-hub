import { MessageCircle, Shield, Clock, Users, BarChart3, Home } from "lucide-react";

const ProductShowcase = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Dashboard Preview
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need in one place
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your rental sidekick for landlord-tenant harmony! Streamlined communication, effortless payments, and property upkeep made easy. Manage like a boss, all from one snazzy spot. 🏠✨
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <Home className="w-5 h-5 mr-3 text-blue-600" />
                <span>Complete property portfolio overview</span>
              </div>
              <div className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 mr-3 text-green-600" />
                <span>Real-time analytics and financial tracking</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-purple-600" />
                <span>Streamlined tenant management</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MessageCircle className="w-5 h-5 mr-3 text-orange-600" />
                <span>Integrated communication tools</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Time saved per week</p>
                <p className="font-semibold text-gray-900">10+ hours</p>
              </div>
              <div>
                <p className="text-gray-500">Response time</p>
                <p className="font-semibold text-gray-900">2x faster</p>
              </div>
              <div>
                <p className="text-gray-500">Setup time</p>
                <p className="font-semibold text-gray-900">5 minutes</p>
              </div>
            </div>
          </div>
          
          {/* Dashboard Screenshot */}
          <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 shadow-xl">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/647d6e2c-428c-404c-9d44-598601a4f63a.png"
                  alt="Piso Dashboard Preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Dashboard badges */}
              <div className="flex justify-center mt-4 space-x-2">
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Live Data
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Real-time Updates
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