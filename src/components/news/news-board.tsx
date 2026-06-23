"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { NewsCategory, NewsItem } from "@/lib/news";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES: (NewsCategory | "All")[] = ["All", "Bitcoin", "Altcoins", "DeFi", "Market Updates"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NewsBoard({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<NewsCategory | "All">("All");
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => (
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
            <Card className="glass group h-full p-4 transition-colors hover:border-primary/40">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                <span className="text-xs text-muted-foreground">{timeAgo(item.publishedAt)}</span>
              </div>
              <p className="font-medium leading-snug group-hover:text-primary">{item.title}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                {item.source} <ExternalLink className="size-3" />
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
