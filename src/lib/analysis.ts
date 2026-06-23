import type { AIAnalysis, Candle } from "./types";
import { ema, findLevels, last, macd, rsi } from "./indicators";

// Deterministic, math-driven market read. Always computed first; the Claude
// layer (see /api/ai/analyze) uses these numbers as ground truth so the LLM
// never hallucinates price levels.
export function computeRuleBasedAnalysis(symbol: string, candles: Candle[]): AIAnalysis {
  const closes = candles.map((c) => c.close);
  const price = last(closes) ?? 0;

  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const e20 = last(ema20) ?? price;
  const e50 = last(ema50) ?? price;

  const rsiSeries = rsi(closes, 14);
  const rsiVal = last(rsiSeries.filter((v) => !isNaN(v))) ?? 50;

  const { histogram, macd: macdLine, signal } = macd(closes);
  const hist = last(histogram.filter((v) => !isNaN(v))) ?? 0;
  const macdVal = last(macdLine.filter((v) => !isNaN(v))) ?? 0;
  const signalVal = last(signal.filter((v) => !isNaN(v))) ?? 0;

  const { support, resistance } = findLevels(candles);

  // Volume read: last candle vs recent average
  const vols = candles.map((c) => c.volume);
  const recentVol = vols.slice(-20);
  const avgVol = recentVol.reduce((a, b) => a + b, 0) / (recentVol.length || 1);
  const lastVol = last(vols) ?? 0;
  const volRatio = avgVol ? lastVol / avgVol : 1;

  // Score the trend on a -100..100 scale from independent signals.
  let score = 0;
  if (price > e20) score += 20;
  else score -= 20;
  if (e20 > e50) score += 20;
  else score -= 20;
  if (macdVal > signalVal) score += 18;
  else score -= 18;
  if (rsiVal > 55) score += 12;
  else if (rsiVal < 45) score -= 12;
  if (hist > 0) score += 10;
  else score -= 10;

  const trend: AIAnalysis["trend"] =
    score > 18 ? "Bullish" : score < -18 ? "Bearish" : "Neutral";
  const strength = Math.min(100, Math.round(50 + score / 2));

  let rsiCondition = "Neutral momentum";
  if (rsiVal >= 70) rsiCondition = "Overbought — pullback risk";
  else if (rsiVal <= 30) rsiCondition = "Oversold — bounce potential";
  else if (rsiVal > 55) rsiCondition = "Bullish momentum";
  else if (rsiVal < 45) rsiCondition = "Bearish momentum";

  const macdSignal: AIAnalysis["macd"]["signal"] =
    macdVal > signalVal && hist > 0 ? "Bullish" : macdVal < signalVal && hist < 0 ? "Bearish" : "Neutral";

  const volTrend = volRatio > 1.3 ? "Expanding" : volRatio < 0.7 ? "Contracting" : "Average";
  const volNote =
    volRatio > 1.3
      ? "Above-average participation confirms the current move."
      : volRatio < 0.7
        ? "Thin volume — moves may lack conviction."
        : "Volume is in line with the recent baseline.";

  const bias =
    trend === "Bullish"
      ? "Price holds above key moving averages with constructive momentum. Dips toward support may offer entries while structure holds."
      : trend === "Bearish"
        ? "Price trades below key moving averages with weak momentum. Rallies into resistance may face supply."
        : "Mixed signals — the market is consolidating. Wait for a decisive break of support or resistance.";

  return {
    symbol,
    trend,
    strength,
    summary: bias,
    support,
    resistance,
    rsi: { value: Math.round(rsiVal * 10) / 10, condition: rsiCondition },
    macd: { signal: macdSignal, histogram: Math.round(hist * 100) / 100 },
    volume: { trend: volTrend, note: volNote },
    bias,
    generatedAt: new Date().toISOString(),
    source: "rule-based",
  };
}
