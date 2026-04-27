"use client";

import { create } from "zustand";

import { addDays, calculateOccupationDays, daysBetween, todayIso } from "@/features/pastures/calculations";
import {
  demoAnimals,
  demoCostRecords,
  demoEvents,
  demoFarms,
  demoFeedItems,
  demoHealthEvents,
  demoLots,
  demoPastures,
  demoRotations,
  demoSaleItems,
  demoSales,
  demoSupplementationRecords,
  demoWeightRecords
} from "@/features/pastures/mock-data";
import type {
  Animal,
  CostCategory,
  CostRecord,
  FeedItem,
  FeedType,
  HealthEvent,
  HealthEventType,
  Farm,
  Lot,
  Pasture,
  PastureEvent,
  PastureEventType,
  PastureRotation,
  Sale,
  SaleItem,
  SupplementationRecord,
  WeightRecord
} from "@/features/pastures/types";

type CreatePastureInput = Omit<Pasture, "id" | "farmId" | "isActive" | "createdAt" | "updatedAt">;

type CreateLotInput = {
  name: string;
  code: string;
  entryDate: string;
  targetSaleWeightKg: number;
  notes?: string;
};

type CreateEventInput = {
  pastureId: string;
  eventDate: string;
  eventType: PastureEventType;
  title: string;
  description?: string;
  costAmount?: number;
};

type EnterPastureInput = {
  pastureId: string;
  lotId: string;
  entryDate: string;
  animalCount: number;
  pastureConditionEntry?: string;
  notes?: string;
};

type ExitPastureInput = {
  rotationId: string;
  exitDate: string;
  pastureConditionExit?: string;
  notes?: string;
};

type CreateAnimalInput = Omit<
  Animal,
  "id" | "farmId" | "currentWeightKg" | "purchasePricePerKg" | "status" | "createdAt" | "updatedAt"
>;

type CreateWeightInput = {
  animalId: string;
  weighedAt: string;
  weightKg: number;
  notes?: string;
};

type CreateHealthEventInput = {
  lotId?: string;
  animalId?: string;
  eventType: HealthEventType;
  eventDate: string;
  productName?: string;
  dose?: string;
  unit?: string;
  diagnosis?: string;
  withdrawalUntil?: string;
  cost?: number;
  notes?: string;
};

type CreateFeedItemInput = {
  name: string;
  feedType: FeedType;
  unit: string;
  defaultCostPerUnit: number;
};

type CreateSupplementationInput = {
  lotId: string;
  feedItemId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  unit: string;
  totalCost: number;
  animalCount: number;
  notes?: string;
};

type CreateCostInput = {
  lotId?: string;
  animalId?: string;
  pastureId?: string;
  costDate: string;
  category: CostCategory;
  description: string;
  amount: number;
  allocationMethod: "animal" | "lote" | "potrero" | "finca";
  notes?: string;
};

type CreateSaleInput = {
  animalIds: string[];
  saleDate: string;
  buyerText: string;
  pricePerKg: number;
  extraCosts: number;
  notes?: string;
};

