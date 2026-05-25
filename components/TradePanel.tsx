"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingCart, Clock3, Activity, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { FAUCET_URL } from "@/lib/ritualConfig";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TradeSide, TradeExecution } from "@/types";

interface TradePanelProps {
  defaultToken?: string;
  history: TradeExecution[];
  lastTrade: TradeExecution | null;
  isTrading: boolean;
  tradeError: string | null;
  setTradeError: (error: string | null) => void;
  executeTrade: (payload: {
    token: string;
    side: TradeSide;
    amount: number;
    walletAddress?: string | null;
  }) => Promise<TradeExecution>;
  withdraw: (token: string, walletAddress?: string | null) => Promise<TradeExecution>;
}

const TRADE_SIDES: TradeSide[] = ["Buy", "Sell"];

function formatTradeTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TradePanel({
  defaultToken = "BTC",
  history,
  lastTrade,
  isTrading,
  tradeError,
  setTradeError,
  executeTrade,
  withdraw,
}: TradePanelProps) {
  const { address, balance, tokenBalance, tokenSymbol, isConnected, isConnecting, connectWallet, error: walletError } = useWallet();

  const [token, setToken] = useState(defaultToken);
  const [side, setSide] = useState<TradeSide>("Buy");
  const [amount, setAmount] = useState("0.5");
  const [message, setMessage] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ t: string; price: number }[]>([]);
  const [openPrice, setOpenPrice] = useState<number | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    setToken(defaultToken || "BTC");
  }, [defaultToken]);

  useEffect(() => {
    const symbol = (lastTrade?.token || token || "BTC").trim().toLowerCase();
    const parsedPrice = lastTrade?.executedPrice
      ? parseFloat(String(lastTrade.executedPrice).replace(/[^0-9.]/g, ""))
      : NaN;

    async function loadMarketChart() {
      setChartError(null);
      try {
        const searchResponse = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(symbol)}`
        );
        if (!searchResponse.ok) throw new Error("Failed to search CoinGecko");

        const searchData = await searchResponse.json();
        const match = (searchData.coins || []).find(
          (coin: any) => coin.symbol?.toLowerCase() === symbol
        ) || searchData.coins?.[0];

        if (!match) {
          throw new Error("No market data found for token");
        }

        const id = match.id;
        const chartResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=1&interval=hourly`
        );
        if (!chartResponse.ok) throw new Error("Failed to fetch chart data");

        const chartJson = await chartResponse.json();
        const prices = chartJson.prices || [];
        const historyData = prices.map((item: [number, number], index: number) => {
          const date = new Date(item[0]);
          return {
            t: `${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`,
            price: Number(item[1].toFixed(6)),
          };
        });

        if (historyData.length === 0) {
          throw new Error("No chart points returned");
        }

        setChartData(historyData);
        setOpenPrice(Number.isFinite(parsedPrice) && !isNaN(parsedPrice)
          ? parsedPrice
          : historyData[historyData.length - 1].price);
      } catch (err: unknown) {
        console.warn("Market chart fetch failed, using fallback:", err);
        setChartError("Market chart unavailable — using synthetic preview.");
        const points = 24;
        const base = Number.isFinite(parsedPrice) && !isNaN(parsedPrice) ? parsedPrice : 1 + Math.random() * 4;
        const fallback: { t: string; price: number }[] = [];
        let p = base * (0.95 + Math.random() * 0.1);
        for (let i = 0; i < points; i++) {
          p = p * (1 + (Math.random() - 0.5) * 0.02);
          fallback.push({ t: `${i - points + 1}`, price: parseFloat(p.toFixed(6)) });
        }
        setChartData(fallback);
        setOpenPrice(Number.isFinite(parsedPrice) && !isNaN(parsedPrice) ? parsedPrice : fallback[fallback.length - 1].price);
      }
    }

    loadMarketChart();
  }, [lastTrade, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setTradeError(null);

    if (!token.trim()) {
      setMessage("Enter a valid token symbol.");
      return;
    }

    const amountValue = Number(amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setMessage("Enter a valid trade amount.");
      return;
    }

    if (!isConnected || !address) {
      setMessage("Connect your wallet to execute a trade.");
      return;
    }

    const trade = await executeTrade({
      token,
      side,
      amount: amountValue,
      walletAddress: address,
    });

    setMessage(`Trade ${trade.side.toLowerCase()} order created for ${trade.amount} ${trade.token}. ${trade.status}.`);
  };

  const handleWithdraw = async () => {
    setMessage(null);
    setTradeError(null);

    if (!token.trim()) {
      setMessage("Enter a valid token symbol to withdraw.");
      return;
    }

    if (!isConnected || !address) {
      setMessage("Connect your wallet to withdraw.");
      return;
    }

    const result = await withdraw(token, address);
    setMessage(`Withdraw request created for ${result.token}. ${result.status}.`);
  };

  const handleOpenFaucet = () => {
    window.open(FAUCET_URL, "_blank", "noreferrer");
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setMessage("Wallet address copied to clipboard. Paste it into the faucet form.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 mt-6 shadow-xl"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[11px] text-emerald-400 tracking-widest">
              TRADE DESK
            </span>
          </div>
          <h3 className="font-mono text-xl font-semibold text-white">
            Execute a trade on Ritual testnet
          </h3>
          <p className="font-mono text-[11px] text-zinc-500 mt-1 max-w-2xl">
            Connect your wallet and simulate buy / sell orders for tokens analyzed in the dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {isConnected && address ? (
            <>
              <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300 font-mono">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </div>
              {balance && (
                <div className="rounded-full border border-zinc-700/30 bg-zinc-900/70 px-3 py-1 text-[11px] text-zinc-400 font-mono">
                  Gas: {balance} RTL
                </div>
              )}
              {tokenBalance && tokenSymbol && (
                <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-300 font-mono">
                  {tokenSymbol}: {tokenBalance}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleOpenFaucet}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-mono text-emerald-300 hover:bg-emerald-500/15 transition"
                >
                  Claim Faucet
                </button>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-4 py-1.5 text-[11px] font-mono text-zinc-300 hover:border-emerald-500/30 hover:text-emerald-300 transition"
                >
                  Copy Address
                </button>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={isTrading}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-[11px] font-mono text-sky-300 hover:bg-sky-500/15 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-mono text-emerald-300 hover:bg-emerald-500/15 transition"
            >
              {isConnecting ? <Clock3 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-2 text-[11px] font-mono text-zinc-400">
            Token
            <input
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              className="rounded-2xl border border-zinc-800 bg-black/60 px-4 py-3 text-white font-mono text-sm outline-none transition focus:border-emerald-400"
              placeholder="BTC"
            />
          </label>

          <label className="flex flex-col gap-2 text-[11px] font-mono text-zinc-400">
            Side
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as TradeSide)}
              className="rounded-2xl border border-zinc-800 bg-black/60 px-4 py-3 text-white font-mono text-sm outline-none transition focus:border-emerald-400"
            >
              {TRADE_SIDES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-[11px] font-mono text-zinc-400">
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-2xl border border-zinc-800 bg-black/60 px-4 py-3 text-white font-mono text-sm outline-none transition focus:border-emerald-400"
              placeholder="0.5"
            />
          </label>
        </div>

        <div className="flex items-end justify-end">
          <button
            type="submit"
            disabled={isTrading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isTrading ? "Executing..." : "Execute Trade"}
          </button>
        </div>
      </form>

      {(message || walletError || tradeError) && (
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-mono text-orange-200">
          {message || walletError || tradeError}
        </div>
      )}

      {lastTrade && (
        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-500 font-mono mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Last executed trade
              </div>
              <p className="font-mono text-lg text-white">
                {lastTrade.side} {lastTrade.amount} {lastTrade.token} @ {lastTrade.executedPrice}
              </p>
            </div>
            <span className="rounded-full bg-zinc-800/70 px-3 py-1 text-[11px] font-mono text-zinc-400">
              {formatTradeTime(lastTrade.timestamp)}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Status
              </p>
              <p className="mt-2 font-mono text-sm text-white">{lastTrade.status}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Price impact
              </p>
              <p className="mt-2 font-mono text-sm text-white">{lastTrade.priceImpact}</p>
            </div>
          </div>
          {lastTrade.txHash && (
            <div className="mt-4 font-mono text-xs text-zinc-500 break-all">
              TX Hash: <span className="text-emerald-300">{lastTrade.txHash}</span>
            </div>
          )}
          {/* Mini price chart for the last executed position */}
          <div className="mt-4">
            <div className="rounded-2xl border border-zinc-800 bg-black/50 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-[11px] text-zinc-500">Position chart — {lastTrade.token}</div>
                <div className="font-mono text-[13px] text-white">
                  Open: <span className="text-emerald-300">
                    {openPrice !== null ? `$${openPrice.toFixed(6)}` : "N/A"}
                  </span>
                </div>
              </div>
              {chartError && (
                <p className="font-mono text-[10px] text-orange-400 mb-2">
                  {chartError}
                </p>
              )}
              <div style={{ height: 120 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#111827" />
                      <XAxis dataKey="t" hide />
                      <YAxis domain={["auto", "auto"]} hide />
                      <Tooltip formatter={(v: number) => `$${v}`} />
                      <Line type="monotone" dataKey="price" stroke="#34d399" strokeWidth={2} dot={false} />
                      {openPrice !== null && (
                        <ReferenceLine y={openPrice} stroke="#60a5fa" strokeDasharray="4 4" label={{ value: 'OPEN', position: 'top', fill: '#60a5fa', fontSize: 11 }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-zinc-500">
                    Chart data unavailable.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="flex items-center gap-2 mb-4 text-[11px] uppercase tracking-[0.24em] text-zinc-500 font-mono">
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
            <span>Recent trade activity</span>
          </div>
          <div className="space-y-3">
            {history.slice(0, 3).map((trade) => (
              <div key={trade.id} className="grid gap-2 rounded-2xl border border-zinc-800 bg-black/40 p-3 sm:grid-cols-[auto_1fr_auto]">
                <div>
                  <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.22em]">
                    {trade.side} {trade.token}
                  </p>
                  <p className="font-mono text-sm text-white">{trade.amount} {trade.token}</p>
                </div>
                <div className="font-mono text-[11px] text-zinc-400">
                  {trade.executedPrice} · {trade.priceImpact}
                </div>
                <div className="text-right text-[11px] text-zinc-500">
                  {formatTradeTime(trade.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
