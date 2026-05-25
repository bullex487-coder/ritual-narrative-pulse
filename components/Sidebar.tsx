// ============================================================
// components/Sidebar.tsx
// Left sidebar — saved analysis history + Ritual integration
// ============================================================

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Trash2, Link2, ChevronRight, Clock, Repeat } from "lucide-react";
import { SavedAnalysis, TradeExecution } from "@/types";
import { formatTimestamp, getSentimentColor } from "@/lib/helpers";

interface SidebarProps {
  savedAnalyses: SavedAnalysis[];
  tradeHistory: TradeExecution[];
  onSelect: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  onClearHistory?: () => void;
}

export default function Sidebar({
  savedAnalyses,
  tradeHistory,
  onSelect,
  onDelete,
  onClearHistory,
}: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 border-r border-zinc-800/60
        bg-black/40 backdrop-blur-sm pt-4 pb-6 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-emerald-400 tracking-widest">
            SAVED ANALYSES
          </span>
        </div>
        <p className="font-mono text-[10px] text-zinc-600">
          {savedAnalyses.length} / 20 stored locally
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/60 mx-4 mb-4" />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 scrollbar-thin
        scrollbar-track-transparent scrollbar-thumb-zinc-800">
        <AnimatePresence>
          {savedAnalyses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-2 py-8 text-center"
            >
              <p className="font-mono text-[11px] text-zinc-600 leading-relaxed">
                No analyses saved yet.
                <br />
                Analyze a token and click Save.
              </p>
            </motion.div>
          )}

          {savedAnalyses.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="group relative rounded-lg border border-zinc-800/60
                  bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70
                  transition-all cursor-pointer p-3"
                onClick={() => onSelect(item)}
              >
                {/* Token + score */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">
                      {item.analysis.token}
                    </span>
                    {item.onChain && (
                      <Link2 className="w-3 h-3 text-blue-400"/>
                    )}
                  </div>
                  <span
                    className={`font-mono text-xs font-bold
                      ${getSentimentColor(item.analysis.sentiment)}`}
                  >
                    {item.analysis.sentimentScore}
                  </span>
                </div>

                {/* Sentiment label */}
                <p className="font-mono text-[10px] text-zinc-500 truncate mb-2">
                  {item.analysis.sentiment}
                </p>

                {/* Timestamp */}
                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-zinc-700" />
                  <span className="font-mono text-[9px] text-zinc-700">
                    {formatTimestamp(item.savedAt)}
                  </span>
                </div>

                {/* Hover actions */}
                <div
                  className="absolute inset-y-0 right-1 hidden group-hover:flex
                    items-center gap-1"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1 rounded text-zinc-600 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trade history */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-[11px] text-sky-400 tracking-widest">
              TRADE HISTORY
            </span>
          </div>
          {tradeHistory.length > 0 && onClearHistory && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-[10px] text-zinc-500 hover:text-rose-400 transition"
            >
              Clear
            </button>
          )}
        </div>
        <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-3">
          {tradeHistory.length === 0 ? (
            <p className="font-mono text-[10px] text-zinc-600 leading-relaxed">
              No trade activity yet.
              <br />
              Execute a trade to populate the history.
            </p>
          ) : (
            <div className="space-y-3">
              {tradeHistory.slice(0, 5).map((trade) => (
                <div key={trade.id} className="rounded-2xl border border-zinc-800/60 bg-black/40 p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      {trade.action === "Withdraw" ? "Withdraw" : trade.side} {trade.token}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {formatTimestamp(trade.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-sm text-white">
                      {trade.action === "Withdraw" ? "Withdraw request" : `${trade.amount} ${trade.token}`}
                    </p>
                    <p className="font-mono text-[11px] text-zinc-400">
                      {trade.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Ritual placeholder */}
      <div className="px-4 mt-4">
        <div className="h-px bg-zinc-800/60 mb-4" />
        <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-3">
          <p className="font-mono text-[10px] text-zinc-500 mb-2">
            RITUAL INTEGRATION
          </p>
          <p className="font-mono text-[9px] text-zinc-700 leading-relaxed">
            Blockchain persistence coming soon.
            Analyses will be anchored on the
            Ritual testnet for immutable history.
          </p>
          <div className="mt-2 h-px bg-zinc-800/40" />
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="font-mono text-[9px] text-zinc-600">
              TESTNET — NOT LIVE
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
