const ProcessSection = () => {
  const steps = [
    {
      title: "Monitor",
      description: "Our AI filters the noise - you get only critical alerts. When your property needs attention, you'll know instantly. No false alarms, no missed signals, just clarity when it matters."
    },
    {
      title: "Predict", 
      description: "Stop issues before they cost you. Our AI spots patterns human eyes can't see, turning potential problems into prevented losses. Perfect properties, protected profits."
    },
    {
      title: "Recover",
      description: "When incidents occur, our AI streamlines the entire process - from documentation to resolution - simplifying complex claims and getting you back to business faster."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="animate-fade-in mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Piso doesn't just monitor—it understands. Our contextual AI answers critical questions raw data can't. It anticipates risk, adapts to each property, and acts automatically—eliminating the need for constant oversight. The result: faster decisions, smarter management, and real impact.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 mt-16">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;