"use client"

import { WorkoutBlocksBar } from "@/components/WorkoutBlocksBar"
import { ActionToolbar } from "@/components/ActionToolbar"
import type { WorkoutBlock } from "@/lib/types"

export function PreviewPane({
  output,
  blocks,
  ftp,
}: {
  output: string
  blocks: WorkoutBlock[]
  ftp: number
}) {
  if (!output) return null

  return (
    <div className="space-y-4">
      {/* Textual output */}
      <div className="relative p-4 bg-zinc-100 dark:bg-zinc-900 rounded font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-line overflow-x-auto">
        <pre className="pr-12">{output}</pre>
      </div>

      {/* Actions: Copy, Link, Download TXT/ZWO */}
      <ActionToolbar output={output} blocks={blocks} ftp={ftp} />

      {/* Timeline bar */}
      {blocks.length > 0 && (
        <WorkoutBlocksBar blocks={blocks} ftp={ftp} />
      )}
    </div>
  )
}