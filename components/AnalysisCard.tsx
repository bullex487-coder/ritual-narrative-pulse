// ============================================================
// components/AnalysisCard.tsx
// Individual metric score card for the analysis dashboard
// ============================================================

"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnalysisCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;       // Tailwind text color class e.g. "text-emerald-400"
  bgColor?: string;    // Tailwind bg class e.g. "bg-emerald-500/10"
  borderColor?: string;
  score?: number;      // 0–100, renders a progress bar if provided
  delay?: number;      // animation delay seconds
  glow?: boolean;
}

export default function AnalysisCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor = "bg-zinc-900/60",
  borderColor = "border-zinc-800",
  score,
  delay = 0,
  glow = false,
}: AnalysisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
      className={`relative rounded-xl border ${borderColor} ${bgColor}
        p-5 overflow-hidden backdrop-blur-sm
        ${glow ? `shadow-lg ${color.replace("text-", "shadow-")}/20` : ""}
        transition-shadow hover:shadow-xl`}
    >
      {/* Background grid decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(255,255,255,0.5) 20px,rgba(255,255,255,0.5) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,255,255,0.5) 20px,rgba(255,255,255,0.5) 21px)",
        }}
      />

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-12 h-12 opacity-20`}>
        <div
          className={`absolute top-0 right-0 w-full h-full ${color.replace(
            "text-",
            "bg-"
          )} blur-2xl`}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
          {title}
        </span>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center
            ${bgColor.includes("zinc") ? "bg-zinc-800/80" : bgColor.replace("/60", "/30")}`}
        >
          <Icon className={`w-3.5 h-3.5 ${color}`} />
        </div>
      </div>

      {/* Value */}
      <div className={`font-mono text-2xl font-bold ${color} mb-1 leading-none`}>
        {value}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="font-mono text-[11px] text-zinc-500 mt-1">{subtitle}</p>
      )}

      {/* Progress bar */}
      {score !== undefined && (
        <div className="mt-4">
          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
              className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[9px] text-zinc-700">0</span>
            <span className="font-mono text-[9px] text-zinc-700">100</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
