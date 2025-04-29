"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WorkoutBlock } from "@/lib/types";

type Props = {
  blocks: WorkoutBlock[];
  ftp: number;
};

export function WorkoutBlocksBar({ blocks, ftp }: Props) {
  return (
    <div className="space-y-1">
      <div className="w-full overflow-x-auto">
        <div className="flex h-6 lg:h-8 overflow-hidden rounded-md border border-zinc-400/40 shadow-inner">
          {blocks.map((b, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  style={{ flex: b.duration, backgroundColor: b.color }}
                  className="h-full flex-shrink-0 flex-grow border-r border-white last:border-r-0 cursor-pointer transition-all"
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="w-40">
                <div className="font-semibold">{b.label}</div>
                <div className="text-sm">
                  {b.duration}′ @ {Math.round(b.ftp * ftp)} W
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-zinc-500 italic">
        Workout visual preview
      </div>
    </div>
  );
}
