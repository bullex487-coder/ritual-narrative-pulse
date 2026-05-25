// ============================================================
// hooks/useMarketPulse.ts
// Simulates a live market pulse feed with periodic updates
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { MarketPulseItem } from "@/types";
import { generateMarketPulse } from "@/lib/mockData";

const REFRESH_INTERVAL_MS = 4000; // update every 4 seconds

export function useMarketPulse() {
  const [pulse, setPulse] = useState<MarketPulseItem[]>([]);
  const [tick, setTick] = useState(0); // used to animate new data

  useEffect(() => {
    // Initial load
    setPulse(generateMarketPulse());

    const interval = setInterval(() => {
      setPulse(generateMarketPulse());
      setTick((t) => t + 1);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return { pulse, tick };
}
