// ============================================================
// services/api.ts
// Client-side API service layer for Narrative Pulse
// All fetch calls to Next.js API routes live here.
// ============================================================

import { AnalyzeRequest, AnalyzeResponse, SentimentAnalysis } from "@/types";

const BASE_URL = "/api";

// ── Analysis ──────────────────────────────────────────────────

/**
 * POST /api/analyze
 * Sends a token ticker to the backend for AI sentiment analysis.
 */
export async function analyzeToken(token: string): Promise<SentimentAnalysis> {
  const payload: AnalyzeRequest = { token: token.trim().toUpperCase() };

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Analysis failed (${res.status}): ${errorText}`);
  }

  const json: AnalyzeResponse = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Unknown error from analysis API");
  }

  return json.data;
}

// ── Blockchain (Ritual placeholder) ──────────────────────────

/**
 * Placeholder: submit analysis hash to Ritual network.
 * Replace with actual Ritual/ethers.js logic when integrating.
 */
export async function submitToRitual(analysisId: string): Promise<string> {
  // TODO: integrate with Ritual testnet via ethers.js
  // Example:
  //   const provider = new ethers.JsonRpcProvider(RITUAL_RPC_URL);
  //   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  //   const tx = await contract.submitAnalysis(analysisId);
  //   return tx.hash;

  console.warn("submitToRitual: Ritual integration not yet implemented.");
  return `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`;
}

// ── OpenAI placeholder ────────────────────────────────────────

/**
 * Placeholder: call OpenAI for enhanced reasoning.
 * Currently handled server-side in /api/analyze.
 * This client stub is reserved for future streaming support.
 */
export async function fetchAIReasoning(_token: string): Promise<string> {
  // TODO: implement streaming OpenAI response
  return "";
}
