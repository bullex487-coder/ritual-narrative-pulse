// ============================================================
// types/index.ts
// Central type definitions for Narrative Pulse dApp
// ============================================================

export type SentimentLabel =
  | "Strongly Bullish"
  | "Bullish Moderate"
  | "Neutral"
  | "Bearish Moderate"
  | "Strongly Bearish";

export type HypeProbability = "Very Low" | "Low" | "Moderate" | "High" | "Extreme";

export type RiskLevel = "Very Low" | "Low" | "Medium" | "High" | "Critical";

export type MarketPredictionDirection = "Bullish" | "Bearish" | "Sideways";

export interface MarketPrediction {
  direction: MarketPredictionDirection;
  confidence: number; // 0–100
  timeframe: "24h" | "7d";
  summary: string;
}

export type TradeSide = "Buy" | "Sell";

export interface TradeExecution {
  id: string;
  token: string;
  side: TradeSide;
  action: "Trade" | "Withdraw";
  amount: number;
  executedPrice: string;
  priceImpact: string;
  status: string;
  txHash?: string;
  timestamp: number;
}

export type NarrativeTag =
  | "DeFi"
  | "Layer 1"
  | "Layer 2"
  | "AI"
  | "RWA"
  | "Meme"
  | "Gaming"
  | "Infra"
  | "Privacy"
  | "Stablecoin";

// ── Core analysis output ──────────────────────────────────────
export interface SentimentAnalysis {
  token: string;
  timestamp: number;

  // Scores
  sentimentScore: number; // 0–100
  narrativeStrength: number; // 0–100
  momentumIndex: number; // 0–100

  // Labels
  sentiment: SentimentLabel;
  hypeProbability: HypeProbability;
  riskLevel: RiskLevel;

  // AI reasoning
  aiInsight: string;
  narrativeTags: NarrativeTag[];
  prediction: MarketPrediction;

  // Chart data
  timelineData: TimelineDataPoint[];
  radarData: RadarDataPoint[];
}

export interface TimelineDataPoint {
  time: string; // "00:00" format
  sentiment: number;
  volume: number;
  momentum: number;
}

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

// ── Saved analyses ────────────────────────────────────────────
export interface SavedAnalysis {
  id: string;
  analysis: SentimentAnalysis;
  savedAt: number;
  txHash?: string; // future blockchain integration
  onChain: boolean;
}

// ── API ───────────────────────────────────────────────────────
export interface AnalyzeRequest {
  token: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: SentimentAnalysis;
  error?: string;
}

// ── Market pulse (live ticker) ────────────────────────────────
export interface MarketPulseItem {
  token: string;
  change: number; // percentage
  sentiment: SentimentLabel;
  score: number;
}

// ── UI state ──────────────────────────────────────────────────
export interface AppState {
  isAnalyzing: boolean;
  currentAnalysis: SentimentAnalysis | null;
  savedAnalyses: SavedAnalysis[];
  error: string | null;
}
