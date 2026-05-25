// ============================================================
// lib/huggingFace.ts
// Server-side Hugging Face integration for token sentiment analysis
// ============================================================

import { SentimentAnalysis, TimelineDataPoint, RadarDataPoint } from "@/types";

const HUGGING_FACE_MODEL = "google/flan-t5-small";
const HUGGING_FACE_ENDPOINT = `https://api-inference.huggingface.co/models/${HUGGING_FACE_MODEL}`;

const SENTIMENT_LABELS = [
  "Strongly Bullish",
  "Bullish Moderate",
  "Neutral",
  "Bearish Moderate",
  "Strongly Bearish",
] as const;

const HYPE_PROBABILITIES = [
  "Very Low",
  "Low",
  "Moderate",
  "High",
  "Extreme",
] as const;

const RISK_LEVELS = [
  "Very Low",
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

const NARRATIVE_TAGS = [
  "DeFi",
  "Layer 1",
  "Layer 2",
  "AI",
  "RWA",
  "Meme",
  "Gaming",
  "Infra",
  "Privacy",
  "Stablecoin",
] as const;

const PREDICTION_DIRECTIONS = [
  "Bullish",
  "Bearish",
  "Sideways",
] as const;

type SafeSentimentLabel = (typeof SENTIMENT_LABELS)[number];
type SafeHypeProbability = (typeof HYPE_PROBABILITIES)[number];
type SafeRiskLevel = (typeof RISK_LEVELS)[number];
type SafeNarrativeTag = (typeof NARRATIVE_TAGS)[number];
type SafePredictionDirection = (typeof PREDICTION_DIRECTIONS)[number];

function buildPrompt(token: string) {
  return `You are a crypto market sentiment analyst for the Ritual testnet ecosystem. Analyze the token ticker ${token} and return ONLY valid JSON with the following structure:\n\n{
  "sentimentScore": number, // 0-100
  "narrativeStrength": number, // 0-100
  "momentumIndex": number, // 0-100
  "sentiment": "Strongly Bullish" | "Bullish Moderate" | "Neutral" | "Bearish Moderate" | "Strongly Bearish",
  "hypeProbability": "Very Low" | "Low" | "Moderate" | "High" | "Extreme",
  "riskLevel": "Very Low" | "Low" | "Medium" | "High" | "Critical",
  "aiInsight": string,
  "narrativeTags": string[],
  "predictedDirection": "Bullish" | "Bearish" | "Sideways",
  "predictionConfidence": number, // 0-100
  "predictionSummary": string
}\n\nUse only the allowed labels and tags. Return a short, actionable insight string in aiInsight and a concise forecast summary in predictionSummary. Do not include any additional text or markdown.`;
}

function parseResponse(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string") {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Unable to parse Hugging Face response as JSON.");
    }
    return JSON.parse(match[0]);
  }

  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];

    if (typeof first === "string") {
      const match = first.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("Unable to parse Hugging Face response as JSON.");
      }
      return JSON.parse(match[0]);
    }

    if (typeof first === "object" && first !== null) {
      if ("generated_text" in first && typeof first.generated_text === "string") {
        const match = first.generated_text.match(/\{[\s\S]*\}/);
        if (!match) {
          throw new Error("Unable to parse generated_text as JSON.");
        }
        return JSON.parse(match[0]);
      }
      return first as Record<string, unknown>;
    }
  }

  throw new Error("Unexpected Hugging Face response format.");
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sanitizeLabel<T extends readonly string[]>(value: unknown, validValues: T): T[number] {
  if (typeof value !== "string") {
    throw new Error("Expected string label from Hugging Face response.");
  }

  const normalized = value.trim();
  const found = validValues.find((item) => item.toLowerCase() === normalized.toLowerCase());
  if (!found) {
    throw new Error(`Invalid response label: ${normalized}`);
  }

  return found;
}

function sanitizeTags(value: unknown): SafeNarrativeTag[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected narrativeTags to be an array.");
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((tag) => {
      const normalized = tag.trim();
      const found = NARRATIVE_TAGS.find((item) => item.toLowerCase() === normalized.toLowerCase());
      return found || null;
    })
    .filter((tag): tag is SafeNarrativeTag => tag !== null)
    .slice(0, 4);
}

