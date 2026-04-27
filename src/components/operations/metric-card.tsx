import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  label,
  value,
  color = "text-slate-700"
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-md border bg-slate-50 p-3">
      <div className={cn("flex items-center gap-2 text-sm font-semibold", color)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
