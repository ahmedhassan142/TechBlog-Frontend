"use client"
import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { 
  FiArrowLeft, 
  FiUsers, 
  FiTarget, 
  FiHeart, 
  FiAward,
  FiBook,
  FiGlobe,
  FiTrendingUp,
  FiCode,
  FiMessageSquare
} from 'react-icons/fi';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & Editor",
      bio: "Tech enthusiast with 10+ years in content creation and digital marketing.",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      bio: "Full-stack developer passionate about modern web technologies and UX design.",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Emily Rodriguez",
      role: "Content Strategist",
      bio: "Creative writer specializing in technology trends and digital innovation.",
      image: "/api/placeholder/200/200"
    }
  ];

  const stats = [
    { icon: <FiBook className="w-6 h-6" />, number: "500+", label: "Articles Published" },
    { icon: <FiUsers className="w-6 h-6" />, number: "50K+", label: "Monthly Readers" },
    { icon: <FiGlobe className="w-6 h-6" />, number: "120+", label: "Countries Reached" },
    { icon: <FiHeart className="w-6 h-6" />, number: "95%", label: "Reader Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>About Us | Blog3D</title>
        <meta name="description" content="Learn about Blog3D - Our mission, team, and commitment to delivering quality content" />
      </Head>

      {/* Header */}
    
            
            {/* Back Button */}
          {/* <Link 
  href="/"
  className="flex items-center w-auto md:w-48 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-300 group border border-gray-600"
>
  <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
  Back to Home
</Link> */}
       

      {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-20 border-b border-gray-700">
        <div className="absolute top-6 left-4 sm:left-6 z-10">
          <Link 
            href="/"
            className="flex items-center w-12 md:w-14 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-300 group border border-gray-600 bg-gray-800/80 backdrop-blur-sm"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          
          </Link>
        </div>
        
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About Blog3D
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Empowering readers with cutting-edge technology insights, tutorials, and industry trends.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transform hover:-translate-y-1 transition-all duration-300 group border border-gray-600"
              >
                <div className="text-blue-400 mb-4 group-hover:text-blue-300 transition-colors duration-300 mx-auto">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Mission & Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're committed to delivering high-quality, accessible content that helps readers navigate the tech landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-700">
              <FiTarget className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
              <p className="text-gray-400 text-sm">
                To democratize technology knowledge and make complex concepts accessible to everyone.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-700">
              <FiHeart className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Our Values</h3>
              <p className="text-gray-400 text-sm">
                Quality, authenticity, and community. We believe in creating content that genuinely helps readers.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-700">
              <FiAward className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Our Promise</h3>
              <p className="text-gray-400 text-sm">
                To maintain the highest standards of accuracy and ethical reporting in all our content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Passionate individuals dedicated to bringing you the best technology content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-gray-700 p-6 rounded-lg text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group border border-gray-600"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 p-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                    <FiUsers className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-xs">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-8 transform hover:scale-102 transition-transform duration-300 border border-blue-500">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-blue-100 mb-6">
              Be part of our growing community of tech enthusiasts and lifelong learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="px-6 py-2 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Read Our Blog
              </Link>
              <Link
                href="/contact"
                className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}

// Footer Component
