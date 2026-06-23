// Number / currency / compact formatting helpers

export function formatPrice(value: number, opts?: { maxDigits?: number }): string {
  if (!isFinite(value)) return "—";
  const abs = Math.abs(value);
  let digits = opts?.maxDigits;
  if (digits == null) {
    if (abs >= 1000) digits = 2;
    else if (abs >= 1) digits = 2;
    else if (abs >= 0.01) digits = 4;
    else digits = 8;
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits >= 4 ? 2 : 2,
    maximumFractionDigits: digits,
  });
}

export function formatUsd(value: number, digits = 2): string {
  if (!isFinite(value)) return "—";
  return "$" + formatPrice(value, { maxDigits: digits });
}

export function formatCompact(value: number): string {
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactUsd(value: number): string {
  return "$" + formatCompact(value);
}

export function formatPercent(value: number, withSign = true): string {
  if (!isFinite(value)) return "—";
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function changeClass(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-muted-foreground";
}
