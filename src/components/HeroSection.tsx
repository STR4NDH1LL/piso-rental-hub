import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBackground})`,
          filter: 'blur(1px)'
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        <div className="animate-fade-in">
          {/* Trust indicator */}
          <p className="text-sm md:text-base text-white/80 mb-8 font-medium tracking-wide">
            Trusted by property managers and tenants worldwide
          </p>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Built for the future of{" "}
            <span className="text-white">rental management.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
            Modern rental management platform for landlords and tenants — all in one place
          </p>
          
          {/* CTA Button */}
          <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 text-lg px-12 py-6 rounded-xl font-semibold shadow-2xl"
            >
              Join the Waitlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;