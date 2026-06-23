import Link from "next/link";
import { ArrowUpRight, Shapes, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PATTERN_CATEGORIES,
  PATTERNS,
  type PatternInfo,
} from "@/lib/patterns-data";

function biasClasses(bias: PatternInfo["bias"]): string {
  if (bias === "Bullish") return "text-profit border-profit/30 bg-profit/10";
  if (bias === "Bearish") return "text-loss border-loss/30 bg-loss/10";
  return "text-primary border-primary/30 bg-primary/10";
}

function BiasBadge({ bias }: { bias: PatternInfo["bias"] }) {
  return (
    <Badge variant="outline" className={cn("gap-1", biasClasses(bias))}>
      {bias === "Bullish" && <TrendingUp />}
      {bias === "Bearish" && <TrendingDown />}
      {bias}
    </Badge>
  );
}

const reliabilityClasses: Record<PatternInfo["reliability"], string> = {
  High: "text-profit",
  Medium: "text-primary",
  Low: "text-muted-foreground",
};

export default function PatternsPage() {
  return (
    <div className="glow-grid">
      <PageHeader
        title="Chart Patterns"
        description="A curated library of classic and harmonic chart patterns — how they form, where to enter, and the mistakes to avoid."
        icon={Shapes}
      >
        <Badge variant="secondary">{PATTERNS.length} patterns</Badge>
      </PageHeader>

      <div className="flex flex-col gap-10">
        {PATTERN_CATEGORIES.map((category) => {
          const items = PATTERNS.filter((p) => p.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-semibold tracking-tight">
                  {category}
                </h2>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((pattern) => (
                  <Link
                    key={pattern.slug}
                    href={`/patterns/${pattern.slug}`}
                    className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <Card className="glass h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:ring-primary/30">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base">
                            {pattern.name}
                          </CardTitle>
                          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary">{pattern.category}</Badge>
                          <BiasBadge bias={pattern.bias} />
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col gap-3">
                        <CardDescription className="leading-relaxed">
                          {pattern.summary}
                        </CardDescription>
                        <div className="mt-auto flex items-center gap-1.5 text-xs">
                          <span className="text-muted-foreground">
                            Reliability
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              reliabilityClasses[pattern.reliability],
                            )}
                          >
                            {pattern.reliability}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
