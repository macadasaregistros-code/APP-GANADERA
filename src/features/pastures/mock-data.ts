import type {
  Animal,
  CostRecord,
  Farm,
  FeedItem,
  HealthEvent,
  Lot,
  Pasture,
  PastureEvent,
  PastureRotation,
  Sale,
  SaleItem,
  SupplementationRecord,
  WeightRecord
} from "@/features/pastures/types";

export const demoFarms: Farm[] = [
  {
    id: "farm-la-esperanza",
    name: "La Esperanza",
    department: "Cundinamarca",
    municipality: "Villeta",
    productiveAreaHa: 42
  },
  {
    id: "farm-el-retorno",
    name: "El Retorno",
    department: "Tolima",
    municipality: "Ibague",
    productiveAreaHa: 31
  }
];

export const demoLots: Lot[] = [
  {
    id: "lot-001",
    farmId: "farm-la-esperanza",
    name: "Lote 001",
    code: "L-001",
    animalCount: 38,
    entryDate: "2026-01-20",
    targetSaleWeightKg: 460,
    status: "active",
    notes: "Machos comprados en Magdalena Medio."
  },
  {
    id: "lot-002",
    farmId: "farm-la-esperanza",
    name: "Lote 002",
    code: "L-002",
    animalCount: 26,
    entryDate: "2026-02-12",
    targetSaleWeightKg: 450,
    status: "active",
    notes: "Animales medianos con suplemento."
  },
  {
    id: "lot-101",
    farmId: "farm-el-retorno",
    name: "Lote 101",
    code: "L-101",
    animalCount: 32,
    entryDate: "2026-02-01",
    targetSaleWeightKg: 455,
    status: "active",
    notes: "Lote de la finca El Retorno."
  }
];

export const demoAnimals: Animal[] = [
  {
    id: "animal-001",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    internalCode: "A-001",
    earTag: "2401",
    sourceText: "Puerto Boyaca",
    supplierText: "Compra feria local",
    breedType: "Cebu comercial",
    sex: "macho",
    approxAgeMonths: 24,
    entryWeightKg: 312,
    currentWeightKg: 392,
    purchaseDate: "2026-01-20",
    purchasePrice: 2496000,
    purchasePricePerKg: 8000,
    bodyConditionScore: 3.2,
    status: "active",
    createdAt: "2026-01-20",
    updatedAt: "2026-04-24"
  },
  {
    id: "animal-002",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    internalCode: "A-002",
    earTag: "2402",
    sourceText: "Puerto Boyaca",
    supplierText: "Compra feria local",
    breedType: "Brahman x Angus",
    sex: "macho",
    approxAgeMonths: 25,
    entryWeightKg: 326,
    currentWeightKg: 421,
    purchaseDate: "2026-01-20",
    purchasePrice: 2640600,
    purchasePricePerKg: 8100,
    bodyConditionScore: 3.5,
    status: "ready_for_sale",
    createdAt: "2026-01-20",
    updatedAt: "2026-04-24"
  },
  {
    id: "animal-003",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    internalCode: "A-003",
    earTag: "2403",
    sourceText: "Puerto Boyaca",
    supplierText: "Compra feria local",
    breedType: "Cebu comercial",
    sex: "macho",
    approxAgeMonths: 22,
    entryWeightKg: 298,
    currentWeightKg: 344,
    purchaseDate: "2026-01-20",
    purchasePrice: 2354200,
    purchasePricePerKg: 7900,
    bodyConditionScore: 2.8,
    healthObservations: "Bajo desempeno, revisar parasitos.",
    status: "underperforming",
    createdAt: "2026-01-20",
    updatedAt: "2026-04-24"
  },
  {
    id: "animal-004",
    farmId: "farm-la-esperanza",
    lotId: "lot-002",
    internalCode: "B-001",
    earTag: "2501",
    sourceText: "La Dorada",
    supplierText: "Compra directa",
    breedType: "Brahman rojo",
    sex: "macho",
    approxAgeMonths: 23,
    entryWeightKg: 305,
    currentWeightKg: 371,
    purchaseDate: "2026-02-12",
    purchasePrice: 2440000,
    purchasePricePerKg: 8000,
    bodyConditionScore: 3,
    status: "active",
    createdAt: "2026-02-12",
    updatedAt: "2026-04-23"
  },
  {
    id: "animal-005",
    farmId: "farm-el-retorno",
    lotId: "lot-101",
    internalCode: "R-001",
    earTag: "3101",
    sourceText: "Cajamarca",
    supplierText: "Compra vecino",
    breedType: "Normando x Cebu",
    sex: "macho",
    approxAgeMonths: 24,
    entryWeightKg: 318,
    currentWeightKg: 383,
    purchaseDate: "2026-02-01",
    purchasePrice: 2544000,
    purchasePricePerKg: 8000,
    bodyConditionScore: 3.1,
    status: "active",
    createdAt: "2026-02-01",
    updatedAt: "2026-04-20"
  }
];

