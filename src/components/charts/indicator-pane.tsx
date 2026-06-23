"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  LineSeries,
  HistogramSeries,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useTheme } from "next-themes";
import type { Candle } from "@/lib/types";
import { macd as calcMacd, rsi as calcRsi } from "@/lib/indicators";
import { CHART_COLORS } from "@/lib/chart-theme";

export function IndicatorPane({
  candles,
  type,
}: {
  candles: Candle[];
  type: "rsi" | "macd";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

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
      grid: { vertLines: { color: colors.grid }, horzLines: { color: colors.grid } },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border, timeVisible: true, secondsVisible: false },
      autoSize: true,
    });
    chartRef.current = chart;
    const closes = candles.map((c) => c.close);

    if (type === "rsi") {
      const rsiVals = calcRsi(closes, 14);
      const line = chart.addSeries(LineSeries, {
        color: colors.line,
        lineWidth: 2,
        priceLineVisible: false,
      });
      line.setData(
        candles
          .map((c, i) => ({ time: c.time as UTCTimestamp, value: rsiVals[i] }))
          .filter((p) => isFinite(p.value)),
      );
      line.createPriceLine({ price: 70, color: colors.down, lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "70" });
      line.createPriceLine({ price: 30, color: colors.up, lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "30" });
    } else {
      const { macd: macdLine, signal, histogram } = calcMacd(closes);
      const hist = chart.addSeries(HistogramSeries, {});
      hist.setData(
        candles
          .map((c, i) => ({
            time: c.time as UTCTimestamp,
            value: histogram[i],
            color: histogram[i] >= 0 ? colors.volUp : colors.volDown,
          }))
          .filter((p) => isFinite(p.value)),
      );
      const m = chart.addSeries(LineSeries, { color: colors.ema20, lineWidth: 2, priceLineVisible: false });
      m.setData(candles.map((c, i) => ({ time: c.time as UTCTimestamp, value: macdLine[i] })).filter((p) => isFinite(p.value)));
      const s = chart.addSeries(LineSeries, { color: colors.ema50, lineWidth: 2, priceLineVisible: false });
      s.setData(candles.map((c, i) => ({ time: c.time as UTCTimestamp, value: signal[i] })).filter((p) => isFinite(p.value)));
    }

    chart.timeScale().fitContent();
    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, type, theme]);

  return (
    <div className="relative">
      <span className="absolute left-2 top-1 z-10 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {type === "rsi" ? "RSI (14)" : "MACD (12, 26, 9)"}
      </span>
      <div ref={containerRef} className="h-32 w-full" />
    </div>
  );
}
