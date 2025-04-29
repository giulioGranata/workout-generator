"use client";

import { ActionToolbar } from "@/components/ActionToolbar";
import { WorkoutBlocksBar } from "@/components/WorkoutBlocksBar";
import type { WorkoutBlock } from "@/lib/types";

export function PreviewPane({
  output,
  blocks,
  ftp,
}: {
  output: string;
  blocks: WorkoutBlock[];
  ftp: number;
}) {
  if (!output) return null;

  return (
    <div className="space-y-4">
      {/* Textual output */}
      <div
        className="
          relative p-4 
          bg-zinc-100 dark:bg-zinc-900 
          rounded font-mono text-sm leading-relaxed 
          text-zinc-900 dark:text-zinc-100 
          max-w-full overflow-auto
        "
      >
        <pre className="m-0 pr-12 whitespace-pre-wrap break-words w-full">
          {output}
        </pre>
      </div>

      {/* Actions: Copy, Link, Download TXT/ZWO */}
      <ActionToolbar output={output} blocks={blocks} ftp={ftp} />

      {/* Timeline bar */}
      {blocks.length > 0 && <WorkoutBlocksBar blocks={blocks} ftp={ftp} />}
    </div>
  );
}
