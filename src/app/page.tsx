// pages/index.tsx
"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';

import Hero from './components/Hero';
import Features from './components/Features';
import FeaturedPosts from './components/Featurespost';




export default function Home() {


  return (
    <div className="dark bg-gray-900 min-h-screen">
      <Head>
        <title>Modern Blog Platform</title>
        <meta name="description" content="A modern blog platform with 3D effects and category tree structure" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <Hero />
      <FeaturedPosts/>
      <Features />
     
    </div>
  );
}