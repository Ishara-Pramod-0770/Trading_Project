import { LineChart } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MarketTable } from "@/components/market/market-table";
import { LiveBadge } from "@/components/market/live-badge";
import { MARKET_COINS } from "@/lib/constants";
import { getKlines } from "@/lib/binance";

export const revalidate = 60;

export default async function MarketPage() {
  const sparklines: Record<string, number[]> = {};
  try {
    const sets = await Promise.all(
      MARKET_COINS.map((c) => getKlines(c.symbol, "4h", 42).catch(() => [])),
    );
    MARKET_COINS.forEach((c, i) => {
      sparklines[c.symbol] = sets[i].map((k) => k.close);
    });
  } catch {
    // sparklines optional
  }

  return (
    <div>
      <PageHeader
        title="Market"
        description="Live prices, market cap and volume across major crypto assets."
        icon={LineChart}
      >
        <LiveBadge />
      </PageHeader>
      <MarketTable sparklines={sparklines} />
    </div>
  );
}
