"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useTheme } from "next-themes";
import type { Candle } from "@/lib/types";
import { bollinger, ema, sma, vwap } from "@/lib/indicators";
import { CHART_COLORS } from "@/lib/chart-theme";

export interface OverlayState {
  ema20: boolean;
  ema50: boolean;
  sma50: boolean;
  bollinger: boolean;
  vwap: boolean;
}

function toLine(candles: Candle[], values: number[]) {
  return candles
    .map((c, i) => ({ time: c.time as UTCTimestamp, value: values[i] }))
    .filter((p) => isFinite(p.value));
}

export function TradingChart({
  candles,
  overlays,
  liveCandle,
}: {
  candles: Candle[];
  overlays: OverlayState;
  liveCandle: { candle: Candle; closed: boolean } | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const overlayRefs = useRef<ISeriesApi<"Line">[]>([]);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  // Create chart once.
  useEffect(() => {
    if (!containerRef.current) return;
    const colors = CHART_COLORS[theme];
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
        fontFamily: "var(--font-sans)",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border, timeVisible: true, secondsVisible: false },
      autoSize: true,
    });
    chartRef.current = chart;

    candleRef.current = chart.addSeries(CandlestickSeries, {
      upColor: colors.up,
      downColor: colors.down,
      borderVisible: false,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });

    volumeRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
    });
    chart.priceScale("vol").applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    return () => {
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volumeRef.current = null;
      overlayRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to theme changes.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const colors = CHART_COLORS[theme];
    chart.applyOptions({
      layout: { background: { type: ColorType.Solid, color: colors.background }, textColor: colors.text },
      grid: { vertLines: { color: colors.grid }, horzLines: { color: colors.grid } },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border },
    });
    candleRef.current?.applyOptions({
      upColor: colors.up,
      downColor: colors.down,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });
  }, [theme]);

  // Set base candle + volume data.
  useEffect(() => {
    if (!candleRef.current || !volumeRef.current) return;
    const colors = CHART_COLORS[theme];
    candleRef.current.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );
    volumeRef.current.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? colors.volUp : colors.volDown,
      })),
    );
    chartRef.current?.timeScale().fitContent();
  }, [candles, theme]);

  // Manage overlay line series.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || candles.length === 0) return;
    const colors = CHART_COLORS[theme];

    overlayRefs.current.forEach((s) => chart.removeSeries(s));
    overlayRefs.current = [];

    const add = (values: number[], color: string, width = 2) => {
      const s = chart.addSeries(LineSeries, {
        color,
        lineWidth: width as 1 | 2 | 3 | 4,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      s.setData(toLine(candles, values));
      overlayRefs.current.push(s);
    };

    const closes = candles.map((c) => c.close);
    if (overlays.ema20) add(ema(closes, 20), colors.ema20);
    if (overlays.ema50) add(ema(closes, 50), colors.ema50);
    if (overlays.sma50) add(sma(closes, 50), colors.sma);
    if (overlays.vwap) add(vwap(candles), colors.vwap);
    if (overlays.bollinger) {
      const bb = bollinger(closes, 20, 2);
      add(bb.upper, colors.bb, 1);
      add(bb.middle, colors.bb, 1);
      add(bb.lower, colors.bb, 1);
    }
  }, [overlays, candles, theme]);

  // Live updates from the websocket.
  useEffect(() => {
    if (!liveCandle || !candleRef.current || !volumeRef.current) return;
    const colors = CHART_COLORS[theme];
    const c = liveCandle.candle;
    candleRef.current.update({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    });
    volumeRef.current.update({
      time: c.time as UTCTimestamp,
      value: c.volume,
      color: c.close >= c.open ? colors.volUp : colors.volDown,
    });
  }, [liveCandle, theme]);

  return <div ref={containerRef} className="h-full w-full" />;
}
