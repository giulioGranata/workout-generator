// lib/exportZwo.ts

import { WorkoutBlock } from "./types"

/**
 * Build a minimal Zwift .zwo XML string from blocks.
 */
export function buildZwoXml(
  name: string,
  blocks: WorkoutBlock[],
  ftp: number
): string {
  const lines: string[] = []
  lines.push('<?xml version="1.0" encoding="UTF-8"?>')
  lines.push("<workout_file>")
  lines.push(`  <name>${name}</name>`)
  lines.push("  <workout>")

  for (const block of blocks) {
    const secs = block.duration * 60
    const power = Math.round(block.ftp * ftp)

    if (block.label.toLowerCase().includes("warm")) {
      lines.push(
        `    <Warmup Duration="${secs}" PowerLow="${power}" PowerHigh="${power}" />`
      )
    } else if (block.label.toLowerCase().includes("cool")) {
      lines.push(
        `    <Cooldown Duration="${secs}" PowerLow="${power}" PowerHigh="${power}" />`
      )
    } else {
      lines.push(
        `    <SteadyState Duration="${secs}" PowerLow="${power}" PowerHigh="${power}" />`
      )
    }
  }

  lines.push("  </workout>")
  lines.push("</workout_file>")
  return lines.join("\n")
}

export function exportZwo(
  filename: string,
  blocks: WorkoutBlock[],
  ftp: number
) {
  const xml = buildZwoXml(filename.replace(/\.zwo$/i, ""), blocks, ftp)
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}