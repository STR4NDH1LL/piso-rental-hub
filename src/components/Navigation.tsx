import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/c58431a2-da7d-48ab-b44d-15118e4b9c7f.png" 
              alt="Piso Logo" 
              className="h-8 w-auto"
            />
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              About
            </a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Contact
            </a>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Log In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;