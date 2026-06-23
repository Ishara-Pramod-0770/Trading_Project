import { NotebookPen } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { JournalManager } from "@/components/journal/journal-manager";

export default function JournalPage() {
  return (
    <div>
      <PageHeader
        title="Trading Journal"
        description="Log your trades, review your strategies and track your win rate over time."
        icon={NotebookPen}
      />
      <JournalManager />
    </div>
  );
}
