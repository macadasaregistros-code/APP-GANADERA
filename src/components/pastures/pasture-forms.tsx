"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, CircleDollarSign, LogIn, LogOut, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type PastureEntryFormValues,
  type PastureEventFormValues,
  type PastureExitFormValues,
  type PastureFormValues,
  pastureEntrySchema,
  pastureEventSchema,
  pastureExitSchema,
  pastureSchema
} from "@/features/pastures/schemas";
import { pastureEventTypeLabels } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";
import type { Pasture } from "@/features/pastures/types";
import { todayIso } from "@/features/pastures/calculations";

type PastureFormProps = {
  pasture?: Pasture;
  onCompleted?: () => void;
};

const grassTypeOptions = [
  { value: "", label: "Sin especificar" },
  { value: "Brachiaria", label: "Brachiaria" },
  { value: "Angleton", label: "Angleton" },
  { value: "Mombasa", label: "Mombasa" },
  { value: "Estrella africana", label: "Estrella africana" },
  { value: "Rastrojo", label: "Rastrojo" },
  { value: "Kikuyo", label: "Kikuyo" },
  { value: "Otro", label: "Otro" }
];

export function PastureForm({ pasture, onCompleted }: PastureFormProps) {
  const createPasture = usePastureStore((state) => state.createPasture);
  const updatePasture = usePastureStore((state) => state.updatePasture);
  const form = useForm<PastureFormValues>({
    resolver: zodResolver(pastureSchema),
    defaultValues: getPastureDefaultValues(pasture)
  });

  useEffect(() => {
    form.reset(getPastureDefaultValues(pasture));
  }, [form, pasture]);

  const onSubmit = form.handleSubmit(async (values) => {
    const pastureValues = {
      ...values,
      grassType: values.grassType ?? "",
      waterAvailable: values.waterAvailable === "true"
    };

    if (pasture) {
      updatePasture(pasture.id, pastureValues);
      onCompleted?.();
      return;
    }

    await createPasture(pastureValues);
    form.reset(getPastureDefaultValues());
    onCompleted?.();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pasture ? "Configurar potrero" : "Nuevo potrero"}</CardTitle>
        <CardDescription>Reglas propias de pastoreo y recuperacion.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Field label="Nombre" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} placeholder="La Vega" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Area ha" error={form.formState.errors.areaHa?.message}>
              <Input type="number" step="0.1" {...form.register("areaHa")} />
            </Field>
            <Field label="Capacidad" error={form.formState.errors.carryingCapacityAnimals?.message}>
              <Input type="number" {...form.register("carryingCapacityAnimals")} />
            </Field>
          </div>
          <Field label="Tipo de pasto" error={form.formState.errors.grassType?.message}>
            <Select {...form.register("grassType")}>
              {grassTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dias pastoreo" error={form.formState.errors.maxGrazingDays?.message}>
              <Input type="number" {...form.register("maxGrazingDays")} />
            </Field>
            <Field label="Dias recuperacion" error={form.formState.errors.recoveryDaysRequired?.message}>
              <Input type="number" {...form.register("recoveryDaysRequired")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Agua">
              <Select {...form.register("waterAvailable")}>
                <option value="true">Si</option>
                <option value="false">No</option>
              </Select>
            </Field>
            <Field label="Estado">
              <Select {...form.register("status")}>
                <option value="active">Activo</option>
                <option value="maintenance">Mantenimiento</option>
              </Select>
            </Field>
          </div>
          <Field label="Notas">
            <Textarea {...form.register("notes")} placeholder="Observaciones del potrero" />
          </Field>
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {pasture ? "Guardar cambios" : "Crear potrero"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function PastureEntryForm({ defaultPastureId, onCompleted }: { defaultPastureId?: string; onCompleted?: () => void }) {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const pastures = usePastureStore((state) => state.pastures);
  const rotations = usePastureStore((state) => state.rotations);
  const lots = usePastureStore((state) => state.lots);
  const enterPasture = usePastureStore((state) => state.enterPasture);
  const activePastureIds = useMemo(
    () => new Set(rotations.filter((rotation) => !rotation.exitDate).map((rotation) => rotation.pastureId)),
    [rotations]
  );
  const availablePastures = useMemo(
    () =>
      pastures.filter(
        (pasture) =>
          pasture.farmId === selectedFarmId &&
          pasture.status !== "maintenance" &&
          !activePastureIds.has(pasture.id)
      ),
    [activePastureIds, pastures, selectedFarmId]
  );
  const farmLots = useMemo(
    () => lots.filter((lot) => lot.farmId === selectedFarmId && lot.status === "active"),
    [lots, selectedFarmId]
  );
  const form = useForm<PastureEntryFormValues>({
    resolver: zodResolver(pastureEntrySchema),
    defaultValues: {
      pastureId: defaultPastureId ?? availablePastures[0]?.id ?? "",
      lotId: farmLots[0]?.id ?? "",
      entryDate: todayIso(),
      animalCount: farmLots[0]?.animalCount ?? 1,
      pastureConditionEntry: "",
      notes: ""
    }
  });

  useEffect(() => {
    form.reset({
      pastureId: defaultPastureId ?? availablePastures[0]?.id ?? "",
      lotId: farmLots[0]?.id ?? "",
      entryDate: todayIso(),
      animalCount: farmLots[0]?.animalCount ?? 1,
      pastureConditionEntry: "",
      notes: ""
    });
  }, [availablePastures, defaultPastureId, farmLots, form, selectedFarmId]);

  const onSubmit = form.handleSubmit(async (values) => {
    await enterPasture(values);
    form.reset({
      pastureId: availablePastures[0]?.id ?? "",
      lotId: farmLots[0]?.id ?? "",
      entryDate: todayIso(),
      animalCount: farmLots[0]?.animalCount ?? 1,
      pastureConditionEntry: "",
      notes: ""
    });
    onCompleted?.();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar ganado</CardTitle>
        <CardDescription>La salida sugerida se calcula con los dias del potrero.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Field label="Potrero" error={form.formState.errors.pastureId?.message}>
            <Select {...form.register("pastureId")}>
              {availablePastures.map((pasture) => (
                <option key={pasture.id} value={pasture.id}>
                  {pasture.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lote" error={form.formState.errors.lotId?.message}>
              <Select {...form.register("lotId")}>
                {farmLots.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Animales" error={form.formState.errors.animalCount?.message}>
              <Input type="number" {...form.register("animalCount")} />
            </Field>
          </div>
          <Field label="Fecha entrada" error={form.formState.errors.entryDate?.message}>
            <Input type="date" {...form.register("entryDate")} />
          </Field>
          <Field label="Condicion al entrar">
            <Textarea {...form.register("pastureConditionEntry")} placeholder="Rebrote, agua, sombra, malezas" />
          </Field>
          <Button type="submit" className="w-full" disabled={availablePastures.length === 0 || farmLots.length === 0}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Registrar entrada
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function PastureExitForm() {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const pastures = usePastureStore((state) => state.pastures);
  const lots = usePastureStore((state) => state.lots);
  const rotations = usePastureStore((state) => state.rotations);
  const exitPasture = usePastureStore((state) => state.exitPasture);
  const activeRotations = useMemo(
    () => rotations.filter((rotation) => rotation.farmId === selectedFarmId && !rotation.exitDate),
    [rotations, selectedFarmId]
  );
  const form = useForm<PastureExitFormValues>({
    resolver: zodResolver(pastureExitSchema),
    defaultValues: {
      rotationId: activeRotations[0]?.id ?? "",
      exitDate: todayIso(),
      pastureConditionExit: "",
      notes: ""
    }
  });

  useEffect(() => {
    form.reset({
      rotationId: activeRotations[0]?.id ?? "",
      exitDate: todayIso(),
      pastureConditionExit: "",
      notes: ""
    });
  }, [activeRotations, form, selectedFarmId]);

  const onSubmit = form.handleSubmit((values) => {
    exitPasture(values);
    form.reset({
      rotationId: activeRotations[0]?.id ?? "",
      exitDate: todayIso(),
      pastureConditionExit: "",
      notes: ""
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sacar ganado</CardTitle>
        <CardDescription>Al cerrar la rotacion inicia la recuperacion.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Field label="Rotacion activa" error={form.formState.errors.rotationId?.message}>
            <Select {...form.register("rotationId")}>
              {activeRotations.map((rotation) => {
                const pasture = pastures.find((item) => item.id === rotation.pastureId);
                const lot = lots.find((item) => item.id === rotation.lotId);

                return (
                  <option key={rotation.id} value={rotation.id}>
                    {pasture?.name ?? "Potrero"} - {lot?.name ?? "Lote"}
                  </option>
                );
              })}
            </Select>
          </Field>
          <Field label="Fecha salida" error={form.formState.errors.exitDate?.message}>
            <Input type="date" {...form.register("exitDate")} />
          </Field>
          <Field label="Condicion al salir">
            <Textarea {...form.register("pastureConditionExit")} placeholder="Altura, zonas comidas, agua, cerca" />
          </Field>
          <Button type="submit" className="w-full" disabled={activeRotations.length === 0}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Registrar salida
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function PastureEventForm({ defaultPastureId, onCompleted }: { defaultPastureId?: string; onCompleted?: () => void }) {
  const selectedFarmId = usePastureStore((state) => state.selectedFarmId);
  const pastures = usePastureStore((state) => state.pastures);
  const addPastureEvent = usePastureStore((state) => state.addPastureEvent);
  const farmPastures = useMemo(
    () => pastures.filter((pasture) => pasture.farmId === selectedFarmId),
    [pastures, selectedFarmId]
  );
  const form = useForm<PastureEventFormValues>({
    resolver: zodResolver(pastureEventSchema),
    defaultValues: {
      pastureId: defaultPastureId ?? farmPastures[0]?.id ?? "",
      eventDate: todayIso(),
      eventType: "observacion",
      title: "",
      description: "",
      costAmount: undefined
    }
  });

  useEffect(() => {
    form.reset({
      pastureId: defaultPastureId ?? farmPastures[0]?.id ?? "",
      eventDate: todayIso(),
      eventType: "observacion",
      title: "",
      description: "",
      costAmount: undefined
    });
  }, [defaultPastureId, farmPastures, form, selectedFarmId]);

  const onSubmit = form.handleSubmit((values) => {
    addPastureEvent({
      ...values,
      costAmount: values.costAmount ? Number(values.costAmount) : undefined
    });
    form.reset({
      pastureId: defaultPastureId ?? farmPastures[0]?.id ?? "",
      eventDate: todayIso(),
      eventType: "observacion",
      title: "",
      description: "",
      costAmount: undefined
    });
    onCompleted?.();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bitacora de potrero</CardTitle>
        <CardDescription>Evento operativo con costo opcional.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Field label="Potrero" error={form.formState.errors.pastureId?.message}>
            <Select {...form.register("pastureId")} disabled={Boolean(defaultPastureId)}>
              {farmPastures.map((pasture) => (
                <option key={pasture.id} value={pasture.id}>
                  {pasture.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha" error={form.formState.errors.eventDate?.message}>
              <Input type="date" {...form.register("eventDate")} />
            </Field>
            <Field label="Tipo" error={form.formState.errors.eventType?.message}>
              <Select {...form.register("eventType")}>
                {Object.entries(pastureEventTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Titulo" error={form.formState.errors.title?.message}>
            <Input {...form.register("title")} placeholder="Guadana de bordes" />
          </Field>
          <Field label="Descripcion">
            <Textarea {...form.register("description")} placeholder="Detalle corto del trabajo" />
          </Field>
          <Field label="Costo opcional" error={form.formState.errors.costAmount?.message}>
            <Input type="number" min="0" step="1000" {...form.register("costAmount")} />
          </Field>
          <Button type="submit" className="w-full">
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Registrar evento
          </Button>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <CircleDollarSign className="h-3.5 w-3.5" aria-hidden="true" />
            Si agregas costo, queda para rentabilidad sin repetir registro.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function getPastureDefaultValues(pasture?: Pasture): PastureFormValues {
  return {
    name: pasture?.name ?? "",
    areaHa: pasture?.areaHa ?? 1,
    grassType: pasture?.grassType ?? "",
    carryingCapacityAnimals: pasture?.carryingCapacityAnimals ?? 0,
    maxGrazingDays: pasture?.maxGrazingDays ?? 3,
    recoveryDaysRequired: pasture?.recoveryDaysRequired ?? 28,
    waterAvailable: pasture?.waterAvailable === false ? "false" : "true",
    status: pasture?.status ?? "active",
    notes: pasture?.notes ?? ""
  };
}
