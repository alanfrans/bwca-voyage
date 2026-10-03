import { DayRunner } from "@/components/day-runner";

export const metadata = {
  title: "Paddle a day · Canoe Country",
};

export default async function PaddlePage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>;
}) {
  const { scenario } = await searchParams;
  return (
    <div className="space-y-6">
      <header className="max-w-3xl space-y-2">
        <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">One day, runnable</p>
        <h1 className="font-display text-5xl tracking-tight">Paddle a day</h1>
        <p className="text-muted-foreground">
          Five sample days from the permits. Cruise if the wind lets you rest. Carry the portage
          the slow way unless the light is actually failing. Hang the food. Check your skin. The
          notebook is what the 3D game is promising to feel like, with the math left visible.
        </p>
      </header>
      <DayRunner initialId={scenario} />
    </div>
  );
}
