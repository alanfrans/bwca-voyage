import Link from "next/link";
import { RouteMap } from "@/components/route-map";
import { Badge } from "@/components/ui/badge";
import { journeys } from "@/lib/journeys";

export default function JourneysPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">Journeys</p>
        <h1 className="font-display text-5xl tracking-tight">Five permits, one lake chain</h1>
        <p className="text-lg text-muted-foreground">
          A Boundary Waters overnight permit fixes your entry point and your entry date. It does
          not fix a maximum stay. These five lengths are the player’s ambition, food, and shuttle
          plan. All of them enter at Moose Lake, Entry Point 25, near Ely. The 14-day leaves at
          Sea Gull on the Gunflint Trail.
        </p>
      </header>
      <RouteMap />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 font-medium">Days</th>
              <th className="py-2 font-medium">Route</th>
              <th className="py-2 font-medium">Nights</th>
              <th className="py-2 font-medium">Km</th>
              <th className="py-2 font-medium">Rods</th>
              <th className="py-2 font-medium">Food</th>
              <th className="py-2 font-medium">Play</th>
            </tr>
          </thead>
          <tbody>
            {journeys.map((j) => (
              <tr key={j.slug} className="border-b border-border/70">
                <td className="py-3 font-mono">{j.days}</td>
                <td className="py-3">
                  <Link href={`/journeys/${j.slug}`} className="text-primary hover:underline">
                    {j.name}
                  </Link>
                  <div className="text-muted-foreground">{j.exit}</div>
                </td>
                <td className="py-3">{j.nights}</td>
                <td className="py-3">{j.km}</td>
                <td className="py-3">{j.rods}</td>
                <td className="py-3">{j.foodKg} kg</td>
                <td className="py-3">{j.playMinutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {journeys.map((j) => (
          <Link
            key={j.slug}
            href={`/journeys/${j.slug}`}
            className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 hover:ring-primary/40"
          >
            <Badge variant="secondary">{j.difficulty}</Badge>
            <h2 className="mt-3 font-display text-3xl">
              {j.days} · {j.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{j.thesis}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
