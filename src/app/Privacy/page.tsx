"use client"
import Link from 'next/link';
import Head from 'next/head';
import { FiArrowLeft, FiShield, FiEye, FiDatabase, FiUser } from 'react-icons/fi';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Privacy Policy | Blog3D</title>
        <meta name="description" content="Blog3D Privacy Policy - Learn how we protect your data" />
      </Head>

      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FiShield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <Section title="Introduction" icon={<FiUser />}>
              <p>At Blog3D, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our website and services.</p>
            </Section>

            <Section title="Information We Collect" icon={<FiDatabase />}>
              <h3 className="text-white font-semibold mt-6 mb-3">Personal Information</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Name and contact information</li>
                <li>• Email address</li>
                <li>• Profile information</li>
                <li>• Communication preferences</li>
              </ul>

              <h3 className="text-white font-semibold mt-6 mb-3">Usage Data</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• IP address and browser type</li>
                <li>• Pages visited and time spent</li>
                <li>• Device information</li>
                <li>• Cookies and tracking technologies</li>
              </ul>
            </Section>

            <Section title="How We Use Your Information" icon={<FiEye />}>
              <ul className="text-gray-400 space-y-2">
                <li>• Provide and maintain our services</li>
                <li>• Improve user experience</li>
                <li>• Communicate with you</li>
                <li>• Analyze usage patterns</li>
                <li>• Prevent fraud and abuse</li>
              </ul>
            </Section>

            <Section title="Data Security">
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </Section>

            <Section title="Your Rights">
              <ul className="text-gray-400 space-y-2">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate information</li>
                <li>• Request deletion of your data</li>
                <li>• Object to data processing</li>
                <li>• Data portability</li>
              </ul>
            </Section>

            <Section title="Contact Us">
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="text-blue-400">privacy@blog3d.com</p>
            </Section>
          </div>
        </div>
      </div>

      
    </div>
  );
}

const Header = () => (
  <header className="bg-gray-800 shadow-lg border-b border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link href="/" className="flex items-center group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transform rotate-45 group-hover:rotate-90 transition-transform duration-300 flex items-center justify-center">
            <FiShield className="text-white text-lg transform -rotate-45" />
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

const Section = ({ title, icon, children }: any) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      {icon && <span className="text-blue-400 mr-2">{icon}</span>}
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);