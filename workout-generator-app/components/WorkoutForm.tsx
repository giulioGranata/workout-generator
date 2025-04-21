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

type Zone = (typeof ZONES)[number];

export function WorkoutForm() {
  const [ftp, setFtp] = useState("");
  const [duration, setDuration] = useState("");
  const [zone, setZone] = useState<Zone | "">("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!ftp || !duration || !zone) {
      toast("Please fill in all fields");
      return;
    }

    const result = generateWorkout({
      ftp: parseInt(ftp),
      duration: parseInt(duration),
      zone,
    });

    setOutput(result);
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
    <div className="space-y-6">
      <div className="space-y-6">
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
          <Label>Target Zonne</Label>
          <Select onValueChange={(value) => setZone(value)}>
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

        <Button onClick={handleGenerate}>Genera workout</Button>
      </div>
      {output && (
        <div className="mt-6 p-4 bg-zinc-100 rounded font-mono text-sm space-y-2">
          <pre className="whitespace-pre-line">{output}</pre>

          <div className="flex justify-end w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {copied ? "Copied!" : "Copy to clipboard"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}
