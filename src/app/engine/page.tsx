const milestones = [
  ["0 · Design lock", "This manual, the body model in src/lib/model.ts, and the lake graph. Change the numbers here before anyone builds a yoke."],
  ["1 · Vertical slice", "One lake (Birch), one portage, one campsite, dusk to dawn. Canoe buoyancy, a yoke that hides the feet, bugs, a hang, a bear check. Greybox is fine. The body model is not optional."],
  ["2 · First permit", "The 3-day route, the paper map, site-taken logic, and the camp machine done with the hands, not a menu."],
  ["3 · Wind and food", "Capsize, fishing, food mass, the tow decision, the 5-day into Knife. Layover day must feel better than another heroic paddle."],
  ["4 · Delayed harm", "Ticks and giardia that arrive on a later morning. Moose that block a channel. Wolf audio with no combat. The 7-day Vera branch."],
  ["5 · The long permits", "Ten and fourteen days, travel compression, the one-way commitment past the border country, the Sea Gull shuttle ending, the short-way-home ending."],
  ["6 · People who have paddled it", "Play the slice with Boundary Waters paddlers. Then replace condensed rod counts, especially Swamp-to-Saganaga, with surveyed portages. Until that pass, the game is a design, not a guidebook."],
];

export default function EnginePage() {
  return (
    <article className="max-w-3xl space-y-12">
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">The build</p>
        <h1 className="font-display text-5xl tracking-tight">A chain of lakes, not a continent</h1>
        <p className="text-lg text-muted-foreground">
          The Boundary Waters is about a million acres and more than a thousand lakes. The game is
          the Ely-side chain a paddler can actually learn: Moose to Knife, Knife to the border,
          the border to Sea Gull. Water has to be the best-looking thing on screen. The survival
          model has to stay as legible as a sore shoulder.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">Engine</h2>
        <p className="text-muted-foreground">
          Unreal Engine 5 is the shipping target. The Water system, Lumen at a dusk camp, World
          Partition for the active lake, and MetaSounds for a bug bed that changes with wind are
          the reasons. A team that cannot staff that stack should ship the same design in Unity
          with a dedicated water renderer, and should cut lakes before they cut the body model.
        </p>
        <p className="text-muted-foreground">
          This site is the design and the executable spec for energy, health, and luck. It is not
          a prototype of the 3D canoe. The first in-engine slice is Birch Lake, one trail, one
          grate.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">World data</h2>
        <p className="text-muted-foreground">
          Lakes, portages, and campsites are a graph. Each lake is an authored basin: shoreline
          spline, a little bathymetry so leeches have shallows, a wind-fetch axis, a fish table,
          and a handful of legal campsites with breeze, landing, and an approach a bear can use.
          Each portage is a spline with rod length, elevation, footing samples, mud, and brush.
          The spreadsheet of rods is the source of truth. The same numbers feed this manual and
          the game.
        </p>
        <pre className="overflow-x-auto rounded-xl bg-card p-4 font-mono text-xs leading-relaxed ring-1 ring-foreground/10">{`Lake     { id, shoreline, camps[], portages[], fetch, fish, shallows }
Portage  { id, from, to, rods, footing[], mud, brush }
Campsite { id, breeze, pads, grate, landing, cover }`}</pre>
        <p className="text-muted-foreground">
          Stream the current lake and the mouths of its portages. Do not stream the Gunflint while
          the player is still on Birch.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">The canoe, and the kayak variant</h2>
        <p className="text-muted-foreground">
          Seventeen feet of kevlar, about 17 kg empty, cargo on top of that. A stroke applies
          force off the centerline. The J-stroke and switching sides are the skill that keeps you
          off the rocks. Four buoyancy samples along the hull. In expanded time, a capsize is two
          samples under on the same side and a missed brace. Wind pushes the hull and the bow.
          In compressed time, the same chance is rolled by the body model you can already paddle
          on this site.
        </p>
        <p className="text-muted-foreground">
          A sea kayak is the variant for big water: lower capsize odds, a spray skirt, worse
          fishing, and a miserable portage because there is no yoke and the boat is heavier. It
          is the wrong default craft for a route made of trails. It is the interesting one on
          day 11 of 14, which is the point of having chosen it ten days earlier.
        </p>
        <p className="text-muted-foreground">
          Two-player co-op is bow and stern, separate bodies, one cargo pile. The best shared
          verb is “I’ll take the canoe.” Drop-in tandem can wait until a solo portage feels right.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">What the player sees</h2>
        <p className="text-muted-foreground">
          The map is a Fisher-style sheet you unfold, with campsites and rod counts, plus a
          pattern in the portage dashes so the rust color is not the only signal. The notebook
          is the save file and the stat screen. Bars stay in the notebook. On the water you get
          breath, stroke rhythm, the sound of flies, and the weight on your neck. Odds visible
          in this manual are a design tool. In the game they live in the body.
        </p>
        <p className="text-muted-foreground">
          Art direction is stylized naturalism: readable silhouettes of white pine and granite,
          tea-colored shallows, dark centers, a red tip on the paddle blade so the canoe reads
          at a distance. Firewatch for color and clarity. The Long Dark for the idea that the
          systems are the story. Not a horror grade on the wolves.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">People, rules, and the place</h2>
        <p className="text-muted-foreground">
          This country is inside the 1854 Ceded Territory, homeland of Ojibwe people. Place-name
          lock waits on paid consultation. The game does not invent spirits, empty the landscape,
          or turn Dorothy Molter’s island on Knife Lake into a shop. She lived on Isle of Pines.
          A marker can say so. The cabin that was moved to Ely is a museum trip, not a level.
        </p>
        <p className="text-muted-foreground">
          Rules worth simulating because paddlers actually live with them: designated sites only,
          a grate if you want a fire, fire bans when they are called, no cans or glass bottles,
          group size capped, a permit to enter in quota season. Fishing in the game is dinner,
          not a cooler. The filter is the legal and the practical way to drink the lake.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">Access</h2>
        <p className="text-muted-foreground">
          Portages can be resolved from the body model with no balance prompts. Bug audio has its
          own slider. Wave height has its own slider. The map does not rely on color alone. The
          14-day fantasy has to be playable by someone who wants the route and the weather and
          does not want a quick-time fall.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl">Game plan</h2>
        <ol className="space-y-4">
          {milestones.map(([title, text]) => (
            <li key={title} className="border-t border-border pt-4">
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl">The risks that actually matter</h2>
        <p className="text-muted-foreground">
          Portage boredom is the project-killer. Compression is the mitigation, and it has to be
          in the vertical slice, not promised for the 14-day. Bug audio that punishes the player
          instead of the character will get turned off and will take the whole survival read with
          it. A combat wolf would be a faster way to be wrong about the place. Building all five
          trip lengths before Birch feels like a real evening is how the scope eats the canoe.
        </p>
      </section>
    </article>
  );
}
