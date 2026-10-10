'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ExternalLink, Sparkles, RefreshCw, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { FactCheckResponse, Claim } from '../types';

// Exact Hardcoded Demo Fixture as specified
const HARDCODED_DEMO_FIXTURE: FactCheckResponse = {
  grounding_a: {
    grounding_score: 88,
    claims_supported: 2,
    claims_refuted: 0,
    details: [
      {
        claim: "JWST launched December 25, 2021 on an Ariane 5 rocket.",
        verdict: "supported",
        score: 95,
        reasoning: "Verified by NASA official launch manifest and ESA flight telemetry.",
        source_url: "https://www.nasa.gov/webb"
      },
      {
        claim: "Its primary mirror is 6.5 meters in diameter, made of 18 gold-coated beryllium segments.",
        verdict: "supported",
        score: 92,
        reasoning: "Confirmed by NASA Goddard optical specification records.",
        source_url: "https://www.nasa.gov/webb"
      }
    ]
  },
  grounding_b: {
    grounding_score: 22,
    claims_supported: 0,
    claims_refuted: 2,
    details: [
      {
        claim: "JWST launched in 2022 on a Falcon 9.",
        verdict: "refuted",
        score: 10,
        reasoning: "Refuted: JWST launched December 25, 2021 on Ariane 5, not a Falcon 9 in 2022.",
        source_url: "https://www.nasa.gov/webb"
      },
      {
        claim: "Its primary mirror is 8.2 meters in diameter.",
        verdict: "refuted",
        score: 15,
        reasoning: "Refuted: Primary mirror diameter is 6.5 meters, not 8.2 meters.",
        source_url: "https://www.nasa.gov/webb"
      }
    ]
  },
  judge: {
    winner: "A",
    confidence: 0.96,
    reasoning: "Model A's claims are directly supported by NASA sources at position 1. Model B misstates both the launch year and mirror diameter, contradicting primary evidence."
  }
};

interface DemoSectionProps {
  onFactCheckComplete?: (winner: "A" | "B" | "tie") => void;
}

