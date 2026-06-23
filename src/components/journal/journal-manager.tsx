"use client";

import { useMemo, useState } from "react";
import { NotebookPen, Plus, Trash2, TrendingDown, TrendingUp, Target, Percent } from "lucide-react";
import { MARKET_COINS, COIN_BY_SYMBOL } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { StatTile } from "@/components/ui/stat-tile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

interface Trade {
  id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
  strategy: string;
  notes: string;
  screenshot?: string;
}

function pnlOf(t: Trade) {
  const raw = (t.exitPrice - t.entryPrice) * t.quantity;
  const pnl = t.side === "LONG" ? raw : -raw;
  const cost = t.entryPrice * t.quantity;
  return { pnl, pct: cost ? (pnl / cost) * 100 : 0 };
}

const emptyForm = {
  symbol: "BTCUSDT",
  side: "LONG" as "LONG" | "SHORT",
  entryPrice: "",
  exitPrice: "",
  quantity: "1",
  date: "",
  strategy: "",
  notes: "",
  screenshot: "" as string | undefined,
};

export function JournalManager() {
  const [trades, setTrades, hydrated] = useLocalStorage<Trade[]>("cp_journal", []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const stats = useMemo(() => {
    if (trades.length === 0) return { winRate: 0, avgWin: 0, avgLoss: 0, total: 0, net: 0 };
    const pnls = trades.map((t) => pnlOf(t).pnl);
    const wins = pnls.filter((p) => p > 0);
    const losses = pnls.filter((p) => p < 0);
    return {
      winRate: (wins.length / trades.length) * 100,
      avgWin: wins.length ? wins.reduce((a, b) => a + b, 0) / wins.length : 0,
      avgLoss: losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 0,
      total: trades.length,
      net: pnls.reduce((a, b) => a + b, 0),
    };
  }, [trades]);

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, screenshot: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const add = () => {
    const entryPrice = parseFloat(form.entryPrice);
    const exitPrice = parseFloat(form.exitPrice);
    const quantity = parseFloat(form.quantity) || 1;
    if (!entryPrice || !exitPrice) return;
    setTrades((prev) => [
      {
        id: crypto.randomUUID(),
        symbol: form.symbol,
        side: form.side,
        entryPrice,
        exitPrice,
        quantity,
        date: form.date || new Date().toISOString().slice(0, 10),
        strategy: form.strategy,
        notes: form.notes,
        screenshot: form.screenshot || undefined,
      },
      ...prev,
    ]);
    setForm({ ...emptyForm });
    setOpen(false);
  };

  const remove = (id: string) => setTrades((prev) => prev.filter((t) => t.id !== id));

  if (!hydrated) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Win Rate" value={`${stats.winRate.toFixed(0)}%`} icon={Percent} accent="primary" />
        <StatTile label="Avg Win" value={<span className="text-profit">{formatUsd(stats.avgWin)}</span>} icon={TrendingUp} accent="profit" />
        <StatTile label="Avg Loss" value={<span className="text-loss">{formatUsd(stats.avgLoss)}</span>} icon={TrendingDown} accent="loss" />
        <StatTile label="Total Trades" value={stats.total} sub={<span className={changeClass(stats.net)}>Net {formatUsd(stats.net)}</span>} icon={Target} accent="primary" />
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4" /> Log Trade</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log a Trade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Coin</Label>
                  <CoinSelect value={form.symbol} onChange={(s) => setForm((f) => ({ ...f, symbol: s }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Side</Label>
                  <div className="flex rounded-lg border border-border p-0.5">
                    {(["LONG", "SHORT"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm((f) => ({ ...f, side: s }))}
                        className={cn(
                          "flex-1 rounded-md py-1.5 text-xs font-medium",
                          form.side === s
                            ? s === "LONG" ? "bg-profit/15 text-profit" : "bg-loss/15 text-loss"
                            : "text-muted-foreground",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Entry</Label>
                  <Input type="number" value={form.entryPrice} onChange={(e) => setForm((f) => ({ ...f, entryPrice: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Exit</Label>
                  <Input type="number" value={form.exitPrice} onChange={(e) => setForm((f) => ({ ...f, exitPrice: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Quantity</Label>
                  <Input type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Strategy</Label>
                  <Input placeholder="Breakout, SMC…" value={form.strategy} onChange={(e) => setForm((f) => ({ ...f, strategy: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Screenshot</Label>
                <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={add}>Save trade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {trades.length === 0 ? (
        <Card className="glass p-12 text-center text-sm text-muted-foreground">
          No trades logged yet. Record your first trade to build your performance stats.
        </Card>
      ) : (
        <div className="grid gap-3">
          {trades.map((t) => {
            const { pnl, pct } = pnlOf(t);
            const coin = COIN_BY_SYMBOL[t.symbol];
            return (
              <Card key={t.id} className="glass flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                {t.screenshot && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.screenshot} alt="trade" className="h-16 w-24 rounded-md object-cover" />
                )}
                <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{coin?.base ?? t.symbol}</span>
                    <Badge variant={t.side === "LONG" ? "default" : "destructive"} className="text-[10px]">{t.side}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.date}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatUsd(t.entryPrice)} → {formatUsd(t.exitPrice)} · {t.quantity}
                  </span>
                  {t.strategy && <Badge variant="outline" className="text-[10px]">{t.strategy}</Badge>}
                </div>
                <div className={cn("text-right font-mono tabular-nums", changeClass(pnl))}>
                  <p className="font-semibold">{formatUsd(pnl)}</p>
                  <p className="text-xs">{formatPercent(pct)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(t.id)}>
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
