// ============================================================
// lib/mockData.ts
// Realistic mock data generation for Narrative Pulse
// ============================================================

import {
  SentimentAnalysis,
  SentimentLabel,
  HypeProbability,
  RiskLevel,
  NarrativeTag,
  MarketPulseItem,
  TimelineDataPoint,
  RadarDataPoint,
} from "@/types";

// ── Per-token personality profiles ───────────────────────────
interface TokenProfile {
  sentiment: SentimentLabel;
  sentimentScore: number;
  narrativeStrength: number;
  momentumIndex: number;
  hypeProbability: HypeProbability;
  riskLevel: RiskLevel;
  tags: NarrativeTag[];
  insights: string[];
  predictionDirection: "Bullish" | "Bearish" | "Sideways";
  predictionConfidence: number;
  predictionSummary: string[];
}

const TOKEN_PROFILES: Record<string, TokenProfile> = {
  BTC: {
    sentiment: "Bullish Moderate",
    sentimentScore: 74,
    narrativeStrength: 88,
    momentumIndex: 71,
    hypeProbability: "Moderate",
    riskLevel: "Low",
    tags: ["Layer 1", "Infra"],
    insights: [
      "Institutional accumulation patterns detected. On-chain flows signal macro conviction building at current price levels.",
      "Halving narrative remains dominant. Supply shock thesis reinforced by ETF inflow data sustaining bullish posture.",
      "Spot ETF demand continues to absorb miner sell pressure. Sentiment structure historically precedes parabolic runs.",
    ],
    predictionDirection: "Bullish",
    predictionConfidence: 78,
    predictionSummary: [
      "Momentum is positive and the market structure points to a higher probability of an upward move.",
      "Strong macro positioning and narrative support suggest bullish continuation over the next 24 hours.",
    ],
  },
  ETH: {
    sentiment: "Bullish Moderate",
    sentimentScore: 79,
    narrativeStrength: 82,
    momentumIndex: 68,
    hypeProbability: "High",
    riskLevel: "Medium",
    tags: ["Layer 1", "DeFi", "Infra"],
    insights: [
      "Momentum appears narrative-driven with strong speculative participation. Dencun upgrade tailwinds persist in L2 ecosystem.",
      "EIP traction combined with staking yield compression is driving rotation. Smart money accumulation evident at key levels.",
      "Re-staking narrative accelerating. Ecosystem breadth differentiates ETH from pure speculative assets in current cycle.",
    ],
    predictionDirection: "Bullish",
    predictionConfidence: 72,
    predictionSummary: [
      "Network momentum remains constructive with strong protocol activity supporting a bullish bias.",
      "The market appears more likely to climb than to reverse, but volatility remains elevated.",
    ],
  },
  SOL: {
    sentiment: "Strongly Bullish",
    sentimentScore: 91,
    narrativeStrength: 94,
    momentumIndex: 89,
    hypeProbability: "Extreme",
    riskLevel: "Medium",
    tags: ["Layer 1", "DeFi", "Gaming"],
    insights: [
      "Extreme hype cycle detected. Meme coin supercycle driving outsized fee revenue and validator economics. FOMO dominant.",
      "Network activity at all-time highs. Developer migration from EVM chains accelerating narrative strength score.",
      "Retail momentum indicators flashing overbought. Risk-reward asymmetry compressing but trend remains structurally intact.",
    ],
    predictionDirection: "Bullish",
    predictionConfidence: 84,
    predictionSummary: [
      "High momentum and narrative strength point toward further upside pressure, although pullbacks can happen quickly.",
      "The current environment favors continued bullish movement with supportive market breadth.",
    ],
  },
  AVAX: {
    sentiment: "Neutral",
    sentimentScore: 52,
    narrativeStrength: 61,
    momentumIndex: 48,
    hypeProbability: "Moderate",
    riskLevel: "Medium",
    tags: ["Layer 1", "RWA", "Infra"],
    insights: [
      "Subnet narrative showing institutional interest but retail conviction lagging. Blackrock tokenization thesis lending macro support.",
      "Cross-chain liquidity fragmentation creating headwinds. Ecosystem development strong but marketing narrative underperforming peers.",
      "RWA thesis alignment provides non-correlated upside catalyst. Price action consolidating ahead of potential breakout.",
    ],
    predictionDirection: "Sideways",
    predictionConfidence: 60,
    predictionSummary: [
      "The token is likely to trade sideways as market participants wait for clearer catalysts.",
      "Expect a consolidation phase rather than a strong trending move in the next 24 hours.",
    ],
  },
  LINK: {
    sentiment: "Bullish Moderate",
    sentimentScore: 71,
    narrativeStrength: 78,
    momentumIndex: 65,
    hypeProbability: "Moderate",
    riskLevel: "Low",
    tags: ["Infra", "RWA", "DeFi"],
    insights: [
      "Oracle infrastructure demand expanding with RWA tokenization wave. CCIP adoption by TradFi institutions providing fundamental floor.",
      "Staking economics improving validator participation. Token utility expansion reducing pure speculation component of price action.",
      "Quiet accumulation by DeFi protocols securing long-term data feeds. Narrative strength building without retail awareness.",
    ],
    predictionDirection: "Bullish",
    predictionConfidence: 68,
    predictionSummary: [
      "Infrastructure demand is supportive, making the upside scenario more probable than a downside break.",
      "Trend favors bullish continuation but watch for potential consolidation ahead of major announcements.",
    ],
  },
  ARB: {
    sentiment: "Bearish Moderate",
    sentimentScore: 38,
    narrativeStrength: 55,
    momentumIndex: 32,
    hypeProbability: "Low",
    riskLevel: "High",
    tags: ["Layer 2", "DeFi"],
    insights: [
      "Token unlock pressure creating consistent sell-side distribution. VC allocation schedule weighing on spot price despite TVL growth.",
      "L2 fragmentation narrative challenging. Competition from Base and OP stack chains diluting ecosystem differentiation thesis.",
      "Governance participation declining. Community engagement metrics suggest narrative fatigue following initial launch euphoria cycle.",
    ],
    predictionDirection: "Bearish",
    predictionConfidence: 64,
    predictionSummary: [
      "Weak momentum and high risk suggest a downside bias remains more likely than a sustained bounce.",
      "Watch for selling pressure to keep the market under pressure unless a strong catalyst emerges.",
    ],
  },
  PEPE: {
    sentiment: "Strongly Bullish",
    sentimentScore: 88,
    narrativeStrength: 42,
    momentumIndex: 95,
    hypeProbability: "Extreme",
    riskLevel: "Critical",
    tags: ["Meme"],
    insights: [
      "Pure momentum trade. Zero fundamental backing — narrative is entirely social sentiment driven. Extreme volatility expected.",
      "Influencer coordination signals detected. Pattern consistent with coordinated pump cycle. Exit liquidity risk extremely elevated.",
      "Retail FOMO at maximum readings. Historical analogs suggest sharp reversal follows current momentum exhaustion phase.",
    ],
    predictionDirection: "Bullish",
    predictionConfidence: 80,
    predictionSummary: [
      "The token is likely to keep pushing higher in the short term amid strong momentum, but risk is elevated.",
      "Momentum remains dominant; still, a sharp correction can appear quickly if sentiment shifts.",
    ],
  },
  OP: {
    sentiment: "Neutral",
    sentimentScore: 49,
    narrativeStrength: 64,
    momentumIndex: 44,
    hypeProbability: "Low",
    riskLevel: "Medium",
    tags: ["Layer 2", "Infra"],
    insights: [
      "Superchain thesis compelling but token value accrual mechanism remains unclear to market. Ecosystem growth not reflecting in price.",
      "Base chain success creates dual-edged narrative — proves OP stack viability while reducing OP token demand directly.",
      "RetroPGF distribution model innovative but dilutive. Long-term value capture thesis requires patience beyond typical cycle.",
    ],
    predictionDirection: "Sideways",
    predictionConfidence: 58,
    predictionSummary: [
      "The token may stay range-bound while traders decide whether the superchain narrative can translate into price action.",
      "Expect consolidation with occasional testing of support and resistance levels in the short term.",
    ],
  },
};

