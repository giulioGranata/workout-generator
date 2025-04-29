"use client";

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
import { TEMPLATES, Template } from "@/lib/constants";
import { generateWorkout } from "@/lib/generator";
import type { WorkoutBlock } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    <div className="space-y-6">
      {/* Template */}
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

      {/* FTP */}
      <div className="space-y-2">
        <Label htmlFor="ftp">FTP (W)</Label>
        <Input
          id="ftp"
          type="number"
          value={ftp}
          onChange={(e) => setFtp(e.target.value)}
        />
      </div>

      {/* Duration */}
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
  );
}
