"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  CopyIcon,
  CheckIcon,
  Link2Icon,
  FileText,
  File,
  MenuIcon,
} from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { exportTxt } from "@/lib/export"
import { exportZwo } from "@/lib/exportZwo"
import type { WorkoutBlock } from "@/lib/types"
import { useState } from "react"
import { useMediaQuery } from "@react-hook/media-query"

export function ActionToolbar({
  output,
  blocks,
  ftp,
}: {
  output: string
  blocks: WorkoutBlock[]
  ftp: number
}) {
  const [copied, setCopied] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const copyText = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    toast("Workout copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast("Link copied!")
  }

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

      <Button variant="ghost" size="icon" onClick={copyLink}>
        <Link2Icon className="h-4 w-4" />
      </Button>

      <Button variant="outline" onClick={() => exportTxt("workout.txt", output)}>
        <FileText className="h-4 w-4 mr-1" />
        TXT
      </Button>

      <Button variant="outline" onClick={() => exportZwo("workout.zwo", blocks, ftp)}>
        <File className="h-4 w-4 mr-1" />
        ZWO
      </Button>
    </>
  )

  /* ---------- Render ---------- */
  if (isDesktop) {
    // toolbar inline (≥ md)
    return (
      <div className="flex flex-wrap items-center justify-end space-x-2">
        {Buttons}
      </div>
    )
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
  )
}