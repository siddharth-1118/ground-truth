'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListChecks, Search, Scale, Trophy } from 'lucide-react';

const pillars = [
  {
    icon: ListChecks,
    title: 'Atomic Claim Decomposition',
    description: 'Splits any AI answer into independently verifiable factual claims.',
    gradient: 'from-indigo-500 to-blue-500',
    border: 'border-indigo-500/30',
  },
  {
    icon: Search,
    title: 'Position-Weighted SerpApi Grounding',
    description: 'Top-ranked search results carry more credibility weight. Every verdict links to its source.',
    gradient: 'from-cyan-500 to-teal-500',
    border: 'border-cyan-500/30',
  },
  {
    icon: Scale,
    title: 'Pairwise LLM Judge',
    description: 'DeepSeek compares both answers against their grounding evidence and returns a reasoned winner.',
    gradient: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/30',
  },
  {
    icon: Trophy,
    title: 'Elo Reliability Leaderboard',
    description: 'Bradley-Terry Elo ranks models by proven grounding, not preference votes.',
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/30',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            ARCHITECTURAL PILLARS
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Factual Accountability, Not Preference Biases.
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Traditional benchmarks ask humans which response sounds nicer. GroundTruth executes live web evidence retrieval to audit every claim sentence by sentence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-panel glass-panel-hover rounded-2xl p-6 relative flex flex-col justify-between border ${pillar.border}`}
              >
                <div className="space-y-4">
                  {/* Icon Badge */}
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${pillar.gradient} p-0.5 shadow-lg shadow-indigo-500/10`}>
                    <div className="h-full w-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>PILLAR 0{index + 1}</span>
                  <span className="text-indigo-400 font-bold">LIVE AUDIT</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

