import { z } from "zod";

export const lotSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  code: z.string().min(1, "Codigo requerido"),
  entryDate: z.string().min(1, "Fecha requerida"),
  targetSaleWeightKg: z.coerce.number().positive("Peso objetivo requerido"),
  notes: z.string().optional()
});

export const animalSchema = z.object({
  lotId: z.string().min(1, "Lote requerido"),
  internalCode: z.string().min(1, "ID interno requerido"),
  earTag: z.string().min(1, "Arete requerido"),
  sourceText: z.string().min(1, "Procedencia requerida"),
  supplierText: z.string().optional(),
  breedType: z.string().min(1, "Tipo racial requerido"),
  sex: z.enum(["macho", "hembra"]),
  approxAgeMonths: z.coerce.number().int().positive("Edad requerida"),
  entryWeightKg: z.coerce.number().positive("Peso requerido"),
  purchaseDate: z.string().min(1, "Fecha requerida"),
  purchasePrice: z.coerce.number().positive("Precio requerido"),
  bodyConditionScore: z.coerce.number().min(1).max(5),
  healthObservations: z.string().optional()
});

export const weightSchema = z.object({
  animalId: z.string().min(1, "Animal requerido"),
  weighedAt: z.string().min(1, "Fecha requerida"),
  weightKg: z.coerce.number().positive("Peso requerido"),
  notes: z.string().optional()
});

export const healthEventSchema = z.object({
  lotId: z.string().optional(),
  animalId: z.string().optional(),
  eventType: z.enum([
    "aftosa",
    "carbon",
    "rabia",
    "desparasitacion",
    "bano_garrapaticida",
    "vitaminas",
    "tratamiento",
    "enfermedad",
    "mortalidad",
    "retiro_sanitario"
  ]),
  eventDate: z.string().min(1, "Fecha requerida"),
  productName: z.string().optional(),
  dose: z.string().optional(),
  unit: z.string().optional(),
  diagnosis: z.string().optional(),
  withdrawalUntil: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  notes: z.string().optional()
});

export const feedItemSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  feedType: z.enum(["sal_mineralizada", "melaza", "silo", "heno", "concentrado", "subproducto", "otro"]),
  unit: z.string().min(1, "Unidad requerida"),
  defaultCostPerUnit: z.coerce.number().min(0, "Costo invalido")
});

export const supplementationSchema = z.object({
  lotId: z.string().min(1, "Lote requerido"),
  feedItemId: z.string().min(1, "Suplemento requerido"),
  startDate: z.string().min(1, "Fecha inicial requerida"),
  endDate: z.string().min(1, "Fecha final requerida"),
  quantity: z.coerce.number().positive("Cantidad requerida"),
  unit: z.string().min(1, "Unidad requerida"),
  totalCost: z.coerce.number().min(0, "Costo invalido"),
  animalCount: z.coerce.number().int().positive("Animales requeridos"),
  notes: z.string().optional()
});

export const costSchema = z.object({
  lotId: z.string().optional(),
  animalId: z.string().optional(),
  pastureId: z.string().optional(),
  costDate: z.string().min(1, "Fecha requerida"),
  category: z.enum([
    "compra_animales",
    "medicamentos",
    "vacunacion",
    "suplementos",
    "sal_mineralizada",
    "fertilizacion",
    "siembra_pasto",
    "guadana",
    "enmiendas",
    "mano_obra",
    "transporte",
    "ica",
    "mantenimiento_potrero",
    "otros"
  ]),
  description: z.string().min(2, "Descripcion requerida"),
  amount: z.coerce.number().positive("Valor requerido"),
  allocationMethod: z.enum(["animal", "lote", "potrero", "finca"]),
  notes: z.string().optional()
});

export const saleSchema = z.object({
  animalIdsText: z.string().min(1, "Selecciona al menos un animal"),
  saleDate: z.string().min(1, "Fecha requerida"),
  buyerText: z.string().min(2, "Comprador requerido"),
  pricePerKg: z.coerce.number().positive("Precio requerido"),
  extraCosts: z.coerce.number().min(0, "Costo invalido"),
  notes: z.string().optional()
});

export type LotFormValues = z.infer<typeof lotSchema>;
export type AnimalFormValues = z.infer<typeof animalSchema>;
export type WeightFormValues = z.infer<typeof weightSchema>;
export type HealthEventFormValues = z.infer<typeof healthEventSchema>;
export type FeedItemFormValues = z.infer<typeof feedItemSchema>;
export type SupplementationFormValues = z.infer<typeof supplementationSchema>;
export type CostFormValues = z.infer<typeof costSchema>;
export type SaleFormValues = z.infer<typeof saleSchema>;
