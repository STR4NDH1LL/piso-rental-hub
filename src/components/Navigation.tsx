import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="/lovable-uploads/7412162f-de95-47ed-9113-ff969ca9a62a.png" 
              alt="Piso Logo" 
              className="h-20 w-auto"
            />
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate("/features")}
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              About
            </button>
            <button 
              onClick={() => navigate("/contact")}
              className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Contact
            </button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 mr-2"
              onClick={() => navigate("/auth")}
            >
              Log In
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Login Button */}
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate("/auth")}
            >
              Log In
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={() => {
                  navigate("/features");
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium text-left"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  navigate("/about");
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium text-left"
              >
                About
              </button>
              <button 
                onClick={() => {
                  navigate("/contact");
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium text-left"
              >
                Contact
              </button>
              <Button 
                size="sm"
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
                className="w-fit"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;