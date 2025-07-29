import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About Piso
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing property management with modern technology and seamless user experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Piso, we believe property management should be simple, transparent, and efficient. 
                We're building the future of rental property management by connecting landlords and 
                tenants through innovative technology.
              </p>
              <p className="text-lg text-muted-foreground">
                Our platform eliminates the complexity and friction in traditional property management, 
                making it easier for everyone involved to focus on what matters most.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">Why Choose Piso?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Streamlined rent payments and receipts</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Digital document management and e-signatures</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Efficient maintenance request tracking</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Real-time communication between all parties</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Comprehensive analytics and reporting</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Built for the Modern World</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Piso is designed with modern tenants and landlords in mind. We understand that property 
              management needs to adapt to changing lifestyles, digital expectations, and the need for 
              transparency. That's why we've built a platform that works seamlessly across all devices 
              and provides real-time updates for every interaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;