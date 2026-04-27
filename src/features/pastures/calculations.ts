import type {
  Animal,
  AnimalPerformance,
  CostRecord,
  HealthEvent,
  Lot,
  LotPerformance,
  Pasture,
  PastureEvent,
  PastureRotation,
  PastureStatusSummary,
  PastureTimelineItem,
  SupplementationRecord,
  WeightRecord
} from "@/features/pastures/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function parseIsoDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function daysBetween(startDate: string, endDate: string) {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function addDays(date: string, days: number) {
  const parsed = parseIsoDate(date);
  parsed.setUTCDate(parsed.getUTCDate() + days);

  return parsed.toISOString().slice(0, 10);
}

export function calculateOccupationDays(entryDate: string, exitDate: string) {
  return Math.max(daysBetween(entryDate, exitDate), 1);
}

export function getPastureStatus(
  pasture: Pasture,
  rotations: PastureRotation[],
  referenceDate = todayIso()
): PastureStatusSummary {
  const pastureRotations = rotations
    .filter((rotation) => rotation.pastureId === pasture.id)
    .sort((a, b) => b.entryDate.localeCompare(a.entryDate));

  const activeRotation = pastureRotations.find((rotation) => !rotation.exitDate);
  const closedRotations = pastureRotations
    .filter((rotation) => rotation.exitDate)
    .sort((a, b) => (b.exitDate ?? "").localeCompare(a.exitDate ?? ""));
  const lastClosedRotation = closedRotations[0];

  if (pasture.status === "maintenance") {
    return {
      status: "maintenance",
      label: "Mantenimiento",
      color: "orange",
      activeRotation,
      lastClosedRotation,
      daysOccupied: 0,
      daysResting: 0,
      daysUntilReady: 0
    };
  }

  if (activeRotation) {
    const daysOccupied = Math.max(daysBetween(activeRotation.entryDate, referenceDate), 0);
    const isOverdue = referenceDate > activeRotation.plannedExitDate;

    return {
      status: isOverdue ? "overdue" : "occupied",
      label: isOverdue ? "Pasado de dias" : "Ocupado",
      color: isOverdue ? "red" : "blue",
      activeRotation,
      lastClosedRotation,
      daysOccupied,
      daysResting: 0,
      daysUntilReady: Math.max(daysBetween(referenceDate, activeRotation.plannedExitDate), 0),
      plannedExitDate: activeRotation.plannedExitDate
    };
  }

  if (!lastClosedRotation?.exitDate) {
    return {
      status: "ready",
      label: "Listo",
      color: "green",
      lastClosedRotation,
      daysOccupied: 0,
      daysResting: 0,
      daysUntilReady: 0
    };
  }

  const daysResting = Math.max(daysBetween(lastClosedRotation.exitDate, referenceDate), 0);
  const daysUntilReady = Math.max(lastClosedRotation.recoveryDaysRequiredSnapshot - daysResting, 0);
  const ready = daysUntilReady === 0;

  return {
    status: ready ? "ready" : "resting",
    label: ready ? "Listo" : "Recuperacion",
    color: ready ? "green" : "yellow",
    lastClosedRotation,
    daysOccupied: 0,
    daysResting,
    daysUntilReady,
    lastExitDate: lastClosedRotation.exitDate
  };
}

