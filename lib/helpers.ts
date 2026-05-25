// ============================================================
// lib/helpers.ts
// Shared utility functions for Narrative Pulse
// ============================================================

import {
  SentimentLabel,
  HypeProbability,
  RiskLevel,
  SavedAnalysis,
  SentimentAnalysis,
} from "@/types";

// ── Color helpers ─────────────────────────────────────────────

/** Returns a Tailwind color class based on sentiment label */
export function getSentimentColor(sentiment: SentimentLabel): string {
  switch (sentiment) {
    case "Strongly Bullish":
      return "text-emerald-400";
    case "Bullish Moderate":
      return "text-emerald-300";
    case "Neutral":
      return "text-zinc-400";
    case "Bearish Moderate":
      return "text-red-400";
    case "Strongly Bearish":
      return "text-red-500";
  }
}

export function getSentimentBg(sentiment: SentimentLabel): string {
  switch (sentiment) {
    case "Strongly Bullish":
      return "bg-emerald-500/20 border-emerald-500/40";
    case "Bullish Moderate":
      return "bg-emerald-500/10 border-emerald-400/30";
    case "Neutral":
      return "bg-zinc-700/30 border-zinc-600/40";
    case "Bearish Moderate":
      return "bg-red-500/10 border-red-400/30";
    case "Strongly Bearish":
      return "bg-red-500/20 border-red-500/40";
  }
}

/** Returns color for a 0–100 score */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-emerald-300";
  if (score >= 40) return "text-yellow-400";
  if (score >= 25) return "text-orange-400";
  return "text-red-400";
}

export function getScoreGlow(score: number): string {
  if (score >= 80) return "shadow-emerald-500/30";
  if (score >= 60) return "shadow-emerald-400/20";
  if (score >= 40) return "shadow-yellow-400/20";
  return "shadow-red-400/20";
}

/** Returns color class for risk level */
export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case "Very Low":
      return "text-emerald-400";
    case "Low":
      return "text-emerald-300";
    case "Medium":
      return "text-yellow-400";
    case "High":
      return "text-orange-400";
    case "Critical":
      return "text-red-400";
  }
}

/** Returns color class for hype probability */
export function getHypeColor(hype: HypeProbability): string {
  switch (hype) {
    case "Very Low":
      return "text-zinc-400";
    case "Low":
      return "text-blue-400";
    case "Moderate":
      return "text-yellow-400";
    case "High":
      return "text-orange-400";
    case "Extreme":
      return "text-red-400";
  }
}

// ── Formatting ────────────────────────────────────────────────

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

export function getChangeColor(change: number): string {
  return change >= 0 ? "text-emerald-400" : "text-red-400";
}

/** Short unique ID for saved analyses */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

// ── Local storage persistence ─────────────────────────────────

const STORAGE_KEY = "narrative_pulse_analyses";

export function loadSavedAnalyses(): SavedAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedAnalysis[]) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(analysis: SentimentAnalysis): SavedAnalysis {
  const item: SavedAnalysis = {
    id: generateId(),
    analysis,
    savedAt: Date.now(),
    onChain: false,
  };
  const existing = loadSavedAnalyses();
  const updated = [item, ...existing].slice(0, 20); // keep last 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return item;
}

export function deleteSavedAnalysis(id: string): SavedAnalysis[] {
  const existing = loadSavedAnalyses();
  const updated = existing.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// ── Scores ────────────────────────────────────────────────────

/** Compute a composite "confidence" score from sub-scores */
export function computeConfidence(
  sentimentScore: number,
  narrativeStrength: number,
  momentumIndex: number
): number {
  return Math.round((sentimentScore * 0.4 + narrativeStrength * 0.35 + momentumIndex * 0.25));
}
