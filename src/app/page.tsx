import Link from "next/link";
import { RouteMap } from "@/components/route-map";
import { Badge } from "@/components/ui/badge";
import { journeys } from "@/lib/journeys";

const pillars = [
  {
    title: "The water is the road",
    text: "Travel is the verb. A calm cruise can restore energy. A headwind on Knife or Saganaga spends it. Fishing from the canoe is rest that might also become dinner.",
  },
  {
    title: "The portage is the price",
    text: "A rod is 16.5 feet. Solo, a canoe and two packs means five crossings of every trail: over, back, over, back, over. The map’s 40 rods is 200 rods on your knees.",
  },
  {
    title: "Camp is a machine you build at dusk",
    text: "Filter, grate, hang or canister, tick check, tent. Done while there is light, you recover. Done late, or with food in the tent, the night edits the trip.",
  },
  {
    title: "You are in the food web",
    text: "Mosquitoes, black flies, and deer flies are a constant tax. Leeches and ticks are delayed. Black bears want the food bag. Wolves are a sound in the dark. Moose are the large animal that can actually hurt you.",
  },
  {
    title: "Leave the site",
    text: "Designated campsites, fire grates, no cans or glass, filters instead of soap in the lake. Leave No Trace is a set of mechanics, including the ranger and the bear who both notice when you skip them.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Field manual · Boundary Waters
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            Canoe Country
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            A 3D game of canoeing and kayaking out of Ely, Minnesota. You carry a kevlar canoe,
            cook at a grate, and try to still like your knees on day ten. The country has
            leeches, mosquitoes, biting flies, ticks, bears, moose, and wolves. It also has
            loons, and evenings when the paddle is a rest.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/paddle"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Paddle one day of it
            </Link>
            <Link
              href="/journeys"
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium"
            >
              The five permits
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            What a trip is for
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>3 days teach the camp.</li>
            <li>5 days teach wind on Knife Lake.</li>
            <li>7 days offer a harder way home.</li>
            <li>10 days turn around heavier in the joints than in the pack.</li>
            <li>14 days commit to a shuttle off Sea Gull Lake.</li>
          </ul>
        </div>
      </section>

      <RouteMap />

      <section>
        <h2 className="font-display text-3xl">Five ways in</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every route starts at Entry Point 25, Moose Lake. Longer permits reuse the same lakes,
          then add country. That is also the production plan: one lake graph, five depths.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((journey) => (
            <Link
              key={journey.slug}
              href={`/journeys/${journey.slug}`}
              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition hover:ring-primary/50"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">{journey.days} days</Badge>
                <span className="font-mono text-xs text-muted-foreground">
                  {journey.rods} rods
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl">{journey.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{journey.epithet}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl">Pillars</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
              <h3 className="font-display text-xl">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="space-y-3">
          <h2 className="font-display text-3xl">The body, in one page</h2>
          <p className="text-muted-foreground">
            Energy rises when you eat, when you cruise calm water, and when you fish. Energy and
            health fall when you portage, when flies and mosquitoes work you over, when you fall,
            dump, or sleep wet and hungry. Strain is the slow one. It is why the eighth day of a
            portage hurts more than the first, even after the food bag has shrunk.
          </p>
          <p className="text-muted-foreground">
            The numbers are not a slide.{" "}
            <Link href="/body" className="text-primary underline-offset-4 hover:underline">
              The body lab
            </Link>{" "}
            and{" "}
            <Link href="/paddle" className="text-primary underline-offset-4 hover:underline">
              the day you can paddle
            </Link>{" "}
            both run <span className="font-mono text-foreground">src/lib/model.ts</span>.
          </p>
        </article>
        <article className="space-y-3">
          <h2 className="font-display text-3xl">What the 3D game is</h2>
          <p className="text-muted-foreground">
            Unreal Engine 5, scoped as a chain of authored lakes and portage splines, not a
            million-acre open world. The canoe has weight, wind, and a yoke that hides your feet.
            Hard miles play in real time. Easy miles compress into travel you can still feel in
            the body model.
          </p>
          <p>
            <Link href="/engine" className="text-primary underline-offset-4 hover:underline">
              Read the build
            </Link>
          </p>
        </article>
      </section>
    </div>
  );
}