export const demoWeightRecords: WeightRecord[] = [
  {
    id: "weight-001-1",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    animalId: "animal-001",
    weighedAt: "2026-03-20",
    weightKg: 360,
    previousWeightKg: 312,
    dailyGainKg: 0.81,
    daysSinceLastWeight: 59,
    daysInCeba: 59,
    createdBy: "owner",
    createdAt: "2026-03-20"
  },
  {
    id: "weight-001-2",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    animalId: "animal-001",
    weighedAt: "2026-04-24",
    weightKg: 392,
    previousWeightKg: 360,
    dailyGainKg: 0.91,
    daysSinceLastWeight: 35,
    daysInCeba: 94,
    createdBy: "owner",
    createdAt: "2026-04-24"
  },
  {
    id: "weight-002-1",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    animalId: "animal-002",
    weighedAt: "2026-04-24",
    weightKg: 421,
    previousWeightKg: 326,
    dailyGainKg: 1.01,
    daysSinceLastWeight: 94,
    daysInCeba: 94,
    createdBy: "owner",
    createdAt: "2026-04-24"
  },
  {
    id: "weight-003-1",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    animalId: "animal-003",
    weighedAt: "2026-04-24",
    weightKg: 344,
    previousWeightKg: 298,
    dailyGainKg: 0.49,
    daysSinceLastWeight: 94,
    daysInCeba: 94,
    notes: "Por debajo del lote.",
    createdBy: "owner",
    createdAt: "2026-04-24"
  },
  {
    id: "weight-004-1",
    farmId: "farm-la-esperanza",
    lotId: "lot-002",
    animalId: "animal-004",
    weighedAt: "2026-04-23",
    weightKg: 371,
    previousWeightKg: 305,
    dailyGainKg: 0.94,
    daysSinceLastWeight: 70,
    daysInCeba: 70,
    createdBy: "owner",
    createdAt: "2026-04-23"
  },
  {
    id: "weight-005-1",
    farmId: "farm-el-retorno",
    lotId: "lot-101",
    animalId: "animal-005",
    weighedAt: "2026-04-20",
    weightKg: 383,
    previousWeightKg: 318,
    dailyGainKg: 0.83,
    daysSinceLastWeight: 78,
    daysInCeba: 78,
    createdBy: "owner",
    createdAt: "2026-04-20"
  }
];

export const demoPastures: Pasture[] = [
  {
    id: "pasture-la-vega",
    farmId: "farm-la-esperanza",
    name: "La Vega",
    areaHa: 3.8,
    grassType: "Brachiaria brizantha",
    carryingCapacityAnimals: 40,
    maxGrazingDays: 4,
    recoveryDaysRequired: 28,
    waterAvailable: true,
    status: "active",
    notes: "Potrero fuerte para lote grande.",
    isActive: true,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01"
  },
  {
    id: "pasture-el-mango",
    farmId: "farm-la-esperanza",
    name: "El Mango",
    areaHa: 1.6,
    grassType: "Angleton",
    carryingCapacityAnimals: 18,
    maxGrazingDays: 2,
    recoveryDaysRequired: 24,
    waterAvailable: true,
    status: "active",
    notes: "Pequeno, no aguanta mas de dos dias.",
    isActive: true,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01"
  },
  {
    id: "pasture-la-cancha",
    farmId: "farm-la-esperanza",
    name: "La Cancha",
    areaHa: 2.4,
    grassType: "Estrella africana",
    carryingCapacityAnimals: 24,
    maxGrazingDays: 3,
    recoveryDaysRequired: 21,
    waterAvailable: false,
    status: "active",
    notes: "Usar con bebedero movil.",
    isActive: true,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01"
  },
  {
    id: "pasture-el-bajo",
    farmId: "farm-la-esperanza",
    name: "El Bajo",
    areaHa: 2.9,
    grassType: "Mombasa",
    carryingCapacityAnimals: 30,
    maxGrazingDays: 3,
    recoveryDaysRequired: 30,
    waterAvailable: true,
    status: "active",
    notes: "Recuperacion lenta en invierno.",
    isActive: true,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01"
  },
  {
    id: "pasture-los-cauchos",
    farmId: "farm-el-retorno",
    name: "Los Cauchos",
    areaHa: 2.2,
    grassType: "Brachiaria humidicola",
    carryingCapacityAnimals: 22,
    maxGrazingDays: 3,
    recoveryDaysRequired: 25,
    waterAvailable: true,
    status: "maintenance",
    notes: "Cerca en reparacion.",
    isActive: true,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01"
  }
];