export default function DemoSection({ onFactCheckComplete }: DemoSectionProps) {
  const [question, setQuestion] = useState("What year did the James Webb Space Telescope launch, and what is its primary mirror diameter?");
  const [answerA, setAnswerA] = useState("JWST launched December 25, 2021 on an Ariane 5 rocket. Its primary mirror is 6.5 meters in diameter, made of 18 gold-coated beryllium segments.");
  const [answerB, setAnswerB] = useState("JWST launched in 2022 on a Falcon 9. Its primary mirror is 8.2 meters in diameter.");

  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [results, setResults] = useState<FactCheckResponse | null>(null);

  // Score Count-up animation state (0 -> score in <= 1.2s)
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [expandedA, setExpandedA] = useState(true);
  const [expandedB, setExpandedB] = useState(true);

  // Auto-run initial demo check on load so it looks real on first render
  useEffect(() => {
    runFactCheck();
  }, []);

  const runFactCheck = async () => {
    setLoading(true);
    setResults(null);
    setScoreA(0);
    setScoreB(0);

    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1600)); // min 1.5s shimmer

    try {
      const resPromise = fetch('http://localhost:8000/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer_a: answerA, answer_b: answerB }),
      });

      const [response] = await Promise.all([resPromise, minLoadTime]);

      if (response.ok) {
        const data: FactCheckResponse = await response.json();
        setIsDemoMode(false);
        setResults(data);
        animateScores(data.grounding_a.grounding_score, data.grounding_b.grounding_score);
        if (onFactCheckComplete) onFactCheckComplete(data.judge.winner);
      } else {
        throw new Error("Backend offline");
      }
    } catch (err) {
      // Fallback to DEMO MODE fixture
      await minLoadTime;
      setIsDemoMode(true);
      setResults(HARDCODED_DEMO_FIXTURE);
      animateScores(HARDCODED_DEMO_FIXTURE.grounding_a.grounding_score, HARDCODED_DEMO_FIXTURE.grounding_b.grounding_score);
      if (onFactCheckComplete) onFactCheckComplete(HARDCODED_DEMO_FIXTURE.judge.winner);
    } finally {
      setLoading(false);
    }
  };

  const animateScores = (targetA: number, targetB: number) => {
    const duration = 1000; // <= 1.2s
    const steps = 30;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const currentA = Math.round((targetA / steps) * step);
      const currentB = Math.round((targetB / steps) * step);

      setScoreA(currentA);
      setScoreB(currentB);

      if (step >= steps) {
        setScoreA(targetA);
        setScoreB(targetB);
        clearInterval(timer);
      }
    }, intervalTime);
  };

  return (
    <section id="demo" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                INTERACTIVE DEMO
              </h2>
              {isDemoMode && (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 shadow-sm animate-pulse">
                  DEMO MODE (BACKEND FALLBACK)
                </span>
              )}
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Pairwise AI Answer Fact-Checker
            </h3>
          </div>

          <p className="text-xs text-slate-400 font-mono max-w-md">
            Enter a prompt and two AI answers. GroundTruth will extract atomic claims, retrieve SerpApi search evidence, and return a grounded judge verdict.
          </p>
        </div>

        {/* Input Form & Two-Column Answer Boxes */}
        <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 space-y-6 shadow-2xl">
          
          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Question / Prompt
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question..."
              className="w-full rounded-xl bg-[#060B14] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors font-medium"
            />
          </div>

          {/* Two Columns: Model A vs Model B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Model A */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-indigo-300">MODEL A ANSWER</span>
                <span className="text-slate-400">Claude 3.5 Sonnet</span>
              </div>
              <textarea
                rows={4}
                value={answerA}
                onChange={(e) => setAnswerA(e.target.value)}
                className="w-full rounded-xl bg-[#060B14] border border-white/10 p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-400 transition-colors leading-relaxed font-sans"
              />
            </div>

            {/* Model B */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-rose-300">MODEL B ANSWER</span>
                <span className="text-slate-400">Unverified Model</span>
              </div>
              <textarea
                rows={4}
                value={answerB}
                onChange={(e) => setAnswerB(e.target.value)}
                className="w-full rounded-xl bg-[#060B14] border border-white/10 p-3.5 text-sm text-slate-200 focus:outline-none focus:border-rose-400 transition-colors leading-relaxed font-sans"
              />
            </div>

          </div>

          {/* Submit Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>SerpApi live evidence retrieval active</span>
            </div>

            <button
              onClick={runFactCheck}
              disabled={loading}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Decomposing & Grounding Claims...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span>Fact-Check Both Answers</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* LOADING SHIMMER STATE (Visible min 1.5s) */}
        {loading && (
          <div className="mt-8 glass-panel rounded-2xl p-8 border border-cyan-500/30 space-y-6 skeleton-shimmer">
            <div className="h-8 bg-white/10 rounded-lg w-1/3" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-32 bg-white/5 rounded-xl" />
              <div className="h-32 bg-white/5 rounded-xl" />
            </div>
          </div>
        )}

        {/* RESULTS SECTION */}
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
          >
            {/* Judge Verdict Banner */}
            <div className="glass-panel rounded-2xl p-6 border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emerald-400" />
                  <h4 className="text-lg font-bold text-white font-mono">
                    Winner: Model {results.judge.winner} — Grounded in {results.grounding_a.claims_supported}/{results.grounding_a.details.length} verified claims
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl pt-1 font-sans">
                  {results.judge.reasoning}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl">
                <span className="text-xs font-mono font-bold text-emerald-300">
                  Confidence: {Math.round(results.judge.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Scorecard Meters & Claim Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* MODEL A RESULTS */}
              <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-300">MODEL A GROUNDING</span>
                    <h5 className="text-sm font-bold text-white">Claude 3.5 Sonnet</h5>
                  </div>
                  
                  {/* Animated Score Count-up Meter */}
                  <div className="text-right">
                    <div className="text-3xl font-black font-mono text-emerald-400">
                      {scoreA}<span className="text-sm text-slate-400 font-normal">/100</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Grounding Score</span>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ {results.grounding_a.claims_supported} Supported
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                    ✕ {results.grounding_a.claims_refuted} Refuted
                  </span>
                </div>

                {/* Expandable Claim List */}
                <div className="space-y-3 pt-2">
                  <div 
                    onClick={() => setExpandedA(!expandedA)}
                    className="flex justify-between items-center text-xs font-mono text-slate-400 cursor-pointer hover:text-white"
                  >
                    <span>ATOMIC CLAIMS ({results.grounding_a.details.length})</span>
                    {expandedA ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>

                  {expandedA && (
                    <div className="space-y-3">
                      {results.grounding_a.details.map((item, idx) => (
                        <RenderClaimCard key={idx} claimItem={item} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* MODEL B RESULTS */}
              <div className="glass-panel rounded-2xl p-6 border border-red-500/30 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-rose-300">MODEL B GROUNDING</span>
                    <h5 className="text-sm font-bold text-white">Unverified Model</h5>
                  </div>

                  {/* Animated Score Count-up Meter */}
                  <div className="text-right">
                    <div className="text-3xl font-black font-mono text-red-400">
                      {scoreB}<span className="text-sm text-slate-400 font-normal">/100</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Grounding Score</span>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ {results.grounding_b.claims_supported} Supported
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                    ✕ {results.grounding_b.claims_refuted} Refuted
                  </span>
                </div>

                {/* Expandable Claim List */}
                <div className="space-y-3 pt-2">
                  <div 
                    onClick={() => setExpandedB(!expandedB)}
                    className="flex justify-between items-center text-xs font-mono text-slate-400 cursor-pointer hover:text-white"
                  >
                    <span>ATOMIC CLAIMS ({results.grounding_b.details.length})</span>
                    {expandedB ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>

                  {expandedB && (
                    <div className="space-y-3">
                      {results.grounding_b.details.map((item, idx) => (
                        <RenderClaimCard key={idx} claimItem={item} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
}

// Sub-component to render individual claim verdict cards with SerpApi source link
function RenderClaimCard({ claimItem }: { claimItem: Claim }) {
  const isSupported = claimItem.verdict === 'supported';
  const isRefuted = claimItem.verdict === 'refuted';

  return (
    <div className={`p-3.5 rounded-xl border transition-all ${
      isSupported 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        : isRefuted
        ? 'bg-red-500/10 border-red-500/30 text-red-200'
        : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {isSupported && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
          {isRefuted && <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
          {!isSupported && !isRefuted && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}

          <div>
            <p className="text-xs font-semibold leading-snug">{claimItem.claim}</p>
            <p className="text-[11px] text-slate-300 mt-1 opacity-90">{claimItem.reasoning}</p>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase shrink-0 ${
          isSupported ? 'bg-emerald-500/20 text-emerald-300' : isRefuted ? 'bg-red-600 text-white' : 'bg-amber-500/20 text-amber-300'
        }`}>
          {claimItem.verdict}
        </span>
      </div>

      {/* Working SerpApi Source Link */}
      {claimItem.source_url && (
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="font-mono text-slate-400">serpapi · google_search</span>
          <a
            href={claimItem.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-cyan-300 hover:text-white hover:underline"
          >
            <span>{claimItem.source_url.replace('https://', '')}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}

