import Link from "next/link";
import { Gauge } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { INDICATORS, type IndicatorInfo } from "@/lib/indicators-data";
import { cn } from "@/lib/utils";

const categoryStyles: Record<IndicatorInfo["category"], string> = {
  Momentum: "bg-primary/10 text-primary",
  Trend: "bg-sky-500/10 text-sky-400",
  Volatility: "bg-amber-500/10 text-amber-400",
  Volume: "bg-violet-500/10 text-violet-400",
};

export default function IndicatorsPage() {
  return (
    <div>
      <PageHeader
        title="Indicators"
        description="Learn the technical indicators that power CryptoPulse AI — what they measure, how traders read them, and the signals to watch for."
        icon={Gauge}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INDICATORS.map((indicator) => (
          <Link
            key={indicator.slug}
            href={`/indicators/${indicator.slug}`}
            className="group block focus:outline-none"
          >
            <article
              className={cn(
                "glass flex h-full flex-col gap-3 rounded-2xl border border-border p-5 transition-all",
                "hover:border-primary/40 hover:-translate-y-0.5 group-focus-visible:border-primary/40",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold tracking-tight",
                      categoryStyles[indicator.category],
                    )}
                  >
                    {indicator.abbr}
                  </span>
                  <div>
                    <h2 className="text-sm leading-tight font-semibold tracking-tight">
                      {indicator.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{indicator.abbr}</p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {indicator.category}
                </Badge>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {indicator.summary}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
