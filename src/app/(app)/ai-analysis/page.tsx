import { Brain } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AIAnalysisPanel } from "@/components/ai/ai-analysis-panel";
import { COIN_BY_SYMBOL } from "@/lib/constants";

export default async function AIAnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  const { symbol } = await searchParams;
  const initialSymbol =
    symbol && COIN_BY_SYMBOL[symbol.toUpperCase()] ? symbol.toUpperCase() : "BTCUSDT";

  return (
    <div>
      <PageHeader
        title="AI Market Analysis"
        description="Get an instant, AI-assisted technical breakdown of any asset — grounded in real indicator math."
        icon={Brain}
      />
      <AIAnalysisPanel initialSymbol={initialSymbol} />
    </div>
  );
}
