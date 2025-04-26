"use client";

import { useState } from "react";
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
import { CopyIcon, CheckIcon } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { generateWorkout } from "@/lib/generator";
import { ZONES } from "@/lib/constants";
import { WorkoutBlock } from "@/lib/types";
import { WorkoutBlocksBar } from "@/components/WorkoutBlocksBar";
import { exportTxt } from "@/lib/export";
import { exportZwo } from "@/lib/exportZwo";

type Zone = (typeof ZONES)[number];

export function WorkoutForm() {
  const [ftp, setFtp] = useState("200");
  const [duration, setDuration] = useState("60");
  const [zone, setZone] = useState<Zone | "">("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const [blocks, setBlocks] = useState<WorkoutBlock[]>([]);

  const handleGenerate = () => {
    if (!ftp || !duration || !zone) {
      toast("Please fill in all fields");
      return;
    }
    const { text, blocks } = generateWorkout({
      ftp: parseInt(ftp),
      duration: parseInt(duration),
      zone,
    });

    setOutput(text);
    setBlocks(blocks);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!output) return;

    navigator.clipboard.writeText(output);
    setCopied(true);
    toast("Workout copied to clipboard!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ftp">FTP (Watt)</Label>
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
          <Select onValueChange={(value) => setZone(value as Zone)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Zone (Z1–Z7)" />
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

      {/* Output */}
      {output && (
        <>
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-line overflow-x-auto relative">
            <pre className="whitespace-pre-line pr-12">{output}</pre>

            <div className="absolute bottom-2 right-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {copied ? "Copied!" : "Copy to clipboard"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {blocks.length > 0 && ftp && (
            <WorkoutBlocksBar blocks={blocks} ftp={parseInt(ftp)} />
          )}
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => exportTxt("workout.txt", output)}
            >
              Download .txt
            </Button>
            <Button
              variant="outline"
              onClick={() => exportZwo("workout.zwo", blocks, parseInt(ftp))}
            >
              Download .zwo
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
