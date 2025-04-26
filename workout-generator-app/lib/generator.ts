import { ZONE_MAP, ZONES, Template } from "./constants";
import { getZoneColorByFtp } from "./utils";
import { WorkoutBlock, WorkoutInput, Zone } from "./types";

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
Main: ${mainBlocks.map((b) => `${b.duration}’ @ ${Math.round(ftp * b.ftp)}W`).join(" / ")}
Cool-down: 5’ @ ${Math.round(ftp * 0.5)}W

Your zones:
${zoneTable}
`.trim();

  return { text, blocks };
}
export function generateMainBlocks(
  zone: Zone,
  duration: number,
  template: Template,
): WorkoutBlock[] {
  const [minFactor, maxFactor] = ZONE_MAP[zone];
  const avgFactor = (minFactor + maxFactor) / 2;
  const totalMain = duration - 15; // subtract warm-up (10) + cool-down (5)

  switch (template) {
    case "Endurance": {
      // Single steady ride at average intensity
      return [
        {
          label: "Endurance",
          duration: totalMain,
          ftp: avgFactor,
          color: getZoneColorByFtp(avgFactor),
        },
      ];
    }

    case "Threshold": {
      // Sweet-spot style intervals: 5’ ON / 3’ OFF
      const onMin = 5;
      const offMin = 3;
      const blockDur = onMin + offMin;
      const count = Math.floor(totalMain / blockDur);
      if (count === 0) {
        return [
          {
            label: "Threshold",
            duration: totalMain,
            ftp: avgFactor,
            color: getZoneColorByFtp(avgFactor),
          },
        ];
      }
      const blocks: WorkoutBlock[] = [];
      for (let i = 0; i < count; i++) {
        blocks.push({
          label: "Work",
          duration: onMin,
          ftp: maxFactor,
          color: getZoneColorByFtp(maxFactor),
        });
        blocks.push({
          label: "Rest",
          duration: offMin,
          ftp: 0.6,
          color: getZoneColorByFtp(0.6),
        });
      }
      return blocks;
    }

    case "VO2 Max": {
      // Short VO2 intervals: 30s ON / 90s OFF → convert to minutes
      const onMin = 0.5;
      const offMin = 1.5;
      const blockDur = onMin + offMin;
      const count = Math.floor(totalMain / blockDur);
      if (count === 0) {
        return [
          {
            label: "VO2 Max",
            duration: totalMain,
            ftp: maxFactor * 1.1, // push a bit above zone max
            color: getZoneColorByFtp(maxFactor * 1.1),
          },
        ];
      }
      const blocks: WorkoutBlock[] = [];
      for (let i = 0; i < count; i++) {
        blocks.push({
          label: "VO2 On",
          duration: onMin,
          ftp: maxFactor * 1.1,
          color: getZoneColorByFtp(maxFactor * 1.1),
        });
        blocks.push({
          label: "Recovery",
          duration: offMin,
          ftp: 0.5,
          color: getZoneColorByFtp(0.5),
        });
      }
      return blocks;
    }

    default:
      // Fallback: one steady block at average intensity
      return [
        {
          label: "Main",
          duration: totalMain,
          ftp: avgFactor,
          color: getZoneColorByFtp(avgFactor),
        },
      ];
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
    ZONES.map((z) => [z, customNames[z] ?? fallbackName(z)]),
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
