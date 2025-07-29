import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/7412162f-de95-47ed-9113-ff969ca9a62a.png" 
              alt="Piso Logo" 
              className="h-20 w-auto"
            />
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
              Contact
            </a>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Log In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;