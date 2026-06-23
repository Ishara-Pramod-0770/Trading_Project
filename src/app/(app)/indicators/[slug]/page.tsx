import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Settings2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { INDICATORS, getIndicator, type IndicatorInfo } from "@/lib/indicators-data";
import { cn } from "@/lib/utils";

const categoryStyles: Record<IndicatorInfo["category"], string> = {
  Momentum: "bg-primary/10 text-primary",
  Trend: "bg-sky-500/10 text-sky-400",
  Volatility: "bg-amber-500/10 text-amber-400",
  Volume: "bg-violet-500/10 text-violet-400",
};

export function generateStaticParams() {
  return INDICATORS.map((indicator) => ({ slug: indicator.slug }));
}

export default async function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const indicator = getIndicator(slug);

  if (!indicator) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/indicators"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to indicators
      </Link>

      <div className="glass mb-6 flex flex-col gap-4 rounded-2xl border border-border p-6 sm:flex-row sm:items-center">
        <span
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-2xl text-base font-bold tracking-tight",
            categoryStyles[indicator.category],
          )}
        >
          {indicator.abbr}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{indicator.name}</h1>
            <Badge variant="secondary">{indicator.abbr}</Badge>
            <Badge variant="outline">{indicator.category}</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {indicator.summary}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              What it does
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {indicator.whatItDoes}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              How traders use it
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {indicator.howTradersUse}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-4 text-primary" />
              Settings
            </CardTitle>
            <CardDescription>Recommended parameters and tuning notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {indicator.settings}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="ring-profit/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-profit">
                <TrendingUp className="size-4" />
                Buy signal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {indicator.buySignal}
              </p>
            </CardContent>
          </Card>

          <Card className="ring-loss/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-loss">
                <TrendingDown className="size-4" />
                Sell signal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {indicator.sellSignal}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary" />
              Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {indicator.example}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
