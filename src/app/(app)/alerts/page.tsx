import { Bell } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AlertsManager } from "@/components/alerts/alerts-manager";
import { LiveBadge } from "@/components/market/live-badge";

export default function AlertsPage() {
  return (
    <div>
      <PageHeader
        title="Price Alerts"
        description="Get notified the moment a coin crosses your target price."
        icon={Bell}
      >
        <LiveBadge />
      </PageHeader>
      <AlertsManager />
    </div>
  );
}
