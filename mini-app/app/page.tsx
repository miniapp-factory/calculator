import { title, description } from "@/lib/metadata";
import Calculator from "@/components/calculator";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      <Calculator />
    </main>
  );
}
