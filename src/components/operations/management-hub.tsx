"use client";

import { HeartPulse, ReceiptText, Scale, Wheat } from "lucide-react";
import { useState } from "react";

import { HealthModule } from "@/components/operations/health-module";
import { SalesModule } from "@/components/operations/sales-module";
import { SupplementationModule } from "@/components/operations/supplementation-module";
import { WeightsModule } from "@/components/operations/weights-module";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ManagementTab = "supplements" | "health" | "weights" | "sales";

const tabs = [
  { id: "supplements", label: "Suplementos", icon: Wheat },
  { id: "health", label: "Sanidad", icon: HeartPulse },
  { id: "weights", label: "Pesajes", icon: Scale },
  { id: "sales", label: "Ventas", icon: ReceiptText }
] satisfies Array<{ id: ManagementTab; label: string; icon: typeof Wheat }>;

export function ManagementHub() {
  const [activeTab, setActiveTab] = useState<ManagementTab>("supplements");

  return (
    <div className="rounded-2xl bg-[#e9eef3] p-3 shadow-[inset_8px_8px_18px_rgba(148,163,184,0.35),inset_-8px_-8px_18px_rgba(255,255,255,0.85)] md:p-5">
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              type="button"
              variant="ghost"
              className={cn(
                "h-16 flex-col rounded-xl bg-[#e9eef3] text-slate-600 shadow-[6px_6px_14px_rgba(148,163,184,0.45),-6px_-6px_14px_rgba(255,255,255,0.95)]",
                active && "text-emerald-800 shadow-[inset_5px_5px_12px_rgba(148,163,184,0.45),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
      <div className="rounded-2xl bg-[#e9eef3] p-2 shadow-[6px_6px_16px_rgba(148,163,184,0.35),-6px_-6px_16px_rgba(255,255,255,0.9)] md:p-4">
        {activeTab === "supplements" ? <SupplementationModule /> : null}
        {activeTab === "health" ? <HealthModule /> : null}
        {activeTab === "weights" ? <WeightsModule /> : null}
        {activeTab === "sales" ? <SalesModule /> : null}
      </div>
    </div>
  );
}
