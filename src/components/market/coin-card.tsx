"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import type { CoinMeta } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Sparkline } from "./sparkline";
import { AnimatedPrice } from "./animated-price";
import { changeClass, formatCompactUsd, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface CoinCardData {
  price: number;
  changePercent: number;
  quoteVolume: number;
  marketCap: number;
  sparkline: number[];
}

export function CoinCard({
  coin,
  data,
  index = 0,
}: {
  coin: CoinMeta;
  data: CoinCardData;
  index?: number;
}) {
  const up = data.changePercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/charts?symbol=${coin.symbol}`}>
        <Card className="glass group relative overflow-hidden p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className="grid size-9 place-items-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: coin.color }}
              >
                {coin.base.slice(0, 3)}
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">{coin.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{coin.base}/USDT</p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <AnimatedPrice value={data.price} className="text-xl font-bold -ml-1" />
              <div className={cn("mt-1 flex items-center gap-1 text-sm font-medium", changeClass(data.changePercent))}>
                {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {formatPercent(data.changePercent)}
              </div>
            </div>
            <Sparkline data={data.sparkline} positive={up} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
            <div>
              <p className="text-muted-foreground">Market Cap</p>
              <p className="mt-0.5 font-mono font-medium tabular-nums">
                {formatCompactUsd(data.marketCap)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">24h Volume</p>
              <p className="mt-0.5 font-mono font-medium tabular-nums">
                {formatCompactUsd(data.quoteVolume)}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
