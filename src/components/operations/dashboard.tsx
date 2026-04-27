"use client";

import { AlertTriangle, Beef, CheckCircle2, CircleDollarSign, Scale, Sprout, TrendingUp } from "lucide-react";
import Link from "next/link";

import { MetricCard } from "@/components/operations/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLotPerformance,
  getPastureStatus,
  getUnifiedCostRecords
} from "@/features/pastures/calculations";
import { formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function OperationsDashboard() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const farms = usePastureStore((state) => state.farms);
  const lots = usePastureStore((state) => state.lots);
  const animals = usePastureStore((state) => state.animals);
  const weights = usePastureStore((state) => state.weights);
  const pastures = usePastureStore((state) => state.pastures);
  const rotations = usePastureStore((state) => state.rotations);
  const pastureEvents = usePastureStore((state) => state.events);
  const healthEvents = usePastureStore((state) => state.healthEvents);
  const supplementationRecords = usePastureStore((state) => state.supplementationRecords);
  const costRecords = usePastureStore((state) => state.costRecords);
  const farm = farms.find((item) => item.id === selectedFarmId);
  const farmAnimals = animals.filter((animal) => animal.farmId === selectedFarmId && animal.status !== "sold");
  const farmLots = lots.filter((lot) => lot.farmId === selectedFarmId && lot.status === "active");
  const farmPastures = pastures.filter((pasture) => pasture.farmId === selectedFarmId);
  const unifiedCosts = getUnifiedCostRecords({
    pastureEvents,
    healthEvents,
    supplementationRecords,
    costRecords
  }).filter((cost) => cost.farmId === selectedFarmId);
  const lotPerformances = farmLots.map((lot) =>
    getLotPerformance({
      lot,
      animals,
      weights,
      costs: unifiedCosts
    })
  );
  const totalKgGained = farmAnimals.reduce((sum, animal) => sum + Math.max(animal.currentWeightKg - animal.entryWeightKg, 0), 0);
  const avgGmd =
    lotPerformances.reduce((sum, performance) => sum + performance.avgDailyGainKg, 0) /
    Math.max(lotPerformances.length, 1);
  const totalOperationalCost = unifiedCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const readyAnimals = farmAnimals.filter((animal) => animal.status === "ready_for_sale").length;
  const delayedAnimals = farmAnimals.filter((animal) => animal.status === "underperforming").length;
  const occupiedPastures = farmPastures.filter((pasture) => {
    const status = getPastureStatus(pasture, rotations).status;
    return status === "occupied" || status === "overdue";
  }).length;
  const estimatedMargin = lotPerformances.reduce((sum, performance) => sum + performance.estimatedMargin, 0);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Dashboard gerencial</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{farm?.name ?? "Finca"}</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <MetricCard icon={TrendingUp} label="GMD prom." value={`${avgGmd.toFixed(2)} kg/d`} color="text-emerald-700" />
          <MetricCard
            icon={CircleDollarSign}
            label="Costo/kg"
            value={formatMoney(totalOperationalCost / Math.max(totalKgGained, 1))}
            color="text-slate-700"
          />
          <MetricCard icon={CheckCircle2} label="Listos venta" value={readyAnimals} color="text-emerald-700" />
          <MetricCard icon={AlertTriangle} label="Atrasados" value={delayedAnimals} color="text-amber-700" />
          <MetricCard icon={Sprout} label="Potreros ocup." value={occupiedPastures} color="text-sky-700" />
          <MetricCard icon={Beef} label="Animales" value={farmAnimals.length} color="text-slate-700" />
          <MetricCard icon={Scale} label="Kg ganados" value={Math.round(totalKgGained)} color="text-slate-700" />
          <MetricCard icon={CircleDollarSign} label="Margen est." value={formatMoney(estimatedMargin)} color="text-emerald-700" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Eficiencia por lote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lotPerformances.map((performance) => (
              <div key={performance.lot.id} className="rounded-md border bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{performance.lot.name}</p>
                    <p className="text-sm text-slate-600">{performance.activeAnimalCount} animales activos</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">{performance.avgDailyGainKg.toFixed(2)} kg/d</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <span>Costo/kg {formatMoney(performance.costPerKgProduced)}</span>
                  <span>Kg ganados {Math.round(performance.totalKgGained)}</span>
                  <span>Margen {formatMoney(performance.estimatedMargin)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones rapidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline">
              <Link href="/pesajes">Registrar pesaje</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/animales">Ingresar animal</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sanidad">Sanidad</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/ventas">Venta</Link>
            </Button>
            <Button asChild className="col-span-2">
              <Link href="/potreros">Ver potreros</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
