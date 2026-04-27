"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign, Plus, ReceiptText, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FloatingCreateButton, FormPanel } from "@/components/app/form-panel";
import { FormField } from "@/components/operations/form-field";
import { MetricCard } from "@/components/operations/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saleSchema, type SaleFormValues } from "@/features/operations/schemas";
import { formatDate, formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function SalesModule() {
  const [formOpen, setFormOpen] = useState(false);
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const animals = usePastureStore((state) => state.animals);
  const lots = usePastureStore((state) => state.lots);
  const sales = usePastureStore((state) => state.sales);
  const saleItems = usePastureStore((state) => state.saleItems);
  const recordSale = usePastureStore((state) => state.recordSale);
  const saleableAnimals = animals.filter(
    (animal) => animal.farmId === selectedFarmId && animal.status !== "sold" && animal.status !== "dead" && animal.status !== "sick"
  );
  const farmSales = sales.filter((sale) => sale.farmId === selectedFarmId);
  const farmSaleItems = saleItems.filter((item) => item.farmId === selectedFarmId);
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      animalIdsText: saleableAnimals[0]?.id ?? "",
      saleDate: new Date().toISOString().slice(0, 10),
      buyerText: "",
      pricePerKg: 9800,
      extraCosts: 0,
      notes: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    recordSale({
      animalIds: values.animalIdsText.split(",").filter(Boolean),
      saleDate: values.saleDate,
      buyerText: values.buyerText,
      pricePerKg: values.pricePerKg,
      extraCosts: values.extraCosts,
      notes: values.notes
    });
    form.reset({
      animalIdsText: saleableAnimals[0]?.id ?? "",
      saleDate: new Date().toISOString().slice(0, 10),
      buyerText: "",
      pricePerKg: 9800,
      extraCosts: 0,
      notes: ""
    });
    setFormOpen(false);
  });

  const totalNetProfit = farmSaleItems.reduce((sum, item) => sum + item.netProfit, 0);
  const avgRoi = farmSaleItems.reduce((sum, item) => sum + item.roi, 0) / Math.max(farmSaleItems.length, 1);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Ventas</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Cierre económico real</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MetricCard icon={ReceiptText} label="Ventas" value={farmSales.length} />
            <MetricCard icon={CircleDollarSign} label="Utilidad" value={formatMoney(totalNetProfit)} color="text-emerald-700" />
            <MetricCard icon={TrendingUp} label="ROI prom." value={`${(avgRoi * 100).toFixed(1)}%`} color="text-emerald-700" />
          </div>
        </div>

        <FormPanel title="Registrar venta" icon={ReceiptText} open={formOpen} onClose={() => setFormOpen(false)}>
            <form className="grid gap-3" onSubmit={onSubmit}>
              <FormField label="Animal" error={form.formState.errors.animalIdsText?.message}>
                <Select {...form.register("animalIdsText")}>
                  {saleableAnimals.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                      {animal.internalCode} · {animal.currentWeightKg} kg
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Fecha" error={form.formState.errors.saleDate?.message}>
                  <Input type="date" {...form.register("saleDate")} />
                </FormField>
                <FormField label="Comprador" error={form.formState.errors.buyerText?.message}>
                  <Input {...form.register("buyerText")} placeholder="Comprador texto libre" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Precio/kg" error={form.formState.errors.pricePerKg?.message}>
                  <Input type="number" {...form.register("pricePerKg")} />
                </FormField>
                <FormField label="Costos venta">
                  <Input type="number" {...form.register("extraCosts")} />
                </FormField>
              </div>
              <FormField label="Notas">
                <Textarea {...form.register("notes")} />
              </FormField>
              <Button type="submit" disabled={saleableAnimals.length === 0}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Cerrar venta
              </Button>
            </form>
        </FormPanel>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {farmSales.map((sale) => (
          <Card key={sale.id}>
            <CardHeader>
              <CardTitle>{sale.buyerText}</CardTitle>
              <p className="text-sm text-slate-500">{formatDate(sale.saleDate)} · {sale.saleType}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="font-semibold">Peso:</span> {sale.totalWeightKg} kg</p>
              <p><span className="font-semibold">Precio/kg:</span> {formatMoney(sale.pricePerKg)}</p>
              <p><span className="font-semibold">Neto:</span> {formatMoney(sale.netAmount)}</p>
              {farmSaleItems
                .filter((item) => item.saleId === sale.id)
                .map((item) => {
                  const animal = animals.find((entry) => entry.id === item.animalId);
                  const lot = lots.find((entry) => entry.id === item.lotId);

                  return (
                    <div key={item.id} className="rounded-md bg-slate-50 p-2">
                      <p className="font-semibold">{animal?.internalCode ?? "Animal"} · {lot?.name}</p>
                      <p>Utilidad neta: {formatMoney(item.netProfit)}</p>
                      <p>ROI: {(item.roi * 100).toFixed(1)}%</p>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        ))}
      </section>
      <FloatingCreateButton label="Registrar venta" onClick={() => setFormOpen(true)} />
    </div>
  );
}
