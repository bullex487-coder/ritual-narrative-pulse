// ============================================================
// components/PricePanel.tsx
// Right sidebar — Real-time top 5 crypto prices with mini charts
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  image: string;
}

export default function PricePanel() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // Fetch Top 5 Coins
  // =========================================================

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?" +
          "vs_currency=usd&" +
          "order=market_cap_desc&" +
          "per_page=5&" +
          "sparkline=false&" +
          "locale=en"
        );

        if (!response.ok) throw new Error("Failed to fetch prices");

        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error("Price fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();

    // Refresh setiap 30 detik
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // Helper Functions
  // =========================================================

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const getPercentageColor = (percentage: number) => {
    return percentage >= 0 ? "text-emerald-400" : "text-red-400";
  };

  // Simple mini sparkline visualization
  const renderSparkline = () => {
    return (
      <div className="h-8 flex items-end gap-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-emerald-500/30 hover:bg-emerald-500/60 transition-all"
            style={{
              height: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <aside
      className="hidden xl:flex flex-col w-72 shrink-0 border-l border-zinc-800/60
        bg-black/40 backdrop-blur-sm pt-4 pb-6 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-emerald-400 tracking-widest">
            TOP TOKENS
          </span>
        </div>
        <p className="font-mono text-[10px] text-zinc-600">
          Live prices from CoinGecko
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-800/60 mx-5 mb-4" />

      {/* Loading State */}
      {loading && (
        <div className="px-5 space-y-3 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-zinc-800/30 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Price List */}
      {!loading && (
        <div className="flex-1 overflow-y-auto px-3 space-y-3 scrollbar-thin
          scrollbar-track-transparent scrollbar-thumb-zinc-800">
          {prices.map((coin, index) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-zinc-800/60 bg-zinc-900/40
                hover:border-zinc-700 hover:bg-zinc-900/70 transition-all p-3"
            >
              {/* Token Header */}
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-bold text-white truncate">
                    {coin.symbol.toUpperCase()}
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500 truncate">
                    #{coin.market_cap_rank}
                  </p>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="mb-3">
                {renderSparkline()}
              </div>

              {/* Price + Percentage */}
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs font-bold text-white">
                  {formatPrice(coin.current_price)}
                </span>
                <div
                  className={`flex items-center gap-1 font-mono text-xs font-semibold
                    ${getPercentageColor(coin.price_change_percentage_24h)}`}
                >
                  {coin.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="px-5 mt-4 pt-4 border-t border-zinc-800/60">
        <p className="font-mono text-[9px] text-zinc-600 text-center">
          Updates every 30 seconds
        </p>
      </div>
    </aside>
  );
}
