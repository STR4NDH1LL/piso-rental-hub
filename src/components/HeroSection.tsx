import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto container-padding text-center">
        <div className="animate-fade-in">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/db6ee567-84e4-4336-b96a-95855d76ff0f.png" 
              alt="Piso Logo" 
              className="h-16 w-auto"
            />
          </div>
          
          {/* Main headline */}
          <h1 className="text-hero mb-6 max-w-4xl mx-auto leading-tight">
            Simplify Your{" "}
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Rental Experience
            </span>{" "}
            with Piso
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Modern rental management for landlords and tenants — all in one place.
          </p>
          
          {/* CTA Button */}
          <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="hero" className="mb-4">
              Join the Waitlist
            </Button>
            <p className="text-sm text-muted-foreground">
              Be the first to experience effortless rental management
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;