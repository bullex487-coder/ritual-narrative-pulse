"use client";

import {
  useState,
  useEffect,
  KeyboardEvent,
  FormEvent,
} from "react";

import { motion } from "framer-motion";

import {
  Search,
  Loader2,
  Zap,
} from "lucide-react";

const QUICK_TOKENS = [
  "BTC",
  "ETH",
  "SOL",
  "AVAX",
  "LINK",
  "ARB",
  "PEPE",
  "OP",
];

interface TokenInputProps {
  onAnalyze: (token: string) => void;
  isLoading: boolean;
}

export default function TokenInput({
  onAnalyze,
  isLoading,
}: TokenInputProps) {

  // =========================================================
  // State
  // =========================================================

  const [value, setValue] = useState("");

  const [focused, setFocused] =
    useState(false);

  const [suggestions, setSuggestions] =
    useState<any[]>([]);

  // =========================================================
  // CoinGecko Search
  // =========================================================

  useEffect(() => {

    async function searchTokens() {

      if (value.length < 1) {
        setSuggestions([]);
        return;
      }

      // Only search jika minimal 1 huruf (bukan angka/simbol random)
      if (!/[a-zA-Z]/.test(value)) {
        setSuggestions([]);
        return;
      }

      try {

        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${value}`
        );

        const data = await response.json();

        // Filter: hanya tampilkan coins yang BENAR-BENAR match
        const filtered = (data.coins || []).filter((coin: any) => {
          const name = coin.name.toLowerCase();
          const symbol = coin.symbol.toLowerCase();
          const query = value.toLowerCase();
          
          return (
            symbol.includes(query) || 
            name.includes(query)
          );
        }).slice(0, 6);

        setSuggestions(filtered);

      } catch (error) {

        console.error(
          "CoinGecko search error:",
          error
        );
        setSuggestions([]);
      }
    }

    const timeout = setTimeout(() => {
      searchTokens();
    }, 400);

    return () => clearTimeout(timeout);

  }, [value]);

  // =========================================================
  // Submit
  // =========================================================

  function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    if (
      value.trim() &&
      !isLoading
    ) {
      onAnalyze(
        value.trim().toUpperCase()
      );
    }
  }

  function handleKey(
    e: KeyboardEvent
  ) {
    if (e.key === "Enter") {
      handleSubmit(
        e as unknown as FormEvent
      );
    }
  }

  function handleQuick(
    token: string
  ) {
    setValue(token);

    onAnalyze(token);
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full">

      {/* Label */}

      <div className="flex items-center gap-2 mb-3">

        <Zap className="w-3.5 h-3.5 text-emerald-400" />

        <span
          className="
          font-mono
          text-[11px]
          text-emerald-400
          tracking-widest
        "
        >
          TOKEN ANALYSIS INPUT
        </span>

      </div>

      {/* Input */}

      <div
        className={`
          relative flex items-center gap-3
          rounded-xl border
          transition-all duration-200

          ${
            focused
              ? "border-emerald-500/60 shadow-[0_0_20px_rgba(52,211,153,0.12)]"
              : "border-zinc-800"
          }

          bg-zinc-900/70
          backdrop-blur
          px-4 py-3
        `}
      >

        <Search className="w-4 h-4 text-zinc-500 shrink-0" />

        <input
          type="text"

          value={value}

          onChange={(e) =>
            setValue(
              e.target.value.toUpperCase()
            )
          }

          onKeyDown={handleKey}

          onFocus={() =>
            setFocused(true)
          }

          onBlur={() =>
            setFocused(false)
          }

          placeholder="Search token..."

          disabled={isLoading}

          className="
            flex-1 bg-transparent
            font-mono text-sm text-white
            placeholder:text-zinc-600
            outline-none
          "

          autoComplete="off"
        />

        {/* Submit Button */}

        <motion.button

          onClick={handleSubmit}

          disabled={
            !value.trim() ||
            isLoading
          }

          whileHover={{
            scale: 1.02,
          }}

          whileTap={{
            scale: 0.98,
          }}

          className="
            shrink-0 flex items-center gap-2
            px-4 py-1.5 rounded-lg

            font-mono text-xs font-semibold
            tracking-wider

            disabled:opacity-40
            disabled:cursor-not-allowed

            bg-emerald-500
            hover:bg-emerald-400
            text-black
          "
        >

          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>SCANNING</span>
            </>
          ) : (
            <span>ANALYZE</span>
          )}

        </motion.button>

      </div>

      {/* Suggestions */}

      {suggestions.length > 0 && (

        <div
          className="
            mt-2 rounded-xl
            border border-zinc-800
            bg-zinc-900/95
            overflow-hidden
          "
        >

          {suggestions.map((coin) => (

            <button

              key={coin.id}

              onClick={() => {

                setValue(
                  coin.symbol.toUpperCase()
                );

                setSuggestions([]);

                onAnalyze(
                  coin.symbol.toUpperCase()
                );
              }}

              className="
                w-full flex items-center gap-3
                px-4 py-3

                hover:bg-zinc-800
                transition-all

                border-b border-zinc-800/50
                last:border-none
              "
            >

              <img
                src={coin.thumb}
                alt={coin.name}
                className="w-5 h-5 rounded-full"
              />

              <div className="text-left">

                <p className="text-sm text-white">
                  {coin.name}
                </p>

                <p className="text-xs text-zinc-500">
                  {coin.symbol.toUpperCase()}
                </p>

              </div>

            </button>

          ))}

        </div>

      )}

      {/* Quick Tokens */}

      <div className="flex flex-wrap gap-2 mt-3">

        <span
          className="
            font-mono text-[10px]
            text-zinc-600 self-center
          "
        >
          QUICK:
        </span>

        {QUICK_TOKENS.map((token) => (

          <motion.button

            key={token}

            onClick={() =>
              handleQuick(token)
            }

            disabled={isLoading}

            whileHover={{
              scale: 1.05,
            }}

            whileTap={{
              scale: 0.95,
            }}

            className="
              px-2.5 py-1 rounded-md
              border border-zinc-800
              bg-zinc-900/60

              font-mono text-[11px]
              text-zinc-400

              hover:text-emerald-400
              hover:border-emerald-500/40
              hover:bg-emerald-500/5

              transition-all
            "
          >

            {token}

          </motion.button>

        ))}

      </div>

    </div>
  );
}