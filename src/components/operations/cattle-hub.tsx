"use client";

import { Beef, Layers3 } from "lucide-react";
import { useState } from "react";

import { AnimalsModule } from "@/components/operations/animals-module";
import { LotsModule } from "@/components/operations/lots-module";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CattleTab = "animals" | "lots";

const tabs = [
  { id: "animals", label: "Animales", icon: Beef },
  { id: "lots", label: "Lotes", icon: Layers3 }
] satisfies Array<{ id: CattleTab; label: string; icon: typeof Beef }>;

export function CattleHub() {
  const [activeTab, setActiveTab] = useState<CattleTab>("animals");

  return (
    <div className="space-y-4">
      <div className="sticky top-[65px] z-10 rounded-lg border bg-white/95 p-1 shadow-sm backdrop-blur md:static">
        <div className="grid grid-cols-2 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                type="button"
                variant={active ? "default" : "ghost"}
                className={cn("h-11", active && "shadow-sm")}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>
      {activeTab === "animals" ? <AnimalsModule /> : <LotsModule />}
    </div>
  );
}
