'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import DemoSection from '../components/DemoSection';
import Leaderboard from '../components/Leaderboard';
import Footer from '../components/Footer';

export default function Home() {
  const [lastWinner, setLastWinner] = useState<"A" | "B" | "tie" | null>(null);

  const handleFactCheckComplete = (winner: "A" | "B" | "tie") => {
    setLastWinner(winner);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#F3F4F6] relative selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DemoSection onFactCheckComplete={handleFactCheckComplete} />
        <Leaderboard lastWinner={lastWinner} />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

