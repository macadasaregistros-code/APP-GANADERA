import type { AnimalStatus, CostCategory, FeedType, HealthEventType } from "@/features/pastures/types";

export const animalStatusLabels: Record<AnimalStatus, string> = {
  active: "Activo",
  ready_for_sale: "Listo venta",
  underperforming: "Atrasado",
  sick: "Enfermo",
  sold: "Vendido",
  dead: "Muerto"
};

export const animalStatusClasses: Record<AnimalStatus, string> = {
  active: "border-sky-200 bg-sky-50 text-sky-800",
  ready_for_sale: "border-emerald-200 bg-emerald-50 text-emerald-800",
  underperforming: "border-amber-200 bg-amber-50 text-amber-800",
  sick: "border-orange-200 bg-orange-50 text-orange-800",
  sold: "border-slate-200 bg-slate-100 text-slate-700",
  dead: "border-red-200 bg-red-50 text-red-800"
};

export const healthEventLabels: Record<HealthEventType, string> = {
  aftosa: "Aftosa",
  carbon: "Carbon",
  rabia: "Rabia",
  desparasitacion: "Desparasitacion",
  bano_garrapaticida: "Bano garrapaticida",
  vitaminas: "Vitaminas",
  tratamiento: "Tratamiento",
  enfermedad: "Enfermedad",
  mortalidad: "Mortalidad",
  retiro_sanitario: "Retiro sanitario"
};

export const feedTypeLabels: Record<FeedType, string> = {
  sal_mineralizada: "Sal mineralizada",
  melaza: "Melaza",
  silo: "Silo",
  heno: "Heno",
  concentrado: "Concentrado",
  subproducto: "Subproducto",
  otro: "Otro"
};

export const costCategoryLabels: Record<CostCategory, string> = {
  compra_animales: "Compra animales",
  medicamentos: "Medicamentos",
  vacunacion: "Vacunacion",
  suplementos: "Suplementos",
  sal_mineralizada: "Sal mineralizada",
  fertilizacion: "Fertilizacion",
  siembra_pasto: "Siembra pasto",
  guadana: "Guadana",
  enmiendas: "Enmiendas",
  mano_obra: "Mano de obra",
  transporte: "Transporte",
  ica: "ICA",
  mantenimiento_potrero: "Mantenimiento potrero",
  otros: "Otros"
};