type PastureStore = {
  farms: Farm[];
  selectedFarmId: string;
  lots: Lot[];
  animals: Animal[];
  weights: WeightRecord[];
  healthEvents: HealthEvent[];
  feedItems: FeedItem[];
  supplementationRecords: SupplementationRecord[];
  costRecords: CostRecord[];
  sales: Sale[];
  saleItems: SaleItem[];
  pastures: Pasture[];
  rotations: PastureRotation[];
  events: PastureEvent[];
  setSelectedFarmId: (farmId: string) => void;
  createLot: (input: CreateLotInput) => void;
  createPasture: (input: CreatePastureInput) => void;
  updatePasture: (pastureId: string, input: Partial<CreatePastureInput>) => void;
  enterPasture: (input: EnterPastureInput) => void;
  exitPasture: (input: ExitPastureInput) => void;
  addPastureEvent: (input: CreateEventInput) => void;
  createAnimal: (input: CreateAnimalInput) => void;
  recordWeight: (input: CreateWeightInput) => void;
  recordHealthEvent: (input: CreateHealthEventInput) => void;
  createFeedItem: (input: CreateFeedItemInput) => void;
  recordSupplementation: (input: CreateSupplementationInput) => void;
  recordCost: (input: CreateCostInput) => void;
  recordSale: (input: CreateSaleInput) => void;
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const usePastureStore = create<PastureStore>((set, get) => ({
  farms: demoFarms,
  selectedFarmId: demoFarms[0]?.id ?? "",
  lots: demoLots,
  animals: demoAnimals,
  weights: demoWeightRecords,
  healthEvents: demoHealthEvents,
  feedItems: demoFeedItems,
  supplementationRecords: demoSupplementationRecords,
  costRecords: demoCostRecords,
  sales: demoSales,
  saleItems: demoSaleItems,
  pastures: demoPastures,
  rotations: demoRotations,
  events: demoEvents,
  setSelectedFarmId: (farmId) => set({ selectedFarmId: farmId }),
  createLot: (input) => {
    const lot: Lot = {
      id: createId("lot"),
      farmId: get().selectedFarmId,
      name: input.name,
      code: input.code,
      entryDate: input.entryDate,
      targetSaleWeightKg: input.targetSaleWeightKg,
      animalCount: 0,
      status: "active",
      notes: input.notes
    };

    set((state) => ({ lots: [lot, ...state.lots] }));
  },
  createPasture: (input) => {
    const now = todayIso();
    const pasture: Pasture = {
      ...input,
      id: createId("pasture"),
      farmId: get().selectedFarmId,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    set((state) => ({ pastures: [pasture, ...state.pastures] }));
  },
  updatePasture: (pastureId, input) => {
    const now = todayIso();

    set((state) => ({
      pastures: state.pastures.map((pasture) =>
        pasture.id === pastureId
          ? {
              ...pasture,
              ...input,
              updatedAt: now
            }
          : pasture
      )
    }));
  },
  enterPasture: (input) => {
    const pasture = get().pastures.find((item) => item.id === input.pastureId);

    if (!pasture) {
      return;
    }

    const rotation: PastureRotation = {
      id: createId("rotation"),
      farmId: pasture.farmId,
      pastureId: pasture.id,
      lotId: input.lotId,
      entryDate: input.entryDate,
      plannedExitDate: addDays(input.entryDate, pasture.maxGrazingDays),
      animalCount: input.animalCount,
      maxGrazingDaysSnapshot: pasture.maxGrazingDays,
      recoveryDaysRequiredSnapshot: pasture.recoveryDaysRequired,
      pastureConditionEntry: input.pastureConditionEntry,
      notes: input.notes,
      createdAt: todayIso()
    };

    set((state) => ({ rotations: [rotation, ...state.rotations] }));
  },
  exitPasture: (input) => {
    set((state) => ({
      rotations: state.rotations.map((rotation) =>
        rotation.id === input.rotationId
          ? {
              ...rotation,
              exitDate: input.exitDate,
              occupationDays: calculateOccupationDays(rotation.entryDate, input.exitDate),
              pastureConditionExit: input.pastureConditionExit,
              notes: input.notes ?? rotation.notes
            }
          : rotation
      )
    }));
  },
  addPastureEvent: (input) => {
    const pasture = get().pastures.find((item) => item.id === input.pastureId);

    if (!pasture) {
      return;
    }

    const event: PastureEvent = {
      id: createId("event"),
      farmId: pasture.farmId,
      pastureId: input.pastureId,
      eventDate: input.eventDate,
      eventType: input.eventType,
      title: input.title,
      description: input.description,
      costAmount: input.costAmount,
      createdBy: "demo-user",
      createdAt: todayIso()
    };

    set((state) => ({ events: [event, ...state.events] }));
  },
  createAnimal: (input) => {
    const now = todayIso();
    const animal: Animal = {
      ...input,
      id: createId("animal"),
      farmId: get().selectedFarmId,
      currentWeightKg: input.entryWeightKg,
      purchasePricePerKg: input.purchasePrice / Math.max(input.entryWeightKg, 1),
      status: "active",
      createdAt: now,
      updatedAt: now
    };

    const weight: WeightRecord = {
      id: createId("weight"),
      farmId: animal.farmId,
      lotId: animal.lotId,
      animalId: animal.id,
      weighedAt: animal.purchaseDate,
      weightKg: animal.entryWeightKg,
      daysInCeba: 0,
      notes: "Peso de entrada",
      createdBy: "demo-user",
      createdAt: now
    };

    set((state) => ({
      animals: [animal, ...state.animals],
      weights: [weight, ...state.weights],
      lots: state.lots.map((lot) =>
        lot.id === animal.lotId
          ? {
              ...lot,
              animalCount: lot.animalCount + 1
            }
          : lot
      )
    }));
  },
  recordWeight: (input) => {
    const animal = get().animals.find((item) => item.id === input.animalId);

    if (!animal) {
      return;
    }

    const previousWeights = get()
      .weights.filter((weight) => weight.animalId === animal.id)
      .sort((a, b) => b.weighedAt.localeCompare(a.weighedAt));
    const previousWeight = previousWeights[0];
    const previousWeightKg = previousWeight?.weightKg ?? animal.entryWeightKg;
    const previousDate = previousWeight?.weighedAt ?? animal.purchaseDate;
    const daysSinceLastWeight = Math.max(daysBetween(previousDate, input.weighedAt), 1);
    const daysInCeba = Math.max(daysBetween(animal.purchaseDate, input.weighedAt), 1);
    const dailyGainKg = (input.weightKg - previousWeightKg) / daysSinceLastWeight;
    const nextStatus =
      input.weightKg >= 450 ? "ready_for_sale" : dailyGainKg < 0.55 ? "underperforming" : animal.status === "sick" ? "sick" : "active";

    const weight: WeightRecord = {
      id: createId("weight"),
      farmId: animal.farmId,
      lotId: animal.lotId,
      animalId: animal.id,
      weighedAt: input.weighedAt,
      weightKg: input.weightKg,
      previousWeightKg,
      dailyGainKg,
      daysSinceLastWeight,
      daysInCeba,
      notes: input.notes,
      createdBy: "demo-user",
      createdAt: todayIso()
    };

    set((state) => ({
      weights: [weight, ...state.weights],
      animals: state.animals.map((item) =>
        item.id === animal.id
          ? {
              ...item,
              currentWeightKg: input.weightKg,
              status: nextStatus,
              updatedAt: todayIso()
            }
          : item
      )
    }));
  },
  recordHealthEvent: (input) => {
    const lot = input.lotId ? get().lots.find((item) => item.id === input.lotId) : undefined;
    const animal = input.animalId ? get().animals.find((item) => item.id === input.animalId) : undefined;
    const farmId = animal?.farmId ?? lot?.farmId ?? get().selectedFarmId;
    const event: HealthEvent = {
      id: createId("health"),
      farmId,
      ...input,
      createdBy: "demo-user",
      createdAt: todayIso()
    };

    set((state) => ({
      healthEvents: [event, ...state.healthEvents],
      animals:
        input.eventType === "mortalidad" && input.animalId
          ? state.animals.map((item) => (item.id === input.animalId ? { ...item, status: "dead" } : item))
          : input.eventType === "enfermedad" && input.animalId
            ? state.animals.map((item) => (item.id === input.animalId ? { ...item, status: "sick" } : item))
            : state.animals
    }));
  },
  createFeedItem: (input) => {
    const feedItem: FeedItem = {
      id: createId("feed"),
      farmId: get().selectedFarmId,
      ...input,
      isActive: true,
      createdAt: todayIso()
    };

    set((state) => ({ feedItems: [feedItem, ...state.feedItems] }));
  },
  recordSupplementation: (input) => {
    const record: SupplementationRecord = {
      id: createId("supp"),
      farmId: get().selectedFarmId,
      ...input,
      costPerAnimal: input.totalCost / Math.max(input.animalCount, 1),
      createdAt: todayIso()
    };

    set((state) => ({ supplementationRecords: [record, ...state.supplementationRecords] }));
  },
  recordCost: (input) => {
    const cost: CostRecord = {
      id: createId("cost"),
      farmId: get().selectedFarmId,
      ...input,
      createdBy: "demo-user",
      createdAt: todayIso()
    };

    set((state) => ({ costRecords: [cost, ...state.costRecords] }));
  },
  recordSale: (input) => {
    const selectedAnimals = get().animals.filter((animal) => input.animalIds.includes(animal.id));

    if (selectedAnimals.length === 0) {
      return;
    }

    const saleId = createId("sale");
    const totalWeightKg = selectedAnimals.reduce((sum, animal) => sum + animal.currentWeightKg, 0);
    const grossAmount = totalWeightKg * input.pricePerKg;
    const extraCostPerAnimal = input.extraCosts / selectedAnimals.length;
    const saleItems: SaleItem[] = selectedAnimals.map((animal) => {
      const gross = animal.currentWeightKg * input.pricePerKg;
      const allocatedCost = extraCostPerAnimal;
      const netProfit = gross - animal.purchasePrice - allocatedCost;

      return {
        id: createId("sale-item"),
        farmId: animal.farmId,
        saleId,
        animalId: animal.id,
        lotId: animal.lotId,
        exitWeightKg: animal.currentWeightKg,
        pricePerKg: input.pricePerKg,
        grossAmount: gross,
        purchaseCost: animal.purchasePrice,
        allocatedCost,
        grossProfit: gross - animal.purchasePrice,
        netProfit,
        roi: netProfit / Math.max(animal.purchasePrice + allocatedCost, 1),
        daysInCeba: Math.max(daysBetween(animal.purchaseDate, input.saleDate), 1)
      };
    });
    const sale: Sale = {
      id: saleId,
      farmId: selectedAnimals[0].farmId,
      saleDate: input.saleDate,
      buyerText: input.buyerText,
      saleType: selectedAnimals.length === 1 ? "individual" : "lot",
      totalWeightKg,
      pricePerKg: input.pricePerKg,
      grossAmount,
      extraCosts: input.extraCosts,
      netAmount: grossAmount - input.extraCosts,
      notes: input.notes,
      createdAt: todayIso()
    };

    set((state) => ({
      sales: [sale, ...state.sales],
      saleItems: [...saleItems, ...state.saleItems],
      animals: state.animals.map((animal) =>
        input.animalIds.includes(animal.id)
          ? {
              ...animal,
              status: "sold"
            }
          : animal
      )
    }));
  }
}));
