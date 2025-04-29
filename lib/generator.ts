import { Template, TEMPLATE_ZONE_MAP, ZONE_MAP, ZONES } from "./constants";
import { WorkoutBlock, WorkoutInput, Zone } from "./types";
import { getZoneColorByFtp } from "./utils";

export function generateWorkout({ ftp, duration, template }: WorkoutInput): {
  text: string;
  blocks: WorkoutBlock[];
} {
  const workoutName = getWorkoutName(template);
  const zoneTable = getZoneTable(ftp);
  const mainBlocks = generateMainBlocks(
    TEMPLATE_ZONE_MAP[template],
    duration,
    template
  );

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
  zonesOrZone: Zone | Zone[],
  totalMinutes: number,
  template: Template
): WorkoutBlock[] {
  // normalize to an array
  const zones = Array.isArray(zonesOrZone) ? zonesOrZone : [zonesOrZone];

  const mainMinutes = totalMinutes - 15;

  // compute average factor across the zones pool
  const avgFactor =
    zones
      .map((z) => {
        const [minF, maxF] = ZONE_MAP[z];
        return (minF + maxF) / 2;
      })
      .reduce((a, b) => a + b, 0) / zones.length;

  switch (template) {
    case "Endurance":
      return [
        {
          label: "Endurance",
          duration: mainMinutes,
          ftp: avgFactor,
          color: getZoneColorByFtp(avgFactor),
        },
      ];

    case "Threshold": {
      const onMin = 5,
        offMin = 3,
        pairs = Math.floor(mainMinutes / (onMin + offMin));
      const blocks: WorkoutBlock[] = [];
      for (let i = 0; i < pairs; i++) {
        blocks.push({
          label: "Work",
          duration: onMin,
          ftp: avgFactor,
          color: getZoneColorByFtp(avgFactor),
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
      const onMin = 0.5,
        offMin = 1.5,
        pairs = Math.floor(mainMinutes / (onMin + offMin));
      const blocks: WorkoutBlock[] = [];
      for (let i = 0; i < pairs; i++) {
        blocks.push({
          label: "VO2 On",
          duration: onMin,
          ftp: avgFactor * 1.1,
          color: getZoneColorByFtp(avgFactor * 1.1),
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
      return [];
  }
}
function getWorkoutName(template: Template): string {
  // prendi la prima zona del pool (per Endurance → Z2, Threshold → Z4, VO2 → Z5)
  const zone = TEMPLATE_ZONE_MAP[template][0];

  const customNames: Record<Zone, string[]> = {
    Z1: ["Easy Breeze", "Recovery Ride", "Zen Spin"],
    Z2: ["Enduro Engine", "Fat Burn Flow", "Steady Spin"],
    Z3: ["Tempo Tracker", "Rolling Thunder", "Push Cruise"],
    Z4: ["Threshold Slayer", "Sweet Spot Smash", "Zone Crusher"],
    Z5: ["Power Surge", "VO2 Max Blitz", "Red Zone Rocket"],
    Z6: ["Lactate Destroyer", "Pain Cave Express", "Speed Demon"],
    Z7: ["Sprint Storm", "Maximum Chaos", "Nuclear Launch"],
  };

  const options = customNames[zone] || [`Custom ${zone} Ride`];
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
