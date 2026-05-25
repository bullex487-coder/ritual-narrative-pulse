// ============================================================
// components/SentimentChart.tsx
// Sentiment timeline (area chart) + radar chart using Recharts
// ============================================================

"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import { TimelineDataPoint, RadarDataPoint } from "@/types";
import { BarChart2 } from "lucide-react";

// ── Custom tooltip for the area chart ────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="font-mono text-[10px] text-zinc-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-mono text-[11px]" style={{ color: p.color }}>
          {p.name.toUpperCase()}: {Math.round(p.value)}
        </p>
      ))}
    </div>
  );
}

interface SentimentChartProps {
  timelineData: TimelineDataPoint[];
  radarData: RadarDataPoint[];
}

export default function SentimentChart({
  timelineData,
  radarData,
}: SentimentChartProps) {
  // Only show every 3rd label to avoid crowding
  const tickIndices = timelineData
    .map((_, i) => i)
    .filter((i) => i % 3 === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-4"
    >
      {/* ── Area chart (spans 2 cols) ────────────────── */}
      <div
        className="xl:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/60
          backdrop-blur-sm p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-emerald-400 tracking-widest">
            24H SENTIMENT TIMELINE
          </span>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="momGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              tick={{ fill: "#52525b", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              ticks={timelineData
                .filter((_, i) => tickIndices.includes(i))
                .map((d) => d.time)}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#52525b", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="sentiment"
              name="Sentiment"
              stroke="#34d399"
              strokeWidth={1.5}
              fill="url(#sentGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="momentum"
              name="Momentum"
              stroke="#60a5fa"
              strokeWidth={1.5}
              fill="url(#momGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Radar chart ──────────────────────────────── */}
      <div
        className="rounded-xl border border-zinc-800 bg-zinc-900/60
          backdrop-blur-sm p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="font-mono text-[11px] text-emerald-400 tracking-widest">
            SIGNAL RADAR
          </span>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#71717a", fontSize: 9, fontFamily: "monospace" }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#34d399"
              fill="#34d399"
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
