"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format";

/**
 * Renders a price that briefly flashes green/red whenever it ticks up/down,
 * giving the live-terminal feel without re-rendering the whole card.
 */
export function AnimatedPrice({
  value,
  className,
  prefix = true,
}: {
  value: number;
  className?: string;
  prefix?: boolean;
}) {
  const prev = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (value > prev.current) setFlash("up");
    else if (value < prev.current) setFlash("down");
    prev.current = value;
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span
      className={cn(
        "inline-block rounded px-1 font-mono tabular-nums transition-colors",
        flash === "up" && "flash-up",
        flash === "down" && "flash-down",
        className,
      )}
    >
      {prefix ? formatUsd(value) : value.toLocaleString("en-US")}
    </span>
  );
}