// Generic fallback for unknown tokens
const GENERIC_PROFILE: Omit<TokenProfile, "insights" | "predictionDirection" | "predictionConfidence" | "predictionSummary"> = {
  sentiment: "Neutral",
  sentimentScore: 55,
  narrativeStrength: 50,
  momentumIndex: 50,
  hypeProbability: "Moderate",
  riskLevel: "Medium",
  tags: ["Layer 1"],
};

const GENERIC_INSIGHTS = [
  "Insufficient on-chain data for high-confidence assessment. Narrative formation in early stages.",
  "Limited historical data available. Sentiment derived from cross-market correlation analysis.",
  "Emerging token with developing narrative. Risk parameters elevated due to limited liquidity history.",
];

// ── Timeline generator ────────────────────────────────────────
function generateTimeline(
  baseScore: number,
  momentum: number
): TimelineDataPoint[] {
  const hours = 24;
  return Array.from({ length: hours }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    const noise = (Math.random() - 0.5) * 18;
    const trend = (momentum - 50) * 0.1 * (i / hours);
    return {
      time: `${hour}:00`,
      sentiment: Math.max(0, Math.min(100, baseScore + noise + trend)),
      volume: Math.floor(Math.random() * 80 + 20),
      momentum: Math.max(0, Math.min(100, momentum + (Math.random() - 0.5) * 20)),
    };
  });
}

