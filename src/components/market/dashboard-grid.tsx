"use client";

import { FEATURED_COINS, CIRCULATING_SUPPLY } from "@/lib/constants";
import { useBinanceTickers } from "@/hooks/use-binance-stream";
import { CoinCard, type CoinCardData } from "./coin-card";

export interface InitialCoinData {
  symbol: string;
  price: number;
  changePercent: number;
  quoteVolume: number;
  sparkline: number[];
}

export function DashboardGrid({ initial }: { initial: InitialCoinData[] }) {
  const symbols = FEATURED_COINS.map((c) => c.symbol);
  const { tickers } = useBinanceTickers(symbols);

  const initialMap = Object.fromEntries(initial.map((d) => [d.symbol, d]));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURED_COINS.map((coin, i) => {
        const base = initialMap[coin.symbol];
        const live = tickers[coin.symbol];
        const price = live?.price ?? base?.price ?? 0;
        const data: CoinCardData = {
          price,
          changePercent: live?.changePercent ?? base?.changePercent ?? 0,
          quoteVolume: live?.quoteVolume ?? base?.quoteVolume ?? 0,
          marketCap: price * (CIRCULATING_SUPPLY[coin.symbol] ?? 0),
          sparkline: base?.sparkline ?? [],
        };
        return <CoinCard key={coin.symbol} coin={coin} data={data} index={i} />;
      })}
    </div>
  );
}
