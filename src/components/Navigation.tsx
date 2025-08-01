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
          
          {/* Desktop Navigation Links - Hidden for waitlist mode */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation removed for waitlist landing page */}
          </div>

          {/* Mobile Navigation - Hidden for waitlist mode */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Navigation removed for waitlist landing page */}
          </div>
        </div>

        {/* Mobile Menu Dropdown - Hidden for waitlist mode */}
      </div>
    </nav>
  );
};

export default Navigation;