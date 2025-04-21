export const ZONES = ["Z1", "Z2", "Z3", "Z4", "Z5", "Z6", "Z7"] as const;

export const ZONE_MAP: Record<(typeof ZONES)[number], [number, number]> = {
  Z1: [0.5, 0.6],
  Z2: [0.6, 0.75],
  Z3: [0.75, 0.9],
  Z4: [0.9, 1.05],
  Z5: [1.05, 1.2],
  Z6: [1.2, 1.5],
  Z7: [1.5, 2.0],
}