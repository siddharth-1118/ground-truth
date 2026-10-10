'use client';

import React, { useState } from 'react';
import { ShieldCheck, Github, FileText, ExternalLink, Check, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#03060D] pt-16 pb-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Top CTA Banner featuring Verbatim Closing Line */}
        <div className="glass-panel rounded-2xl p-8 mb-16 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              GROUNDTRUTH VERDICT PRINCIPIA
            </span>
            {/* Verbatim Closing Line */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Preference is cheap. Grounding is verifiable.
            </h3>
            <p className="text-sm text-slate-300">
              Join AI labs and researchers auditing model claims with live search evidence.
            </p>
          </div>

          <a
            href="#demo"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] shrink-0"
          >
            Start Verification Demo
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0A0F1D]">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">GroundTruth</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Autonomous fact-checking framework decomposing AI answers into atomic claims and ranking models by verifiable search evidence.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              <span>Powered by SerpApi</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider">Resources & Track</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Documentation & API Spec</span>
                </a>
              </li>
              <li>
                <a href="https://serpapi.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>SerpApi Engine Docs</span>
                </a>
              </li>
              <li>
                <span className="text-indigo-400 font-mono">Track: AI Agents</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Benchmark Models */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider">Ranked Models</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li>GPT-4o (Elo 1612)</li>
              <li>Claude 3.5 Sonnet (Elo 1587)</li>
              <li>DeepSeek-V3 (Elo 1554)</li>
              <li>Llama 3.1 70B (Elo 1498)</li>
            </ul>
          </div>

          {/* Col 4: Newsletter Signup */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider">Grounding Digest</h4>
            <p className="text-slate-400">Receive weekly model reliability rankings and hallucination audit reports.</p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="enter.your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 transition-colors pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono pt-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Subscribed to GroundTruth digest!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-mono">
          <p>© 2026 GroundTruth. All rights reserved.</p>
          <p className="text-slate-400">Bradley-Terry Elo Grounding Evaluator • Open-Source License</p>
        </div>

      </div>
    </footer>
  );
}

