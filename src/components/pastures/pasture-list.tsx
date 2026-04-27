"use client";

import { AlertTriangle, CalendarPlus, CheckCircle2, Clock, LogIn, Plus, Sprout } from "lucide-react";
import { useMemo, useState } from "react";

import { FloatingCreateButton, FormPanel } from "@/components/app/form-panel";
import { PastureCard } from "@/components/pastures/pasture-card";
import { PastureEntryForm, PastureEventForm, PastureForm } from "@/components/pastures/pasture-forms";
import { PastureRotationBoard } from "@/components/pastures/pasture-rotation-board";
import { Button } from "@/components/ui/button";
import { getPastureStatus } from "@/features/pastures/calculations";
import { usePastureStore } from "@/features/pastures/store";
import { cn } from "@/lib/utils";

type ActionPanel = "entry" | "event" | "new";

const actionButtons = [
  { id: "entry", label: "Entrar", icon: LogIn },
  { id: "event", label: "Evento", icon: CalendarPlus },
  { id: "new", label: "Nuevo", icon: Plus }
] satisfies Array<{ id: ActionPanel; label: string; icon: typeof LogIn }>;

export function PastureList() {
  const [actionPanel, setActionPanel] = useState<ActionPanel>("entry");
  const [formOpen, setFormOpen] = useState(false);
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const farms = usePastureStore((state) => state.farms);
  const pastures = usePastureStore((state) => state.pastures);
  const rotations = usePastureStore((state) => state.rotations);
  const events = usePastureStore((state) => state.events);
  const lots = usePastureStore((state) => state.lots);
  const farm = farms.find((item) => item.id === selectedFarmId);
  const farmPastures = pastures.filter((pasture) => pasture.farmId === selectedFarmId && pasture.isActive);
  const farmLots = lots.filter((lot) => lot.farmId === selectedFarmId);

  const stats = useMemo(() => {
    const summaries = farmPastures.map((pasture) => getPastureStatus(pasture, rotations));

    return {
      ready: summaries.filter((summary) => summary.status === "ready").length,
      occupied: summaries.filter((summary) => summary.status === "occupied").length,
      overdue: summaries.filter((summary) => summary.status === "overdue").length,
      resting: summaries.filter((summary) => summary.status === "resting").length
    };
  }, [farmPastures, rotations]);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Modulo potreros</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">{farm?.name ?? "Finca"}</h2>
            </div>
            <Sprout className="h-8 w-8 text-emerald-700" aria-hidden="true" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Stat icon={CheckCircle2} label="Listos" value={stats.ready} color="text-emerald-700" />
            <Stat icon={Sprout} label="Ocupados" value={stats.occupied} color="text-sky-700" />
            <Stat icon={AlertTriangle} label="Vencidos" value={stats.overdue} color="text-red-700" />
            <Stat icon={Clock} label="Recuperando" value={stats.resting} color="text-amber-700" />
          </div>
        </div>

        <PastureRotationBoard pastures={farmPastures} rotations={rotations} lots={farmLots} />
      </section>

      <FormPanel title="Acciones de rotacion" icon={Sprout} open={formOpen} onClose={() => setFormOpen(false)}>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {actionButtons.map((item) => {
              const Icon = item.icon;
              const active = actionPanel === item.id;

              return (
                <Button
                  key={item.id}
                  type="button"
                  variant={active ? "default" : "outline"}
                  className="h-16 flex-col px-2 text-xs"
                  onClick={() => setActionPanel(item.id)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Button>
              );
            })}
          </div>
          {actionPanel === "entry" ? <PastureEntryForm /> : null}
          {actionPanel === "event" ? <PastureEventForm /> : null}
          {actionPanel === "new" ? <PastureForm /> : null}
        </div>
      </FormPanel>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {farmPastures.map((pasture) => (
          <PastureCard
            key={pasture.id}
            pasture={pasture}
            rotations={rotations}
            events={events}
            lots={farmLots}
          />
        ))}
      </section>
      <FloatingCreateButton label="Acciones de potrero" onClick={() => setFormOpen(true)} />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-md border bg-slate-50 p-3">
      <div className={cn("flex items-center gap-2 text-sm font-semibold", color)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
