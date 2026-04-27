"use client";

import { AlertTriangle, CheckCircle2, Clock, Sprout, WalletCards } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPastureCostTotal, getPastureStatus } from "@/features/pastures/calculations";
import { formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";
import { cn } from "@/lib/utils";

export function PastureDashboard() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const farms = usePastureStore((state) => state.farms);
  const pastures = usePastureStore((state) => state.pastures);
  const rotations = usePastureStore((state) => state.rotations);
  const events = usePastureStore((state) => state.events);
  const farm = farms.find((item) => item.id === selectedFarmId);
  const farmPastures = pastures.filter((pasture) => pasture.farmId === selectedFarmId && pasture.isActive);
  const summaries = farmPastures.map((pasture) => ({
    pasture,
    summary: getPastureStatus(pasture, rotations)
  }));
  const ready = summaries.filter((item) => item.summary.status === "ready").length;
  const overdue = summaries.filter((item) => item.summary.status === "overdue");
  const resting = summaries.filter((item) => item.summary.status === "resting").length;
  const occupied = summaries.filter((item) => item.summary.status === "occupied").length;
  const totalPastureCost = farmPastures.reduce((sum, pasture) => sum + getPastureCostTotal(pasture.id, events), 0);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Dashboard operativo</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{farm?.name ?? "Finca"}</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
          <DashboardMetric icon={CheckCircle2} label="Listos" value={ready} color="text-emerald-700" />
          <DashboardMetric icon={Sprout} label="Ocupados" value={occupied} color="text-sky-700" />
          <DashboardMetric icon={AlertTriangle} label="Vencidos" value={overdue.length} color="text-red-700" />
          <DashboardMetric icon={Clock} label="Recuperando" value={resting} color="text-amber-700" />
          <DashboardMetric icon={WalletCards} label="Costos" value={formatMoney(totalPastureCost)} color="text-slate-700" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alertas de potrero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdue.length > 0 ? (
              overdue.map(({ pasture, summary }) => (
                <div key={pasture.id} className="rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="font-semibold text-red-900">{pasture.name}</p>
                  <p className="text-sm text-red-700">
                    {summary.daysOccupied} dias ocupado. La salida sugerida ya paso.
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">Sin potreros vencidos.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proximos listos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summaries
              .filter((item) => item.summary.status === "resting")
              .sort((a, b) => a.summary.daysUntilReady - b.summary.daysUntilReady)
              .slice(0, 4)
              .map(({ pasture, summary }) => (
                <div key={pasture.id} className="flex items-center justify-between gap-3 rounded-md border bg-slate-50 p-3">
                  <div>
                    <p className="font-semibold text-slate-950">{pasture.name}</p>
                    <p className="text-sm text-slate-600">{summary.daysResting} dias recuperando</p>
                  </div>
                  <span className="text-sm font-bold text-amber-700">{summary.daysUntilReady} dias</span>
                </div>
              ))}
            <Button asChild variant="outline" className="w-full">
              <Link href="/potreros">Ver potreros</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DashboardMetric({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string | number;
  color: string;
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
