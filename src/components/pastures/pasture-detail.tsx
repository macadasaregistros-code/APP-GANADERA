"use client";

import { ArrowLeft, CalendarDays, Droplets, Ruler, Sprout, Timer, WalletCards } from "lucide-react";
import Link from "next/link";

import { PastureEntryForm, PastureEventForm, PastureForm } from "@/components/pastures/pasture-forms";
import { PastureStatusBadge } from "@/components/pastures/pasture-status-badge";
import { PastureTimeline } from "@/components/pastures/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPastureCostTotal, getPastureStatus, getPastureTimeline } from "@/features/pastures/calculations";
import { formatDate, formatMoney } from "@/features/pastures/format";
import { usePastureStore } from "@/features/pastures/store";

export function PastureDetail({ pastureId }: { pastureId: string }) {
  const pastures = usePastureStore((state) => state.pastures);
  const rotations = usePastureStore((state) => state.rotations);
  const events = usePastureStore((state) => state.events);
  const lots = usePastureStore((state) => state.lots);
  const pasture = pastures.find((item) => item.id === pastureId);

  if (!pasture) {
    return (
      <div className="space-y-4">
        <Button asChild variant="outline">
          <Link href="/potreros">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </Link>
        </Button>
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">Potrero no encontrado.</CardContent>
        </Card>
      </div>
    );
  }

  const summary = getPastureStatus(pasture, rotations);
  const timeline = getPastureTimeline(pasture, rotations, events);
  const costTotal = getPastureCostTotal(pasture.id, events);
  const activeLot = summary.activeRotation ? lots.find((lot) => lot.id === summary.activeRotation?.lotId) : undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link href="/potreros">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </Link>
        </Button>
        <PastureStatusBadge summary={summary} />
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Potrero</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-950">{pasture.name}</h2>
            <p className="mt-1 text-slate-600">{pasture.grassType}</p>
          </div>
          <Sprout className="h-9 w-9 text-emerald-700" aria-hidden="true" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
          <DetailMetric icon={Ruler} label="Area" value={`${pasture.areaHa} ha`} />
          <DetailMetric icon={Timer} label="Pastoreo" value={`${pasture.maxGrazingDays} dias`} />
          <DetailMetric icon={CalendarDays} label="Recuperacion" value={`${pasture.recoveryDaysRequired} dias`} />
          <DetailMetric icon={Droplets} label="Agua" value={pasture.waterAvailable ? "Si" : "No"} />
          <DetailMetric icon={WalletCards} label="Costos" value={formatMoney(costTotal)} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {(summary.status === "occupied" || summary.status === "overdue") && summary.activeRotation ? (
                <>
                  <p>
                    <span className="font-semibold">Lote:</span> {activeLot?.name ?? "Activo"}
                  </p>
                  <p>
                    <span className="font-semibold">Animales:</span> {summary.activeRotation.animalCount}
                  </p>
                  <p>
                    <span className="font-semibold">Entrada:</span> {formatDate(summary.activeRotation.entryDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Salida sugerida:</span>{" "}
                    {formatDate(summary.activeRotation.plannedExitDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Dias ocupado:</span> {summary.daysOccupied}
                  </p>
                </>
              ) : summary.status === "resting" ? (
                <>
                  <p>
                    <span className="font-semibold">Ultima salida:</span>{" "}
                    {summary.lastExitDate ? formatDate(summary.lastExitDate) : "Sin fecha"}
                  </p>
                  <p>
                    <span className="font-semibold">Dias recuperando:</span> {summary.daysResting}
                  </p>
                  <p>
                    <span className="font-semibold">Faltan:</span> {summary.daysUntilReady} dias
                  </p>
                </>
              ) : (
                <p className="font-semibold text-emerald-800">
                  {summary.status === "maintenance" ? "Potrero en mantenimiento." : "Potrero listo para usar."}
                </p>
              )}
            </CardContent>
          </Card>

          <PastureForm pasture={pasture} />
          {summary.status === "ready" ? <PastureEntryForm defaultPastureId={pasture.id} /> : null}
          <PastureEventForm defaultPastureId={pasture.id} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent>
            <PastureTimeline items={timeline} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DetailMetric({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
