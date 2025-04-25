export type WorkoutBlock = {
  label: string
  duration: number // in minutes
  ftp: number // es: 0.85 = 85% FTP
  color: string // HEX color code
}


export type WorkoutInput = {
  ftp: number;
  duration: number; // in minutes
  zone: Zone;
};

import { ZONES } from "./constants"
export type Zone = (typeof ZONES)[number]



