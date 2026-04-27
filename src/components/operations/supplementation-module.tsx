"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus, Plus, Wheat, WalletCards } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/operations/form-field";
import { MetricCard } from "@/components/operations/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { feedTypeLabels } from "@/features/operations/labels";
import {
  feedItemSchema,
  supplementationSchema,
  type FeedItemFormValues,
  type SupplementationFormValues
} from "@/features/operations/schemas";
import { formatDate, formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function SupplementationModule() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const lots = usePastureStore((state) => state.lots);
  const feedItems = usePastureStore((state) => state.feedItems);
  const supplementationRecords = usePastureStore((state) => state.supplementationRecords);
  const createFeedItem = usePastureStore((state) => state.createFeedItem);
  const recordSupplementation = usePastureStore((state) => state.recordSupplementation);
  const farmLots = lots.filter((lot) => lot.farmId === selectedFarmId && lot.status === "active");
  const farmFeedItems = feedItems.filter((item) => item.farmId === selectedFarmId && item.isActive);
  const farmRecords = supplementationRecords.filter((record) => record.farmId === selectedFarmId);
  const feedForm = useForm<FeedItemFormValues>({
    resolver: zodResolver(feedItemSchema),
    defaultValues: {
      name: "",
      feedType: "sal_mineralizada",
      unit: "kg",
      defaultCostPerUnit: 0
    }
  });
  const recordForm = useForm<SupplementationFormValues>({
    resolver: zodResolver(supplementationSchema),
    defaultValues: {
      lotId: farmLots[0]?.id ?? "",
      feedItemId: farmFeedItems[0]?.id ?? "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      quantity: 1,
      unit: "kg",
      totalCost: 0,
      animalCount: farmLots[0]?.animalCount ?? 1,
      notes: ""
    }
  });

  const onFeedSubmit = feedForm.handleSubmit((values) => {
    createFeedItem(values);
    feedForm.reset({ name: "", feedType: "sal_mineralizada", unit: "kg", defaultCostPerUnit: 0 });
  });

  const onRecordSubmit = recordForm.handleSubmit((values) => {
    recordSupplementation(values);
    recordForm.reset({
      lotId: farmLots[0]?.id ?? "",
      feedItemId: farmFeedItems[0]?.id ?? "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      quantity: 1,
      unit: "kg",
      totalCost: 0,
      animalCount: farmLots[0]?.animalCount ?? 1,
      notes: ""
    });
  });

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Suplementacion</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Costo nutricional por lote</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MetricCard icon={Wheat} label="Insumos" value={farmFeedItems.length} />
            <MetricCard icon={WalletCards} label="Costo total" value={formatMoney(farmRecords.reduce((sum, item) => sum + item.totalCost, 0))} color="text-emerald-700" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo suplemento</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={onFeedSubmit}>
                <FormField label="Nombre" error={feedForm.formState.errors.name?.message}>
                  <Input {...feedForm.register("name")} placeholder="Sal mineralizada 8%" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Tipo">
                    <Select {...feedForm.register("feedType")}>
                      {Object.entries(feedTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Unidad">
                    <Input {...feedForm.register("unit")} />
                  </FormField>
                </div>
                <FormField label="Costo unidad">
                  <Input type="number" {...feedForm.register("defaultCostPerUnit")} />
                </FormField>
                <Button type="submit" variant="outline">
                  <PackagePlus className="h-4 w-4" aria-hidden="true" />
                  Crear insumo
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registrar suministro</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={onRecordSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Lote">
                    <Select {...recordForm.register("lotId")}>
                      {farmLots.map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}
                    </Select>
                  </FormField>
                  <FormField label="Insumo">
                    <Select {...recordForm.register("feedItemId")}>
                      {farmFeedItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </Select>
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Inicio">
                    <Input type="date" {...recordForm.register("startDate")} />
                  </FormField>
                  <FormField label="Fin">
                    <Input type="date" {...recordForm.register("endDate")} />
                  </FormField>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FormField label="Cantidad">
                    <Input type="number" {...recordForm.register("quantity")} />
                  </FormField>
                  <FormField label="Unidad">
                    <Input {...recordForm.register("unit")} />
                  </FormField>
                  <FormField label="Animales">
                    <Input type="number" {...recordForm.register("animalCount")} />
                  </FormField>
                </div>
                <FormField label="Costo total">
                  <Input type="number" {...recordForm.register("totalCost")} />
                </FormField>
                <FormField label="Notas">
                  <Textarea {...recordForm.register("notes")} />
                </FormField>
                <Button type="submit" disabled={farmLots.length === 0 || farmFeedItems.length === 0}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Guardar suministro
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {farmRecords.map((record) => {
          const lot = lots.find((item) => item.id === record.lotId);
          const feed = feedItems.find((item) => item.id === record.feedItemId);

          return (
            <Card key={record.id}>
              <CardHeader>
                <CardTitle>{feed?.name ?? "Suplemento"}</CardTitle>
                <p className="text-sm text-slate-500">{lot?.name} · {formatDate(record.startDate)} a {formatDate(record.endDate)}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-semibold">Cantidad:</span> {record.quantity} {record.unit}</p>
                <p><span className="font-semibold">Costo total:</span> {formatMoney(record.totalCost)}</p>
                <p><span className="font-semibold">Costo/animal:</span> {formatMoney(record.costPerAnimal)}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
