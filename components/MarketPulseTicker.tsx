// ============================================================
// components/MarketPulseTicker.tsx
// Live scrolling market pulse ticker (auto-refreshes every 4s)
// ============================================================

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMarketPulse } from "@/hooks/useMarketPulse";
import { formatChange, getChangeColor, getSentimentColor } from "@/lib/helpers";
import { Radio } from "lucide-react";

export default function MarketPulseTicker() {
  const { pulse, tick } = useMarketPulse();

  return (
    <div
      className="w-full border-b border-zinc-800/60 bg-zinc-950/80
        backdrop-blur-sm overflow-hidden"
    >
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex items-center h-9 gap-4">
          {/* Label */}
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Radio className="w-2.5 h-2.5 text-emerald-400" />
            </motion.div>
            <span className="font-mono text-[10px] text-emerald-400 tracking-widest">
              LIVE
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-zinc-800" />

          {/* Ticker items */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none flex-1">
            <AnimatePresence mode="popLayout">
              {pulse.map((item) => (
                <motion.div
                  key={`${item.token}-${tick}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 shrink-0"
                >
                  {/* Token name */}
                  <span className="font-mono text-[11px] font-bold text-white">
                    {item.token}
                  </span>

                  {/* Score */}
                  <span
                    className={`font-mono text-[11px] ${getSentimentColor(
                      item.sentiment
                    )}`}
                  >
                    {item.score}
                  </span>

                  {/* Change */}
                  <span
                    className={`font-mono text-[11px] ${getChangeColor(item.change)}`}
                  >
                    {formatChange(item.change)}
                  </span>

                  {/* Separator */}
                  <span className="text-zinc-800 select-none">·</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right: update indicator */}
          <div className="shrink-0 font-mono text-[9px] text-zinc-700">
            UPD {tick}
          </div>
        </div>
      </div>
    </div>
  );
}
