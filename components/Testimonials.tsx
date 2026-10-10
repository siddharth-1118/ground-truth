'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Evaluating models on length and fluency is fundamentally broken. GroundTruth forces models to defend every single sentence against real-time web evidence.",
    name: "Dr. Aris Thorne",
    role: "Benchmark Researcher, AI Alignment Institute",
    avatar: "AT",
  },
  {
    quote: "We caught 3 hallucinated citations in our benchmark suite within 10 minutes of deployment. Grounding metrics are a game-changer for production safety.",
    name: "Elena Rostova",
    role: "Senior ML Engineer, Synthetic Labs",
    avatar: "ER",
  },
  {
    quote: "Preference RLHF rewards sycophancy and confident-sounding prose. GroundTruth rewards factual accountability and empirical accuracy.",
    name: "Marcus Vance",
    role: "Model Evaluation Lead, HyperScale AI",
    avatar: "MV",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            COMMUNITY BENCHMARK PERSPECTIVES
          </h2>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            Why Evaluators Are Switching to Factual Grounding.
          </p>
          <p className="text-slate-400 text-sm sm:text-base">
            Preference votes are cheap. Verifiable evidence is ground truth.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 space-y-6 relative"
            >
              <div className="space-y-4">
                <Quote className="h-8 w-8 text-indigo-400/40" />
                <p className="text-sm text-slate-200 leading-relaxed font-normal italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{t.name}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" title="Verified Evaluator" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

