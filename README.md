# CryptoPulse AI — Crypto Trading Intelligence Platform

An all-in-one crypto ecosystem: a real-time trading terminal, an AI market analyst, and a
trading academy — in one premium, responsive fintech UI with light/dark themes.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · ShadCN UI · Framer
Motion · Prisma · Clerk · Anthropic Claude · Binance API**.

---

## Features

| Area | What it does |
|---|---|
| **Dashboard** | Live cards for BTC, ETH, SOL, BNB, XRP, ADA — price, 24h %, market cap, volume, sparkline, with flash-on-tick updates over WebSocket. |
| **Market** | Sortable, searchable live table of major assets. |
| **Charts** | Candlestick charts (lightweight-charts) with 1m–1D timeframes, live candle updates, and toggleable EMA, SMA, Bollinger Bands, VWAP, RSI & MACD. |
| **AI Analysis** | Trend, strength %, support/resistance, RSI, MACD and volume read. Indicator math is computed deterministically and passed to **Claude (`claude-opus-4-8`)** as ground truth for the narrative. Falls back to the rule-based engine without an API key. |
| **AI Chart Scanner** | Upload a chart screenshot → Claude vision detects the pattern, trend, confidence and a possible setup. |
| **Patterns** | Reversal, Continuation, Triangle & Harmonic pattern library with formation, entry/stop/target ideas, ASCII sketches and common mistakes. |
| **Indicators** | RSI, MACD, EMA, SMA, VWAP, Bollinger Bands, ATR — what they do, settings, and buy/sell interpretation. |
| **Learn** | Beginner → Advanced courses (candlestick basics to Smart Money Concepts) with progress tracking. |
| **News** | Categorized crypto headlines (CryptoPanic when a token is set, curated fallback otherwise). |
| **Journal** | Log trades with screenshots; auto win-rate, avg win/loss, net P/L. |
| **Portfolio** | Holdings with live valuation and unrealized P/L. |
| **Alerts** | Price-above/below alerts with live monitoring and browser notifications. |
| **Settings** | Theme (light/dark/system, persisted + system-aware), preferences, integration status. |

---

## Getting started

```bash
npm install
cp .env.example .env   # fill in keys (optional — the app runs without them)
npm run dev            # http://localhost:3000
```

The app is **fully runnable with no keys**: market data uses Binance's public API, AI
features fall back to deterministic math, auth becomes a no-op guest, and the
Journal/Portfolio/Alerts persist in the browser.

### Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection for Prisma | For DB-backed persistence |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk auth | To enable sign-in |
| `ANTHROPIC_API_KEY` | Claude AI analysis & chart scanner | To enable real AI |
| `ANTHROPIC_MODEL` | Model id (default `claude-opus-4-8`) | No |
| `CRYPTOPANIC_TOKEN` | Live news feed | No (curated fallback) |
| `BINANCE_REST_BASE`, `NEXT_PUBLIC_BINANCE_WS_BASE` | Override Binance hosts | No |

---

## Architecture notes

- **Real-time data** — All Binance REST access is server-side (`src/lib/binance.ts`) via the
  public `data-api.binance.vision` host with `next` revalidation. Live updates stream over
  WebSocket from the client (`src/hooks/use-binance-stream.ts`, `use-binance-kline.ts`) with
  auto-reconnect/backoff.
- **AI** — `src/app/api/ai/analyze` and `/scan` are server routes; the Claude key never
  reaches the client. Indicator values are computed in `src/lib/analysis.ts` /
  `indicators.ts` and given to Claude as ground truth so it can't invent price levels.
- **Auth** — Clerk is wired but optional: `src/lib/auth-config.ts` gates it on a valid key,
  and `src/middleware.ts` no-ops without one.
- **Database** — Full Prisma schema for all models (User, Coin, Watchlist, Trade, Portfolio,
  Alert, Course, Lesson, Pattern, Indicator) is in `prisma/schema.prisma`. Until a
  `DATABASE_URL` is set, the user-data features persist via `localStorage`
  (`src/hooks/use-local-storage.ts`) — swapping these for Prisma-backed server actions is a
  drop-in change.
- **Design system** — Custom OKLCH theme + glassmorphism utilities in
  `src/app/globals.css`; ShadCN (Base UI) components in `src/components/ui`.

### Database setup (optional)

```bash
# set DATABASE_URL in .env, then:
npx prisma migrate dev --name init
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
| `npx prisma generate` | Regenerate the Prisma client |

## Deployment

Vercel-ready. Push the repo, set the environment variables in the Vercel dashboard, and
deploy. The Prisma client is generated at build via `prisma generate`.

---

> ⚠️ **Disclaimer:** CryptoPulse AI is an educational platform. Nothing in it is financial
> advice.
