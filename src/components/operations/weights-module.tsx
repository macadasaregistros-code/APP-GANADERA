"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/operations/form-field";
import { MetricCard } from "@/components/operations/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { weightSchema, type WeightFormValues } from "@/features/operations/schemas";
import { getAnimalPerformance, getLatestWeightRecord, getUnifiedCostRecords } from "@/features/pastures/calculations";
import { formatDate } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function WeightsModule() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const animals = usePastureStore((state) => state.animals);
  const lots = usePastureStore((state) => state.lots);
  const weights = usePastureStore((state) => state.weights);
  const pastureEvents = usePastureStore((state) => state.events);
  const healthEvents = usePastureStore((state) => state.healthEvents);
  const supplementationRecords = usePastureStore((state) => state.supplementationRecords);
  const costRecords = usePastureStore((state) => state.costRecords);
  const recordWeight = usePastureStore((state) => state.recordWeight);
  const farmAnimals = animals.filter((animal) => animal.farmId === selectedFarmId && animal.status !== "sold" && animal.status !== "dead");
  const costs = getUnifiedCostRecords({ pastureEvents, healthEvents, supplementationRecords, costRecords });
  const performances = farmAnimals.map((animal) =>
    getAnimalPerformance({
      animal,
      lot: lots.find((lot) => lot.id === animal.lotId),
      animals,
      weights,
      costs
    })
  );
  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      animalId: farmAnimals[0]?.id ?? "",
      weighedAt: new Date().toISOString().slice(0, 10),
      weightKg: farmAnimals[0]?.currentWeightKg ?? 300,
      notes: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    recordWeight(values);
    form.reset({
      animalId: farmAnimals[0]?.id ?? "",
      weighedAt: new Date().toISOString().slice(0, 10),
      weightKg: farmAnimals[0]?.currentWeightKg ?? 300,
      notes: ""
    });
  });

  const avgGmd =
    performances.reduce((sum, performance) => sum + performance.accumulatedDailyGainKg, 0) /
    Math.max(performances.length, 1);
  const delayed = performances.filter((performance) => performance.accumulatedDailyGainKg < 0.55).length;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Pesajes</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Control de GMD</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MetricCard icon={Scale} label="Pesajes" value={weights.filter((weight) => weight.farmId === selectedFarmId).length} />
            <MetricCard icon={TrendingUp} label="GMD prom." value={`${avgGmd.toFixed(2)} kg/d`} color="text-emerald-700" />
            <MetricCard icon={TrendingDown} label="Atrasados" value={delayed} color="text-amber-700" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrar pesaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={onSubmit}>
              <FormField label="Animal" error={form.formState.errors.animalId?.message}>
                <Select {...form.register("animalId")}>
                  {farmAnimals.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                      {animal.internalCode} · {animal.earTag}
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Fecha" error={form.formState.errors.weighedAt?.message}>
                  <Input type="date" {...form.register("weighedAt")} />
                </FormField>
                <FormField label="Peso kg" error={form.formState.errors.weightKg?.message}>
                  <Input type="number" step="0.1" {...form.register("weightKg")} />
                </FormField>
              </div>
              <FormField label="Observaciones">
                <Textarea {...form.register("notes")} />
              </FormField>
              <Button type="submit" disabled={farmAnimals.length === 0}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Guardar pesaje
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {performances.map((performance) => {
          const latestWeight = getLatestWeightRecord(performance.animal.id, weights);

          return (
            <Card key={performance.animal.id}>
              <CardHeader>
                <CardTitle>{performance.animal.internalCode}</CardTitle>
                <p className="text-sm text-slate-500">
                  Ultimo pesaje {latestWeight ? formatDate(latestWeight.weighedAt) : "sin pesaje"}
                </p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-semibold">Peso:</span> {performance.animal.currentWeightKg} kg</p>
                <p><span className="font-semibold">GMD acumulada:</span> {performance.accumulatedDailyGainKg.toFixed(2)} kg/dia</p>
                <p><span className="font-semibold">Dias en ceba:</span> {performance.daysInCeba}</p>
                <p><span className="font-semibold">Kg ganados:</span> {performance.kgGained.toFixed(0)} kg</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
