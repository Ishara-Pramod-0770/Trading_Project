"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { MARKET_COINS, CIRCULATING_SUPPLY } from "@/lib/constants";
import { useBinanceTickers } from "@/hooks/use-binance-stream";
import { AnimatedPrice } from "./animated-price";
import { Sparkline } from "./sparkline";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { changeClass, formatCompactUsd, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortKey = "name" | "price" | "change" | "volume" | "mcap";

export function MarketTable({
  sparklines,
}: {
  sparklines: Record<string, number[]>;
}) {
  const { tickers } = useBinanceTickers(MARKET_COINS.map((c) => c.symbol));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "mcap", dir: -1 });

  const rows = useMemo(() => {
    const data = MARKET_COINS.map((coin) => {
      const t = tickers[coin.symbol];
      const price = t?.price ?? 0;
      return {
        coin,
        price,
        change: t?.changePercent ?? 0,
        volume: t?.quoteVolume ?? 0,
        mcap: price * (CIRCULATING_SUPPLY[coin.symbol] ?? 0),
      };
    }).filter(
      (r) =>
        r.coin.name.toLowerCase().includes(query.toLowerCase()) ||
        r.coin.base.toLowerCase().includes(query.toLowerCase()),
    );
    data.sort((a, b) => {
      const dir = sort.dir;
      if (sort.key === "name") return a.coin.name.localeCompare(b.coin.name) * dir;
      return (a[sort.key] - b[sort.key]) * dir;
    });
    return data;
  }, [tickers, query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: -1 }));

  const Th = ({ k, label, className }: { k: SortKey; label: string; className?: string }) => (
    <th className={cn("px-4 py-3 text-xs font-medium text-muted-foreground", className)}>
      <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        <ArrowUpDown className="size-3" />
      </button>
    </th>
  );

  return (
    <Card className="glass overflow-hidden p-0">
      <div className="border-b border-border/60 p-4">
        <Input
          placeholder="Search coins…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left">
            <tr>
              <Th k="name" label="Asset" />
              <Th k="price" label="Price" className="text-right" />
              <Th k="change" label="24h %" className="text-right" />
              <Th k="mcap" label="Market Cap" className="hidden text-right md:table-cell" />
              <Th k="volume" label="Volume" className="hidden text-right sm:table-cell" />
              <th className="hidden px-4 py-3 text-right text-xs font-medium text-muted-foreground lg:table-cell">
                7d
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ coin, price, change, volume, mcap }) => (
              <tr key={coin.symbol} className="border-b border-border/40 transition-colors hover:bg-accent/40">
                <td className="px-4 py-3">
                  <Link href={`/charts?symbol=${coin.symbol}`} className="flex items-center gap-3">
                    <span
                      className="grid size-8 place-items-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: coin.color }}
                    >
                      {coin.base.slice(0, 3)}
                    </span>
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-xs text-muted-foreground">{coin.base}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <AnimatedPrice value={price} className="font-medium" />
                </td>
                <td className={cn("px-4 py-3 text-right font-mono tabular-nums", changeClass(change))}>
                  {formatPercent(change)}
                </td>
                <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-muted-foreground md:table-cell">
                  {formatCompactUsd(mcap)}
                </td>
                <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-muted-foreground sm:table-cell">
                  {formatCompactUsd(volume)}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <div className="flex justify-end">
                    <Sparkline data={sparklines[coin.symbol] ?? []} positive={change >= 0} width={100} height={32} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
