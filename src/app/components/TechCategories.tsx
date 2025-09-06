// components/TechCategories.tsx
export default function TechCategories() {
  const categories = [
    {
      id: 1,
      name: "Quantum Computing",
      description: "Explore the future of computation with quantum mechanics",
      icon: (
        <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0h15m0 0h-15" />
        </svg>
      ),
      gradient: "from-blue-600 to-blue-800",
      link: "/category/quantum-computing"
    },
    {
      id: 2,
      name: "AI in Healthcare",
      description: "How artificial intelligence is revolutionizing medicine",
      icon: (
        <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0h15m0 0h-15" />
        </svg>
      ),
      gradient: "from-purple-600 to-purple-800",
      link: "/category/ai-healthcare"
    },
    {
      id: 3,
      name: "Fintech Innovations",
      description: "The latest in financial technology and digital banking",
      icon: (
        <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0h15m0 0h-15" />
        </svg>
      ),
      gradient: "from-green-600 to-green-800",
      link: "/category/fintech"
    },
    {
      id: 4,
      name: "Web Development",
      description: "Modern frameworks, tools and best practices",
      icon: (
        <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0h15m0 0h-15" />
        </svg>
      ),
      gradient: "from-cyan-600 to-cyan-800",
      link: "/category/web-development"
    },
    {
      id: 5,
      name: "Mobile Applications",
      description: "iOS, Android and cross-platform development insights",
      icon: (
        <svg className="w-12 h-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0h15m0 0h-15" />
        </svg>
      ),
      gradient: "from-orange-600 to-orange-800",
      link: "/category/mobile-development"
    },
    {
      id: 6,
      name: "Machine Learning",
      description: "Algorithms, models and practical applications",
      icon: (
        <svg className="w-12 h-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0h15m0 0h-15" />
        </svg>
      ),
      gradient: "from-pink-600 to-pink-800",
      link: "/category/machine-learning"
    }
  ];

  return (
    <div className="py-16 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase">Technology Domains</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Explore Cutting-Edge Technology Fields
          </p>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-4">
            Dive deep into specialized technology domains that are shaping our future
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="transform transition duration-500 hover:scale-105">
              <div className={`bg-gradient-to-br ${category.gradient} rounded-xl overflow-hidden shadow-xl h-full`}>
                <div className="p-6 h-full flex flex-col">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white/10 text-white">
                      {category.icon}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white">{category.name}</h3>
                    <p className="mt-2 text-gray-200">{category.description}</p>
                  </div>
                  <div className="mt-6 flex-grow flex items-end">
                    <a href={category.link} className="text-sm font-medium text-white hover:text-blue-200">
                      Explore articles <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}