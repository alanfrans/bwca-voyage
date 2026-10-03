import Link from "next/link";

const hours = [
  ["5:40", "Wake. Weather, body, food count. A real breakfast is an energy decision."],
  ["6:30", "Break camp. A wet tent packed wet is tomorrow’s warmth problem, already locked in."],
  ["Morning", "Paddle and portage while the wind is still deciding. Moose get the narrows first."],
  ["Midday", "Eat. Fish if the lake is kind. Deer flies find open July water."],
  ["Afternoon", "The dangerous hours. Sites fill. Wind builds. A double carry starts to look clever."],
  ["Late light", "Be on a legal site. Darkness mid-portage is the worst state in the game."],
  ["Dusk", "Filter, cook at the grate, hang or canister, tick and leech check, headnet."],
  ["Night", "Bears follow smell. Wolves, if they come, are a voice. Sleep restores what the day allowed."],
  ["Dawn", "Strain drops if you ate and dried. A missed tick starts a slower clock."],
];

export default function DayPage() {
  return (
    <article className="max-w-3xl space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">The day</p>
        <h1 className="font-display text-5xl tracking-tight">Dawn to dawn</h1>
        <p className="text-lg text-muted-foreground">
          A wilderness day is the session. Short trips are one or two of them. The 14-day route is
          a run of them, with hard days played long and easy water folded down so the game is not
          a walking simulator with a yoke.
        </p>
      </header>

      <ol className="space-y-4">
        {hours.map(([when, text]) => (
          <li key={when} className="grid gap-1 border-t border-border pt-4 sm:grid-cols-[120px_1fr]">
            <span className="font-mono text-sm text-primary">{when}</span>
            <span className="text-muted-foreground">{text}</span>
          </li>
        ))}
      </ol>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">Travel compression</h2>
        <p className="text-muted-foreground">
          If wind, footing, bugs, wet, and fatigue are all quiet, the game integrates the body
          model and plays the mile as travel: a shoreline sliding past, a stroke rate, a loon.
          If any of those pressures rise, the mile expands. You feel the brace, the root, the
          fly, the decision to wait. Fresh paddlers on flat water get their afternoon back. Tired
          paddlers on a muddy 120-rod trail do not.
        </p>
        <p className="font-mono text-sm text-foreground/90">
          pressure = wind + footing + fatigue + bugs + wet + a nearby animal
        </p>
        <p className="text-muted-foreground">
          Below a calm threshold, compress. Above it, expand. The threshold is tuned per trip
          length so a 3-day route still has one fully expanded portage, and a 14-day route does
          not make you walk eleven hundred rods in real time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">Camp is a checklist with a location</h2>
        <p className="text-muted-foreground">
          The tent pad has slope and drainage. The hang has height, distance from the trunk, and
          distance from the tent. The cook site is the grate, not the vestibule. The water goes
          through the filter. The body gets checked for ticks and leeches before the headlamp is
          the only light. Each of those is a spatial act in the 3D game and a choice in{" "}
          <Link href="/paddle" className="text-primary underline-offset-4 hover:underline">
            the day you can paddle here
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">Endings</h2>
        <p className="text-muted-foreground">
          You finish by reaching the exit landing with a body that can still walk to the truck.
          Health at zero is an evacuation: a float plane or a hard paddle assist, written as an
          ending, not a slap on the wrist and a reload. Turning around early on the long routes
          is scored as judgment when the numbers say you should. There is no combat win. The
          score is five lines in the notebook: body out, wind obeyed, dinners, hangs, and whether
          the animals were given room.
        </p>
      </section>
    </article>
  );
}