export const demoRotations: PastureRotation[] = [
  {
    id: "rotation-vega-active",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-la-vega",
    lotId: "lot-001",
    entryDate: "2026-04-24",
    plannedExitDate: "2026-04-28",
    animalCount: 38,
    maxGrazingDaysSnapshot: 4,
    recoveryDaysRequiredSnapshot: 28,
    pastureConditionEntry: "Buen rebrote, agua disponible.",
    createdAt: "2026-04-24"
  },
  {
    id: "rotation-mango-active",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-el-mango",
    lotId: "lot-002",
    entryDate: "2026-04-23",
    plannedExitDate: "2026-04-25",
    animalCount: 26,
    maxGrazingDaysSnapshot: 2,
    recoveryDaysRequiredSnapshot: 24,
    pastureConditionEntry: "Pasto medio, sombra buena.",
    createdAt: "2026-04-23"
  },
  {
    id: "rotation-cancha-closed",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-la-cancha",
    lotId: "lot-001",
    entryDate: "2026-03-30",
    plannedExitDate: "2026-04-02",
    exitDate: "2026-04-02",
    animalCount: 38,
    occupationDays: 3,
    maxGrazingDaysSnapshot: 3,
    recoveryDaysRequiredSnapshot: 21,
    pastureConditionEntry: "Bueno.",
    pastureConditionExit: "Parejo, requiere agua movil.",
    createdAt: "2026-03-30"
  },
  {
    id: "rotation-bajo-closed",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-el-bajo",
    lotId: "lot-002",
    entryDate: "2026-04-15",
    plannedExitDate: "2026-04-18",
    exitDate: "2026-04-18",
    animalCount: 26,
    occupationDays: 3,
    maxGrazingDaysSnapshot: 3,
    recoveryDaysRequiredSnapshot: 30,
    pastureConditionEntry: "Alto y tierno.",
    pastureConditionExit: "Bajito en la parte humeda.",
    createdAt: "2026-04-15"
  }
];

export const demoEvents: PastureEvent[] = [
  {
    id: "event-vega-fence",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-la-vega",
    eventDate: "2026-04-20",
    eventType: "mantenimiento_cercas",
    title: "Cambio de grapas en cerca norte",
    description: "Se reforzo linea cerca del bebedero.",
    costAmount: 65000,
    createdBy: "owner",
    createdAt: "2026-04-20"
  },
  {
    id: "event-mango-cut",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-el-mango",
    eventDate: "2026-04-10",
    eventType: "guadana",
    title: "Guadana de bordes",
    description: "Se limpio entrada y cerca oriental.",
    costAmount: 90000,
    createdBy: "owner",
    createdAt: "2026-04-10"
  },
  {
    id: "event-cancha-water",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-la-cancha",
    eventDate: "2026-04-12",
    eventType: "reparacion_agua",
    title: "Revision de bebedero movil",
    description: "Quedo pendiente manguera nueva.",
    createdBy: "worker",
    createdAt: "2026-04-12"
  },
  {
    id: "event-bajo-fertilizer",
    farmId: "farm-la-esperanza",
    pastureId: "pasture-el-bajo",
    eventDate: "2026-04-19",
    eventType: "fertilizacion",
    title: "Fertilizacion post salida",
    description: "Aplicacion despues de sacar el lote.",
    costAmount: 180000,
    createdBy: "owner",
    createdAt: "2026-04-19"
  },
  {
    id: "event-cauchos-fence",
    farmId: "farm-el-retorno",
    pastureId: "pasture-los-cauchos",
    eventDate: "2026-04-22",
    eventType: "mantenimiento_cercas",
    title: "Reparacion de cerca principal",
    description: "Potrero fuera de uso hasta terminar.",
    costAmount: 140000,
    createdBy: "worker",
    createdAt: "2026-04-22"
  }
];

