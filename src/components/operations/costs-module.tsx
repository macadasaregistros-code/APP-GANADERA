"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign, Plus, WalletCards } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/operations/form-field";
import { MetricCard } from "@/components/operations/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { costCategoryLabels } from "@/features/operations/labels";
import { costSchema, type CostFormValues } from "@/features/operations/schemas";
import { getUnifiedCostRecords } from "@/features/pastures/calculations";
import { formatDate, formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function CostsModule() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const lots = usePastureStore((state) => state.lots);
  const animals = usePastureStore((state) => state.animals);
  const pastures = usePastureStore((state) => state.pastures);
  const pastureEvents = usePastureStore((state) => state.events);
  const healthEvents = usePastureStore((state) => state.healthEvents);
  const supplementationRecords = usePastureStore((state) => state.supplementationRecords);
  const costRecords = usePastureStore((state) => state.costRecords);
  const recordCost = usePastureStore((state) => state.recordCost);
  const farmLots = lots.filter((lot) => lot.farmId === selectedFarmId);
  const farmAnimals = animals.filter((animal) => animal.farmId === selectedFarmId);
  const farmPastures = pastures.filter((pasture) => pasture.farmId === selectedFarmId);
  const allCosts = getUnifiedCostRecords({ pastureEvents, healthEvents, supplementationRecords, costRecords }).filter(
    (cost) => cost.farmId === selectedFarmId
  );
  const form = useForm<CostFormValues>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      lotId: "",
      animalId: "",
      pastureId: "",
      costDate: new Date().toISOString().slice(0, 10),
      category: "otros",
      description: "",
      amount: 0,
      allocationMethod: "finca",
      notes: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    recordCost({
      ...values,
      lotId: values.lotId || undefined,
      animalId: values.animalId || undefined,
      pastureId: values.pastureId || undefined
    });
    form.reset({
      lotId: "",
      animalId: "",
      pastureId: "",
      costDate: new Date().toISOString().slice(0, 10),
      category: "otros",
      description: "",
      amount: 0,
      allocationMethod: "finca",
      notes: ""
    });
  });

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Costos</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Centro financiero operativo</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MetricCard icon={WalletCards} label="Registros" value={allCosts.length} />
            <MetricCard icon={CircleDollarSign} label="Total" value={formatMoney(allCosts.reduce((sum, cost) => sum + cost.amount, 0))} color="text-emerald-700" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrar costo</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Fecha" error={form.formState.errors.costDate?.message}>
                  <Input type="date" {...form.register("costDate")} />
                </FormField>
                <FormField label="Categoria" error={form.formState.errors.category?.message}>
                  <Select {...form.register("category")}>
                    {Object.entries(costCategoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </FormField>
              </div>
              <FormField label="Descripcion" error={form.formState.errors.description?.message}>
                <Input {...form.register("description")} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Valor" error={form.formState.errors.amount?.message}>
                  <Input type="number" {...form.register("amount")} />
                </FormField>
                <FormField label="Distribucion">
                  <Select {...form.register("allocationMethod")}>
                    <option value="finca">Finca</option>
                    <option value="lote">Lote</option>
                    <option value="animal">Animal</option>
                    <option value="potrero">Potrero</option>
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Lote">
                  <Select {...form.register("lotId")}>
                    <option value="">No aplica</option>
                    {farmLots.map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}
                  </Select>
                </FormField>
                <FormField label="Animal">
                  <Select {...form.register("animalId")}>
                    <option value="">No aplica</option>
                    {farmAnimals.map((animal) => <option key={animal.id} value={animal.id}>{animal.internalCode}</option>)}
                  </Select>
                </FormField>
                <FormField label="Potrero">
                  <Select {...form.register("pastureId")}>
                    <option value="">No aplica</option>
                    {farmPastures.map((pasture) => <option key={pasture.id} value={pasture.id}>{pasture.name}</option>)}
                  </Select>
                </FormField>
              </div>
              <FormField label="Notas">
                <Textarea {...form.register("notes")} />
              </FormField>
              <Button type="submit">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Guardar costo
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {allCosts
          .sort((a, b) => b.costDate.localeCompare(a.costDate))
          .map((cost) => (
            <Card key={cost.id}>
              <CardHeader>
                <CardTitle>{cost.description}</CardTitle>
                <p className="text-sm text-slate-500">{formatDate(cost.costDate)} · {costCategoryLabels[cost.category]}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-semibold">Valor:</span> {formatMoney(cost.amount)}</p>
                <p><span className="font-semibold">Distribucion:</span> {cost.allocationMethod}</p>
              </CardContent>
            </Card>
          ))}
      </section>
    </div>
  );
}
