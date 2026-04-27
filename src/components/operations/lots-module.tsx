"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Layers3, Plus, Scale, TrendingUp, WalletCards } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/operations/form-field";
import { MetricCard } from "@/components/operations/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { lotSchema, type LotFormValues } from "@/features/operations/schemas";
import { getLotPerformance, getUnifiedCostRecords } from "@/features/pastures/calculations";
import { formatDate, formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function LotsModule() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const lots = usePastureStore((state) => state.lots);
  const animals = usePastureStore((state) => state.animals);
  const weights = usePastureStore((state) => state.weights);
  const pastureEvents = usePastureStore((state) => state.events);
  const healthEvents = usePastureStore((state) => state.healthEvents);
  const supplementationRecords = usePastureStore((state) => state.supplementationRecords);
  const costRecords = usePastureStore((state) => state.costRecords);
  const createLot = usePastureStore((state) => state.createLot);
  const farmLots = lots.filter((lot) => lot.farmId === selectedFarmId);
  const costs = getUnifiedCostRecords({ pastureEvents, healthEvents, supplementationRecords, costRecords });
  const form = useForm<LotFormValues>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      name: "",
      code: "",
      entryDate: new Date().toISOString().slice(0, 10),
      targetSaleWeightKg: 450,
      notes: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createLot(values);
    form.reset({
      name: "",
      code: "",
      entryDate: new Date().toISOString().slice(0, 10),
      targetSaleWeightKg: 450,
      notes: ""
    });
  });

  const performances = farmLots.map((lot) => getLotPerformance({ lot, animals, weights, costs }));

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Lotes</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Eficiencia y margen por lote</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MetricCard icon={Layers3} label="Activos" value={farmLots.filter((lot) => lot.status === "active").length} />
            <MetricCard
              icon={TrendingUp}
              label="GMD prom."
              value={`${(performances.reduce((sum, item) => sum + item.avgDailyGainKg, 0) / Math.max(performances.length, 1)).toFixed(2)}`}
              color="text-emerald-700"
            />
            <MetricCard
              icon={WalletCards}
              label="Margen"
              value={formatMoney(performances.reduce((sum, item) => sum + item.estimatedMargin, 0))}
              color="text-emerald-700"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear lote</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nombre" error={form.formState.errors.name?.message}>
                  <Input {...form.register("name")} placeholder="Lote 003" />
                </FormField>
                <FormField label="Codigo" error={form.formState.errors.code?.message}>
                  <Input {...form.register("code")} placeholder="L-003" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Entrada" error={form.formState.errors.entryDate?.message}>
                  <Input type="date" {...form.register("entryDate")} />
                </FormField>
                <FormField label="Peso objetivo" error={form.formState.errors.targetSaleWeightKg?.message}>
                  <Input type="number" {...form.register("targetSaleWeightKg")} />
                </FormField>
              </div>
              <FormField label="Notas">
                <Textarea {...form.register("notes")} />
              </FormField>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {form.formState.isSubmitting ? "Creando..." : "Crear lote"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {performances.map((performance) => (
          <Card key={performance.lot.id}>
            <CardHeader>
              <CardTitle>{performance.lot.name}</CardTitle>
              <p className="text-sm text-slate-500">
                {performance.lot.entryDate ? formatDate(performance.lot.entryDate) : "Sin fecha"} · {performance.activeAnimalCount} animales
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <MetricCard icon={Scale} label="Peso prom." value={`${performance.avgCurrentWeightKg.toFixed(0)} kg`} />
                <MetricCard icon={TrendingUp} label="GMD" value={`${performance.avgDailyGainKg.toFixed(2)} kg/d`} color="text-emerald-700" />
              </div>
              <p><span className="font-semibold">Kg ganados:</span> {performance.totalKgGained.toFixed(0)} kg</p>
              <p><span className="font-semibold">Costo/kg producido:</span> {formatMoney(performance.costPerKgProduced)}</p>
              <p><span className="font-semibold">Margen estimado:</span> {formatMoney(performance.estimatedMargin)}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
