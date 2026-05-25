// ============================================================
// app/api/analyze/route.ts
// Next.js API Route — Token sentiment analysis endpoint
//
// Production: replace generateMockAnalysis() with real
// OpenAI API calls and on-chain data fetchers.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { analyzeTokenWithHuggingFace } from "@/lib/huggingFace";
import { generateMockAnalysis } from "@/lib/mockData";
import { AnalyzeResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = (body.token as string | undefined)?.trim().toUpperCase();

    // ── Validation ──────────────────────────────────────────
    if (!token) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    if (!/^[A-Z0-9]{1,10}$/.test(token)) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: "Invalid token format" },
        { status: 400 }
      );
    }

    // ── AI Analysis through Hugging Face / fallback to mock ──
    let analysis;
    const useMock = !process.env.HUGGINGFACE_API_KEY;

    if (useMock) {
      console.warn("[/api/analyze] HUGGINGFACE_API_KEY missing. Falling back to mock analysis.");
      analysis = generateMockAnalysis(token);
    } else {
      try {
        analysis = await analyzeTokenWithHuggingFace(token);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : "Unknown Hugging Face error.";

        console.warn("[/api/analyze] Hugging Face error, falling back to mock analysis:", message, error);
        analysis = generateMockAnalysis(token);
      }
    }

    return NextResponse.json<AnalyzeResponse>({ success: true, data: analysis });
  } catch (err: unknown) {
    console.error("[/api/analyze] Error:", err);
    return NextResponse.json<AnalyzeResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
