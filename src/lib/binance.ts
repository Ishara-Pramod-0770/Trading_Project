import type { Candle, Ticker24h, Timeframe } from "./types";

// All Binance REST access is centralized here so it can run server-side
// (per spec: server-side API calls, no key needed for public market data).
// data-api.binance.vision is the public, CORS-friendly market-data host.
const BASE = process.env.BINANCE_REST_BASE ?? "https://data-api.binance.vision";

async function binanceFetch<T>(path: string, revalidate = 15): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Binance ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

interface RawTicker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
}

function mapTicker(t: RawTicker): Ticker24h {
  return {
    symbol: t.symbol,
    lastPrice: parseFloat(t.lastPrice),
    priceChange: parseFloat(t.priceChange),
    priceChangePercent: parseFloat(t.priceChangePercent),
    highPrice: parseFloat(t.highPrice),
    lowPrice: parseFloat(t.lowPrice),
    volume: parseFloat(t.volume),
    quoteVolume: parseFloat(t.quoteVolume),
    openPrice: parseFloat(t.openPrice),
  };
}

export async function getTickers(symbols: string[]): Promise<Ticker24h[]> {
  const param = encodeURIComponent(JSON.stringify(symbols));
  const data = await binanceFetch<RawTicker[]>(`/api/v3/ticker/24hr?symbols=${param}`);
  return data.map(mapTicker);
}

export async function getTicker(symbol: string): Promise<Ticker24h> {
  const data = await binanceFetch<RawTicker>(`/api/v3/ticker/24hr?symbol=${symbol}`);
  return mapTicker(data);
}

type RawKline = [
  number, string, string, string, string, string,
  number, string, number, string, string, string,
];

export async function getKlines(
  symbol: string,
  interval: Timeframe,
  limit = 300,
): Promise<Candle[]> {
  const data = await binanceFetch<RawKline[]>(
    `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    interval === "1m" ? 5 : 30,
  );
  return data.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }));
}
