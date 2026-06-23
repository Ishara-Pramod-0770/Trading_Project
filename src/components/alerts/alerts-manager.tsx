"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellRing, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MARKET_COINS, COIN_BY_SYMBOL } from "@/lib/constants";
import { useBinanceTickers } from "@/hooks/use-binance-stream";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CoinSelect } from "@/components/charts/coin-select";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  symbol: string;
  condition: "ABOVE" | "BELOW";
  targetPrice: number;
  channel: "BROWSER" | "EMAIL";
  triggered: boolean;
}

export function AlertsManager() {
  const [alerts, setAlerts, hydrated] = useLocalStorage<Alert[]>("cp_alerts", []);
  const { tickers } = useBinanceTickers(MARKET_COINS.map((c) => c.symbol));
  const [form, setForm] = useState({
    symbol: "BTCUSDT",
    condition: "ABOVE" as "ABOVE" | "BELOW",
    targetPrice: "",
    channel: "BROWSER" as "BROWSER" | "EMAIL",
  });
  const firedRef = useRef<Set<string>>(new Set());

  // Monitor live prices and fire alerts.
  useEffect(() => {
    alerts.forEach((a) => {
      if (a.triggered || firedRef.current.has(a.id)) return;
      const price = tickers[a.symbol]?.price;
      if (price == null) return;
      const hit = a.condition === "ABOVE" ? price >= a.targetPrice : price <= a.targetPrice;
      if (hit) {
        firedRef.current.add(a.id);
        const coin = COIN_BY_SYMBOL[a.symbol];
        const msg = `${coin?.base ?? a.symbol} is ${a.condition.toLowerCase()} ${formatUsd(a.targetPrice)} — now ${formatUsd(price)}`;
        toast.success("Price alert triggered", { description: msg });
        if (a.channel === "BROWSER" && typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("CryptoPulse AI — Price Alert", { body: msg });
        }
        setAlerts((prev) => prev.map((x) => (x.id === a.id ? { ...x, triggered: true } : x)));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickers]);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const res = await Notification.requestPermission();
    if (res === "granted") toast.success("Browser notifications enabled");
  };

  const add = () => {
    const targetPrice = parseFloat(form.targetPrice);
    if (!targetPrice) return;
    if (form.channel === "BROWSER") requestPermission();
    if (form.channel === "EMAIL") {
      toast.info("Email alerts require SMTP configuration on the server (see README).");
    }
    setAlerts((prev) => [
      { id: crypto.randomUUID(), ...form, targetPrice, triggered: false },
      ...prev,
    ]);
    setForm((f) => ({ ...f, targetPrice: "" }));
  };

  const remove = (id: string) => {
    firedRef.current.delete(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (!hydrated) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Create */}
      <Card className="glass h-fit space-y-4 p-5">
        <h3 className="flex items-center gap-2 font-semibold"><Plus className="size-4" /> New Alert</h3>
        <div className="space-y-1.5">
          <Label>Coin</Label>
          <CoinSelect value={form.symbol} onChange={(s) => setForm((f) => ({ ...f, symbol: s }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Condition</Label>
          <div className="flex rounded-lg border border-border p-0.5">
            {(["ABOVE", "BELOW"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setForm((f) => ({ ...f, condition: c }))}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-medium",
                  form.condition === c ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                Price {c.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Target price (USD)</Label>
          <Input type="number" placeholder="120000" value={form.targetPrice} onChange={(e) => setForm((f) => ({ ...f, targetPrice: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Notify via</Label>
          <div className="flex rounded-lg border border-border p-0.5">
            {(["BROWSER", "EMAIL"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setForm((f) => ({ ...f, channel: c }))}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-medium",
                  form.channel === c ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {c === "BROWSER" ? "Browser" : "Email"}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={add} className="w-full">Create alert</Button>
      </Card>

      {/* List */}
      <div className="space-y-3 lg:col-span-2">
        {alerts.length === 0 ? (
          <Card className="glass p-12 text-center text-sm text-muted-foreground">
            No alerts yet. Create one to get notified on price moves.
          </Card>
        ) : (
          alerts.map((a) => {
            const coin = COIN_BY_SYMBOL[a.symbol];
            const price = tickers[a.symbol]?.price;
            return (
              <Card key={a.id} className={cn("glass flex items-center gap-4 p-4", a.triggered && "opacity-60")}>
                <div className={cn("grid size-10 place-items-center rounded-xl", a.triggered ? "bg-profit/10 text-profit" : "bg-primary/10 text-primary")}>
                  {a.triggered ? <BellRing className="size-5" /> : <Bell className="size-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {coin?.name ?? a.symbol} {a.condition === "ABOVE" ? "≥" : "≤"} {formatUsd(a.targetPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {price != null ? `Now ${formatUsd(price)}` : "Connecting…"} · {a.channel.toLowerCase()}
                  </p>
                </div>
                {a.triggered && <Badge className="bg-profit/15 text-profit">Triggered</Badge>}
                <Button variant="ghost" size="icon" onClick={() => remove(a.id)}>
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
