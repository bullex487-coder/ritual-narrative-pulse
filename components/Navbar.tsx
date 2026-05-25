// ============================================================
// components/Navbar.tsx
// Top navigation bar with branding, status indicator, and nav
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Radio, Zap } from "lucide-react";
import WalletButton from "./WalletButton";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [blockHeight, setBlockHeight] = useState(4_291_847);

  // Update clock every second
  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Simulate block height incrementing
  useEffect(() => {
    const id = setInterval(() => {
      setBlockHeight((h) => h + Math.floor(Math.random() * 3));
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/80
        bg-black/70 backdrop-blur-xl ${className}`}
    >
      <div className="mx-auto max-w-screen-xl px-4 h-14 flex items-center justify-between">

        {/* ── Brand ─────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-7 h-7 rounded-md bg-emerald-500/20 border border-emerald-500/50
              flex items-center justify-center"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
          </motion.div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-white tracking-wider text-sm">
              NARRATIVE
            </span>
            <span className="font-mono font-bold text-emerald-400 tracking-wider text-sm">
              PULSE
            </span>
          </div>

          {/* Protocol badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded
            bg-emerald-500/10 border border-emerald-500/20">
            <img 
              src="/ritual-logo.svg" 
              alt="Ritual Logo" 
              className="w-3.5 h-3.5"
            />
            <span className="font-mono text-[10px] text-emerald-400 tracking-widest">
              RITUAL
            </span>
          </div>
        </div>

        {/* ── Center status ─────────────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {/* AI Status */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
            <span className="font-mono text-[11px] text-zinc-400">
              AI ENGINE ONLINE
            </span>
          </div>

          {/* Network */}
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-blue-400" />
            <span className="font-mono text-[11px] text-zinc-400">
              RITUAL TESTNET
            </span>
          </div>

          {/* Block */}
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-zinc-500" />
            <span className="font-mono text-[11px] text-zinc-500">
              #{blockHeight.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Right: clock + wallet ──────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded
            bg-zinc-900/80 border border-zinc-800">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-300 tabular-nums">
              {currentTime} UTC
            </span>
          </div>
          
          {/* Wallet Button */}
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
