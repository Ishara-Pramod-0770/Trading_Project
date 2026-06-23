import { CandlestickChart } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ChartWorkspace } from "@/components/charts/chart-workspace";
import { LiveBadge } from "@/components/market/live-badge";
import { COIN_BY_SYMBOL } from "@/lib/constants";

export default async function ChartsPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  const { symbol } = await searchParams;
  const initialSymbol =
    symbol && COIN_BY_SYMBOL[symbol.toUpperCase()] ? symbol.toUpperCase() : "BTCUSDT";

  return (
    <div>
      <PageHeader
        title="Charts"
        description="Professional candlestick charts with live data, multiple timeframes and technical indicators."
        icon={CandlestickChart}
      >
        <LiveBadge />
      </PageHeader>
      <ChartWorkspace initialSymbol={initialSymbol} />
      <p className="mt-4 text-xs text-muted-foreground">
        Tip: scroll to zoom, drag to pan. Toggle EMA, SMA, Bollinger Bands, VWAP, RSI and MACD above the chart.
      </p>
    </div>
  );
}
