"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Beef, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/operations/form-field";
import { MetricCard } from "@/components/operations/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { animalStatusClasses, animalStatusLabels } from "@/features/operations/labels";
import { animalSchema, type AnimalFormValues } from "@/features/operations/schemas";
import {
  getAnimalPerformance,
  getUnifiedCostRecords
} from "@/features/pastures/calculations";
import { formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function AnimalsModule() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const lots = usePastureStore((state) => state.lots);
  const animals = usePastureStore((state) => state.animals);
  const weights = usePastureStore((state) => state.weights);
  const pastureEvents = usePastureStore((state) => state.events);
  const healthEvents = usePastureStore((state) => state.healthEvents);
  const supplementationRecords = usePastureStore((state) => state.supplementationRecords);
  const costRecords = usePastureStore((state) => state.costRecords);
  const createAnimal = usePastureStore((state) => state.createAnimal);
  const farmLots = lots.filter((lot) => lot.farmId === selectedFarmId && lot.status === "active");
  const farmAnimals = animals.filter((animal) => animal.farmId === selectedFarmId);
  const unifiedCosts = getUnifiedCostRecords({
    pastureEvents,
    healthEvents,
    supplementationRecords,
    costRecords
  });
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      lotId: farmLots[0]?.id ?? "",
      internalCode: "",
      earTag: "",
      sourceText: "",
      supplierText: "",
      breedType: "",
      sex: "macho",
      approxAgeMonths: 24,
      entryWeightKg: 300,
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchasePrice: 2400000,
      bodyConditionScore: 3,
      healthObservations: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    createAnimal({
      ...values,
      supplierText: values.supplierText ?? "",
      healthObservations: values.healthObservations ?? ""
    });
    form.reset({
      lotId: farmLots[0]?.id ?? "",
      internalCode: "",
      earTag: "",
      sourceText: "",
      supplierText: "",
      breedType: "",
      sex: "macho",
      approxAgeMonths: 24,
      entryWeightKg: 300,
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchasePrice: 2400000,
      bodyConditionScore: 3,
      healthObservations: ""
    });
  });

  const ready = farmAnimals.filter((animal) => animal.status === "ready_for_sale").length;
  const delayed = farmAnimals.filter((animal) => animal.status === "underperforming").length;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Animales</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Ingreso y desempeno individual</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MetricCard icon={Beef} label="Total" value={farmAnimals.length} />
            <MetricCard icon={TrendingUp} label="Listos" value={ready} color="text-emerald-700" />
            <MetricCard icon={TrendingDown} label="Atrasados" value={delayed} color="text-amber-700" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ingresar animal</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Lote" error={form.formState.errors.lotId?.message}>
                  <Select {...form.register("lotId")}>
                    {farmLots.map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="ID interno" error={form.formState.errors.internalCode?.message}>
                  <Input {...form.register("internalCode")} placeholder="A-010" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Arete" error={form.formState.errors.earTag?.message}>
                  <Input {...form.register("earTag")} />
                </FormField>
                <FormField label="Sexo">
                  <Select {...form.register("sex")}>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Peso entrada" error={form.formState.errors.entryWeightKg?.message}>
                  <Input type="number" {...form.register("entryWeightKg")} />
                </FormField>
                <FormField label="Precio compra" error={form.formState.errors.purchasePrice?.message}>
                  <Input type="number" {...form.register("purchasePrice")} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Fecha compra" error={form.formState.errors.purchaseDate?.message}>
                  <Input type="date" {...form.register("purchaseDate")} />
                </FormField>
                <FormField label="Edad meses" error={form.formState.errors.approxAgeMonths?.message}>
                  <Input type="number" {...form.register("approxAgeMonths")} />
                </FormField>
              </div>
              <FormField label="Procedencia" error={form.formState.errors.sourceText?.message}>
                <Input {...form.register("sourceText")} placeholder="Municipio o feria" />
              </FormField>
              <FormField label="Proveedor texto libre">
                <Input {...form.register("supplierText")} placeholder="Opcional" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Tipo racial" error={form.formState.errors.breedType?.message}>
                  <Input {...form.register("breedType")} placeholder="Cebu comercial" />
                </FormField>
                <FormField label="Condicion 1-5" error={form.formState.errors.bodyConditionScore?.message}>
                  <Input type="number" step="0.1" {...form.register("bodyConditionScore")} />
                </FormField>
              </div>
              <FormField label="Observaciones sanitarias">
                <Textarea {...form.register("healthObservations")} />
              </FormField>
              <Button type="submit" disabled={farmLots.length === 0}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Guardar animal
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {farmAnimals.map((animal) => {
          const lot = lots.find((item) => item.id === animal.lotId);
          const performance = getAnimalPerformance({
            animal,
            lot,
            animals,
            weights,
            costs: unifiedCosts
          });

          return (
            <Card key={animal.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{animal.internalCode}</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">Arete {animal.earTag} · {lot?.name}</p>
                  </div>
                  <Badge className={animalStatusClasses[animal.status]}>{animalStatusLabels[animal.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <p><span className="font-semibold">Peso actual:</span> {animal.currentWeightKg} kg</p>
                <p><span className="font-semibold">Kg ganados:</span> {performance.kgGained.toFixed(0)} kg</p>
                <p><span className="font-semibold">GMD:</span> {performance.accumulatedDailyGainKg.toFixed(2)} kg/dia</p>
                <p><span className="font-semibold">Costo/kg ganado:</span> {formatMoney(performance.costPerKgGained)}</p>
                <p><span className="font-semibold">Compra:</span> {formatMoney(animal.purchasePrice)}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
