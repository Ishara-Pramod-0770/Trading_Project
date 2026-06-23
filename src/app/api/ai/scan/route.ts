import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI scanning requires an ANTHROPIC_API_KEY. Add it to .env to enable this feature." },
      { status: 503 },
    );
  }

  let body: { image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const dataUrl = body.image ?? "";
  const match = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
  }
  const mediaType = match[1] as (typeof ALLOWED)[number];
  const base64 = match[2];
  if (!ALLOWED.includes(mediaType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  // Guard against very large uploads (~7MB base64).
  if (base64.length > 7_000_000) {
    return NextResponse.json({ error: "Image too large (max ~5MB)" }, { status: 413 });
  }

  try {
    const client = new Anthropic();
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
              pattern: { type: "string", description: "Most likely chart pattern, or 'None detected'." },
              confidence: { type: "integer", description: "0-100 confidence in the pattern." },
              trend: { type: "string", enum: ["Bullish", "Bearish", "Neutral"] },
              setup: { type: "string", description: "1-2 sentence possible trade setup idea (educational)." },
              observations: { type: "array", items: { type: "string" }, description: "2-4 things observed in the chart." },
            },
            required: ["pattern", "confidence", "trend", "setup", "observations"],
          },
        },
      },
      system:
        "You are a technical-analysis vision assistant for an educational crypto platform. " +
        "Analyze the uploaded price chart image: identify the most likely chart pattern, the " +
        "overall trend, and a possible setup. Be honest about uncertainty (lower confidence). " +
        "This is educational only — never give financial advice.",
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: "Analyze this trading chart for patterns, trend and a possible setup." },
          ],
        },
      ],
    });

    const textBlock = msg.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No analysis returned" }, { status: 502 });
    }
    const result = JSON.parse(textBlock.text);
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Scan failed" },
      { status: 502 },
    );
  }
}
