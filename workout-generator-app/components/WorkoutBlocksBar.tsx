"use client"

import { WorkoutBlock } from "@/lib/types"

type Props = {
  blocks: WorkoutBlock[]
  ftp: number
}

export function WorkoutBlocksBar({ blocks, ftp }: Props) {
  if (!blocks.length) return null
  const total = blocks.reduce((s, b) => s + b.duration, 0)

  return (
    <div className="space-y-1">
      {/* Colored bar */}
      <div className="flex w-full h-6 lg:h-8 overflow-hidden rounded-md border border-zinc-400/40 shadow-inner">
        {blocks.map((b, i) => (
          <div
            key={i}
            title={`${b.label}: ${b.duration}’ @ ${Math.round(b.ftp * ftp)} W`}
            style={{
              width: `${(b.duration / total) * 100}%`,
              backgroundColor: b.color,
            }}
            className="h-full cursor-help border-r border-white last:border-r-0 transition-all"
          />
        ))}
      </div>

      {/* Caption */}
      <div className="text-center text-xs text-zinc-500 italic">
        Workout visual preview
      </div>
    </div>
  )
}