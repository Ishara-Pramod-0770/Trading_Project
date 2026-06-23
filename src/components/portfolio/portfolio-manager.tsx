"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import { MARKET_COINS, COIN_BY_SYMBOL } from "@/lib/constants";
import { useBinanceTickers } from "@/hooks/use-binance-stream";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { StatTile } from "@/components/ui/stat-tile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoinSelect } from "@/components/charts/coin-select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { changeClass, formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Holding {
  id: string;
  symbol: string;
  amount: number;
  avgBuyPrice: number;
}

export function PortfolioManager() {
  const [holdings, setHoldings, hydrated] = useLocalStorage<Holding[]>("cp_portfolio", []);
  const { tickers } = useBinanceTickers(MARKET_COINS.map((c) => c.symbol));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ symbol: "BTCUSDT", amount: "", avgBuyPrice: "" });

  const rows = useMemo(
    () =>
      holdings.map((h) => {
        const price = tickers[h.symbol]?.price ?? 0;
        const value = price * h.amount;
        const cost = h.avgBuyPrice * h.amount;
        const pnl = value - cost;
        const pnlPct = cost ? (pnl / cost) * 100 : 0;
        return { ...h, price, value, cost, pnl, pnlPct };
      }),
    [holdings, tickers],
  );

  const totals = rows.reduce(
    (acc, r) => {
      acc.value += r.value;
      acc.cost += r.cost;
      return acc;
    },
    { value: 0, cost: 0 },
  );
  const totalPnl = totals.value - totals.cost;
  const totalPnlPct = totals.cost ? (totalPnl / totals.cost) * 100 : 0;

  const add = () => {
    const amount = parseFloat(form.amount);
    const avgBuyPrice = parseFloat(form.avgBuyPrice);
    if (!amount || !avgBuyPrice) return;
    setHoldings((prev) => [
      ...prev,
      { id: crypto.randomUUID(), symbol: form.symbol, amount, avgBuyPrice },
    ]);
    setForm({ symbol: "BTCUSDT", amount: "", avgBuyPrice: "" });
    setOpen(false);
  };

  const remove = (id: string) => setHoldings((prev) => prev.filter((h) => h.id !== id));

  if (!hydrated) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Total Value" value={formatUsd(totals.value)} icon={Wallet} accent="primary" />
        <StatTile label="Total Cost" value={formatUsd(totals.cost)} sub="Invested" accent="primary" />
        <StatTile
          label="Unrealized P/L"
          value={<span className={changeClass(totalPnl)}>{formatUsd(totalPnl)}</span>}
          sub={<span className={changeClass(totalPnl)}>{formatPercent(totalPnlPct)}</span>}
          accent={totalPnl >= 0 ? "profit" : "loss"}
        />
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4" /> Add Holding</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Holding</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Coin</Label>
                <CoinSelect value={form.symbol} onChange={(s) => setForm((f) => ({ ...f, symbol: s }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Amount owned</Label>
                <Input
                  type="number"
                  placeholder="0.5"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Average buy price (USD)</Label>
                <Input
                  type="number"
                  placeholder="60000"
                  value={form.avgBuyPrice}
                  onChange={(e) => setForm((f) => ({ ...f, avgBuyPrice: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={add}>Add to portfolio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass overflow-hidden p-0">
        {rows.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">
            No holdings yet. Add a coin to start tracking your portfolio.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="hidden px-4 py-3 text-right sm:table-cell">Avg Buy</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-right">P/L</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const coin = COIN_BY_SYMBOL[r.symbol];
                  return (
                    <tr key={r.id} className="border-b border-border/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full" style={{ backgroundColor: coin?.color }} />
                          <span className="font-medium">{coin?.name ?? r.symbol}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">{r.amount}</td>
                      <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-muted-foreground sm:table-cell">
                        {formatUsd(r.avgBuyPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">{formatUsd(r.price)}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">{formatUsd(r.value)}</td>
                      <td className={cn("px-4 py-3 text-right font-mono tabular-nums", changeClass(r.pnl))}>
                        {formatUsd(r.pnl)}
                        <span className="block text-xs">{formatPercent(r.pnlPct)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
