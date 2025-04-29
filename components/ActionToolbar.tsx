"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { exportTxt } from "@/lib/export";
import { exportZwo } from "@/lib/exportZwo";
import type { WorkoutBlock } from "@/lib/types";
import { useMediaQuery } from "@react-hook/media-query";
import {
  CheckIcon,
  CopyIcon,
  File,
  FileText,
  Link2Icon,
  MenuIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ActionToolbar({
  output,
  blocks,
  ftp,
}: {
  output: string;
  blocks: WorkoutBlock[];
  ftp: number;
}) {
  const [copied, setCopied] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const copyText = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast("Workout copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied!");
  };

  const Buttons = (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={copyText}>
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {copied ? "Copied" : "Copy text"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={copyLink}>
            <Link2Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {copied ? "Copied" : "Copy link"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={() => exportTxt("workout.txt", output)}
          >
            <FileText className="h-4 w-4 mr-1" />
            TXT
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Export as TXT</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={() => exportZwo("workout.zwo", blocks, ftp)}
          >
            <File className="h-4 w-4 mr-1" />
            ZWO
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Export as ZWO</TooltipContent>
      </Tooltip>
    </>
  );

  /* ---------- Render ---------- */
  if (isDesktop) {
    // toolbar inline (≥ md)
    return (
      <div className="flex flex-wrap items-center justify-end space-x-2">
        {Buttons}
      </div>
    );
  }

  // mobile (< md) – hamburger + bottom sheet
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 md:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="pb-10 flex flex-col items-center gap-4"
      >
        {/* titolo sr-only per accessibilità */}
        <SheetHeader className="sr-only">
          <SheetTitle>Action toolbar</SheetTitle>
        </SheetHeader>

        {Buttons}
      </SheetContent>
    </Sheet>
  );
}
