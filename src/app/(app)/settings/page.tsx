import { Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { clerkEnabled } from "@/lib/auth-config";

export default function SettingsPage() {
  const aiEnabled = !!process.env.ANTHROPIC_API_KEY;
  return (
    <div>
      <PageHeader title="Settings" description="Manage your appearance, preferences and integrations." icon={Settings} />
      <SettingsPanel clerkEnabled={clerkEnabled} aiEnabled={aiEnabled} />
    </div>
  );
}
