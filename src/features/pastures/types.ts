export type Farm = {
  id: string;
  name: string;
  department?: string;
  municipality?: string;
  productiveAreaHa: number;
};

export type Lot = {
  id: string;
  farmId: string;
  name: string;
  code: string;
  animalCount: number;
  entryDate?: string;
  targetSaleWeightKg?: number;
  status: "active" | "sold" | "closed";
  notes?: string;
};

export type AnimalStatus = "active" | "ready_for_sale" | "underperforming" | "sick" | "sold" | "dead";

export type Animal = {
  id: string;
  farmId: string;
  lotId: string;
  internalCode: string;
  earTag: string;
  sourceText: string;
  supplierText: string;
  breedType: string;
  sex: "macho" | "hembra";
  approxAgeMonths: number;
  entryWeightKg: number;
  currentWeightKg: number;
  purchaseDate: string;
  purchasePrice: number;
  purchasePricePerKg: number;
  bodyConditionScore: number;
  healthObservations?: string;
  photoUrl?: string;
  status: AnimalStatus;
  createdAt: string;
  updatedAt: string;
};

export type WeightRecord = {
  id: string;
  farmId: string;
  lotId: string;
  animalId: string;
  weighedAt: string;
  weightKg: number;
  previousWeightKg?: number;
  dailyGainKg?: number;
  daysSinceLastWeight?: number;
  daysInCeba: number;
  notes?: string;
  createdBy?: string;
  createdAt: string;
};

export type HealthEventType =
  | "aftosa"
  | "carbon"
  | "rabia"
  | "desparasitacion"
  | "bano_garrapaticida"
  | "vitaminas"
  | "tratamiento"
  | "enfermedad"
  | "mortalidad"
  | "retiro_sanitario";

export type HealthEvent = {
  id: string;
  farmId: string;
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
  createdBy?: string;
  createdAt: string;
};

export type FeedType =
  | "sal_mineralizada"
  | "melaza"
  | "silo"
  | "heno"
  | "concentrado"
  | "subproducto"
  | "otro";

export type FeedItem = {
  id: string;
  farmId: string;
  name: string;
  feedType: FeedType;
  unit: string;
  defaultCostPerUnit: number;
  isActive: boolean;
  createdAt: string;
};

export type SupplementationRecord = {
  id: string;
  farmId: string;
  lotId: string;
  feedItemId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  unit: string;
  totalCost: number;
  animalCount: number;
  costPerAnimal: number;
  notes?: string;
  createdAt: string;
};

export type CostCategory =
  | "compra_animales"
  | "medicamentos"
  | "vacunacion"
  | "suplementos"
  | "sal_mineralizada"
  | "fertilizacion"
  | "siembra_pasto"
  | "guadana"
  | "enmiendas"
  | "mano_obra"
  | "transporte"
  | "ica"
  | "mantenimiento_potrero"
  | "otros";

export type CostRecord = {
  id: string;
  farmId: string;
  lotId?: string;
  animalId?: string;
  pastureId?: string;
  costDate: string;
  category: CostCategory;
  description: string;
  amount: number;
  allocationMethod: "animal" | "lote" | "potrero" | "finca";
  notes?: string;
  createdBy?: string;
  createdAt: string;
};

export type Sale = {
  id: string;
  farmId: string;
  saleDate: string;
  buyerText: string;
  saleType: "individual" | "lot";
  totalWeightKg: number;
  pricePerKg: number;
  grossAmount: number;
  extraCosts: number;
  netAmount: number;
  notes?: string;
  createdAt: string;
};

export type SaleItem = {
  id: string;
  farmId: string;
  saleId: string;
  animalId: string;
  lotId: string;
  exitWeightKg: number;
  pricePerKg: number;
  grossAmount: number;
  purchaseCost: number;
  allocatedCost: number;
  grossProfit: number;
  netProfit: number;
  roi: number;
  daysInCeba: number;
};

export type AnimalPerformance = {
  animal: Animal;
  lot?: Lot;
  kgGained: number;
  daysInCeba: number;
  accumulatedDailyGainKg: number;
  latestWeightDate?: string;
  allocatedCost: number;
  costPerKgGained: number;
};

export type LotPerformance = {
  lot: Lot;
  activeAnimalCount: number;
  avgEntryWeightKg: number;
  avgCurrentWeightKg: number;
  avgDailyGainKg: number;
  totalKgGained: number;
  totalCost: number;
  costPerKgProduced: number;
  estimatedMargin: number;
};

export type PastureManualStatus = "active" | "maintenance";

export type PastureOperationalStatus = "ready" | "occupied" | "overdue" | "resting" | "maintenance";

export type Pasture = {
  id: string;
  farmId: string;
  name: string;
  areaHa: number;
  grassType: string;
  carryingCapacityAnimals: number;
  maxGrazingDays: number;
  recoveryDaysRequired: number;
  waterAvailable: boolean;
  status: PastureManualStatus;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PastureRotation = {
  id: string;
  farmId: string;
  pastureId: string;
  lotId: string;
  entryDate: string;
  plannedExitDate: string;
  exitDate?: string;
  animalCount: number;
  occupationDays?: number;
  maxGrazingDaysSnapshot: number;
  recoveryDaysRequiredSnapshot: number;
  pastureConditionEntry?: string;
  pastureConditionExit?: string;
  notes?: string;
  createdAt: string;
};

export type PastureEventType =
  | "guadana"
  | "mantenimiento_cercas"
  | "siembra_pasto"
  | "fertilizacion"
  | "enmienda"
  | "control_malezas"
  | "reparacion_agua"
  | "limpieza"
  | "observacion"
  | "otro";

export type PastureEvent = {
  id: string;
  farmId: string;
  pastureId: string;
  eventDate: string;
  eventType: PastureEventType;
  title: string;
  description?: string;
  costAmount?: number;
  createdBy?: string;
  createdAt: string;
};

export type PastureStatusSummary = {
  status: PastureOperationalStatus;
  label: string;
  color: "green" | "blue" | "red" | "yellow" | "orange";
  activeRotation?: PastureRotation;
  lastClosedRotation?: PastureRotation;
  daysOccupied: number;
  daysResting: number;
  daysUntilReady: number;
  plannedExitDate?: string;
  lastExitDate?: string;
};

export type PastureTimelineItem = {
  id: string;
  date: string;
  type: "entry" | "exit" | "event";
  title: string;
  description?: string;
  costAmount?: number;
};
