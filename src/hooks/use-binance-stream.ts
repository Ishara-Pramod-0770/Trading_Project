"use client";

import { useEffect, useRef, useState } from "react";

const WS_BASE =
  process.env.NEXT_PUBLIC_BINANCE_WS_BASE ?? "wss://data-stream.binance.vision";

export interface LiveTicker {
  symbol: string;
  price: number;
  changePercent: number;
  change: number;
  high: number;
  low: number;
  quoteVolume: number;
  open: number;
}

interface RawTickerMsg {
  s: string; // symbol
  c: string; // last price
  P: string; // price change percent
  p: string; // price change
  h: string;
  l: string;
  q: string; // quote volume
  o: string; // open
}

/**
 * Subscribe to Binance combined !ticker streams for the given symbols and keep
 * a live map of the latest values. Auto-reconnects with backoff. The UI updates
 * instantly on every tick — no polling, no page refresh.
 */
export function useBinanceTickers(symbols: string[]) {
  const [tickers, setTickers] = useState<Record<string, LiveTicker>>({});
  const [connected, setConnected] = useState(false);
  const key = symbols.join(",");

  useEffect(() => {
    if (symbols.length === 0) return;
    let ws: WebSocket | null = null;
    let closed = false;
    let retry = 0;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");

    const connect = () => {
      ws = new WebSocket(`${WS_BASE}/stream?streams=${streams}`);

      ws.onopen = () => {
        retry = 0;
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as { data: RawTickerMsg };
          const d = parsed.data;
          if (!d?.s) return;
          setTickers((prev) => ({
            ...prev,
            [d.s]: {
              symbol: d.s,
              price: parseFloat(d.c),
              changePercent: parseFloat(d.P),
              change: parseFloat(d.p),
              high: parseFloat(d.h),
              low: parseFloat(d.l),
              quoteVolume: parseFloat(d.q),
              open: parseFloat(d.o),
            },
          }));
        } catch {
          // ignore malformed frames
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (closed) return;
        retry += 1;
        const delay = Math.min(1000 * 2 ** retry, 15000);
        reconnectTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      closed = true;
      clearTimeout(reconnectTimer);
      ws?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { tickers, connected };
}
