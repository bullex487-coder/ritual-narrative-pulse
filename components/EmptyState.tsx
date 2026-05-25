// ============================================================
// components/EmptyState.tsx
// Shown when no analysis has been run yet
// ============================================================

"use client";

import { motion } from "framer-motion";
import { Activity, ArrowDown } from "lucide-react";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Animated icon */}
      <div className="relative mb-6">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px rgba(52,211,153,0)",
              "0 0 40px rgba(52,211,153,0.15)",
              "0 0 0px rgba(52,211,153,0)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800
            flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Activity className="w-7 h-7 text-emerald-400/60" />
          </motion.div>
        </motion.div>

        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-start justify-center"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div
            className="w-2 h-2 rounded-full bg-emerald-400/50 -mt-1"
            style={{ marginTop: -4 }}
          />
        </motion.div>
      </div>

      <h3 className="font-mono text-lg font-bold text-white mb-2">
        NARRATIVE PULSE READY
      </h3>
      <p className="font-mono text-sm text-zinc-500 max-w-xs leading-relaxed">
        Enter a token ticker above to generate an AI-powered sentiment analysis report.
      </p>

      <div className="flex items-center gap-2 mt-6">
        <ArrowDown className="w-3 h-3 text-zinc-700" />
        <span className="font-mono text-[11px] text-zinc-700">
          Try BTC, ETH, or SOL to get started
        </span>
      </div>

      {/* Background grid decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(52,211,153,0.8) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
