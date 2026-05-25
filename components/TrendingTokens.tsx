"use client";

import { useEffect, useState } from "react";

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}

export default function TrendingTokens() {

  const [coins, setCoins] = useState<
    TrendingCoin[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // Fetch Trending Coins
  // =========================================================

  useEffect(() => {

    async function fetchTrending() {

      try {

        const response = await fetch(
          "https://api.coingecko.com/api/v3/search/trending"
        );

        const data = await response.json();

        const formatted =
          data.coins.map(
            (item: any) => ({
              id: item.item.id,
              name: item.item.name,
              symbol: item.item.symbol,
              thumb: item.item.thumb,
              market_cap_rank:
                item.item.market_cap_rank,
            })
          );

        setCoins(formatted);

      } catch (error) {

        console.error(
          "Trending fetch error:",
          error
        );

      } finally {

        setLoading(false);
      }
    }

    fetchTrending();

  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="
        rounded-2xl
        border border-zinc-800
        bg-zinc-900/60
        backdrop-blur
        p-5
      "
    >

      {/* Header */}

      <div className="mb-4">

        <h2
          className="
            text-sm font-mono
            tracking-widest
            text-emerald-400
          "
        >
          TRENDING TOKENS
        </h2>

      </div>

      {/* Loading */}

      {loading && (

        <div className="space-y-3">

          {Array.from({ length: 5 }).map(
            (_, i) => (

              <div
                key={i}
                className="
                  h-12 rounded-lg
                  bg-zinc-800/50
                  animate-pulse
                "
              />
            )
          )}

        </div>

      )}

      {/* Tokens */}

      {!loading && (

        <div className="space-y-2">

          {coins.map((coin, index) => (

            <div
              key={coin.id}

              className="
                flex items-center gap-3
                p-3 rounded-xl

                border border-zinc-800
                hover:border-emerald-500/30

                hover:bg-zinc-800/40
                transition-all
              "
            >

              {/* Rank */}

              <div
                className="
                  text-xs font-mono
                  text-zinc-500
                  w-5
                "
              >
                #{index + 1}
              </div>

              {/* Logo */}

              <img
                src={coin.thumb}
                alt={coin.name}
                className="
                  w-8 h-8 rounded-full
                "
              />

              {/* Info */}

              <div className="flex-1">

                <p
                  className="
                    text-sm text-white
                    font-medium
                  "
                >
                  {coin.name}
                </p>

                <p
                  className="
                    text-xs text-zinc-500
                  "
                >
                  {coin.symbol.toUpperCase()}
                </p>

              </div>

              {/* Market Rank */}

              <div
                className="
                  text-xs text-emerald-400
                  font-mono
                "
              >
                #{coin.market_cap_rank}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}