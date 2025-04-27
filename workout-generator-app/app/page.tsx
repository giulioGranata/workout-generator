"use client"

import { useState } from "react"
import { WorkoutForm } from "@/components/WorkoutForm"
import { PreviewPane } from "@/components/PreviewPane"
import type { WorkoutBlock } from "@/lib/types"

export default function WorkoutPage() {
  const [output, setOutput] = useState<string>("")
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([])
  const [ftp, setFtp] = useState<number>(0)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* left: form */}
        <WorkoutForm
          onGenerate={(text, b, f) => {
            setOutput(text)
            setBlocks(b)
            setFtp(f)
          }}
        />

        {/* right: preview */}
        <PreviewPane output={output} blocks={blocks} ftp={ftp} />
      </div>
    </main>
  )
}