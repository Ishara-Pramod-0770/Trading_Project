"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageUp, Loader2, ScanLine, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScanResult {
  pattern: string;
  confidence: number;
  trend: "Bullish" | "Bearish" | "Neutral";
  setup: string;
  observations: string[];
}

export function ChartScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const onFile = (file?: File) => {
    if (!file) return;
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const scan = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scan failed");
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const trendColor =
    result?.trend === "Bullish" ? "text-profit" : result?.trend === "Bearish" ? "text-loss" : "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass p-5">
        {!image ? (
          <label className="flex h-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-center transition-colors hover:border-primary/50">
            <ImageUp className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Upload a chart screenshot</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or WEBP · max ~5MB</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="chart" className="max-h-80 w-full rounded-xl object-contain" />
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
            <Button onClick={scan} disabled={loading} className="w-full">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ScanLine className="size-4" />}
              {loading ? "Scanning…" : "Scan chart"}
            </Button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-loss">{error}</p>}
      </Card>

      <Card className="glass p-5">
        {!result ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <Sparkles className="mx-auto mb-3 size-8 text-primary" />
              <p className="font-medium">Detection results appear here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a chart and run the scanner to detect patterns, trend and a possible setup.
              </p>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Detected pattern</p>
              <p className="text-2xl font-bold">{result.pattern}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn("text-sm", trendColor)} variant="secondary">{result.trend}</Badge>
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Confidence</span>
                  <span>{result.confidence}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Possible setup</p>
              <p className="text-sm">{result.setup}</p>
            </div>
            {result.observations?.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Observations</p>
                <ul className="space-y-1 text-sm">
                  {result.observations.map((o, i) => (
                    <li key={i} className="flex gap-2"><span className="text-primary">•</span>{o}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-muted-foreground">⚠️ Educational only — not financial advice.</p>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
