import { ZONE_MAP, ZONES } from "./constants"
import { getZoneColorByFtp } from "./utils"
import { WorkoutBlock, WorkoutInput, Zone } from "./types"

export function generateWorkout({
  ftp,
  duration,
  zone,
}: WorkoutInput): { text: string; blocks: WorkoutBlock[] } {
  const workoutName = getWorkoutName(zone)
  const zoneTable = getZoneTable(ftp)
  const mainBlocks = generateMainBlocks(zone, duration)

  const blocks: WorkoutBlock[] = [
    { label: "Warm-up", duration: 10, ftp: 0.6, color: getZoneColorByFtp(0.6) },
    ...mainBlocks,
    { label: "Cool-down", duration: 5, ftp: 0.5, color: getZoneColorByFtp(0.5) },
  ]

  const text = `
Workout: ${workoutName}
---------------------
Warm-up: 10’ @ ${Math.round(ftp * 0.6)}W
Main: ${mainBlocks.map(b => `${b.duration}’ @ ${Math.round(ftp * b.ftp)}W`).join(" / ")}
Cool-down: 5’ @ ${Math.round(ftp * 0.5)}W

Your zones:
${zoneTable}
`.trim()

  return { text, blocks }
}

function generateMainBlocks(zone: Zone, duration: number): WorkoutBlock[] {
  const [, maxFactor] = ZONE_MAP[zone]
  const intervalOn = 5
  const intervalOff = 3
  const blockDuration = intervalOn + intervalOff
  const totalMainDuration = duration - 15
  const numIntervals = Math.floor(totalMainDuration / blockDuration)

  if (numIntervals === 0) {
    return [
      {
        label: "Main",
        duration: totalMainDuration,
        ftp: maxFactor,
        color: getZoneColorByFtp(maxFactor),
      },
    ]
  }

  const blocks: WorkoutBlock[] = []

  for (let i = 0; i < numIntervals; i++) {
    blocks.push({
      label: "Work",
      duration: intervalOn,
      ftp: maxFactor,
      color: getZoneColorByFtp(maxFactor),
    })
    blocks.push({
      label: "Rest",
      duration: intervalOff,
      ftp: 0.6,
      color: getZoneColorByFtp(0.6),
    })
  }

  return blocks
}

function getWorkoutName(zone: Zone): string {
  const fallbackName = (z: Zone) => [`Custom ${z} Ride`]

  const customNames: Partial<Record<Zone, string[]>> = {
    Z1: ["Easy Breeze", "Recovery Ride", "Zen Spin"],
    Z2: ["Enduro Engine", "Fat Burn Flow", "Steady Spin"],
    Z3: ["Tempo Tracker", "Rolling Thunder", "Push Cruise"],
    Z4: ["Threshold Slayer", "Sweet Spot Smash", "Zone Crusher"],
    Z5: ["Power Surge", "VO2 Max Blitz", "Red Zone Rocket"],
    Z6: ["Lactate Destroyer", "Pain Cave Express", "Speed Demon"],
    Z7: ["Sprint Storm", "Maximum Chaos", "Nuclear Launch"],
  }

  const names: Record<Zone, string[]> = Object.fromEntries(
    ZONES.map((z) => [z, customNames[z] ?? fallbackName(z)])
  ) as Record<Zone, string[]>

  const options = names[zone]
  return options[Math.floor(Math.random() * options.length)]
}

function getZoneTable(ftp: number): string {
  return ZONES.map((z) => {
    const [min, max] = ZONE_MAP[z]
    const minW = Math.round(ftp * min)
    const maxW = Math.round(ftp * max)
    return `${z}: ${minW}–${maxW}W`
  }).join("\n")
}
