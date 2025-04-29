"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WorkoutBlock } from "@/lib/types";
import { useEffect, useState } from "react";

type Props = {
  blocks: WorkoutBlock[];
  ftp: number;
};

export function WorkoutBlocksBar({ blocks, ftp }: Props) {
  const total = blocks.reduce((sum, b) => sum + b.duration, 0);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // rileva se il device supporta hover
    const mql = window.matchMedia("(hover: hover)");
    setCanHover(mql.matches);
    const listener = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  return (
    <div className="w-full">
      <div className="flex h-24 overflow-hidden rounded-xl bg-transparent">
        {blocks.map((b, i) => {
          const trigger = (
            <div
              className="
                flex-shrink-0 h-full transition-all duration-200
                hover:brightness-90 cursor-pointer
              "
              style={{
                flex: b.duration,
                backgroundColor: b.color,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                borderRadius: "0.5rem",
                marginLeft: i === 0 ? 0 : 2,
              }}
            />
          );

          const mins = b.duration;
          const power = Math.round(b.ftp * ftp);
          const content = (
            <div className="whitespace-nowrap px-2 py-1">
              <div className="font-medium text-sm">
                {mins} minute{mins > 1 ? "s" : ""} of {power} W
              </div>
            </div>
          );

          return canHover ? (
            <HoverCard key={i}>
              <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="center"
                style={{ padding: ".25rem" }}
              >
                {content}
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Popover key={i}>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                style={{ padding: ".25rem" }}
              >
                {content}
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
      <div className="text-center text-xs text-zinc-500 italic mt-1">
        Workout visual preview
      </div>
    </div>
  );
}
