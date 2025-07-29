import { Button } from "@/components/ui/button";

const UseCasesSection = () => {
  const useCases = [
    {
      title: "Premium Apartment Complex",
      challenge: "A luxury apartment complex in Manhattan managing 200+ units faced recurring tenant communication issues and delayed maintenance responses, resulting in decreased tenant satisfaction and higher turnover rates.",
      solution: "Piso's AI-powered communication system and automated maintenance tracking reduced response times by 75% and improved tenant satisfaction scores by 40%.",
      result: "60% reduction in tenant turnover, saving $240,000 annually in leasing costs."
    },
    {
      title: "Multi-Property Portfolio",
      challenge: "A property management company overseeing 15 residential buildings struggled with manual rent collection, scattered communication channels, and inefficient maintenance coordination across properties.",
      solution: "Implemented Piso's unified platform for automated rent collection, centralized communication, and intelligent maintenance dispatching with real-time property insights.",
      result: "95% rent collection efficiency and 50% faster maintenance resolution times."
    },
    {
      title: "First-Time Landlords",
      challenge: "New property investors managing their first rental properties lacked experience in tenant screening, lease management, and legal compliance, leading to costly mistakes and stress.",
      solution: "Piso's guided workflows, automated compliance checks, and expert support system provided structure and confidence for new landlords.",
      result: "100% compliant leases and 3x faster property onboarding process."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Use Cases
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These use cases show how Piso tackles real rental management challenges, delivering rapid ROI through reduced costs, enhanced tenant satisfaction, and streamlined operations.
          </p>
          <div className="mt-8">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Evaluate your use case here
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          {useCases.map((useCase, index) => (
            <div 
              key={useCase.title}
              className="bg-gray-50 rounded-2xl p-8 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {useCase.title}
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Challenge</h4>
                  <p className="text-gray-600 text-sm">
                    {useCase.challenge}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Solution</h4>
                  <p className="text-gray-600 text-sm">
                    {useCase.solution}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Result</h4>
                  <p className="text-primary font-medium text-sm">
                    {useCase.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;