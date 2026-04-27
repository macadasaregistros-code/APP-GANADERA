"use client";

import { LogIn, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { getPastureStatus, todayIso } from "@/features/pastures/calculations";
import { usePastureStore } from "@/features/pastures/store";
import type { Lot, Pasture, PastureRotation, PastureStatusSummary } from "@/features/pastures/types";
import { cn } from "@/lib/utils";

type RotationBoardProps = {
  pastures: Pasture[];
  rotations: PastureRotation[];
  lots: Lot[];
};

type BoardItem = {
  pasture: Pasture;
  summary: PastureStatusSummary;
};

export function PastureRotationBoard({ pastures, rotations, lots }: RotationBoardProps) {
  const enterPasture = usePastureStore((state) => state.enterPasture);
  const [selected, setSelected] = useState<BoardItem | null>(null);
  const [selectedLotId, setSelectedLotId] = useState("");
  const farmLots = lots.filter((lot) => lot.status === "active");

  const items = useMemo(() => {
    return pastures
      .map((pasture) => ({ pasture, summary: getPastureStatus(pasture, rotations) }))
      .sort((a, b) => {
        const aOccupied = a.summary.activeRotation ? 1 : 0;
        const bOccupied = b.summary.activeRotation ? 1 : 0;

        if (aOccupied !== bOccupied) {
          return bOccupied - aOccupied;
        }

        return b.summary.daysResting - a.summary.daysResting;
      });
  }, [pastures, rotations]);

  const maxArea = Math.max(...pastures.map((pasture) => pasture.areaHa), 1);

  function handleOpen(item: BoardItem) {
    setSelected(item);
    setSelectedLotId(farmLots[0]?.id ?? "");
  }

  function handleEnterLot() {
    if (!selected || !selectedLotId) {
      return;
    }

    const lot = farmLots.find((item) => item.id === selectedLotId);
    enterPasture({
      pastureId: selected.pasture.id,
      lotId: selectedLotId,
      entryDate: todayIso(),
      animalCount: Math.max(lot?.animalCount ?? 1, 1)
    });
    setSelected(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mapa de rotacion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-72 flex-wrap content-start gap-2">
            {items.map((item) => {
              const style = getPastureStyle(item.summary, item.pasture.recoveryDaysRequired);
              const scale = Math.max(0.72, Math.sqrt(item.pasture.areaHa / maxArea));
              const width = Math.round(82 + scale * 92);
              const height = Math.round(58 + scale * 62);
              const lot = item.summary.activeRotation
                ? lots.find((entry) => entry.id === item.summary.activeRotation?.lotId)
                : undefined;

              return (
                <button
                  key={item.pasture.id}
                  type="button"
                  onClick={() => handleOpen(item)}
                  className={cn(
                    "flex shrink-0 flex-col justify-between rounded-md border-4 p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                    style.className
                  )}
                  style={{
                    width,
                    height,
                    backgroundColor: style.backgroundColor,
                    borderColor: style.borderColor
                  }}
                >
                  <span className="line-clamp-2 text-sm font-bold text-slate-950">{item.pasture.name}</span>
                  <span className="text-[11px] font-semibold text-slate-700">
                    {item.summary.activeRotation
                      ? `${lot?.name ?? "Ocupado"} · ${item.summary.daysOccupied}d`
                      : `${item.summary.daysResting}d descanso`}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selected ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45 px-4 py-5 backdrop-blur-sm">
          <div className="mx-auto flex min-h-full max-w-md items-center">
            <Card className="w-full">
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>{selected.pasture.name}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{selected.pasture.areaHa} ha</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                {selected.summary.activeRotation ? (
                  <OccupiedInfo item={selected} lots={lots} />
                ) : (
                  <>
                    <p>
                      <span className="font-semibold">Dias desocupado:</span> {selected.summary.daysResting}
                    </p>
                    <Select value={selectedLotId} onChange={(event) => setSelectedLotId(event.target.value)}>
                      {farmLots.map((lot) => (
                        <option key={lot.id} value={lot.id}>
                          {lot.name} · {lot.animalCount} animales
                        </option>
                      ))}
                    </Select>
                    <div className="grid grid-cols-2 gap-2">
                      <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                        Cancelar
                      </Button>
                      <Button type="button" onClick={handleEnterLot} disabled={!selectedLotId}>
                        <LogIn className="h-4 w-4" aria-hidden="true" />
                        Entrar lote
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}

function OccupiedInfo({ item, lots }: { item: BoardItem; lots: Lot[] }) {
  const rotation = item.summary.activeRotation;
  const lot = rotation ? lots.find((entry) => entry.id === rotation.lotId) : undefined;

  return (
    <>
      <p>
        <span className="font-semibold">Dias ocupado:</span> {item.summary.daysOccupied}
      </p>
      <p>
        <span className="font-semibold">Lote:</span> {lot?.name ?? "Lote activo"}
      </p>
      <p>
        <span className="font-semibold">Animales:</span> {rotation?.animalCount ?? lot?.animalCount ?? 0}
      </p>
    </>
  );
}

function getPastureStyle(summary: PastureStatusSummary, recoveryDays: number) {
  if (summary.activeRotation) {
    return {
      className: "bg-sky-50",
      backgroundColor: "hsl(199 89% 96%)",
      borderColor: summary.status === "overdue" ? "hsl(0 72% 45%)" : "hsl(199 89% 48%)"
    };
  }

  if (summary.status === "maintenance") {
    return {
      className: "bg-orange-50",
      backgroundColor: "hsl(33 100% 96%)",
      borderColor: "hsl(25 95% 53%)"
    };
  }

  const ratio = Math.min(summary.daysResting / Math.max(recoveryDays, 1), 1);
  const hue = Math.round(0 + ratio * 142);

  return {
    className: "",
    backgroundColor: `hsl(${hue} 85% 95%)`,
    borderColor: `hsl(${hue} 70% 38%)`
  };
}
