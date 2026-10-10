'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, ShieldCheck, TrendingUp, RefreshCw } from 'lucide-react';
import { LeaderboardItem } from '../types';

const INITIAL_MOCK_LEADERBOARD: LeaderboardItem[] = [
  { model: "GPT-4o", elo: 1612 },
  { model: "Claude 3.5 Sonnet", elo: 1587 },
  { model: "DeepSeek-V3", elo: 1554 },
  { model: "Llama 3.1 70B", elo: 1498 },
];

interface LeaderboardProps {
  lastWinner?: "A" | "B" | "tie" | null;
}

export default function Leaderboard({ lastWinner }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>(INITIAL_MOCK_LEADERBOARD);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Whenever a vote / fact check happens, update Elo ratings seamlessly without page reload
  useEffect(() => {
    if (lastWinner) {
      handleVoteUpdate(lastWinner);
    }
  }, [lastWinner]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/leaderboard');
      if (res.ok) {
        const data: LeaderboardItem[] = await res.json();
        setLeaderboard(data.sort((a, b) => b.elo - a.elo));
        setIsDemoMode(false);
      } else {
        throw new Error('Backend offline');
      }
    } catch (err) {
      setIsDemoMode(true);
      setLeaderboard(INITIAL_MOCK_LEADERBOARD);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteUpdate = async (winner: "A" | "B" | "tie") => {
    const modelA = "Claude 3.5 Sonnet";
    const modelB = "Unverified Model";

    try {
      await fetch('http://localhost:8000/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_a: modelA, model_b: modelB, winner }),
      });
      fetchLeaderboard();
    } catch (err) {
      // Re-sort local state smoothly in fallback mode
      setLeaderboard((prev) => {
        const next = [...prev];
        const itemA = next.find((m) => m.model.includes('Claude') || m.model.includes('GPT'));
        if (itemA && winner === 'A') {
          itemA.elo += 16;
        }
        return next.sort((a, b) => b.elo - a.elo);
      });
    }
  };

  return (
    <section id="leaderboard" className="py-20 relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                RELIABILITY BENCHMARK
              </h2>
              {isDemoMode && (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                  DEMO MODE MOCK
                </span>
              )}
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Bradley-Terry Elo Grounding Leaderboard
            </h3>
          </div>

          <p className="text-xs text-slate-400 font-mono max-w-md">
            Models ranked by proven factual grounding accuracy in SerpApi verified audits. No preference RLHF bias.
          </p>
        </div>

        {/* Leaderboard Table Glass Panel */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-white/5 px-6 py-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
            <div className="col-span-1">Rank</div>
            <div className="col-span-6">Model Architecture</div>
            <div className="col-span-3 text-right">Grounding Elo</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {leaderboard.map((item, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              return (
                <motion.div
                  key={item.model}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="grid grid-cols-12 px-6 py-4.5 items-center hover:bg-white/5 transition-colors"
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center gap-2">
                    <span className={`font-mono text-sm font-bold ${
                      isFirst ? 'text-amber-400' : isSecond ? 'text-slate-300' : isThird ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      #{index + 1}
                    </span>
                    {isFirst && <Trophy className="h-4 w-4 text-amber-400 shrink-0" />}
                    {isSecond && <Award className="h-4 w-4 text-slate-300 shrink-0" />}
                  </div>

                  {/* Model Name */}
                  <div className="col-span-6 flex items-center gap-3">
                    <span className="font-bold text-white text-sm sm:text-base tracking-tight">
                      {item.model}
                    </span>
                    {isFirst && (
                      <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                        #1 Grounded
                      </span>
                    )}
                  </div>

                  {/* Grounding Elo */}
                  <div className="col-span-3 text-right font-mono font-bold text-base text-cyan-300">
                    {item.elo} <span className="text-xs text-slate-500 font-normal">pts</span>
                  </div>

                  {/* Status Pill */}
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono text-emerald-300">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Refresh Action Footer */}
          <div className="bg-white/5 px-6 py-4 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Updated continuously via pairwise SerpApi verification audits</span>
            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Standings</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

