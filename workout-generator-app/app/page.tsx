import { WorkoutForm } from "@/components/WorkoutForm";

export default function Home() {
  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Workout Generator</h1>
      <WorkoutForm />
    </main>
  );
}
