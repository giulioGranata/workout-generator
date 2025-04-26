export const ZONES = ["Z1", "Z2", "Z3", "Z4", "Z5", "Z6", "Z7"] as const
export const TEMPLATES = ["Endurance", "Threshold", "VO2 Max"] as const
export type Template = (typeof TEMPLATES)[number]

export const ZONE_MAP: Record<(typeof ZONES)[number], [number, number]> = {
  Z1: [0.5, 0.6],
  Z2: [0.6, 0.75],
  Z3: [0.75, 0.9],
  Z4: [0.9, 1.05],
  Z5: [1.05, 1.2],
  Z6: [1.2, 1.5],
  Z7: [1.5, 2.0],
};

export enum ZoneColor {
  Z1 = "#9E9E9E", // gray
  Z2 = "#2196F3", // blue
  Z3 = "#4CAF50", // green
  Z4 = "#FFEB3B", // yellow
  Z5 = "#FF7043", // orange
  Z6 = "#F44336", // red
  Z7 = "#B71C1C", // dark red (personal choice for Z7)
}

// dopo TEMPLATES…
export const TEMPLATE_ZONE_MAP: Record<Template, Zone> = {
  Endurance: "Z2",   // user lavora a Z2–Z3, scegliamo Z2 come default
  Threshold: "Z4",   // TS sempre in Z4
  "VO2 Max": "Z5",   // VO2 su Z5+ → scegliamo Z5
}