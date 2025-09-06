// components/Hero.tsx
import React from "react";
export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Exploring the Future of Technology
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            <span className="block">Decoding Tomorrow's</span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Technology Landscape</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
            Dive into quantum computing, AI innovations, fintech revolutions, and cutting-edge development practices shaping our digital future.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform transition duration-300 hover:-translate-y-1 shadow-lg">
              Explore Articles
            </button>
            <button className="px-8 py-3 text-base font-medium rounded-md text-blue-100 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/50 transform transition duration-300 hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-16 relative">
          <div className="absolute -inset-8">
            <div className="w-full h-full mx-auto opacity-30 blur-lg filter" style={{ background: "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)" }}></div>
          </div>
          
          <div className="relative bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-blue-900/30 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Quantum Computing</h3>
              <p className="mt-1 text-sm text-gray-400">Next-gen processing power</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">AI & Machine Learning</h3>
              <p className="mt-1 text-sm text-gray-400">Intelligent systems</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-green-900/30 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Fintech</h3>
              <p className="mt-1 text-sm text-gray-400">Financial technology</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-cyan-900/30 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Web & Mobile Dev</h3>
              <p className="mt-1 text-sm text-gray-400">Development insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}