import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";
import ProcessSection from "@/components/FeaturesSection";
import ValueProposition from "@/components/ValueProposition";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProductShowcase />
      <ProcessSection />
      <ValueProposition />
      <Footer />
    </div>
  );
};

export default Index;