export const demoHealthEvents: HealthEvent[] = [
  {
    id: "health-001",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    eventType: "desparasitacion",
    eventDate: "2026-03-05",
    productName: "Ivermectina",
    dose: "1",
    unit: "ml/50kg",
    cost: 128000,
    notes: "Aplicacion por lote.",
    createdBy: "worker",
    createdAt: "2026-03-05"
  },
  {
    id: "health-002",
    farmId: "farm-la-esperanza",
    animalId: "animal-003",
    lotId: "lot-001",
    eventType: "tratamiento",
    eventDate: "2026-04-18",
    productName: "Complejo B",
    dose: "10",
    unit: "ml",
    diagnosis: "Bajo desempeno",
    cost: 28000,
    notes: "Revisar respuesta en proximo pesaje.",
    createdBy: "owner",
    createdAt: "2026-04-18"
  },
  {
    id: "health-003",
    farmId: "farm-la-esperanza",
    lotId: "lot-002",
    eventType: "aftosa",
    eventDate: "2026-04-02",
    productName: "Vacuna aftosa",
    dose: "2",
    unit: "ml",
    cost: 78000,
    createdBy: "worker",
    createdAt: "2026-04-02"
  }
];

export const demoFeedItems: FeedItem[] = [
  {
    id: "feed-sal-8",
    farmId: "farm-la-esperanza",
    name: "Sal mineralizada 8%",
    feedType: "sal_mineralizada",
    unit: "kg",
    defaultCostPerUnit: 3200,
    isActive: true,
    createdAt: "2026-01-01"
  },
  {
    id: "feed-melaza",
    farmId: "farm-la-esperanza",
    name: "Melaza",
    feedType: "melaza",
    unit: "kg",
    defaultCostPerUnit: 1800,
    isActive: true,
    createdAt: "2026-01-01"
  },
  {
    id: "feed-sal-retorno",
    farmId: "farm-el-retorno",
    name: "Sal mineralizada 6%",
    feedType: "sal_mineralizada",
    unit: "kg",
    defaultCostPerUnit: 2900,
    isActive: true,
    createdAt: "2026-01-01"
  }
];

export const demoSupplementationRecords: SupplementationRecord[] = [
  {
    id: "supp-001",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    feedItemId: "feed-sal-8",
    startDate: "2026-04-01",
    endDate: "2026-04-15",
    quantity: 120,
    unit: "kg",
    totalCost: 384000,
    animalCount: 38,
    costPerAnimal: 10105,
    notes: "Consumo normal.",
    createdAt: "2026-04-15"
  },
  {
    id: "supp-002",
    farmId: "farm-la-esperanza",
    lotId: "lot-002",
    feedItemId: "feed-melaza",
    startDate: "2026-04-05",
    endDate: "2026-04-20",
    quantity: 160,
    unit: "kg",
    totalCost: 288000,
    animalCount: 26,
    costPerAnimal: 11077,
    notes: "Apoyo energetico.",
    createdAt: "2026-04-20"
  }
];

export const demoCostRecords: CostRecord[] = [
  {
    id: "cost-labor-001",
    farmId: "farm-la-esperanza",
    costDate: "2026-04-01",
    category: "mano_obra",
    description: "Jornal rotacion de cercas moviles",
    amount: 95000,
    allocationMethod: "finca",
    createdBy: "owner",
    createdAt: "2026-04-01"
  },
  {
    id: "cost-transport-001",
    farmId: "farm-la-esperanza",
    lotId: "lot-001",
    costDate: "2026-01-20",
    category: "transporte",
    description: "Transporte ingreso lote 001",
    amount: 420000,
    allocationMethod: "lote",
    createdBy: "owner",
    createdAt: "2026-01-20"
  },
  {
    id: "cost-ica-001",
    farmId: "farm-la-esperanza",
    costDate: "2026-03-01",
    category: "ica",
    description: "Guias y tramites",
    amount: 72000,
    allocationMethod: "finca",
    createdBy: "owner",
    createdAt: "2026-03-01"
  }
];

export const demoSales: Sale[] = [
  {
    id: "sale-001",
    farmId: "farm-la-esperanza",
    saleDate: "2026-04-10",
    buyerText: "Frigorifico regional",
    saleType: "individual",
    totalWeightKg: 452,
    pricePerKg: 9800,
    grossAmount: 4429600,
    extraCosts: 85000,
    netAmount: 4344600,
    notes: "Venta demo cerrada.",
    createdAt: "2026-04-10"
  }
];

export const demoSaleItems: SaleItem[] = [
  {
    id: "sale-item-001",
    farmId: "farm-la-esperanza",
    saleId: "sale-001",
    animalId: "animal-002",
    lotId: "lot-001",
    exitWeightKg: 452,
    pricePerKg: 9800,
    grossAmount: 4429600,
    purchaseCost: 2640600,
    allocatedCost: 468000,
    grossProfit: 1789000,
    netProfit: 1236000,
    roi: 0.4,
    daysInCeba: 81
  }
];
