import Link from "next/link";
import { notFound } from "next/navigation";
import { RouteMap } from "@/components/route-map";
import { Badge } from "@/components/ui/badge";
import { getJourney, journeys } from "@/lib/journeys";

export function generateStaticParams() {
  return journeys.map((j) => ({ slug: j.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const journey = getJourney(p.slug);
    return { title: journey ? `${journey.name} · Canoe Country` : "Journey" };
  });
}

export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const journey = getJourney(slug);
  if (!journey) notFound();

  return (
    <article className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
          {journey.days}-day permit
        </p>
        <h1 className="font-display text-5xl tracking-tight">{journey.name}</h1>
        <p className="text-lg text-muted-foreground">{journey.epithet}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{journey.difficulty}</Badge>
          <Badge variant="outline">{journey.nights} nights</Badge>
          <Badge variant="outline">{journey.km} km</Badge>
          <Badge variant="outline">{journey.rods} rods</Badge>
          <Badge variant="outline">{journey.foodKg} kg food</Badge>
        </div>
      </header>

      <RouteMap highlight={journey.lakes} />

      <section className="grid gap-4 md:grid-cols-2">
        <Fact label="Entry" value={journey.entry} />
        <Fact label="Exit" value={journey.exit} />
        <Fact label="Best season in the design" value={journey.season} />
        <Fact label="Play time target" value={journey.playMinutes} />
      </section>

      <section className="max-w-3xl space-y-3">
        <h2 className="font-display text-3xl">What this length is for</h2>
        <p className="text-muted-foreground">{journey.thesis}</p>
        <p className="text-muted-foreground">
          <span className="text-foreground">How it fails. </span>
          {journey.failure}
        </p>
        <p>
          <Link
            href={`/paddle?scenario=${journey.scenarioId}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            Paddle the sample day from this route
          </Link>
        </p>
      </section>

      <ol className="space-y-6">
        {journey.daysPlan.map((day) => (
          <li key={day.n} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl">
                Day {day.n} · {day.title}
              </h2>
              <span className="font-mono text-xs text-muted-foreground">{day.rods} rods</span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <Cell k="Move" v={day.move} />
              <Cell k="Camp" v={day.camp} />
              <Cell k="Hazard" v={day.hazard} />
              <Cell k="The choice" v={day.choice} />
            </dl>
          </li>
        ))}
      </ol>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <p className="font-mono text-xs text-muted-foreground uppercase">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-primary">{k}</dt>
      <dd className="mt-1 text-muted-foreground">{v}</dd>
    </div>
  );
}
