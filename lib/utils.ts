import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZoneColor } from "./constants";
import { WorkoutBlock } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getZoneColorByFtp(ftpRatio: number): string {
  if (ftpRatio < 0.6) return ZoneColor.Z1;
  if (ftpRatio < 0.75) return ZoneColor.Z2;
  if (ftpRatio < 0.9) return ZoneColor.Z3;
  if (ftpRatio < 1.05) return ZoneColor.Z4;
  if (ftpRatio < 1.2) return ZoneColor.Z5;
  if (ftpRatio < 1.5) return ZoneColor.Z6;
  return ZoneColor.Z7;
}

export function compressBlocks(blocks: WorkoutBlock[]): WorkoutBlock[] {
  if (blocks.length === 0) return [];
  const out: WorkoutBlock[] = [blocks[0]];
  for (let i = 1; i < blocks.length; i++) {
    const prev = out[out.length - 1];
    const cur = blocks[i];
    if (prev.ftp === cur.ftp && prev.color === cur.color) {
      prev.duration += cur.duration;
    } else {
      out.push({ ...cur });
    }
  }
  return out;
}
