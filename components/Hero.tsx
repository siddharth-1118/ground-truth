'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, ShieldCheck, CheckCircle2, XCircle, Search, ExternalLink } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-indigo-600/20 via-cyan-500/10 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Headline & Pitch */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300"
            >
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Verifiable AI Grounding Engine</span>
            </motion.div>

            {/* Verbatim Core Thesis Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white"
            >
              Every other arena asks which answer you like.{' '}
              <span className="gradient-text-brand block mt-2">
                GroundTruth asks which answer we can prove.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl"
            >
              GroundTruth decomposes AI answers into atomic claims, grounds each one in live SerpApi evidence, and ranks models by what they can prove — not by preference votes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#demo"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-indigo-500/50"
              >
                <span>Run a Live Fact-Check</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#leaderboard"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>View Elo Leaderboard</span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>SERPAPI LIVE VERIFICATION</span>
              </div>
              <div>•</div>
              <div>BRADLEY-TERRY ELO</div>
              <div>•</div>
              <div>ZERO PREFERENCE BIAS</div>
            </motion.div>
          </div>

          {/* RIGHT: Animated Side-by-Side Scorecard Mockup */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="glass-panel rounded-2xl p-6 relative overflow-hidden space-y-5 border border-white/10 shadow-2xl"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-300">GROUNDING VERIFICATION SCORECARD</span>
                </div>
                {/* SerpApi chip */}
                <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-mono text-cyan-300">
                  <span>serpapi · google_light</span>
                </div>
              </div>

              {/* Model Comparison Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Model A (Emerald 82/100) */}
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">Claude 3.5 Sonnet</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">82/100</span>
                  </div>
                  
                  <div className="h-2 w-full rounded-full bg-emerald-950 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[82%]" />
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-1">Launch date verified</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-1">Mirror diameter 6.5m</span>
                    </div>
                  </div>
                </div>

                {/* Model B (Crimson 31/100 with Floating REFUTED badge) */}
                <div className="rounded-xl border border-crimson-500/40 bg-red-500/10 p-4 space-y-3 relative overflow-hidden">
                  
                  {/* Floating REFUTED Badge */}
                  <div className="absolute top-2 right-2 rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-mono font-extrabold text-white shadow-lg animate-bounce">
                    REFUTED
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">Model B (Unverified)</span>
                    <span className="text-xs font-mono font-bold text-red-400">31/100</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-red-950 overflow-hidden">
                    <div className="h-full bg-red-500 w-[31%]" />
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-1">Launch 2022 (False)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-1">Falcon 9 rocket (False)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sample Source Link Footer */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono text-[11px] text-slate-400 truncate">Source: nasa.gov/webb-specifications</span>
                <span className="flex items-center gap-1 text-cyan-400 font-medium shrink-0 ml-2">
                  <span>Verified</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

