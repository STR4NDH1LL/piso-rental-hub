const ValueProposition = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Effortless, transparent, and{" "}
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              stress-free renting
            </span>{" "}
            for everyone
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We believe rental management should be simple and transparent. Piso eliminates the friction between landlords and tenants, creating a seamless experience that saves time, reduces stress, and builds better relationships. Whether you're managing multiple properties or renting your first apartment, our platform adapts to your needs.
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50%</div>
            <p className="text-gray-600">Less time on admin tasks</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-gray-600">Paperless transactions</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <p className="text-gray-600">Support & accessibility</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;