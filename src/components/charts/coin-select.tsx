"use client";

import { MARKET_COINS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CoinSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (symbol: string) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select coin" />
      </SelectTrigger>
      <SelectContent>
        {MARKET_COINS.map((c) => (
          <SelectItem key={c.symbol} value={c.symbol}>
            <span className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.name}
              <span className="text-muted-foreground">{c.base}/USDT</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
