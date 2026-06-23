"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsPanel({
  clerkEnabled,
  aiEnabled,
}: {
  clerkEnabled: boolean;
  aiEnabled: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prefs, setPrefs, hydrated] = useLocalStorage("cp_prefs", {
    compactCards: false,
    soundAlerts: false,
  });
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Appearance */}
      <Card className="glass p-5">
        <h3 className="font-semibold">Appearance</h3>
        <p className="text-sm text-muted-foreground">Choose how CryptoPulse looks.</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const active = mounted && theme === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
                )}
              >
                {active && <Check className="absolute right-2 top-2 size-4 text-primary" />}
                <Icon className="size-5" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="glass space-y-4 p-5">
        <h3 className="font-semibold">Preferences</h3>
        {hydrated && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact cards</Label>
                <p className="text-xs text-muted-foreground">Denser layout on the dashboard.</p>
              </div>
              <Switch
                checked={prefs.compactCards}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, compactCards: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Sound on alerts</Label>
                <p className="text-xs text-muted-foreground">Play a sound when a price alert fires.</p>
              </div>
              <Switch
                checked={prefs.soundAlerts}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, soundAlerts: v }))}
              />
            </div>
          </>
        )}
      </Card>

      {/* Integrations status */}
      <Card className="glass space-y-3 p-5">
        <h3 className="font-semibold">Integrations</h3>
        <Row label="Market data (Binance)" ok subtitle="Public REST + WebSocket" />
        <Row label="Authentication (Clerk)" ok={clerkEnabled} subtitle={clerkEnabled ? "Configured" : "Add Clerk keys in .env"} />
        <Row label="AI analysis (Claude)" ok={aiEnabled} subtitle={aiEnabled ? "Configured" : "Add ANTHROPIC_API_KEY in .env"} />
      </Card>
    </div>
  );
}

function Row({ label, ok, subtitle }: { label: string; ok: boolean; subtitle: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Badge variant="secondary" className={ok ? "bg-profit/15 text-profit" : "text-muted-foreground"}>
        {ok ? "Active" : "Not set"}
      </Badge>
    </div>
  );
}
