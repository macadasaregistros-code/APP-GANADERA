import type { PastureEventType } from "@/features/pastures/types";

export const pastureEventTypeLabels: Record<PastureEventType, string> = {
  guadana: "Guadana",
  mantenimiento_cercas: "Mantenimiento cercas",
  siembra_pasto: "Siembra pasto",
  fertilizacion: "Fertilizacion",
  enmienda: "Enmienda",
  control_malezas: "Control malezas",
  reparacion_agua: "Reparacion agua",
  limpieza: "Limpieza",
  observacion: "Observacion",
  otro: "Otro"
};

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}
