import { SimpleCalculator } from "@/components/calculator/simple";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Calculator</h1>
      <SimpleCalculator />
    </div>
  );
}
