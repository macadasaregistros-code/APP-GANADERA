import { AlertTriangle, CheckCircle2, Clock, Construction, Sprout } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PastureStatusSummary } from "@/features/pastures/types";

const statusStyles = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  blue: "border-sky-200 bg-sky-50 text-sky-800",
  red: "border-red-200 bg-red-50 text-red-800",
  yellow: "border-amber-200 bg-amber-50 text-amber-800",
  orange: "border-orange-200 bg-orange-50 text-orange-800"
};

const statusIcons = {
  ready: CheckCircle2,
  occupied: Sprout,
  overdue: AlertTriangle,
  resting: Clock,
  maintenance: Construction
};

export function PastureStatusBadge({ summary, className }: { summary: PastureStatusSummary; className?: string }) {
  const Icon = statusIcons[summary.status];

  return (
    <Badge className={cn(statusStyles[summary.color], className)}>
      <Icon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
      {summary.label}
    </Badge>
  );
}
