// Plain-hex color palettes for lightweight-charts (canvas), kept separate from
// the oklch CSS tokens so colors render consistently across browsers.
export interface ChartColors {
  background: string;
  text: string;
  grid: string;
  border: string;
  up: string;
  down: string;
  volUp: string;
  volDown: string;
  ema20: string;
  ema50: string;
  sma: string;
  bb: string;
  vwap: string;
  line: string;
}

export const CHART_COLORS: Record<"light" | "dark", ChartColors> = {
  dark: {
    background: "rgba(0,0,0,0)",
    text: "#9aa4bf",
    grid: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.08)",
    up: "#26d07c",
    down: "#f6465d",
    volUp: "rgba(38,208,124,0.35)",
    volDown: "rgba(246,70,93,0.35)",
    ema20: "#7c6cff",
    ema50: "#f7931a",
    sma: "#2dd4bf",
    bb: "rgba(124,108,255,0.5)",
    vwap: "#facc15",
    line: "#7c6cff",
  },
  light: {
    background: "rgba(0,0,0,0)",
    text: "#5b6478",
    grid: "rgba(0,0,0,0.06)",
    border: "rgba(0,0,0,0.1)",
    up: "#16a34a",
    down: "#dc2626",
    volUp: "rgba(22,163,74,0.3)",
    volDown: "rgba(220,38,38,0.3)",
    ema20: "#6d28d9",
    ema50: "#ea580c",
    sma: "#0d9488",
    bb: "rgba(109,40,217,0.4)",
    vwap: "#ca8a04",
    line: "#6d28d9",
  },
};
