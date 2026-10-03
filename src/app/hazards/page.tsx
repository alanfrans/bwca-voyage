const hazards = [
  {
    name: "Mosquitoes",
    when: "Dusk, dawn, still air, after rain. Portages and bay camps.",
    does: "A steady drain on energy, sleep, and morale. A headnet and a breezy point cut the tax. They are not a health crisis unless you give them the night.",
    design: "The audio bed ducks when the headnet goes on. The player is rewarded for preparation. The character is annoyed. The player’s ears are not the punishment.",
  },
  {
    name: "Black flies",
    when: "Late May and June, in daylight, into collars and cuffs. Worse on portages than on open water.",
    does: "A sharper morale and energy tax than mosquitoes, concentrated on the trails where your hands are full.",
    design: "May is a different game than September. People who want solitude and trout accept the flies. People who want quiet skin come later and accept the cold.",
  },
  {
    name: "Deer flies and horse flies",
    when: "Hot, still July afternoons on open water. They circle the canoe.",
    does: "Bites on wrists and necks. A small health nick, a larger patience nick. They make a cruise paddle less restful if you are uncovered.",
    design: "Waving one off can be a single input in expanded time. It never becomes a swarm minigame.",
  },
  {
    name: "Leeches",
    when: "Mucky landings, swamp portages, warm shallows, the swim you take because the day was beautiful.",
    does: "Disgust, a small health cost if removed, an infection cost if you sleep with it on.",
    design: "The nightly body check clears leeches and ticks together. Skipping the check is the mistake, not the swim.",
  },
  {
    name: "Ticks",
    when: "Brushy portages and tall grass at landings. Wood ticks are the common annoyance. Deer ticks are the delayed one.",
    does: "You do not feel the bite. A tick found the same evening is a notebook line. A deer tick still attached the next day starts a fever that arrives on a travel day, not on the day you were careless.",
    design: "Delayed consequences are the point. The 10-day route is where a missed check on day 4 becomes a health problem on day 8, which is already the hard walk west.",
  },
  {
    name: "The portage itself",
    when: "Every time the water stops.",
    does: "Energy, health, and strain, scaled by rods, footing, mud, load, and how you carry. A fall soaks gear, spills food, and can end the heroic version of the afternoon.",
    design: "The canoe on your shoulders blocks the view of your feet. That is the fantasy and the risk. Balance inputs exist only on bad footing, and a ‘resolve the carry’ mode exists for players who want the trip without the twitch.",
  },
  {
    name: "Cold water and weather",
    when: "Wind on Knife, Saganaga, Sea Gull, and any lake with fetch. Thunderstorms. September mornings.",
    does: "A dump costs health, warmth, and sometimes food. A storm on a point camp finds the tent. Lightning means get off the water. That is a win, not a delay you are graded against.",
    design: "Waiting an hour is a first-class verb. On the 14-day route it is sometimes the whole day, and the day still counts as played well.",
  },
  {
    name: "Black bears",
    when: "Camp, especially tired camps, lazy hangs, and food in the tent. September, when they are eating toward winter.",
    does: "They want the food. A good hang or a canister makes a raid rare. A lazy hang makes it ordinary. Food in the tent makes it likely, and it is the case where you can actually be hurt.",
    design: "The bear is a smell gradient and a camp-geometry problem. It is not a boss. Losing kilograms of food on day 9 of 14 is the severe outcome. Injury is the rare one you stored in the vestibule.",
  },
  {
    name: "Wolves",
    when: "Remote nights. More likely on the border-country half of the 14-day than on Moose Lake.",
    does: "A howl, sometimes an answer. Morale moves. You are not being hunted.",
    design: "There is no wolf combat, no stealth takedown, no ‘defend the camp’ meter. A distant sighting resolves if you do not approach and do not leave food out. A wolf encounter that becomes a fight would be a design failure in this country.",
  },
  {
    name: "Moose",
    when: "Shallow bays, portage ponds, narrows like Ottertrack. Cows with calves especially.",
    does: "They block the route. They are more dangerous to a paddler than a wolf. Waiting costs time and gives you the channel back. Pushing past can cost health.",
    design: "The animal keeps its size. You do not get a prompt to scare it off.",
  },
  {
    name: "Giardia and the filter",
    when: "Any lake, the moment you drink it straight.",
    does: "Nothing tonight. Cramps on a later morning, aimed at a day you needed your energy.",
    design: "Same delayed-clock idea as the tick. The filter is slow, boring, and correct, which is why the game has to make the skip tempting.",
  },
];

export default function HazardsPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">Hazards</p>
        <h1 className="font-display text-5xl tracking-tight">What the country charges</h1>
        <p className="text-lg text-muted-foreground">
          Nothing here is a monster roster. The constant costs are small and daily. The rare costs
          are legible: you can see the bad hang, the whitecaps, the moose in the channel, before
          they become a number.
        </p>
      </header>
      <div className="grid gap-4">
        {hazards.map((hazard) => (
          <article
            key={hazard.name}
            className="grid gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10 md:grid-cols-[200px_1fr]"
          >
            <h2 className="font-display text-2xl">{hazard.name}</h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                <span className="text-primary">When. </span>
                <span className="text-muted-foreground">{hazard.when}</span>
              </p>
              <p>
                <span className="text-primary">On the body. </span>
                <span className="text-muted-foreground">{hazard.does}</span>
              </p>
              <p>
                <span className="text-primary">In the game. </span>
                <span className="text-muted-foreground">{hazard.design}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
