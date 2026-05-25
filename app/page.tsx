// ============================================================
// app/page.tsx
// Main dashboard page — orchestrates all components
// ============================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Gauge,
  Flame,
  ShieldAlert,
  BarChart2,
} from "lucide-react";
import TrendingTokens from "@/components/TrendingTokens"

// Layout
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PricePanel from "@/components/PricePanel";
import MarketPulseTicker from "@/components/MarketPulseTicker";

// Feature components
import TokenInput from "@/components/TokenInput";
import LoadingState from "@/components/LoadingState";
import AnalysisCard from "@/components/AnalysisCard";
import SentimentChart from "@/components/SentimentChart";
import AIInsight from "@/components/AIInsight";
import EmptyState from "@/components/EmptyState";
import TradePanel from "@/components/TradePanel";

// Hooks & helpers
import { useAnalysis } from "@/hooks/useAnalysis";
import { useTrade } from "@/hooks/useTrade";
import {
  getSentimentColor,
  getRiskColor,
  getHypeColor,
  getScoreColor,
  computeConfidence,
} from "@/lib/helpers";

// Types
import { SavedAnalysis } from "@/types";

export default function HomePage() {
  const {
    isAnalyzing,
    currentAnalysis,
    savedAnalyses,
    error,
    analyze,
    save,
    remove,
  } = useAnalysis();

  const {
    history: tradeHistory,
    lastTrade,
    isTrading,
    error: tradeError,
    setError: setTradeError,
    executeTrade,
    withdraw,
    clearHistory,
  } = useTrade();

  const [isSaved, setIsSaved] = useState(false);
  const [lastToken, setLastToken] = useState("");

  function handleAnalyze(token: string) {
    setLastToken(token);
    setIsSaved(false);
    analyze(token);
  }

  function handleSave() {
    save();
    setIsSaved(true);
  }

  function handleSelectSaved(item: SavedAnalysis) {
    // Re-populate analysis view from a saved record
    // This mutates via analyze but we can just show the data:
    // For a richer UX you could load it directly into state.
    // Here we simply trigger a fresh analysis of the same token.
    handleAnalyze(item.analysis.token);
  }

  // Compute confidence score
  const confidence = currentAnalysis
    ? computeConfidence(
      currentAnalysis.sentimentScore,
      currentAnalysis.narrativeStrength,
      currentAnalysis.momentumIndex
    )
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* ── Top nav ───────────────────────────────────────── */}
      <Navbar />

      {/* ── Ticker strip (below nav) ──────────────────────── */}
      <div className="mt-14">
        <MarketPulseTicker />
      </div>

      {/* ── Body layout ──────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <Sidebar
          savedAnalyses={savedAnalyses}
          tradeHistory={tradeHistory}
          onSelect={handleSelectSaved}
          onDelete={remove}
          onClearHistory={clearHistory}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

            {/* Page heading */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                <h1 className="font-mono text-xs text-zinc-400 tracking-widest">
                  RITUAL AI SENTIMENT ORACLE
                </h1>
              </div>
              <h2 className="font-mono text-2xl font-bold text-white tracking-tight">
                Market Intelligence Dashboard
              </h2>
              <p className="font-mono text-xs text-zinc-600 mt-1">
                Real-time AI analysis of crypto narrative strength, sentiment, and risk
              </p>
            </motion.div>

            {/* Token input */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8"
            >
              <TokenInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
            </motion.div>

            {/* Error state */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10
                    px-5 py-4 font-mono text-sm text-red-400"
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <LoadingState token={lastToken} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dashboard — only shown after analysis completes */}
            <AnimatePresence>
              {!isAnalyzing && currentAnalysis && (
                <motion.div
                  key={currentAnalysis.timestamp}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* ── Score cards ──────────────────────── */}
                  <section>
                    <SectionLabel icon={BarChart2} label="ANALYSIS SCORES" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">

                      <AnalysisCard
                        title="Sentiment Score"
                        value={`${currentAnalysis.sentimentScore}/100`}
                        subtitle={currentAnalysis.sentiment}
                        icon={Activity}
                        color={getSentimentColor(currentAnalysis.sentiment)}
                        score={currentAnalysis.sentimentScore}
                        delay={0.05}
                        glow
                      />

                      <AnalysisCard
                        title="Narrative Strength"
                        value={`${currentAnalysis.narrativeStrength}/100`}
                        subtitle="Ecosystem discourse index"
                        icon={TrendingUp}
                        color={getScoreColor(currentAnalysis.narrativeStrength)}
                        score={currentAnalysis.narrativeStrength}
                        delay={0.1}
                      />

                      <AnalysisCard
                        title="Momentum Index"
                        value={`${currentAnalysis.momentumIndex}/100`}
                        subtitle="Price action velocity"
                        icon={Gauge}
                        color={getScoreColor(currentAnalysis.momentumIndex)}
                        score={currentAnalysis.momentumIndex}
                        delay={0.15}
                      />

                      <AnalysisCard
                        title="Hype Probability"
                        value={currentAnalysis.hypeProbability}
                        subtitle="Social signal intensity"
                        icon={Flame}
                        color={getHypeColor(currentAnalysis.hypeProbability)}
                        delay={0.2}
                      />

                      <AnalysisCard
                        title="Risk Level"
                        value={currentAnalysis.riskLevel}
                        subtitle="Volatility-adjusted risk"
                        icon={ShieldAlert}
                        color={getRiskColor(currentAnalysis.riskLevel)}
                        delay={0.25}
                      />

                      <AnalysisCard
                        title="Market Prediction"
                        value={currentAnalysis.prediction.direction}
                        subtitle={`${currentAnalysis.prediction.confidence}% confidence`}
                        icon={TrendingUp}
                        color={currentAnalysis.prediction.direction === "Bullish" ? "text-emerald-400" : currentAnalysis.prediction.direction === "Bearish" ? "text-rose-400" : "text-slate-400"}
                        score={currentAnalysis.prediction.confidence}
                        delay={0.3}
                      />

                      <AnalysisCard
                        title="AI Confidence"
                        value={`${confidence}%`}
                        subtitle="Composite model certainty"
                        icon={Activity}
                        color="text-blue-400"
                        score={confidence}
                        delay={0.35}
                      />
                    </div>
                  </section>

                  {/* ── Charts ───────────────────────────── */}
                  <section>
                    <SectionLabel icon={BarChart2} label="MARKET SIGNAL CHARTS" />
                    <div className="mt-3">
                      <SentimentChart
                        timelineData={currentAnalysis.timelineData}
                        radarData={currentAnalysis.radarData}
                      />
                    </div>
                  </section>

                  {/* ── AI Insight ───────────────────────── */}
                  <section>
                    <SectionLabel icon={Activity} label="AI INTELLIGENCE REPORT" />
                    <div className="mt-3">
                      <AIInsight
                        analysis={currentAnalysis}
                        onSave={handleSave}
                        isSaved={isSaved}
                      />
                    </div>
                  </section>

                  <section>
                    <TradePanel
                      defaultToken={currentAnalysis.token}
                      history={tradeHistory}
                      lastTrade={lastTrade}
                      isTrading={isTrading}
                      tradeError={tradeError}
                      setTradeError={setTradeError}
                      executeTrade={executeTrade}
                      withdraw={withdraw}
                    />
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            <AnimatePresence>
              {!isAnalyzing && !currentAnalysis && !error && (
                <EmptyState />
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Right Sidebar — Price Panel */}
        <PricePanel />
      </div>
    </div>
  );
}

// ── Tiny section label helper ─────────────────────────────────
function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-zinc-800" />
      <div className="flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-zinc-600" />
        <span className="font-mono text-[10px] text-zinc-600 tracking-widest">
          {label}
        </span>
      </div>
      <div className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}
