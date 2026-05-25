// ============================================================
// hooks/useAnalysis.ts
// Core state management hook for token analysis flow
// ============================================================

"use client";

import { useState, useCallback } from "react";
import { SentimentAnalysis, SavedAnalysis } from "@/types";
import { analyzeToken } from "@/services/api";
import {
  loadSavedAnalyses,
  saveAnalysis,
  deleteSavedAnalysis,
} from "@/lib/helpers";

interface UseAnalysisReturn {
  isAnalyzing: boolean;
  currentAnalysis: SentimentAnalysis | null;
  savedAnalyses: SavedAnalysis[];
  error: string | null;
  analyze: (token: string) => Promise<void>;
  save: () => SavedAnalysis | null;
  remove: (id: string) => void;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(() =>
    loadSavedAnalyses()
  );
  const [error, setError] = useState<string | null>(null);

  /** Trigger analysis for a given token ticker */
  const analyze = useCallback(async (token: string) => {
    if (!token.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const result = await analyzeToken(token);
      setCurrentAnalysis(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /** Save the current analysis to localStorage */
  const save = useCallback((): SavedAnalysis | null => {
    if (!currentAnalysis) return null;
    const saved = saveAnalysis(currentAnalysis);
    setSavedAnalyses(loadSavedAnalyses());
    return saved;
  }, [currentAnalysis]);

  /** Remove a saved analysis by ID */
  const remove = useCallback((id: string) => {
    const updated = deleteSavedAnalysis(id);
    setSavedAnalyses(updated);
  }, []);

  /** Clear current analysis and error */
  const reset = useCallback(() => {
    setCurrentAnalysis(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    currentAnalysis,
    savedAnalyses,
    error,
    analyze,
    save,
    remove,
    reset,
  };
}
