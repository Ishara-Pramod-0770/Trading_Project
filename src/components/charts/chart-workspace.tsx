"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Brain, Loader2 } from "lucide-react";
import type { Candle, Timeframe } from "@/lib/types";
import { TIMEFRAMES, COIN_BY_SYMBOL } from "@/lib/constants";
import { useBinanceKline } from "@/hooks/use-binance-kline";
import { TradingChart, type OverlayState } from "./trading-chart";
import { IndicatorPane } from "./indicator-pane";
import { CoinSelect } from "./coin-select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { changeClass, formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const OVERLAY_LABELS: { key: keyof OverlayState; label: string }[] = [
  { key: "ema20", label: "EMA 20" },
  { key: "ema50", label: "EMA 50" },
  { key: "sma50", label: "SMA 50" },
  { key: "bollinger", label: "Bollinger" },
  { key: "vwap", label: "VWAP" },
];

export function ChartWorkspace({ initialSymbol }: { initialSymbol: string }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [interval, setInterval] = useState<Timeframe>("1h");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [overlays, setOverlays] = useState<OverlayState>({
    ema20: true,
    ema50: true,
    sma50: false,
    bollinger: false,
    vwap: false,
  });
  const [showRsi, setShowRsi] = useState(true);
  const [showMacd, setShowMacd] = useState(false);

  const live = useBinanceKline(symbol, interval);

  // Load historical candles when symbol/interval changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/klines?symbol=${symbol}&interval=${interval}&limit=500`)
      .then((r) => r.json())
      .then((d) => {
        if (active && d.candles) setCandles(d.candles);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [symbol, interval]);

  // Merge a closed live candle into the dataset so indicator panes refresh.
  useEffect(() => {
    if (!live?.closed) return;
    setCandles((prev) => {
      if (prev.length === 0) return prev;
      const lastTime = prev[prev.length - 1].time;
      if (live.candle.time > lastTime) return [...prev.slice(-499), live.candle];
      if (live.candle.time === lastTime) {
        const copy = [...prev];
        copy[copy.length - 1] = live.candle;
        return copy;
      }
      return prev;
    });
  }, [live]);

  const meta = COIN_BY_SYMBOL[symbol];
  const livePrice = live?.candle.close ?? candles[candles.length - 1]?.close ?? 0;
  const firstClose = candles[0]?.close ?? livePrice;
  const sessionChange = firstClose ? ((livePrice - firstClose) / firstClose) * 100 : 0;

  const toggle = (key: keyof OverlayState) =>
    setOverlays((o) => ({ ...o, [key]: !o[key] }));

  const paneCount = useMemo(() => (showRsi ? 1 : 0) + (showMacd ? 1 : 0), [showRsi, showMacd]);

  return (
    <Card className="glass overflow-hidden p-0">
      {/* Header controls */}
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <CoinSelect value={symbol} onChange={setSymbol} className="w-44" />
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold tabular-nums">
                {formatUsd(livePrice)}
              </span>
              <span className={cn("font-mono text-sm tabular-nums", changeClass(sessionChange))}>
                {formatPercent(sessionChange)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{meta?.name} · {interval} session</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setInterval(tf.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  interval === tf.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href={`/ai-analysis?symbol=${symbol}`}>
              <Brain className="size-4" /> Analyze
            </Link>
          </Button>
        </div>
      </div>

      {/* Indicator toggles */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/60 px-4 py-2">
        <span className="mr-1 text-xs text-muted-foreground">Overlays:</span>
        {OVERLAY_LABELS.map((o) => (
          <Badge
            key={o.key}
            variant={overlays[o.key] ? "default" : "outline"}
            className="cursor-pointer select-none"
            onClick={() => toggle(o.key)}
          >
            {o.label}
          </Badge>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <Badge
          variant={showRsi ? "default" : "outline"}
          className="cursor-pointer select-none"
          onClick={() => setShowRsi((v) => !v)}
        >
          RSI
        </Badge>
        <Badge
          variant={showMacd ? "default" : "outline"}
          className="cursor-pointer select-none"
          onClick={() => setShowMacd((v) => !v)}
        >
          MACD
        </Badge>
      </div>

      {/* Charts */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}
        <div
          className="w-full"
          style={{ height: paneCount === 0 ? 520 : paneCount === 1 ? 440 : 380 }}
        >
          {candles.length > 0 && (
            <TradingChart candles={candles} overlays={overlays} liveCandle={live} />
          )}
        </div>
        {showRsi && candles.length > 0 && (
          <div className="border-t border-border/60">
            <IndicatorPane candles={candles} type="rsi" />
          </div>
        )}
        {showMacd && candles.length > 0 && (
          <div className="border-t border-border/60">
            <IndicatorPane candles={candles} type="macd" />
          </div>
        )}
      </div>
    </Card>
  );
}
