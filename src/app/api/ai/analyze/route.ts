import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getKlines } from "@/lib/binance";
import { COIN_BY_SYMBOL } from "@/lib/constants";
import { computeRuleBasedAnalysis } from "@/lib/analysis";
import { formatUsd } from "@/lib/format";
import type { AIAnalysis, Timeframe } from "@/lib/types";

export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

export async function POST(req: Request) {
  let body: { symbol?: string; interval?: Timeframe };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const symbol = (body.symbol ?? "BTCUSDT").toUpperCase();
  const interval = (body.interval ?? "4h") as Timeframe;

  if (!COIN_BY_SYMBOL[symbol]) {
    return NextResponse.json({ error: "Unsupported symbol" }, { status: 400 });
  }

  let analysis: AIAnalysis;
  try {
    const candles = await getKlines(symbol, interval, 200);
    analysis = computeRuleBasedAnalysis(symbol, candles);
  } catch {
    return NextResponse.json(
      { error: "Could not load market data for analysis." },
      { status: 502 },
    );
  }

  // If no Claude key, return the deterministic rule-based read.
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ analysis });
  }

  // Enrich the narrative with Claude. The computed numbers are passed as
  // ground truth so the model never invents price levels.
  try {
    const client = new Anthropic();
    const coin = COIN_BY_SYMBOL[symbol];
    const facts = {
      asset: `${coin.name} (${symbol})`,
      timeframe: interval,
      trend: analysis.trend,
      strength: analysis.strength,
      rsi: analysis.rsi,
      macd: analysis.macd,
      volume: analysis.volume,
      support: analysis.support.map((s) => formatUsd(s)),
      resistance: analysis.resistance.map((r) => formatUsd(r)),
    };

    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: {
                type: "string",
                description: "2-3 sentence plain-English read of the market structure.",
              },
              bias: {
                type: "string",
                description: "One sentence actionable bias (educational).",
              },
              keyPoints: {
                type: "array",
                items: { type: "string" },
                description: "3-4 short bullet takeaways.",
              },
            },
            required: ["summary", "bias", "keyPoints"],
          },
        },
      },
      system:
        "You are a crypto technical-analysis assistant for an educational platform. " +
        "You are given pre-computed indicator values that are GROUND TRUTH — never " +
        "invent or alter price levels, RSI, or MACD numbers. Write clear, neutral, " +
        "educational commentary. Never give financial advice or guarantee outcomes.",
      messages: [
        {
          role: "user",
          content:
            "Write an educational technical read using ONLY these computed facts:\n" +
            JSON.stringify(facts, null, 2),
        },
      ],
    });

    // Extract the structured JSON text block.
    const textBlock = msg.content.find((b) => b.type === "text");
    if (textBlock && textBlock.type === "text") {
      const parsed = JSON.parse(textBlock.text) as {
        summary: string;
        bias: string;
        keyPoints: string[];
      };
      analysis = {
        ...analysis,
        summary: parsed.summary || analysis.summary,
        bias: parsed.bias || analysis.bias,
        keyPoints: parsed.keyPoints,
        source: "claude",
      };
    }
  } catch {
    // Any Claude failure → fall back to the rule-based analysis already computed.
  }

  return NextResponse.json({ analysis });
}
