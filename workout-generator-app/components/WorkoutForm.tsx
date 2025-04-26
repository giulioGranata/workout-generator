"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CopyIcon, Link2Icon, CheckIcon } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { generateWorkout } from "@/lib/generator";
import { exportTxt } from "@/lib/export";
import { exportZwo } from "@/lib/exportZwo";
import { WorkoutBlocksBar } from "@/components/WorkoutBlocksBar";
import { ZONES } from "@/lib/constants";
import type { Zone } from "@/lib/types";

export function WorkoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from querystring
  const [ftp, setFtp] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [zone, setZone] = useState<Zone | "">("");
  const [output, setOutput] = useState<string>("");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const qFtp = searchParams.get("ftp");
    const qDur = searchParams.get("duration");
    const qZone = searchParams.get("zone");
    if (qFtp) setFtp(qFtp);
    if (qDur) setDuration(qDur);
    if (qZone && ZONES.includes(qZone as Zone)) setZone(qZone as Zone);
  }, [searchParams]);

  const handleGenerate = () => {
    if (!ftp || !duration || !zone) {
      toast("Please fill all fields");
      return;
    }

    const { text, blocks: wb } = generateWorkout({
      ftp: parseInt(ftp, 10),
      duration: parseInt(duration, 10),
      zone,
    });

    setOutput(text);
    setBlocks(wb);
    setCopied(false);

    // update URL without full reload
    router.replace(`?ftp=${ftp}&duration=${duration}&zone=${zone}`, {
      scroll: false,
    });
  };

  const handleCopyResult = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast("Workout copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast("Link copied!");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ftp">FTP (W)</Label>
          <Input
            id="ftp"
            type="number"
            value={ftp}
            onChange={(e) => setFtp(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Target Zone</Label>
          <Select onValueChange={(v) => setZone(v as Zone)} value={zone}>
            <SelectTrigger>
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              {ZONES.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGenerate}>Generate workout</Button>
      </div>

      {output && (
        <>
          {/* Text box with Copy & Link */}
          <div className="relative p-4 bg-zinc-100 dark:bg-zinc-900 rounded font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-line overflow-x-auto">
            <pre className="pr-12">{output}</pre>
            <div className="absolute bottom-2 right-2 flex space-x-2">
              {/* Copy text */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyResult}
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {copied ? "Copied!" : "Copy text"}
                </TooltipContent>
              </Tooltip>

              {/* Copy link */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                    <Link2Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Copy link</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex flex-wrap justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => exportTxt("workout.txt", output)}
            >
              Download .txt
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                exportZwo("workout.zwo", blocks, parseInt(ftp, 10))
              }
            >
              Download .zwo
            </Button>
          </div>

          {/* Visual bar */}
          {blocks.length > 0 && (
            <WorkoutBlocksBar blocks={blocks} ftp={parseInt(ftp, 10)} />
          )}
        </>
      )}
    </div>
  );
}
