"use client";

import { FEATURED_COINS } from "@/lib/constants";
import { useBinanceTickers } from "@/hooks/use-binance-stream";
import { cn } from "@/lib/utils";

export function LiveBadge({ className }: { className?: string }) {
  const { connected } = useBinanceTickers(FEATURED_COINS.map((c) => c.symbol));
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        connected
          ? "border-profit/30 bg-profit/10 text-profit"
          : "border-muted-foreground/30 text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          connected ? "bg-profit live-dot" : "bg-muted-foreground",
        )}
      />
      {connected ? "Live" : "Connecting…"}
    </span>
  );
}
