import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Crosshair,
  GaugeCircle,
  LogIn,
  ShieldX,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
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
  PATTERNS,
  getPattern,
  type PatternInfo,
} from "@/lib/patterns-data";

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

function biasClasses(bias: PatternInfo["bias"]): string {
  if (bias === "Bullish") return "text-profit border-profit/30 bg-profit/10";
  if (bias === "Bearish") return "text-loss border-loss/30 bg-loss/10";
  return "text-primary border-primary/30 bg-primary/10";
}

const reliabilityClasses: Record<PatternInfo["reliability"], string> = {
  High: "text-profit",
  Medium: "text-primary",
  Low: "text-muted-foreground",
};

function Section({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("glass", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPattern(slug);

  if (!pattern) {
    notFound();
  }

  return (
    <div className="glow-grid">
      <Link
        href="/patterns"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to patterns
      </Link>

      <div className="mb-6 flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {pattern.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{pattern.category}</Badge>
          <Badge
            variant="outline"
            className={cn("gap-1", biasClasses(pattern.bias))}
          >
            {pattern.bias === "Bullish" && <TrendingUp />}
            {pattern.bias === "Bearish" && <TrendingDown />}
            {pattern.bias}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <GaugeCircle
              className={cn("size-3", reliabilityClasses[pattern.reliability])}
            />
            <span className="text-muted-foreground">Reliability</span>
            <span
              className={cn(
                "font-medium",
                reliabilityClasses[pattern.reliability],
              )}
            >
              {pattern.reliability}
            </span>
          </Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {pattern.summary}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: chart + description */}
        <div className="flex flex-col gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm">Pattern Shape</CardTitle>
              <CardDescription>Schematic sketch of the formation</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 font-mono text-xs leading-snug text-foreground">
                {pattern.asciiChart}
              </pre>
            </CardContent>
          </Card>

          <Section icon={Crosshair} title="Description">
            {pattern.description}
          </Section>

          <Section icon={GaugeCircle} title="Formation">
            {pattern.formation}
          </Section>
        </div>

        {/* Right column: trade plan + mistakes */}
        <div className="flex flex-col gap-6">
          <Section icon={LogIn} title="Entry Idea">
            {pattern.entryIdea}
          </Section>

          <div className="grid gap-6 sm:grid-cols-2">
            <Section icon={ShieldX} title="Stop Loss">
              {pattern.stopLoss}
            </Section>
            <Section icon={Target} title="Target">
              {pattern.target}
            </Section>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="grid size-7 place-items-center rounded-lg bg-loss/10 text-loss">
                  <X className="size-4" />
                </span>
                Common Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2.5">
                {pattern.mistakes.map((mistake) => (
                  <li key={mistake} className="flex items-start gap-2 text-sm">
                    <X className="mt-0.5 size-4 shrink-0 text-loss" />
                    <span className="text-muted-foreground">{mistake}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-profit/10 p-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-profit" />
                <span className="text-muted-foreground">
                  Always wait for confirmation, respect your stop, and trade with
                  the higher-timeframe trend for the best results.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
