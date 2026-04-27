"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, HeartPulse, Plus, ShieldCheck } from "lucide-react";
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
import { healthEventLabels } from "@/features/operations/labels";
import { healthEventSchema, type HealthEventFormValues } from "@/features/operations/schemas";
import { formatDate, formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function HealthModule() {
  const [formOpen, setFormOpen] = useState(false);
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const lots = usePastureStore((state) => state.lots);
  const animals = usePastureStore((state) => state.animals);
  const healthEvents = usePastureStore((state) => state.healthEvents);
  const recordHealthEvent = usePastureStore((state) => state.recordHealthEvent);
  const farmLots = lots.filter((lot) => lot.farmId === selectedFarmId && lot.status === "active");
  const farmAnimals = animals.filter((animal) => animal.farmId === selectedFarmId && animal.status !== "sold" && animal.status !== "dead");
  const farmEvents = healthEvents.filter((event) => event.farmId === selectedFarmId);
  const withdrawalAlerts = farmEvents.filter((event) => event.withdrawalUntil && event.withdrawalUntil >= new Date().toISOString().slice(0, 10));
  const form = useForm<HealthEventFormValues>({
    resolver: zodResolver(healthEventSchema),
    defaultValues: {
      lotId: farmLots[0]?.id ?? "",
      animalId: "",
      eventType: "desparasitacion",
      eventDate: new Date().toISOString().slice(0, 10),
      productName: "",
      dose: "",
      unit: "",
      diagnosis: "",
      withdrawalUntil: "",
      cost: 0,
      notes: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    recordHealthEvent({
      ...values,
      lotId: values.lotId || undefined,
      animalId: values.animalId || undefined
    });
    form.reset({
      lotId: farmLots[0]?.id ?? "",
      animalId: "",
      eventType: "desparasitacion",
      eventDate: new Date().toISOString().slice(0, 10),
      productName: "",
      dose: "",
      unit: "",
      diagnosis: "",
      withdrawalUntil: "",
      cost: 0,
      notes: ""
    });
    setFormOpen(false);
  });

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Sanidad</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Control sanitario y retiros</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MetricCard icon={HeartPulse} label="Eventos" value={farmEvents.length} />
            <MetricCard icon={ShieldCheck} label="Vacunas" value={farmEvents.filter((event) => ["aftosa", "carbon", "rabia"].includes(event.eventType)).length} color="text-emerald-700" />
            <MetricCard icon={AlertTriangle} label="Retiros" value={withdrawalAlerts.length} color="text-amber-700" />
          </div>
        </div>

        <FormPanel title="Registrar sanidad" icon={HeartPulse} open={formOpen} onClose={() => setFormOpen(false)}>
            <form className="grid gap-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Tipo" error={form.formState.errors.eventType?.message}>
                  <Select {...form.register("eventType")}>
                    {Object.entries(healthEventLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Fecha" error={form.formState.errors.eventDate?.message}>
                  <Input type="date" {...form.register("eventDate")} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Lote">
                  <Select {...form.register("lotId")}>
                    <option value="">Sin lote</option>
                    {farmLots.map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Animal">
                  <Select {...form.register("animalId")}>
                    <option value="">Todo el lote</option>
                    {farmAnimals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.internalCode}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Producto">
                  <Input {...form.register("productName")} />
                </FormField>
                <FormField label="Costo">
                  <Input type="number" {...form.register("cost")} />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Dosis">
                  <Input {...form.register("dose")} />
                </FormField>
                <FormField label="Unidad">
                  <Input {...form.register("unit")} />
                </FormField>
                <FormField label="Retiro hasta">
                  <Input type="date" {...form.register("withdrawalUntil")} />
                </FormField>
              </div>
              <FormField label="Diagnostico">
                <Input {...form.register("diagnosis")} />
              </FormField>
              <FormField label="Notas">
                <Textarea {...form.register("notes")} />
              </FormField>
              <Button type="submit">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Guardar evento
              </Button>
            </form>
        </FormPanel>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {farmEvents.map((event) => {
          const animal = animals.find((item) => item.id === event.animalId);
          const lot = lots.find((item) => item.id === event.lotId);

          return (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{healthEventLabels[event.eventType]}</CardTitle>
                <p className="text-sm text-slate-500">{formatDate(event.eventDate)} · {animal?.internalCode ?? lot?.name ?? "Finca"}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {event.productName ? <p><span className="font-semibold">Producto:</span> {event.productName}</p> : null}
                {event.diagnosis ? <p><span className="font-semibold">Diagnostico:</span> {event.diagnosis}</p> : null}
                {event.withdrawalUntil ? <p><span className="font-semibold">Retiro:</span> hasta {formatDate(event.withdrawalUntil)}</p> : null}
                {event.cost ? <p><span className="font-semibold">Costo:</span> {formatMoney(event.cost)}</p> : null}
                {event.notes ? <p className="text-slate-600">{event.notes}</p> : null}
              </CardContent>
            </Card>
          );
        })}
      </section>
      <FloatingCreateButton label="Registrar sanidad" onClick={() => setFormOpen(true)} />
    </div>
  );
}
