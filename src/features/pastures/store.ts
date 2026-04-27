"use client";

import { create } from "zustand";

import { addDays, calculateOccupationDays, daysBetween, todayIso } from "@/features/pastures/calculations";
import type {
  Animal,
  CostCategory,
  CostRecord,
  Farm,
  FeedItem,
  FeedType,
  HealthEvent,
  HealthEventType,
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
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type CreateFarmInput = {
  name: string;
  department?: string;
  municipality?: string;
  productiveAreaHa?: number;
};

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
  isLoading: boolean;
  error?: string;
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
  initializeData: () => Promise<void>;
  setSelectedFarmId: (farmId: string) => void;
  createFarm: (input: CreateFarmInput) => Promise<void>;
  createLot: (input: CreateLotInput) => Promise<void>;
  createPasture: (input: CreatePastureInput) => void;
  updatePasture: (pastureId: string, input: Partial<CreatePastureInput>) => void;
  enterPasture: (input: EnterPastureInput) => void;
  exitPasture: (input: ExitPastureInput) => void;
  addPastureEvent: (input: CreateEventInput) => void;
  createAnimal: (input: CreateAnimalInput) => Promise<void>;
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

function mapFarm(row: {
  id: string;
  name: string;
  department: string | null;
  municipality: string | null;
  productive_area_ha: number | null;
}): Farm {
  return {
    id: row.id,
    name: row.name,
    department: row.department ?? undefined,
    municipality: row.municipality ?? undefined,
    productiveAreaHa: Number(row.productive_area_ha ?? 0)
  };
}

function mapLot(row: {
  id: string;
  farm_id: string;
  name: string;
  code: string | null;
  entry_date: string | null;
  target_sale_weight_kg: number | null;
  status: string;
  notes: string | null;
}): Lot {
  return {
    id: row.id,
    farmId: row.farm_id,
    name: row.name,
    code: row.code ?? "",
    animalCount: 0,
    entryDate: row.entry_date ?? undefined,
    targetSaleWeightKg: Number(row.target_sale_weight_kg ?? 450),
    status: row.status === "sold" || row.status === "closed" ? row.status : "active",
    notes: row.notes ?? undefined
  };
}

function mapAnimal(row: {
  id: string;
  farm_id: string;
  lot_id: string;
  internal_code: string;
  ear_tag: string;
  source_text: string;
  supplier_text: string | null;
  breed_type: string;
  sex: "macho" | "hembra";
  approx_age_months: number | null;
  entry_weight_kg: number;
  current_weight_kg: number;
  purchase_date: string;
  purchase_price: number;
  purchase_price_per_kg: number | null;
  body_condition_score: number | null;
  health_observations: string | null;
  photo_url: string | null;
  status: Animal["status"];
  created_at: string;
  updated_at: string;
}): Animal {
  return {
    id: row.id,
    farmId: row.farm_id,
    lotId: row.lot_id,
    internalCode: row.internal_code,
    earTag: row.ear_tag,
    sourceText: row.source_text,
    supplierText: row.supplier_text ?? "",
    breedType: row.breed_type,
    sex: row.sex,
    approxAgeMonths: Number(row.approx_age_months ?? 0),
    entryWeightKg: Number(row.entry_weight_kg),
    currentWeightKg: Number(row.current_weight_kg),
    purchaseDate: row.purchase_date,
    purchasePrice: Number(row.purchase_price),
    purchasePricePerKg: Number(row.purchase_price_per_kg ?? row.purchase_price / Math.max(row.entry_weight_kg, 1)),
    bodyConditionScore: Number(row.body_condition_score ?? 0),
    healthObservations: row.health_observations ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapWeight(row: {
  id: string;
  farm_id: string;
  lot_id: string;
  animal_id: string;
  weighed_at: string;
  weight_kg: number;
  previous_weight_kg: number | null;
  daily_gain_kg: number | null;
  days_since_last_weight: number | null;
  days_in_ceba: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}): WeightRecord {
  return {
    id: row.id,
    farmId: row.farm_id,
    lotId: row.lot_id,
    animalId: row.animal_id,
    weighedAt: row.weighed_at,
    weightKg: Number(row.weight_kg),
    previousWeightKg: row.previous_weight_kg === null ? undefined : Number(row.previous_weight_kg),
    dailyGainKg: row.daily_gain_kg === null ? undefined : Number(row.daily_gain_kg),
    daysSinceLastWeight: row.days_since_last_weight ?? undefined,
    daysInCeba: row.days_in_ceba,
    notes: row.notes ?? undefined,
    createdBy: row.created_by ?? undefined,
    createdAt: row.created_at
  };
}

function withLotCounts(lots: Lot[], animals: Animal[]) {
  return lots.map((lot) => ({
    ...lot,
    animalCount: animals.filter((animal) => animal.lotId === lot.id && animal.status !== "sold" && animal.status !== "dead").length
  }));
}

function setLocalError(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo completar la operacion.";
}

export const usePastureStore = create<PastureStore>((set, get) => ({
  isLoading: true,
  farms: [],
  selectedFarmId: "",
  lots: [],
  animals: [],
  weights: [],
  healthEvents: [],
  feedItems: [],
  supplementationRecords: [],
  costRecords: [],
  sales: [],
  saleItems: [],
  pastures: [],
  rotations: [],
  events: [],
  initializeData: async () => {
    set({ isLoading: true, error: undefined });

    try {
      const supabase = createSupabaseBrowserClient();
      const [farmsResult, lotsResult, animalsResult, weightsResult] = await Promise.all([
        supabase.from("farms").select("id,name,department,municipality,productive_area_ha").eq("is_active", true).order("created_at"),
        supabase.from("lots").select("id,farm_id,name,code,entry_date,target_sale_weight_kg,status,notes").order("created_at", { ascending: false }),
        supabase.from("animals").select("*").order("created_at", { ascending: false }),
        supabase.from("weight_records").select("*").order("weighed_at", { ascending: false })
      ]);

      if (farmsResult.error) throw farmsResult.error;
      if (lotsResult.error) throw lotsResult.error;
      if (animalsResult.error) throw animalsResult.error;
      if (weightsResult.error) throw weightsResult.error;

      const farms = (farmsResult.data ?? []).map(mapFarm);
      const animals = (animalsResult.data ?? []).map(mapAnimal);
      const lots = withLotCounts((lotsResult.data ?? []).map(mapLot), animals);
      const selectedFarmId =
        get().selectedFarmId && farms.some((farm) => farm.id === get().selectedFarmId)
          ? get().selectedFarmId
          : farms[0]?.id ?? "";

      set({
        farms,
        selectedFarmId,
        lots,
        animals,
        weights: (weightsResult.data ?? []).map(mapWeight),
        isLoading: false
      });
    } catch (error) {
      set({ error: setLocalError(error), isLoading: false });
    }
  },
  setSelectedFarmId: (farmId) => set({ selectedFarmId: farmId }),
  createFarm: async (input) => {
    set({ error: undefined });

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Debes iniciar sesion para crear una finca.");

      const { error: profileError } = await supabase.rpc("ensure_current_profile");
      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from("farms")
        .insert({
          owner_id: user.id,
          name: input.name,
          department: input.department || null,
          municipality: input.municipality || null,
          productive_area_ha: input.productiveAreaHa ?? null
        })
        .select("id,name,department,municipality,productive_area_ha")
        .single();

      if (error) throw error;

      const farm = mapFarm(data);
      set((state) => ({
        farms: [farm, ...state.farms],
        selectedFarmId: farm.id
      }));
    } catch (error) {
      set({ error: setLocalError(error) });
      throw error;
    }
  },
  createLot: async (input) => {
    const farmId = get().selectedFarmId;
    if (!farmId) {
      set({ error: "Primero crea o selecciona una finca." });
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("lots")
        .insert({
          farm_id: farmId,
          name: input.name,
          code: input.code,
          entry_date: input.entryDate || null,
          target_sale_weight_kg: input.targetSaleWeightKg,
          notes: input.notes || null
        })
        .select("id,farm_id,name,code,entry_date,target_sale_weight_kg,status,notes")
        .single();

      if (error) throw error;

      set((state) => ({ lots: [mapLot(data), ...state.lots], error: undefined }));
    } catch (error) {
      set({ error: setLocalError(error) });
      throw error;
    }
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
      pastures: state.pastures.map((pasture) => (pasture.id === pastureId ? { ...pasture, ...input, updatedAt: now } : pasture))
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
      createdAt: todayIso()
    };

    set((state) => ({ events: [event, ...state.events] }));
  },
  createAnimal: async (input) => {
    const farmId = get().selectedFarmId;
    if (!farmId) {
      set({ error: "Primero crea o selecciona una finca." });
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: animalRow, error: animalError } = await supabase
        .from("animals")
        .insert({
          farm_id: farmId,
          lot_id: input.lotId,
          internal_code: input.internalCode,
          ear_tag: input.earTag,
          source_text: input.sourceText,
          supplier_text: input.supplierText || null,
          breed_type: input.breedType,
          sex: input.sex,
          approx_age_months: input.approxAgeMonths,
          entry_weight_kg: input.entryWeightKg,
          current_weight_kg: input.entryWeightKg,
          purchase_date: input.purchaseDate,
          purchase_price: input.purchasePrice,
          body_condition_score: input.bodyConditionScore,
          health_observations: input.healthObservations || null
        })
        .select("*")
        .single();

      if (animalError) throw animalError;

      const { data: weightRow, error: weightError } = await supabase
        .from("weight_records")
        .insert({
          farm_id: farmId,
          lot_id: input.lotId,
          animal_id: animalRow.id,
          weighed_at: input.purchaseDate,
          weight_kg: input.entryWeightKg,
          days_in_ceba: 0,
          notes: "Peso de entrada"
        })
        .select("*")
        .single();

      if (weightError) throw weightError;

      const animal = mapAnimal(animalRow);
      const weight = mapWeight(weightRow);
      set((state) => ({
        animals: [animal, ...state.animals],
        weights: [weight, ...state.weights],
        lots: withLotCounts(state.lots, [animal, ...state.animals]),
        error: undefined
      }));
    } catch (error) {
      set({ error: setLocalError(error) });
      throw error;
    }
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
      createdAt: todayIso()
    };

    set((state) => ({ weights: [weight, ...state.weights] }));
  },
  recordHealthEvent: (input) => {
    const lot = input.lotId ? get().lots.find((item) => item.id === input.lotId) : undefined;
    const animal = input.animalId ? get().animals.find((item) => item.id === input.animalId) : undefined;
    const farmId = animal?.farmId ?? lot?.farmId ?? get().selectedFarmId;
    const event: HealthEvent = {
      id: createId("health"),
      farmId,
      ...input,
      createdAt: todayIso()
    };

    set((state) => ({ healthEvents: [event, ...state.healthEvents] }));
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
    const saleItems: SaleItem[] = selectedAnimals.map((animal) => ({
      id: createId("sale-item"),
      farmId: animal.farmId,
      saleId,
      animalId: animal.id,
      lotId: animal.lotId,
      exitWeightKg: animal.currentWeightKg,
      pricePerKg: input.pricePerKg,
      grossAmount: animal.currentWeightKg * input.pricePerKg,
      purchaseCost: animal.purchasePrice,
      allocatedCost: input.extraCosts / Math.max(selectedAnimals.length, 1),
      grossProfit: animal.currentWeightKg * input.pricePerKg - animal.purchasePrice,
      netProfit: animal.currentWeightKg * input.pricePerKg - animal.purchasePrice - input.extraCosts / Math.max(selectedAnimals.length, 1),
      roi: 0,
      daysInCeba: Math.max(daysBetween(animal.purchaseDate, input.saleDate), 1)
    }));
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
      animals: state.animals.map((animal) => (input.animalIds.includes(animal.id) ? { ...animal, status: "sold" } : animal))
    }));
  }
}));
