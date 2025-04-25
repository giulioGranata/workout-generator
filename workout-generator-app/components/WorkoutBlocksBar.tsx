"use client"

import { WorkoutBlock } from "@/lib/types"

type Props = {
  blocks: WorkoutBlock[]
  ftp: number
}

export function WorkoutBlocksBar({ blocks, ftp }: Props) {
  const totalDuration = blocks.reduce((sum, b) => sum + b.duration, 0)

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto">
      <div className="flex h-6 overflow-hidden rounded border border-zinc-300 shadow-sm bg-white dark:bg-zinc-800">
        {blocks.map((block, i) => (
          <div
            key={i}
            title={`${block.label}: ${block.duration}’ @ ${Math.round(block.ftp * ftp)}W`}
            style={{
              width: `${(block.duration / totalDuration) * 100}%`,
              backgroundColor: block.color,
            }}
            className="h-full border-r border-white last:border-r-0 cursor-help transition-all"
          />
        ))}
      </div>
      <div className="text-xs text-zinc-400 mt-2 text-center italic">
        Workout visual preview
      </div>
    </div>
  )
}