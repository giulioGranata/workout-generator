import { ZONE_MAP, ZONES } from "./constants";

type Zone = (typeof ZONES)[number];

type WorkoutInput = {
  ftp: number;
  duration: number; // in minutes
  zone: Zone;
};

export function generateWorkout({ ftp, duration, zone }: WorkoutInput): string {
  const workoutName = getWorkoutName(zone);
  const zoneTable = getZoneTable(ftp);

  return `
Workout: ${workoutName}
---------------------
Warm-up: 10’ @ ${Math.round(ftp * 0.6)}W
Main: ${generateMainBlock(ftp, zone, duration)}
Cool-down: 5’ @ ${Math.round(ftp * 0.5)}W

Your zones:
${zoneTable}
`.trim();
}

function getWorkoutName(zone: Zone): string {
  const fallbackName = (z: Zone) => [`Custom ${z} Ride`];

  const customNames: Partial<Record<Zone, string[]>> = {
    Z1: ["Easy Breeze", "Recovery Ride", "Zen Spin"],
    Z2: ["Enduro Engine", "Fat Burn Flow", "Steady Spin"],
    Z3: ["Tempo Tracker", "Rolling Thunder", "Push Cruise"],
    Z4: ["Threshold Slayer", "Sweet Spot Smash", "Zone Crusher"],
    Z5: ["Power Surge", "VO2 Max Blitz", "Red Zone Rocket"],
    Z6: ["Lactate Destroyer", "Pain Cave Express", "Speed Demon"],
    Z7: ["Sprint Storm", "Maximum Chaos", "Nuclear Launch"],
  };

  const names: Record<Zone, string[]> = Object.fromEntries(
    ZONES.map((z) => [z, customNames[z] ?? fallbackName(z)])
  ) as Record<Zone, string[]>;

  const options = names[zone];
  return options[Math.floor(Math.random() * options.length)];
}

function generateMainBlock(ftp: number, zone: Zone, duration: number): string {
  const [minFactor, maxFactor] = ZONE_MAP[zone];
  const workIntensity = Math.round(ftp * maxFactor);
  const restIntensity = Math.round(ftp * 0.6);

  const intervalOn = 5; // min
  const intervalOff = 3; // min
  const blockDuration = intervalOn + intervalOff;

  const numIntervals = Math.floor((duration - 15) / blockDuration);

  if (numIntervals === 0) {
    return `${duration - 15}’ @ ${workIntensity}W`;
  }

  return `${numIntervals} x [${intervalOn}’ @ ${workIntensity}W / ${intervalOff}’ @ ${restIntensity}W]`;
}

function getZoneTable(ftp: number): string {
  return ZONES.map((z) => {
    const [min, max] = ZONE_MAP[z];
    const minW = Math.round(ftp * min);
    const maxW = Math.round(ftp * max);
    return `${z}: ${minW}–${maxW}W`;
  }).join("\n");
}