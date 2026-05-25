// ============================================================
// components/LoadingState.tsx
// Terminal-style AI scanning / loading animation
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";

const SCAN_STEPS = [
  "Connecting to Ritual oracle network...",
  "Fetching on-chain signal data...",
  "Analyzing social sentiment vectors...",
  "Computing narrative strength index...",
  "Running AI inference engine...",
  "Calibrating hype probability model...",
  "Cross-referencing historical patterns...",
  "Generating intelligence report...",
];

interface LoadingStateProps {
  token: string;
}

export default function LoadingState({ token }: LoadingStateProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(".");

  // Cycle through steps
  useEffect(() => {
    const stepMs = 2200 / SCAN_STEPS.length;
    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, SCAN_STEPS.length - 1));
    }, stepMs);
    return () => clearInterval(id);
  }, []);

  // Smooth progress bar
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 0.8, 95));
    }, 18);
    return () => clearInterval(id);
  }, []);

  // Animated dots
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70
        backdrop-blur-sm p-8"
    >
      {/* Top: spinning CPU icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          {/* Outer glow ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent
              border-t-emerald-500/60 border-r-emerald-500/20"
            style={{ width: 64, height: 64, margin: -8 }}
          />
          <div
            className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30
              flex items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Cpu className="w-6 h-6 text-emerald-400" />
            </motion.div>
          </div>
        </div>

        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="font-mono text-xs text-emerald-400 tracking-widest"
        >
          ANALYZING {token}{dots}
        </motion.p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1.5">
          <span className="font-mono text-[10px] text-zinc-600">PROCESSING</span>
          <span className="font-mono text-[10px] text-emerald-400 tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
          <motion.div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Scan steps terminal */}
      <div
        className="rounded-lg bg-black/60 border border-zinc-800/80 p-4
          font-mono text-[11px] space-y-1.5 max-h-48 overflow-hidden"
      >
        {SCAN_STEPS.slice(0, stepIndex + 1).map((step, i) => (
          <AnimatePresence key={i}>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {i < stepIndex ? (
                <span className="text-emerald-500">✓</span>
              ) : (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-emerald-400"
                >
                  ›
                </motion.span>
              )}
              <span
                className={
                  i < stepIndex ? "text-zinc-600" : "text-zinc-400"
                }
              >
                {step}
              </span>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
}
