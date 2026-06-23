import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CandlestickChart,
  GraduationCap,
  LineChart,
  NotebookPen,
  ScanLine,
  Shapes,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  { icon: LineChart, title: "Real-time markets", desc: "Live prices, market cap and volume streamed straight from Binance." },
  { icon: CandlestickChart, title: "Pro charts", desc: "Candlesticks, multiple timeframes, EMA, MACD, RSI, Bollinger & VWAP." },
  { icon: Brain, title: "AI analysis", desc: "Claude-powered technical reads grounded in real indicator math." },
  { icon: ScanLine, title: "Chart scanner", desc: "Upload a screenshot and let AI detect the pattern and setup." },
  { icon: Shapes, title: "Pattern & indicator academy", desc: "Learn every major chart pattern and indicator in depth." },
  { icon: GraduationCap, title: "Trading courses", desc: "From candlestick basics to Smart Money Concepts, with progress tracking." },
  { icon: NotebookPen, title: "Trading journal", desc: "Log trades, review strategies and track your win rate." },
  { icon: Wallet, title: "Portfolio & alerts", desc: "Track holdings with live P/L and get notified on price moves." },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glow-grid pointer-events-none absolute inset-0 -z-10" />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="/dashboard">Launch app <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24">
        <Badge variant="secondary" className="mb-5 gap-1.5">
          <Brain className="size-3.5" /> AI-powered crypto trading intelligence
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          The all-in-one crypto{" "}
          <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
            trading terminal
          </span>{" "}
          & learning platform
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Analyze markets in real time, learn to trade from the ground up, and let AI read the
          charts with you — all in one beautiful, professional workspace.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">Open dashboard <ArrowRight className="size-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/learn">Start learning</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Educational platform. Not financial advice.</p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass rounded-2xl p-5">
                <div className="mb-3 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <p>CryptoPulse AI — built with Next.js, Tailwind & Claude. Market data via Binance.</p>
      </footer>
    </div>
  );
}
