import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZoneColor } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getZoneColorByFtp(ftpRatio: number): string {
  if (ftpRatio < 0.6) return ZoneColor.Z1
  if (ftpRatio < 0.75) return ZoneColor.Z2
  if (ftpRatio < 0.9) return ZoneColor.Z3
  if (ftpRatio < 1.05) return ZoneColor.Z4
  if (ftpRatio < 1.2) return ZoneColor.Z5
  if (ftpRatio < 1.5) return ZoneColor.Z6
  return ZoneColor.Z7
}
