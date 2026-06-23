"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpToLine,
  Brain,
  CheckCircle2,
  Gauge,
  Loader2,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { AIAnalysis, Timeframe } from "@/lib/types";
import { COIN_BY_SYMBOL, TIMEFRAMES } from "@/lib/constants";
import { CoinSelect } from "@/components/charts/coin-select";
import { StrengthGauge } from "./strength-gauge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AIAnalysisPanel({ initialSymbol }: { initialSymbol: string }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [interval, setInterval] = useState<Timeframe>("4h");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIAnalysis | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, interval }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const trendColor =
    result?.trend === "Bullish"
      ? "text-profit"
      : result?.trend === "Bearish"
        ? "text-loss"
        : "text-muted-foreground";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Asset</label>
            <CoinSelect value={symbol} onChange={setSymbol} className="w-48" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Timeframe</label>
            <div className="flex rounded-lg border border-border p-0.5">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setInterval(tf.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    interval === tf.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={run} disabled={loading} className="sm:ml-auto">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
            {loading ? "Analyzing…" : "Run AI Analysis"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-loss">{error}</p>}
      </Card>

      {!result && !loading && (
        <Card className="glass glow-grid grid place-items-center p-12 text-center">
          <Sparkles className="mb-3 size-8 text-primary" />
          <h3 className="text-lg font-semibold">AI-powered market read</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Select an asset and timeframe, then run the analysis to get an instant
            technical breakdown — trend, strength, key levels, RSI, MACD and volume.
          </p>
        </Card>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Headline */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="glass flex items-center justify-between p-6 lg:col-span-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {COIN_BY_SYMBOL[result.symbol]?.name} · {interval}
                  </span>
                  <Badge variant="secondary" className="gap-1 text-[10px]">
                    {result.source === "claude" ? (
                      <><Brain className="size-3" /> Claude AI</>
                    ) : (
                      <><Gauge className="size-3" /> Rule-based</>
                    )}
                  </Badge>
                </div>
                <div className={cn("mt-1 flex items-center gap-2 text-3xl font-bold", trendColor)}>
                  {result.trend === "Bullish" ? (
                    <TrendingUp className="size-7" />
                  ) : result.trend === "Bearish" ? (
                    <TrendingDown className="size-7" />
                  ) : (
                    <Activity className="size-7" />
                  )}
                  {result.trend}
                </div>
                <p className="mt-3 max-w-lg text-sm text-muted-foreground">{result.summary}</p>
              </div>
              <StrengthGauge value={result.strength} label="Strength" />
            </Card>

            {/* Key levels */}
            <Card className="glass space-y-3 p-6">
              <h3 className="text-sm font-semibold">Key Levels</h3>
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-loss">
                  <ArrowUpToLine className="size-3.5" /> Resistance
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.resistance.length ? (
                    result.resistance.map((r) => (
                      <span key={r} className="rounded-md bg-loss/10 px-2 py-1 font-mono text-xs text-loss">
                        {formatUsd(r)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-profit">
                  <ArrowDownToLine className="size-3.5" /> Support
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.support.length ? (
                    result.support.map((s) => (
                      <span key={s} className="rounded-md bg-profit/10 px-2 py-1 font-mono text-xs text-profit">
                        {formatUsd(s)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Indicators */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="glass p-5">
              <p className="text-xs text-muted-foreground">RSI (14)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{result.rsi.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{result.rsi.condition}</p>
            </Card>
            <Card className="glass p-5">
              <p className="text-xs text-muted-foreground">MACD</p>
              <p className={cn("mt-1 text-2xl font-bold", result.macd.signal === "Bullish" ? "text-profit" : result.macd.signal === "Bearish" ? "text-loss" : "")}>
                {result.macd.signal}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Histogram {result.macd.histogram}</p>
            </Card>
            <Card className="glass p-5">
              <p className="text-xs text-muted-foreground">Volume</p>
              <p className="mt-1 text-2xl font-bold">{result.volume.trend}</p>
              <p className="mt-1 text-xs text-muted-foreground">{result.volume.note}</p>
            </Card>
          </div>

          {/* Key points + bias */}
          {(result.keyPoints?.length || result.bias) && (
            <Card className="glass p-6">
              <h3 className="mb-3 text-sm font-semibold">Takeaways</h3>
              <ul className="space-y-2">
                {(result.keyPoints ?? [result.bias]).map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <p className="rounded-lg border border-[color-mix(in_oklab,var(--warning)_30%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)] p-3 text-center text-xs text-muted-foreground">
            ⚠️ AI analysis is educational and not financial advice.
          </p>
        </motion.div>
      )}
    </div>
  );
}
