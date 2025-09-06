"use client"
import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { FiArrowLeft, FiFileText, FiCopy, FiDownload, FiCode } from 'react-icons/fi';// Add this Section component
const Section = ({ title, icon, children }: any) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      {icon && <span className="text-blue-400 mr-2">{icon}</span>}
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

export default function LicensingFAQ() {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const faqs = [
    {
      question: "Can I use your content for my project?",
      answer: "Most of our content is available under Creative Commons licenses. Please check individual articles for specific licensing information."
    },
    {
      question: "How do I attribute content properly?",
      answer: "Attribution should include the author's name, article title, and a link back to the original content on Blog3D."
    },
    {
      question: "Can I modify your content?",
      answer: "This depends on the specific license. Some content allows modifications, while others require keeping the content intact."
    },
    {
      question: "Do you offer commercial licenses?",
      answer: "Yes, we offer commercial licensing options for businesses and organizations. Contact us for more information."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Licensing & FAQ | Blog3D</title>
        <meta name="description" content="Blog3D Licensing Information and Frequently Asked Questions" />
      </Head>

     

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FiFileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Licensing & FAQ</h1>
          <p className="text-gray-400">Information about content usage and common questions</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <Section title="Content Licensing" icon={<FiCopy />}>
              <p>All original content on Blog3D is licensed under Creative Commons Attribution 4.0 International License, unless otherwise specified.</p>
            </Section>

            <Section title="Frequently Asked Questions" icon={<FiFileText />}>
              <div className="space-y-4 mt-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <button
                      onClick={() => setActiveQuestion(activeQuestion === index ? -1 : index)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h3 className="font-semibold text-white">{faq.question}</h3>
                      <span className="text-blue-400">
                        {activeQuestion === index ? '−' : '+'}
                      </span>
                    </button>
                    {activeQuestion === index && (
                      <p className="text-gray-400 mt-2 text-sm">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Contact for Licensing" icon={<FiCode />}>
              <p>For specific licensing questions or commercial use inquiries, please contact:</p>
              <p className="text-blue-400 mt-2">licensing@blog3d.com</p>
            </Section>
          </div>
        </div>
      </div>

    
    </div>
  );
}