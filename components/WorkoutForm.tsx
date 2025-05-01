"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { generateWorkout } from "@/lib/generator";
import { TEMPLATES, Template } from "@/lib/constants";
import type { WorkoutBlock } from "@/lib/types";

export function WorkoutForm({
  onGenerate,
}: {
  onGenerate: (text: string, blocks: WorkoutBlock[], ftp: number) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // form state
  const [template, setTemplate] = useState<Template>(TEMPLATES[0]);
  const [ftp, setFtp] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  // init from querystring
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

    const { text, blocks } = generateWorkout({
      ftp: parseInt(ftp, 10),
      duration: parseInt(duration, 10),
      template,
    });

    onGenerate(text, blocks, parseInt(ftp, 10));

    // update URL querystring (shallow)
    router.replace(`?ftp=${ftp}&duration=${duration}&template=${template}`, {
      scroll: false,
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md h-fit">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template */}
        <div className="space-y-2">
          <Label>Template</Label>
          <Select value={template} onValueChange={(v) => setTemplate(v as Template)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose style" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FTP */}
        <div className="space-y-2">
          <Label htmlFor="ftp">FTP (W)</Label>
          <Input
            id="ftp"
            type="number"
            placeholder="e.g. 250"
            value={ftp}
            onChange={(e) => setFtp(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            id="duration"
            type="number"
            placeholder="e.g. 60"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Generate button */}
        <div className="md:col-span-2 flex justify-center md:justify-end">
          <Button onClick={handleGenerate}>Generate workout</Button>
        </div>
      </div>
    </div>
  );
}