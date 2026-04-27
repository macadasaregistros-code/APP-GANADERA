import { ArrowDownToLine, ArrowUpFromLine, CircleDollarSign, ClipboardList } from "lucide-react";

import { formatDate, formatMoney } from "@/features/pastures/format";
import type { PastureTimelineItem } from "@/features/pastures/types";
import { cn } from "@/lib/utils";

const timelineIcon = {
  entry: ArrowDownToLine,
  exit: ArrowUpFromLine,
  event: ClipboardList
};

export function PastureTimeline({ items }: { items: PastureTimelineItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-slate-500">
        Sin historial registrado.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = timelineIcon[item.type];

        return (
          <div key={item.id} className="flex gap-3 rounded-lg border bg-white p-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                item.type === "entry" && "bg-sky-50 text-sky-700",
                item.type === "exit" && "bg-emerald-50 text-emerald-700",
                item.type === "event" && "bg-slate-100 text-slate-700"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-950">{item.title}</h3>
                <span className="text-xs font-medium text-slate-500">{formatDate(item.date)}</span>
              </div>
              {item.description ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}
              {item.costAmount ? (
                <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                  <CircleDollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatMoney(item.costAmount)}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
