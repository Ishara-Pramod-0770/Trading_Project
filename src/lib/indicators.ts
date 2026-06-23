import type { Candle } from "./types";

// Pure technical-analysis math. Shared by the Charts overlays and the
// rule-based portion of the AI analysis engine.

export function sma(values: number[], period: number): number[] {
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : NaN);
  }
  return out;
}

export function ema(values: number[], period: number): number[] {
  const out: number[] = [];
  const k = 2 / (period + 1);
  let prev = NaN;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(NaN);
      continue;
    }
    if (isNaN(prev)) {
      // seed with SMA of first `period` values
      const seed = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      prev = seed;
    } else {
      prev = values[i] * k + prev * (1 - k);
    }
    out.push(prev);
  }
  return out;
}

export function rsi(values: number[], period = 14): number[] {
  const out: number[] = new Array(values.length).fill(NaN);
  if (values.length <= period) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gain += diff;
    else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  out[period] = 100 - 100 / (1 + avgGain / (avgLoss || 1e-9));
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const g = diff > 0 ? diff : 0;
    const l = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    out[i] = 100 - 100 / (1 + avgGain / (avgLoss || 1e-9));
  }
  return out;
}

export function macd(
  values: number[],
  fast = 12,
  slow = 26,
  signalPeriod = 9,
): { macd: number[]; signal: number[]; histogram: number[] } {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine = values.map((_, i) =>
    isNaN(emaFast[i]) || isNaN(emaSlow[i]) ? NaN : emaFast[i] - emaSlow[i],
  );
  const valid = macdLine.filter((v) => !isNaN(v));
  const signalValid = ema(valid, signalPeriod);
  // re-align signal back onto the full-length array
  const signal: number[] = new Array(macdLine.length).fill(NaN);
  let j = 0;
  for (let i = 0; i < macdLine.length; i++) {
    if (!isNaN(macdLine[i])) {
      signal[i] = signalValid[j];
      j++;
    }
  }
  const histogram = macdLine.map((v, i) =>
    isNaN(v) || isNaN(signal[i]) ? NaN : v - signal[i],
  );
  return { macd: macdLine, signal, histogram };
}

export function bollinger(
  values: number[],
  period = 20,
  mult = 2,
): { upper: number[]; middle: number[]; lower: number[] } {
  const middle = sma(values, period);
  const upper: number[] = [];
  const lower: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }
    const slice = values.slice(i - period + 1, i + 1);
    const mean = middle[i];
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const sd = Math.sqrt(variance);
    upper.push(mean + mult * sd);
    lower.push(mean - mult * sd);
  }
  return { upper, middle, lower };
}

export function atr(candles: Candle[], period = 14): number[] {
  const tr: number[] = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prev = candles[i - 1].close;
    return Math.max(c.high - c.low, Math.abs(c.high - prev), Math.abs(c.low - prev));
  });
  return ema(tr, period);
}

export function vwap(candles: Candle[]): number[] {
  let cumPV = 0;
  let cumVol = 0;
  return candles.map((c) => {
    const typical = (c.high + c.low + c.close) / 3;
    cumPV += typical * c.volume;
    cumVol += c.volume;
    return cumVol ? cumPV / cumVol : NaN;
  });
}

// Detect swing-based support / resistance pivots from recent candles.
export function findLevels(
  candles: Candle[],
  lookback = 2,
): { support: number[]; resistance: number[] } {
  const support: number[] = [];
  const resistance: number[] = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    const win = candles.slice(i - lookback, i + lookback + 1);
    const isLow = win.every((c) => candles[i].low <= c.low);
    const isHigh = win.every((c) => candles[i].high >= c.high);
    if (isLow) support.push(candles[i].low);
    if (isHigh) resistance.push(candles[i].high);
  }
  const cluster = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => b - a);
    const result: number[] = [];
    for (const v of sorted) {
      if (!result.some((r) => Math.abs(r - v) / r < 0.012)) result.push(v);
      if (result.length >= 3) break;
    }
    return result;
  };
  return { support: cluster(support), resistance: cluster(resistance) };
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
