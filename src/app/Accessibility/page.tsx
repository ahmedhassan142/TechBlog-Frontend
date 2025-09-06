"use client"
import Link from 'next/link';
import Head from 'next/head';

import { FiArrowLeft,  FiAward, FiEye, FiHeadphones, FiMousePointer } from 'react-icons/fi';

// Section Component
const Section = ({ title, icon, children }: any) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      {icon && <span className="text-blue-400 mr-2">{icon}</span>}
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

// Feature Component
const Feature = ({ icon, title, children }: any) => (
  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
    <div className="flex items-center mb-2">
      <span className="text-blue-400 mr-2">{icon}</span>
      <h3 className="font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm">{children}</p>
  </div>
);

// Header Component
const Header = () => (
  <header className="bg-gray-800 shadow-lg border-b border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link href="/" className="flex items-center group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transform rotate-45 group-hover:rotate-90 transition-transform duration-300 flex items-center justify-center">
            <FiAward className="text-white text-lg transform -rotate-45" />
          </div>
          <span className="ml-2 text-xl font-bold text-white">Blog3D</span>
        </Link>
        
        <Link 
          href="/"
          className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-300 group border border-gray-600"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>
      </div>
    </div>
  </header>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-800 border-t border-gray-700 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transform rotate-45 mx-auto mb-4 hover:rotate-90 transition duration-300"></div>
      <h3 className="text-lg font-bold text-white mb-2">Blog3D</h3>
      <p className="text-gray-400 text-sm mb-4">Modern blogging platform for tech enthusiasts</p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="text-gray-400 hover:text-white transition duration-300">
          <FiAward className="w-5 h-5" />
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition duration-300">
          <FiEye className="w-5 h-5" />
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition duration-300">
          <FiMousePointer className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Accessibility Statement | Blog3D</title>
        <meta name="description" content="Blog3D Accessibility Statement - Committed to inclusive design" />
      </Head>

      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FiAward className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Accessibility Statement</h1>
          <p className="text-gray-400">We're committed to making Blog3D accessible to everyone</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            {/* Fixed: Use Section component instead of section element */}
            <Section title="Our Commitment" icon={<FiAward />}>
              <p>Blog3D is committed to ensuring digital accessibility for people with disabilities. We're continually improving the user experience for everyone and applying relevant accessibility standards.</p>
            </Section>

            <Section title="Accessibility Features" icon={<FiEye />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Feature icon={<FiMousePointer />} title="Keyboard Navigation">
                  Full keyboard support for all interactive elements
                </Feature>
                <Feature icon={<FiHeadphones />} title="Screen Reader Support">
                  Compatible with major screen readers
                </Feature>
                <Feature icon={<FiEye />} title="Text Resizing">
                  Support for browser text resizing up to 200%
                </Feature>
                <Feature icon={<FiAward />} title="Color Contrast">
                  Minimum contrast ratio of 4.5:1 for normal text
                </Feature>
              </div>
            </Section>

            <Section title="Standards Compliance">
              <p>We aim to meet WCAG 2.1 Level AA guidelines. Our website is designed to be accessible and usable by everyone, regardless of ability.</p>
            </Section>

            <Section title="Feedback">
              <p>We welcome your feedback on the accessibility of Blog3D. Please let us know if you encounter accessibility barriers:</p>
              <p className="text-blue-400 mt-2">accessibility@blog3d.com</p>
            </Section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}