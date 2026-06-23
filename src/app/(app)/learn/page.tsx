import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Academy } from "@/components/learn/academy";

export const metadata = {
  title: "Learn Trading",
};

export default function LearnPage() {
  return (
    <div>
      <PageHeader
        title="Learn Trading"
        description="A structured crypto trading academy, from candlestick basics to advanced smart money concepts. Work through the lessons at your own pace and track your progress."
        icon={GraduationCap}
      />
      <Academy />
    </div>
  );
}
