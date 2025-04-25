import { WorkoutForm } from "@/components/WorkoutForm"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

export default function Home() {
  return (
    <>
      {/* Top nav */}
      <header className="w-full px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Workout Generator</h1>
        <ThemeSwitcher />
      </header>

      {/* Main content */}
      <main className="max-w-md mx-auto py-8 px-4">
        <WorkoutForm />
      </main>
    </>
    )
}
