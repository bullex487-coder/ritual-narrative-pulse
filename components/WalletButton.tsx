// ============================================================
// components/WalletButton.tsx
// Wallet connect/disconnect button for Navbar
// ============================================================

"use client";

import { useWallet } from "@/hooks/useWallet";
import { motion } from "framer-motion";
import { Wallet, LogOut, Loader2 } from "lucide-react";

export default function WalletButton() {
  const { address, isConnected, isConnecting, error, connectWallet, disconnectWallet } = useWallet();

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <motion.button
        disabled
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg
          bg-emerald-500/20 border border-emerald-500/50
          font-mono text-xs text-emerald-400 font-semibold"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>CONNECTING...</span>
      </motion.button>
    );
  }

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        {/* Connected status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
          bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-400 tracking-widest">
            {formatAddress(address)}
          </span>
        </div>

        {/* Disconnect button */}
        <motion.button
          onClick={disconnectWallet}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg
            border border-zinc-700 hover:border-red-500/50
            bg-zinc-900/40 hover:bg-red-500/10
            font-mono text-xs text-zinc-400 hover:text-red-400
            transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Disconnect</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={connectWallet}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg
        bg-emerald-500 hover:bg-emerald-400
        text-black font-mono text-xs font-semibold
        transition-all"
    >
      <Wallet className="w-3.5 h-3.5" />
      <span>CONNECT</span>
    </motion.button>
  );
}
