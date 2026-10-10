'use client';

import React from 'react';
import { ShieldCheck, Terminal, Award, HelpCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050811]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0F1D]">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-bold tracking-tight text-white">GroundTruth</span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                v1.0 Live
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
              Verifiable AI Fact-Checker
            </p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Pillars
          </a>
          <a href="#demo" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-indigo-400" />
            Live Demo
          </a>
          <a href="#leaderboard" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-400" />
            Elo Leaderboard
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors">
            Benchmarks
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <a
            href="#demo"
            className="rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-100"
          >
            Fact-Check Now
          </a>
        </div>
      </div>
    </header>
  );
}

