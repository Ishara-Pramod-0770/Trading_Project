"use client";

import { FEATURED_COINS } from "@/lib/constants";
import { useBinanceTickers } from "@/hooks/use-binance-stream";
import { changeClass, formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TickerTape() {
  const { tickers } = useBinanceTickers(FEATURED_COINS.map((c) => c.symbol));

  return (
    <div className="hidden items-center gap-5 overflow-hidden lg:flex">
      {FEATURED_COINS.map((coin) => {
        const t = tickers[coin.symbol];
        return (
          <div key={coin.symbol} className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-muted-foreground">{coin.base}</span>
            <span className="font-mono tabular-nums">
              {t ? formatUsd(t.price) : "—"}
            </span>
            {t && (
              <span className={cn("font-mono tabular-nums", changeClass(t.changePercent))}>
                {formatPercent(t.changePercent)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
