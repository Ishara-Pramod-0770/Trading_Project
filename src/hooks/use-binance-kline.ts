"use client";

import { useEffect, useState } from "react";
import type { Candle, Timeframe } from "@/lib/types";

const WS_BASE =
  process.env.NEXT_PUBLIC_BINANCE_WS_BASE ?? "wss://data-stream.binance.vision";

interface RawKlineMsg {
  k: {
    t: number; // open time (ms)
    o: string;
    h: string;
    l: string;
    c: string;
    v: string;
    x: boolean; // is this kline closed?
  };
}

/**
 * Streams live candle (kline) updates for a single symbol/timeframe.
 * Emits the in-progress candle on every tick so charts update in real time.
 */
export function useBinanceKline(symbol: string, interval: Timeframe) {
  const [candle, setCandle] = useState<{ candle: Candle; closed: boolean } | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let closed = false;
    let retry = 0;
    let timer: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(
        `${WS_BASE}/ws/${symbol.toLowerCase()}@kline_${interval}`,
      );
      ws.onopen = () => {
        retry = 0;
      };
      ws.onmessage = (event) => {
        try {
          const { k } = JSON.parse(event.data) as RawKlineMsg;
          setCandle({
            candle: {
              time: Math.floor(k.t / 1000),
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
              volume: parseFloat(k.v),
            },
            closed: k.x,
          });
        } catch {
          /* ignore */
        }
      };
      ws.onclose = () => {
        if (closed) return;
        retry += 1;
        timer = setTimeout(connect, Math.min(1000 * 2 ** retry, 15000));
      };
      ws.onerror = () => ws?.close();
    };

    connect();
    return () => {
      closed = true;
      clearTimeout(timer);
      ws?.close();
    };
  }, [symbol, interval]);

  return candle;
}
