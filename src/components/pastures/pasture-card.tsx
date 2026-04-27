"use client";

import { CalendarDays, Droplets, ExternalLink, Ruler, WalletCards } from "lucide-react";
import Link from "next/link";

import { PastureStatusBadge } from "@/components/pastures/pasture-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLastMaintenanceEvent, getPastureCostTotal, getPastureStatus } from "@/features/pastures/calculations";
import { formatDate, formatMoney } from "@/features/pastures/format";
import type { Lot, Pasture, PastureEvent, PastureRotation } from "@/features/pastures/types";

type PastureCardProps = {
  pasture: Pasture;
  rotations: PastureRotation[];
  events: PastureEvent[];
  lots: Lot[];
};

export function PastureCard({ pasture, rotations, events, lots }: PastureCardProps) {
  const summary = getPastureStatus(pasture, rotations);
  const currentLot = summary.activeRotation ? lots.find((lot) => lot.id === summary.activeRotation?.lotId) : undefined;
  const lastEvent = getLastMaintenanceEvent(pasture.id, events);
  const costTotal = getPastureCostTotal(pasture.id, events);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{pasture.name}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">{pasture.grassType}</p>
          </div>
          <PastureStatusBadge summary={summary} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Metric icon={Ruler} label="Area" value={`${pasture.areaHa} ha`} />
          <Metric icon={Droplets} label="Agua" value={pasture.waterAvailable ? "Si" : "No"} />
          <Metric icon={CalendarDays} label="Pastoreo" value={`${pasture.maxGrazingDays} dias`} />
          <Metric icon={WalletCards} label="Costos" value={formatMoney(costTotal)} />
        </div>

        <div className="rounded-md bg-slate-50 p-3 text-sm">
          {summary.status === "occupied" || summary.status === "overdue" ? (
            <div>
              <p className="font-semibold text-slate-900">{currentLot?.name ?? "Lote activo"}</p>
              <p className="text-slate-600">
                {summary.daysOccupied} dias ocupado. Salida sugerida:{" "}
                {summary.plannedExitDate ? formatDate(summary.plannedExitDate) : "sin fecha"}.
              </p>
            </div>
          ) : summary.status === "resting" ? (
            <p className="text-slate-700">
              {summary.daysResting} dias en recuperacion. Faltan {summary.daysUntilReady} dias.
            </p>
          ) : summary.status === "ready" ? (
            <p className="font-semibold text-emerald-800">Listo para entrar ganado.</p>
          ) : (
            <p className="font-semibold text-orange-800">No usar hasta terminar mantenimiento.</p>
          )}
        </div>

        {lastEvent ? (
          <p className="text-xs text-slate-500">
            Ultimo trabajo: {lastEvent.title} ({formatDate(lastEvent.eventDate)})
          </p>
        ) : (
          <p className="text-xs text-slate-500">Sin trabajos registrados.</p>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href={`/potreros/${pasture.id}`}>
            Ver historial
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-white p-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
