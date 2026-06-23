import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-3 text-primary-foreground shadow-lg shadow-primary/25">
        <Activity className="size-5" strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight">CryptoPulse</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
