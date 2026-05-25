// ============================================================
// components/AIInsight.tsx
// AI reasoning / insight display with typewriter animation
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Tag, ExternalLink, Save, CheckCircle } from "lucide-react";
import { SentimentAnalysis } from "@/types";
import { getSentimentColor, getSentimentBg, getRiskColor, getHypeColor } from "@/lib/helpers";

interface AIInsightProps {
  analysis: SentimentAnalysis;
  onSave: () => void;
  isSaved: boolean;
}

export default function AIInsight({ analysis, onSave, isSaved }: AIInsightProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect for AI insight text
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);

    const text = analysis.aiInsight;
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22); // characters per interval

    return () => clearInterval(interval);
  }, [analysis.aiInsight]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: isTyping ? Infinity : 0 }}
          >
            <Brain className="w-4 h-4 text-emerald-400" />
          </motion.div>
          <span className="font-mono text-[11px] text-emerald-400 tracking-widest">
            AI INTELLIGENCE REPORT — {analysis.token}
          </span>
        </div>

        {/* Save button */}
        <motion.button
          onClick={onSave}
          disabled={isSaved}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
            font-mono text-[11px] transition-all
            ${isSaved
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-default"
              : "border-zinc-700 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400"
            }`}
        >
          {isSaved ? (
            <>
              <CheckCircle className="w-3 h-3" />
              SAVED
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              SAVE
            </>
          )}
        </motion.button>
      </div>

      {/* Insight text terminal block */}
      <div
        className="rounded-lg bg-black/60 border border-zinc-800/80 px-5 py-4
          font-mono text-sm text-zinc-300 leading-relaxed min-h-[72px]
          relative overflow-hidden"
      >
        {/* Terminal scan lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
          }}
        />

        {/* AI prefix */}
        <span className="text-emerald-500/60 select-none">{">>> "}</span>
        <span>{displayedText}</span>
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-emerald-400 align-middle ml-0.5"
          />
        )}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
        {/* Sentiment */}
        <div
          className={`rounded-lg border px-3 py-2.5 ${getSentimentBg(analysis.sentiment)}`}
        >
          <p className="font-mono text-[9px] text-zinc-600 mb-1">SENTIMENT</p>
          <p className={`font-mono text-sm font-bold ${getSentimentColor(analysis.sentiment)}`}>
            {analysis.sentiment}
          </p>
        </div>

        {/* Risk */}
        <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-2.5">
          <p className="font-mono text-[9px] text-zinc-600 mb-1">RISK LEVEL</p>
          <p className={`font-mono text-sm font-bold ${getRiskColor(analysis.riskLevel)}`}>
            {analysis.riskLevel}
          </p>
        </div>

        {/* Hype */}
        <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-2.5">
          <p className="font-mono text-[9px] text-zinc-600 mb-1">HYPE PROBABILITY</p>
          <p className={`font-mono text-sm font-bold ${getHypeColor(analysis.hypeProbability)}`}>
            {analysis.hypeProbability}
          </p>
        </div>
      </div>

      {/* Narrative tags */}
      {analysis.narrativeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <Tag className="w-3 h-3 text-zinc-600 self-center" />
          {analysis.narrativeTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full border border-zinc-700/60
                bg-zinc-800/40 font-mono text-[10px] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/50 p-4">
        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-2">
          MARKET FORECAST SUMMARY
        </p>
        <p className="font-mono text-sm text-zinc-300 leading-relaxed">
          {analysis.prediction.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800/60">
        <p className="font-mono text-[10px] text-zinc-600">
          Powered by Ritual × AI Oracle Engine v0.1
        </p>
        <button className="flex items-center gap-1 font-mono text-[10px] text-zinc-600
          hover:text-zinc-400 transition-colors">
          <ExternalLink className="w-3 h-3" />
          VERIFY ON-CHAIN
        </button>
      </div>
    </motion.div>
  );
}
