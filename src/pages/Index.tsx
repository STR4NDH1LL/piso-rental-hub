import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";
import ProcessSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/ValueProposition";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProductShowcase />
      <ProcessSection />
      <UseCasesSection />
      <Footer />
    </div>
  );
};

export default Index;
