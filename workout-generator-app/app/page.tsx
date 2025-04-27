"use client";
import { Suspense } from "react";
import { WorkoutForm } from "@/components/WorkoutForm";
import { PreviewPane } from "@/components/PreviewPane";
import type { WorkoutBlock } from "@/lib/types";
import { useState } from "react";

export default function WorkoutPage() {
  const [output, setOutput] = useState("");
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([]);
  const [ftp, setFtp] = useState(0);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <Suspense fallback={null}>
          <WorkoutForm
            onGenerate={(text, b, f) => {
              setOutput(text);
              setBlocks(b);
              setFtp(f);
            }}
          />
        </Suspense>

        <PreviewPane output={output} blocks={blocks} ftp={ftp} />
      </div>
    </main>
  );
}