function sanitizePredictionDirection(value: unknown): SafePredictionDirection {
  if (typeof value !== "string") {
    throw new Error("Expected predictedDirection to be a string.");
  }

  const normalized = value.trim();
  const found = PREDICTION_DIRECTIONS.find((item) => item.toLowerCase() === normalized.toLowerCase());
  if (!found) {
    throw new Error(`Invalid prediction direction: ${normalized}`);
  }

  return found;
}

function buildTimelineData(score: number, momentum: number): TimelineDataPoint[] {
  return Array.from({ length: 12 }).map((_, index) => {
    const trend = score + (momentum - 50) * (index / 12) * 0.6;
    const volatility = (Math.sin(index / 2) * 8 + Math.random() * 10) * 0.8;
    return {
      time: `${(index * 2).toString().padStart(2, "0")}:00`,
      sentiment: Math.max(0, Math.min(100, Math.round(trend + volatility - 4))),
      volume: Math.max(10, Math.round(40 + Math.cos(index / 2) * 12 + Math.random() * 20)),
      momentum: Math.max(0, Math.min(100, Math.round(momentum + Math.sin(index / 3) * 12 + (Math.random() - 0.5) * 10))),
    };
  });
}

function buildRadarData(
  sentimentScore: number,
  narrativeStrength: number,
  momentumIndex: number,
  hypeProbability: SafeHypeProbability,
  riskLevel: SafeRiskLevel
): RadarDataPoint[] {
  const hypeValue = {
    "Very Low": 10,
    Low: 25,
    Moderate: 50,
    High: 75,
    Extreme: 95,
  }[hypeProbability];

  const safetyValue = 100 - {
    "Very Low": 10,
    Low: 25,
    Medium: 50,
    High: 75,
    Critical: 95,
  }[riskLevel];

  return [
    { subject: "Sentiment", value: clampScore(sentimentScore), fullMark: 100 },
    { subject: "Narrative", value: clampScore(narrativeStrength), fullMark: 100 },
    { subject: "Momentum", value: clampScore(momentumIndex), fullMark: 100 },
    { subject: "Hype", value: hypeValue, fullMark: 100 },
    { subject: "Safety", value: safetyValue, fullMark: 100 },
  ];
}

export async function analyzeTokenWithHuggingFace(token: string): Promise<SentimentAnalysis> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured.");
  }

  const prompt = buildPrompt(token);

  let response;

  try {
    response = await fetch(HUGGING_FACE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.2,
          top_p: 0.9,
        },
      }),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown network error.";
    throw new Error(`Unable to reach Hugging Face API: ${message}`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face request failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const parsed = parseResponse(result);

  const sentimentScore = clampScore(Number(parsed.sentimentScore));
  const narrativeStrength = clampScore(Number(parsed.narrativeStrength));
  const momentumIndex = clampScore(Number(parsed.momentumIndex));
  const sentiment = sanitizeLabel(parsed.sentiment, SENTIMENT_LABELS);
  const hypeProbability = sanitizeLabel(parsed.hypeProbability, HYPE_PROBABILITIES);
  const riskLevel = sanitizeLabel(parsed.riskLevel, RISK_LEVELS);
  const aiInsight = typeof parsed.aiInsight === "string" ? parsed.aiInsight.trim() : "No insight available.";
  const narrativeTags = sanitizeTags(parsed.narrativeTags);
  const predictionDirection = sanitizePredictionDirection(parsed.predictedDirection);
  const predictionConfidence = clampScore(Number(parsed.predictionConfidence));
  const predictionSummary = typeof parsed.predictionSummary === "string" ? parsed.predictionSummary.trim() : "No prediction summary available.";

  return {
    token: token.toUpperCase(),
    timestamp: Date.now(),
    sentimentScore,
    narrativeStrength,
    momentumIndex,
    sentiment,
    hypeProbability,
    riskLevel,
    aiInsight,
    narrativeTags,
    prediction: {
      direction: predictionDirection,
      confidence: predictionConfidence,
      timeframe: "24h",
      summary: predictionSummary,
    },
    timelineData: buildTimelineData(sentimentScore, momentumIndex),
    radarData: buildRadarData(sentimentScore, narrativeStrength, momentumIndex, hypeProbability, riskLevel),
  };
}
