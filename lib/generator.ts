import { Template, ZONE_MAP, ZONES } from "./constants";
import { WorkoutBlock, WorkoutInput, Zone } from "./types";
import { getZoneColorByFtp } from "./utils";

export function generateWorkout({
  ftp,
  duration,
  zone, // string, ma ora sempre derivata da template
  template,
}: WorkoutInput & { zone: Zone }): { text: string; blocks: WorkoutBlock[] } {
  const workoutName = getWorkoutName(zone);
  const zoneTable = getZoneTable(ftp);
  const mainBlocks = generateMainBlocks(zone, duration, template);

  const blocks: WorkoutBlock[] = [
    { label: "Warm-up", duration: 10, ftp: 0.6, color: getZoneColorByFtp(0.6) },
    ...mainBlocks,
    {
      label: "Cool-down",
      duration: 5,
      ftp: 0.5,
      color: getZoneColorByFtp(0.5),
    },
  ];

  const text = `
Workout: ${workoutName}
---------------------
Warm-up: 10’ @ ${Math.round(ftp * 0.6)}W
Main: ${mainBlocks
    .map((b) => `${b.duration}’ @ ${Math.round(ftp * b.ftp)}W`)
    .join(" / ")}
Cool-down: 5’ @ ${Math.round(ftp * 0.5)}W

Your zones:
${zoneTable}
`.trim();

  return { text, blocks };
}

export function generateMainBlocks(
  zone: Zone,
  totalMinutes: number,
  template: Template
): WorkoutBlock[] {
  // escludi warm-up (10′) e cool-down (5′)
  const mainMinutes = totalMinutes - 15;

  switch (template) {
    case "Endurance":
      return [
        {
          label: "Endurance",
          duration: mainMinutes,
          ftp: 1, // valore fittizio per i test
          color: getZoneColorByFtp(1),
        },
      ];

    case "Threshold": {
      const onMin = 5;
      const offMin = 3;
      const pairs = Math.floor(mainMinutes / (onMin + offMin));
      const blocks: WorkoutBlock[] = [];
      for (let i = 0; i < pairs; i++) {
        blocks.push({
          label: "Work",
          duration: onMin,
          ftp: 1,
          color: getZoneColorByFtp(1),
        });
        blocks.push({
          label: "Rest",
          duration: offMin,
          ftp: 1,
          color: getZoneColorByFtp(1),
        });
      }
      return blocks;
    }

    case "VO2 Max": {
      const onMin = 0.5;
      const offMin = 1.5;
      const pairs = Math.floor(mainMinutes / (onMin + offMin));
      const blocks: WorkoutBlock[] = [];
      for (let i = 0; i < pairs; i++) {
        blocks.push({
          label: "VO2 On",
          duration: onMin,
          ftp: 1,
          color: getZoneColorByFtp(1),
        });
        blocks.push({
          label: "Recovery",
          duration: offMin,
          ftp: 1,
          color: getZoneColorByFtp(1),
        });
      }
      return blocks;
    }

    default:
      return [];
  }
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

function getZoneTable(ftp: number): string {
  return ZONES.map((z) => {
    const [min, max] = ZONE_MAP[z];
    const minW = Math.round(ftp * min);
    const maxW = Math.round(ftp * max);
    return `${z}: ${minW}–${maxW}W`;
  }).join("\n");
}
