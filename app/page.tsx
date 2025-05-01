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
    <main className="w-full max-w-md sm:max-w-lg lg:max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* form sempre full-width su mobile, metà‐schermo su desktop */}
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
