import Link from "next/link";
import { Activity, ArrowUpRight, Brain, Coins, Flame, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatTile } from "@/components/ui/stat-tile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveBadge } from "@/components/market/live-badge";
import { DashboardGrid, type InitialCoinData } from "@/components/market/dashboard-grid";
import { FEATURED_COINS, CIRCULATING_SUPPLY } from "@/lib/constants";
import { getKlines, getTickers } from "@/lib/binance";
import { changeClass, formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";

export const revalidate = 30;

export default async function DashboardPage() {
  const symbols = FEATURED_COINS.map((c) => c.symbol);

  let initial: InitialCoinData[] = [];
  let totalMcap = 0;
  let totalVol = 0;
  let movers: { symbol: string; name: string; changePercent: number; price: number }[] = [];

  try {
    const [tickers, ...klineSets] = await Promise.all([
      getTickers(symbols),
      ...symbols.map((s) => getKlines(s, "1h", 48)),
    ]);
    const tickerMap = Object.fromEntries(tickers.map((t) => [t.symbol, t]));

    initial = FEATURED_COINS.map((coin, i) => {
      const t = tickerMap[coin.symbol];
      const sparkline = klineSets[i].map((k) => k.close);
      const price = t?.lastPrice ?? 0;
      totalMcap += price * (CIRCULATING_SUPPLY[coin.symbol] ?? 0);
      totalVol += t?.quoteVolume ?? 0;
      return {
        symbol: coin.symbol,
        price,
        changePercent: t?.priceChangePercent ?? 0,
        quoteVolume: t?.quoteVolume ?? 0,
        sparkline,
      };
    });

    movers = FEATURED_COINS.map((c) => ({
      symbol: c.symbol,
      name: c.name,
      changePercent: tickerMap[c.symbol]?.priceChangePercent ?? 0,
      price: tickerMap[c.symbol]?.lastPrice ?? 0,
    })).sort((a, b) => b.changePercent - a.changePercent);
  } catch {
    // Network/region failure — render with empty state; WS will populate live.
  }

  const topGainer = movers[0];
  const topLoser = movers[movers.length - 1];
  const avgChange = movers.length
    ? movers.reduce((a, m) => a + m.changePercent, 0) / movers.length
    : 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of the market's leading assets."
        icon={Activity}
      >
        <LiveBadge />
      </PageHeader>

      {/* Overview stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Tracked Market Cap"
          value={formatCompactUsd(totalMcap)}
          sub="Top 6 assets (approx.)"
          icon={Coins}
          accent="primary"
        />
        <StatTile
          label="24h Volume"
          value={formatCompactUsd(totalVol)}
          sub="Combined USDT volume"
          icon={Activity}
          accent="primary"
        />
        <StatTile
          label="Top Gainer"
          value={topGainer ? topGainer.name : "—"}
          sub={topGainer ? formatPercent(topGainer.changePercent) : ""}
          icon={TrendingUp}
          accent="profit"
        />
        <StatTile
          label="Avg 24h Change"
          value={<span className={changeClass(avgChange)}>{formatPercent(avgChange)}</span>}
          sub="Across tracked assets"
          icon={avgChange >= 0 ? TrendingUp : TrendingDown}
          accent={avgChange >= 0 ? "profit" : "loss"}
        />
      </div>

      {/* Live coin cards */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Top Cryptocurrencies</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/market">View all markets <ArrowUpRight className="size-4" /></Link>
          </Button>
        </div>
        <DashboardGrid initial={initial} />
      </div>

      {/* Movers + AI teaser */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Flame className="size-4 text-[var(--warning)]" />
            <h3 className="font-semibold">Market Movers (24h)</h3>
          </div>
          <div className="space-y-1">
            {movers.map((m) => (
              <Link
                key={m.symbol}
                href={`/charts?symbol=${m.symbol}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-accent/50"
              >
                <span className="text-sm font-medium">{m.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm tabular-nums">{formatUsd(m.price)}</span>
                  <span className={`w-20 text-right font-mono text-sm tabular-nums ${changeClass(m.changePercent)}`}>
                    {formatPercent(m.changePercent)}
                  </span>
                </div>
              </Link>
            ))}
            {movers.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                Market data is loading or unavailable in your region. Live prices will stream in shortly.
              </p>
            )}
          </div>
        </Card>

        <Card className="glass glow-grid relative overflow-hidden p-5">
          <Badge variant="secondary" className="mb-3 gap-1">
            <Brain className="size-3" /> AI Insight
          </Badge>
          <h3 className="text-lg font-semibold">Let AI read the market</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get an instant technical breakdown — trend, strength, key support &amp;
            resistance, RSI and MACD — for any asset.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/ai-analysis">Run AI Analysis <Brain className="size-4" /></Link>
          </Button>
          {topLoser && (
            <p className="mt-4 text-xs text-muted-foreground">
              Biggest dip today: <span className="font-medium text-foreground">{topLoser.name}</span>{" "}
              <span className={changeClass(topLoser.changePercent)}>
                {formatPercent(topLoser.changePercent)}
              </span>
            </p>
          )}
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Market data via Binance. CryptoPulse AI is an educational platform and does not provide financial advice.
      </p>
    </div>
  );
}
