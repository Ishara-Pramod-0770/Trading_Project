import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PortfolioManager } from "@/components/portfolio/portfolio-manager";

export default function PortfolioPage() {
  return (
    <div>
      <PageHeader
        title="Portfolio"
        description="Track your holdings with live valuation and profit / loss."
        icon={Wallet}
      />
      <PortfolioManager />
    </div>
  );
}