export function getPastureTimeline(
  pasture: Pasture,
  rotations: PastureRotation[],
  events: PastureEvent[]
): PastureTimelineItem[] {
  const rotationItems = rotations
    .filter((rotation) => rotation.pastureId === pasture.id)
    .flatMap<PastureTimelineItem>((rotation) => {
      const entry: PastureTimelineItem = {
        id: `${rotation.id}-entry`,
        date: rotation.entryDate,
        type: "entry",
        title: "Entro ganado",
        description: `${rotation.animalCount} animales. Salida sugerida: ${rotation.plannedExitDate}.`
      };

      if (!rotation.exitDate) {
        return [entry];
      }

      return [
        entry,
        {
          id: `${rotation.id}-exit`,
          date: rotation.exitDate,
          type: "exit",
          title: "Salio ganado",
          description: `${rotation.occupationDays ?? calculateOccupationDays(rotation.entryDate, rotation.exitDate)} dias de ocupacion.`
        }
      ];
    });

  const eventItems = events
    .filter((event) => event.pastureId === pasture.id)
    .map<PastureTimelineItem>((event) => ({
      id: event.id,
      date: event.eventDate,
      type: "event",
      title: event.title,
      description: event.description,
      costAmount: event.costAmount
    }));

  return [...rotationItems, ...eventItems].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPastureCostTotal(pastureId: string, events: PastureEvent[]) {
  return events
    .filter((event) => event.pastureId === pastureId)
    .reduce((sum, event) => sum + (event.costAmount ?? 0), 0);
}

export function getLastMaintenanceEvent(pastureId: string, events: PastureEvent[]) {
  return events
    .filter((event) => event.pastureId === pastureId && event.eventType !== "observacion")
    .sort((a, b) => b.eventDate.localeCompare(a.eventDate))[0];
}

export function getLatestWeightRecord(animalId: string, weights: WeightRecord[]) {
  return weights
    .filter((weight) => weight.animalId === animalId)
    .sort((a, b) => b.weighedAt.localeCompare(a.weighedAt))[0];
}

export function getAnimalDaysInCeba(animal: Animal, referenceDate = todayIso()) {
  return Math.max(daysBetween(animal.purchaseDate, referenceDate), 1);
}

export function getAccumulatedDailyGain(animal: Animal, referenceDate = todayIso()) {
  const kgGained = animal.currentWeightKg - animal.entryWeightKg;
  return kgGained / getAnimalDaysInCeba(animal, referenceDate);
}

export function getUnifiedCostRecords(input: {
  pastureEvents: PastureEvent[];
  healthEvents: HealthEvent[];
  supplementationRecords: SupplementationRecord[];
  costRecords: CostRecord[];
}): CostRecord[] {
  const pastureCosts: CostRecord[] = input.pastureEvents
    .filter((event) => event.costAmount && event.costAmount > 0)
    .map((event) => ({
      id: `pasture-event-cost-${event.id}`,
      farmId: event.farmId,
      pastureId: event.pastureId,
      costDate: event.eventDate,
      category: event.eventType === "guadana" ? "guadana" : "mantenimiento_potrero",
      description: event.title,
      amount: event.costAmount ?? 0,
      allocationMethod: "potrero",
      createdBy: event.createdBy,
      createdAt: event.createdAt
    }));

  const healthCosts: CostRecord[] = input.healthEvents
    .filter((event) => event.cost && event.cost > 0)
    .map((event) => ({
      id: `health-cost-${event.id}`,
      farmId: event.farmId,
      lotId: event.lotId,
      animalId: event.animalId,
      costDate: event.eventDate,
      category: event.eventType === "aftosa" ? "vacunacion" : "medicamentos",
      description: event.productName ?? event.eventType,
      amount: event.cost ?? 0,
      allocationMethod: event.animalId ? "animal" : event.lotId ? "lote" : "finca",
      createdBy: event.createdBy,
      createdAt: event.createdAt
    }));

  const supplementCosts: CostRecord[] = input.supplementationRecords.map((record) => ({
    id: `supplement-cost-${record.id}`,
    farmId: record.farmId,
    lotId: record.lotId,
    costDate: record.endDate,
    category: "suplementos",
    description: `Suplementacion ${record.unit}`,
    amount: record.totalCost,
    allocationMethod: "lote",
    createdAt: record.createdAt
  }));

  return [...input.costRecords, ...pastureCosts, ...healthCosts, ...supplementCosts];
}

export function getAnimalAllocatedCost(animal: Animal, animals: Animal[], costs: CostRecord[]) {
  const farmAnimals = animals.filter((item) => item.farmId === animal.farmId && item.status !== "sold");
  const lotAnimals = animals.filter((item) => item.lotId === animal.lotId && item.status !== "sold");

  return costs
    .filter((cost) => cost.farmId === animal.farmId)
    .reduce((sum, cost) => {
      if (cost.allocationMethod === "animal" && cost.animalId === animal.id) {
        return sum + cost.amount;
      }

      if (cost.allocationMethod === "lote" && cost.lotId === animal.lotId) {
        return sum + cost.amount / Math.max(lotAnimals.length, 1);
      }

      if (cost.allocationMethod === "finca") {
        return sum + cost.amount / Math.max(farmAnimals.length, 1);
      }

      return sum;
    }, 0);
}

export function getAnimalPerformance(input: {
  animal: Animal;
  lot?: Lot;
  animals: Animal[];
  weights: WeightRecord[];
  costs: CostRecord[];
  referenceDate?: string;
}): AnimalPerformance {
  const latestWeight = getLatestWeightRecord(input.animal.id, input.weights);
  const kgGained = Math.max(input.animal.currentWeightKg - input.animal.entryWeightKg, 0);
  const daysInCeba = getAnimalDaysInCeba(input.animal, input.referenceDate);
  const allocatedCost = getAnimalAllocatedCost(input.animal, input.animals, input.costs);

  return {
    animal: input.animal,
    lot: input.lot,
    kgGained,
    daysInCeba,
    accumulatedDailyGainKg: kgGained / Math.max(daysInCeba, 1),
    latestWeightDate: latestWeight?.weighedAt,
    allocatedCost,
    costPerKgGained: allocatedCost / Math.max(kgGained, 1)
  };
}

export function getLotPerformance(input: {
  lot: Lot;
  animals: Animal[];
  weights: WeightRecord[];
  costs: CostRecord[];
  expectedSalePricePerKg?: number;
}): LotPerformance {
  const lotAnimals = input.animals.filter((animal) => animal.lotId === input.lot.id && animal.status !== "sold");
  const performances = lotAnimals.map((animal) =>
    getAnimalPerformance({
      animal,
      lot: input.lot,
      animals: input.animals,
      weights: input.weights,
      costs: input.costs
    })
  );
  const totalEntryWeight = lotAnimals.reduce((sum, animal) => sum + animal.entryWeightKg, 0);
  const totalCurrentWeight = lotAnimals.reduce((sum, animal) => sum + animal.currentWeightKg, 0);
  const totalKgGained = performances.reduce((sum, performance) => sum + performance.kgGained, 0);
  const totalCost = performances.reduce((sum, performance) => sum + performance.allocatedCost, 0);
  const estimatedRevenue = totalCurrentWeight * (input.expectedSalePricePerKg ?? 9800);
  const purchaseCost = lotAnimals.reduce((sum, animal) => sum + animal.purchasePrice, 0);

  return {
    lot: input.lot,
    activeAnimalCount: lotAnimals.length,
    avgEntryWeightKg: totalEntryWeight / Math.max(lotAnimals.length, 1),
    avgCurrentWeightKg: totalCurrentWeight / Math.max(lotAnimals.length, 1),
    avgDailyGainKg:
      performances.reduce((sum, performance) => sum + performance.accumulatedDailyGainKg, 0) /
      Math.max(performances.length, 1),
    totalKgGained,
    totalCost,
    costPerKgProduced: totalCost / Math.max(totalKgGained, 1),
    estimatedMargin: estimatedRevenue - purchaseCost - totalCost
  };
}
