import { z } from "zod";

export const pastureSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  areaHa: z.coerce.number().positive("Area mayor a 0"),
  grassType: z.string().optional(),
  carryingCapacityAnimals: z.coerce.number().int().min(0, "No puede ser negativo"),
  maxGrazingDays: z.coerce.number().int().positive("Dias de pastoreo requeridos"),
  recoveryDaysRequired: z.coerce.number().int().positive("Dias de recuperacion requeridos"),
  waterAvailable: z.enum(["true", "false"]),
  status: z.enum(["active", "maintenance"]),
  notes: z.string().optional()
});

export const pastureEventSchema = z.object({
  pastureId: z.string().min(1, "Potrero requerido"),
  eventDate: z.string().min(1, "Fecha requerida"),
  eventType: z.enum([
    "guadana",
    "mantenimiento_cercas",
    "siembra_pasto",
    "fertilizacion",
    "enmienda",
    "control_malezas",
    "reparacion_agua",
    "limpieza",
    "observacion",
    "otro"
  ]),
  title: z.string().min(2, "Titulo requerido"),
  description: z.string().optional(),
  costAmount: z
    .string()
    .optional()
    .refine((value) => !value || Number(value) >= 0, "Costo invalido")
});

export const pastureEntrySchema = z.object({
  pastureId: z.string().min(1, "Potrero requerido"),
  lotId: z.string().min(1, "Lote requerido"),
  entryDate: z.string().min(1, "Fecha requerida"),
  animalCount: z.coerce.number().int().positive("Animales requeridos"),
  pastureConditionEntry: z.string().optional(),
  notes: z.string().optional()
});

export const pastureExitSchema = z.object({
  rotationId: z.string().min(1, "Rotacion requerida"),
  exitDate: z.string().min(1, "Fecha requerida"),
  pastureConditionExit: z.string().optional(),
  notes: z.string().optional()
});

export type PastureFormValues = z.infer<typeof pastureSchema>;
export type PastureEventFormValues = z.infer<typeof pastureEventSchema>;
export type PastureEntryFormValues = z.infer<typeof pastureEntrySchema>;
export type PastureExitFormValues = z.infer<typeof pastureExitSchema>;
