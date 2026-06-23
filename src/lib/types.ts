// Shared domain types for CryptoPulse AI

export interface CoinMeta {
  symbol: string; // Binance symbol e.g. BTCUSDT
  base: string; // e.g. BTC
  name: string; // e.g. Bitcoin
  color: string; // brand accent
}

export interface Ticker24h {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number; // base asset volume
  quoteVolume: number; // quote (USDT) volume
  openPrice: number;
}

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export interface AIAnalysis {
  symbol: string;
  trend: "Bullish" | "Bearish" | "Neutral";
  strength: number; // 0-100
  summary: string;
  support: number[];
  resistance: number[];
  rsi: { value: number; condition: string };
  macd: { signal: "Bullish" | "Bearish" | "Neutral"; histogram: number };
  volume: { trend: string; note: string };
  bias: string;
  keyPoints?: string[];
  generatedAt: string;
  source: "claude" | "rule-based";
}