// ── Radar data ────────────────────────────────────────────────
function generateRadarData(profile: Pick<TokenProfile, "sentimentScore" | "narrativeStrength" | "momentumIndex" | "hypeProbability" | "riskLevel">): RadarDataPoint[] {
  const hyp: Record<HypeProbability, number> = {
    "Very Low": 10, Low: 25, Moderate: 50, High: 75, Extreme: 95,
  };
  const rsk: Record<RiskLevel, number> = {
    "Very Low": 10, Low: 25, Medium: 50, High: 75, Critical: 95,
  };

  return [
    { subject: "Sentiment", value: profile.sentimentScore, fullMark: 100 },
    { subject: "Narrative", value: profile.narrativeStrength, fullMark: 100 },
    { subject: "Momentum", value: profile.momentumIndex, fullMark: 100 },
    { subject: "Hype", value: hyp[profile.hypeProbability], fullMark: 100 },
    { subject: "Safety", value: 100 - rsk[profile.riskLevel], fullMark: 100 },
    { subject: "Volume", value: Math.floor(Math.random() * 40 + 40), fullMark: 100 },
  ];
}

// ── Main generator ────────────────────────────────────────────
export function generateMockAnalysis(token: string): SentimentAnalysis {
  const upper = token.toUpperCase();
  const profile = TOKEN_PROFILES[upper];

  if (profile) {
    const insights = profile.insights;
    const insight = insights[Math.floor(Math.random() * insights.length)];
    const predictionSummary = profile.predictionSummary[
      Math.floor(Math.random() * profile.predictionSummary.length)
    ];

    return {
      token: upper,
      timestamp: Date.now(),
      sentimentScore: profile.sentimentScore + Math.floor((Math.random() - 0.5) * 6),
      narrativeStrength: profile.narrativeStrength,
      momentumIndex: profile.momentumIndex,
      sentiment: profile.sentiment,
      hypeProbability: profile.hypeProbability,
      riskLevel: profile.riskLevel,
      aiInsight: insight,
      narrativeTags: profile.tags,
      prediction: {
        direction: profile.predictionDirection,
        confidence: profile.predictionConfidence,
        timeframe: "24h",
        summary: predictionSummary,
      },
      timelineData: generateTimeline(profile.sentimentScore, profile.momentumIndex),
      radarData: generateRadarData(profile),
    };
  }

  // Randomized generic fallback
  const score = Math.floor(Math.random() * 60 + 20);
  const predictedDirections: Array<"Bullish" | "Bearish" | "Sideways"> = [
    "Bullish",
    "Bearish",
    "Sideways",
  ];
  const direction = predictedDirections[Math.floor(Math.random() * predictedDirections.length)];
  const summaryMap: Record<"Bullish" | "Bearish" | "Sideways", string> = {
    Bullish: "Market momentum is tilting upward, but watch for pullbacks if hype cools.",
    Bearish: "Weak momentum is present with elevated risk of a downside correction.",
    Sideways: "The token is likely to consolidate as traders wait for a clearer catalyst.",
  };

  return {
    token: upper,
    timestamp: Date.now(),
    sentimentScore: score,
    narrativeStrength: score - 5,
    momentumIndex: score - 10,
    sentiment: GENERIC_PROFILE.sentiment,
    hypeProbability: GENERIC_PROFILE.hypeProbability,
    riskLevel: GENERIC_PROFILE.riskLevel,
    aiInsight: GENERIC_INSIGHTS[Math.floor(Math.random() * GENERIC_INSIGHTS.length)],
    narrativeTags: GENERIC_PROFILE.tags as NarrativeTag[],
    prediction: {
      direction,
      confidence: Math.max(30, Math.min(90, score + Math.floor((Math.random() - 0.5) * 20))),
      timeframe: "24h",
      summary: summaryMap[direction],
    },
    timelineData: generateTimeline(score, score),
    radarData: generateRadarData({ sentimentScore: score, narrativeStrength: score, momentumIndex: score, hypeProbability: "Moderate", riskLevel: "Medium" }),
  };
}

// ── Live market pulse ─────────────────────────────────────────
const PULSE_TOKENS = ["BTC", "ETH", "SOL", "AVAX", "LINK", "ARB", "OP", "MATIC", "INJ", "TIA"];

export function generateMarketPulse(): MarketPulseItem[] {
  return PULSE_TOKENS.map((token) => {
    const profile = TOKEN_PROFILES[token];
    const score = profile
      ? profile.sentimentScore + Math.floor((Math.random() - 0.5) * 10)
      : Math.floor(Math.random() * 60 + 20);
    const change = parseFloat(((Math.random() - 0.4) * 12).toFixed(2));
    return {
      token,
      change,
      score,
      sentiment: (profile?.sentiment ?? "Neutral") as SentimentLabel,
    };
  });
}
