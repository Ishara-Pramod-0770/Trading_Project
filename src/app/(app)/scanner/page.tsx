import { ScanLine } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ChartScanner } from "@/components/ai/chart-scanner";

export default function ScannerPage() {
  return (
    <div>
      <PageHeader
        title="AI Chart Scanner"
        description="Upload a chart screenshot and let AI detect patterns, trend and a possible setup."
        icon={ScanLine}
      />
      <ChartScanner />
    </div>
  );
}
