import { BodyLab } from "@/components/body-lab";
import { foodForDays } from "@/lib/model";
import { journeys } from "@/lib/journeys";

const stats = [
  ["Energy", "The day. Eating, a calm cruise, and fishing raise it. Pushing, portaging, bugs, cold, and a bad night spend it."],
  ["Health", "Injury, infection, dumps, cold, hunger, a tick left in place, a bear you invited into the tent. Food does not snap it back. Sleep, dryness, and not falling do, slowly."],
  ["Strain", "Shoulders and knees across the whole permit. It decays on layovers and full nights. It is why day 8 hurts on a trail day 3 called easy."],
  ["Warmth and wet", "Rain, a dump, a point camp in a storm. A wet sleeping bag is a multi-day health problem you packed yourself."],
  ["Morale", "Bugs, rain, a taken site, a wolf in the dark, a walleye in the pan. Low morale is how you miss a portage sign and call a double carry a good idea."],
  ["Food kilograms", "The heaviest honest item on day 1 of a long trip. Fishing replaces dinners so a 14-day bag can stay under 10 kg. A bear is a cut in this number."],
];

export default function BodyPage() {
  return (
    <div className="space-y-12">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">The body</p>
        <h1 className="font-display text-5xl tracking-tight">Weight, wind, and what is left</h1>
        <p className="text-lg text-muted-foreground">
          Canoeing raises energy when it is rest: a cruise in shelter, a drift while fishing.
          Portaging spends energy and health, scaled by rods, footing, the carry you chose, and
          the strain you already own. Bites, falls, and dumps spend both. The lab on this page
          is the spec.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {stats.map(([title, text]) => (
          <article key={title} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl">Try a carry or a crossing</h2>
        <BodyLab />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl">Food you start with</h2>
        <p className="max-w-3xl text-muted-foreground">
          Packed kilograms, before the fish. Long trips assume you will replace dinners. A pure
          14-day freeze-dried bag would break the first portage, so the design does not pack one.
          A kayak carries less than a canoe, which means the 14-day kayak variant is a food crisis
          unless you fish early and often.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 font-medium">Trip</th>
                <th className="py-2 font-medium">Food at launch</th>
                <th className="py-2 font-medium">Layovers budgeted</th>
                <th className="py-2 font-medium">Portage rods</th>
                <th className="py-2 font-medium">Paddle km</th>
              </tr>
            </thead>
            <tbody>
              {journeys.map((j) => (
                <tr key={j.slug} className="border-b border-border/70">
                  <td className="py-3">
                    {j.days}-day · {j.name}
                  </td>
                  <td className="py-3 font-mono">{foodForDays(j.days).toFixed(1)} kg</td>
                  <td className="py-3">{j.layovers}</td>
                  <td className="py-3">{j.rods}</td>
                  <td className="py-3">{j.km}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-3xl space-y-3">
        <h2 className="font-display text-3xl">The five-crossing rule</h2>
        <p className="text-muted-foreground">
          Solo canoe, careful carry: the canoe goes over, you walk back, a pack goes over, you
          walk back, the second pack goes over. Hustle keeps the five crossings and spends extra
          energy and fall chance to buy minutes. A double carry is one pass with the canoe and a
          pack. It can cost less energy than walking the trail five times, and it is how people
          fall when the light is going. That bargain is intentional. The kayak has no yoke, so
          even a careful carry is a worse trip per rod.
        </p>
        <p className="text-muted-foreground">
          Base gear besides food sits near 9 kg in the second pack: tent, bag, stove, clothes,
          filter, kit. The canoe itself is about 17 kg of kevlar. You wear one load at a time.
          You feel all of them.
        </p>
      </section>
    </div>
  );
}
