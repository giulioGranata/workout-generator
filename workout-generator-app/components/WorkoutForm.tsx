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
import {
  CopyIcon,
  Link2Icon,
  CheckIcon,
  FileText,
  File,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { generateWorkout } from "@/lib/generator";
import { exportTxt } from "@/lib/export";
import { exportZwo } from "@/lib/exportZwo";
import { WorkoutBlocksBar } from "@/components/WorkoutBlocksBar";
import {
  TEMPLATES,
  TEMPLATE_ZONE_MAP,
  Template,
} from "@/lib/constants";

export function WorkoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // form state
  const [template, setTemplate] = useState<Template>(TEMPLATES[0]);
  const [ftp, setFtp] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  // result state
  const [output, setOutput] = useState<string>("");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  // initialize from URL query
  useEffect(() => {
    const qFtp = searchParams.get("ftp");
    const qDur = searchParams.get("duration");
    const qTpl = searchParams.get("template");
    if (qFtp) setFtp(qFtp);
    if (qDur) setDuration(qDur);
    if (qTpl && TEMPLATES.includes(qTpl as Template))
      setTemplate(qTpl as Template);
  }, [searchParams]);

  const handleGenerate = () => {
    if (!ftp || !duration) {
      toast("Please fill all fields");
      return;
    }

    // derive zone from template
    const selectedZone = TEMPLATE_ZONE_MAP[template];

    const { text, blocks: workoutBlocks } = generateWorkout({
      ftp: parseInt(ftp, 10),
      duration: parseInt(duration, 10),
      zone: selectedZone,
      template,
    });

    setOutput(text);
    setBlocks(workoutBlocks);
    setCopied(false);

    // update querystring (shallow)
    router.replace(
      `?ftp=${ftp}&duration=${duration}&template=${template}`,
      { scroll: false }
    );
  };

  const handleCopyResult = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast("Workout copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied!");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Form */}
      <div className="space-y-4">
        {/* Template select */}
        <div className="space-y-2">
          <Label>Template</Label>
          <Select
            value={template}
            onValueChange={(v) => setTemplate(v as Template)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose style" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FTP input */}
        <div className="space-y-2">
          <Label htmlFor="ftp">FTP (W)</Label>
          <Input
            id="ftp"
            type="number"
            value={ftp}
            onChange={(e) => setFtp(e.target.value)}
          />
        </div>

        {/* Duration input */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate}>Generate workout</Button>
      </div>

      {/* Output & Actions */}
      {output && (
        <>
          {/* Textual output */}
          <div className="relative p-4 bg-zinc-100 dark:bg-zinc-900 rounded font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-line overflow-x-auto">
            <pre className="pr-12">{output}</pre>

            {/* Inline toolbar */}
            <div className="absolute bottom-2 right-2 flex space-x-2">
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
                  {copied ? "Copied text" : "Copy text"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyLink}
                  >
                    <Link2Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Copy link</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex flex-wrap items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => exportTxt("workout.txt", output)}
            >
              <FileText className="h-4 w-4 mr-2" />
              TXT
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                exportZwo("workout.zwo", blocks, parseInt(ftp, 10))
              }
            >
              <File className="h-4 w-4 mr-2" />
              ZWO
            </Button>
          </div>

          {/* Visual Zwift-style preview */}
          {blocks.length > 0 && (
            <WorkoutBlocksBar blocks={blocks} ftp={parseInt(ftp, 10)} />
          )}
        </>
      )}
    </div>
  );
}