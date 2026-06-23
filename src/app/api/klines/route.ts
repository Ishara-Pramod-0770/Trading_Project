import { NextResponse } from "next/server";
import { getKlines } from "@/lib/binance";
import { COIN_BY_SYMBOL } from "@/lib/constants";
import type { Timeframe } from "@/lib/types";

const VALID_TF: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") ?? "BTCUSDT").toUpperCase();
  const interval = (searchParams.get("interval") ?? "1h") as Timeframe;
  const limit = Math.min(Number(searchParams.get("limit") ?? 500), 1000);

  if (!VALID_TF.includes(interval)) {
    return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
  }
  // Restrict to symbols we know about (basic input validation / abuse guard).
  if (!COIN_BY_SYMBOL[symbol]) {
    return NextResponse.json({ error: "Unsupported symbol" }, { status: 400 });
  }

  try {
    const candles = await getKlines(symbol, interval, limit);
    return NextResponse.json({ candles });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load klines" },
      { status: 502 },
    );
  }
}
