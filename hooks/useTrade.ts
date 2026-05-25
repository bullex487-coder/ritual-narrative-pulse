// ============================================================
// hooks/useTrade.ts
// Trade execution state and history storage for Narrative Pulse
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { TradeExecution, TradeSide } from "@/types";
import { generateId } from "@/lib/helpers";

const STORAGE_KEY = "narrative_pulse_trades";

function loadTradeHistory(): TradeExecution[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TradeExecution[]) : [];
  } catch {
    return [];
  }
}

function persistTradeHistory(trades: TradeExecution[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

interface ExecuteTradePayload {
  token: string;
  side: TradeSide;
  amount: number;
  walletAddress?: string | null;
}

export function useTrade() {
  const [history, setHistory] = useState<TradeExecution[]>(() => loadTradeHistory());
  const [lastTrade, setLastTrade] = useState<TradeExecution | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadTradeHistory());
  }, []);

  const executeTrade = useCallback(async (payload: ExecuteTradePayload) => {
    setError(null);
    setIsTrading(true);

    const token = payload.token.trim().toUpperCase();
    const amount = Number(payload.amount);
    const basePrice = 0.12 + Math.min(2, amount * 0.04);
    const executedPrice = `$${(basePrice + (payload.side === "Buy" ? 0.02 : -0.01)).toFixed(4)}`;
    const priceImpact = `${(Math.max(0.15, Math.min(1.8, amount * 0.04))).toFixed(2)}%`;

    let txHash: string | undefined;
    let status = "Simulated trade executed";

    if (payload.walletAddress) {
      try {
        const ethereum = (window as any).ethereum;
        if (ethereum?.request) {
          const tx = await ethereum.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: payload.walletAddress,
                to: payload.walletAddress,
                value: "0x0",
                data: "0x",
              },
            ],
          });
          txHash = typeof tx === "string" ? tx : undefined;
          status = txHash ? "Trade transaction submitted" : status;
        }
      } catch (err: unknown) {
        console.warn("Trade signed transaction failed, fallback to simulation:", err);
      }
    }

    const trade: TradeExecution = {
      id: generateId(),
      token,
      side: payload.side,
      action: "Trade",
      amount,
      executedPrice,
      priceImpact,
      status,
      txHash,
      timestamp: Date.now(),
    };

    setHistory((current) => {
      const next = [trade, ...current].slice(0, 12);
      persistTradeHistory(next);
      return next;
    });
    setLastTrade(trade);
    setIsTrading(false);

    return trade;
  }, []);

  const withdraw = useCallback(async (token: string, walletAddress?: string | null) => {
    setError(null);
    setIsTrading(true);

    const formattedToken = token.trim().toUpperCase();
    let status = "Withdraw simulated";
    let txHash: string | undefined;

    if (walletAddress) {
      try {
        const ethereum = (window as any).ethereum;
        if (ethereum?.request) {
          const tx = await ethereum.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: walletAddress,
                to: walletAddress,
                value: "0x0",
                data: "0x",
              },
            ],
          });
          txHash = typeof tx === "string" ? tx : undefined;
          status = txHash ? "Withdraw transaction submitted" : status;
        }
      } catch (err: unknown) {
        console.warn("Withdraw signed transaction failed, fallback to simulation:", err);
      }
    }

    const withdrawRecord: TradeExecution = {
      id: generateId(),
      token: formattedToken,
      side: "Sell",
      action: "Withdraw",
      amount: 0,
      executedPrice: "N/A",
      priceImpact: "0.00%",
      status,
      txHash,
      timestamp: Date.now(),
    };

    setHistory((current) => {
      const next = [withdrawRecord, ...current].slice(0, 12);
      persistTradeHistory(next);
      return next;
    });
    setLastTrade(withdrawRecord);
    setIsTrading(false);

    return withdrawRecord;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    persistTradeHistory([]);
  }, []);

  return {
    history,
    lastTrade,
    isTrading,
    error,
    setError,
    executeTrade,
    withdraw,
    clearHistory,
  };
}
