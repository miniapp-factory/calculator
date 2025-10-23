import { ScientificCalculator } from "@/components/calculator/scientific";

export default function ScientificPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">Scientific Calculator</h1>
      <ScientificCalculator />
    </div>
  );
}
