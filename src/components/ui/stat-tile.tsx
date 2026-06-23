import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "profit" | "loss" | "warning";
  className?: string;
}) {
  const accentClass = {
    primary: "text-primary bg-primary/10",
    profit: "text-profit bg-profit/10",
    loss: "text-loss bg-loss/10",
    warning: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  }[accent ?? "primary"];

  return (
    <Card className={cn("glass p-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn("grid size-7 place-items-center rounded-lg", accentClass)}>
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
}
