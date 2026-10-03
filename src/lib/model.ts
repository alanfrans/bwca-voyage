/**
 * Executable spec for Canoe Country's body model.
 * The day simulator and the body lab both call this file.
 * Distances are design values grounded in Ely-side BWCA travel, not a Fisher map.
 */

export type Season = "may" | "july" | "september";
export type Craft = "canoe" | "kayak";
export type Carry = "careful" | "hustle" | "double";
export type Pace = "cruise" | "push" | "fish";
export type Exposure = "open" | "sheltered";
export type Footing = 1 | 2 | 3;
export type Site = "point" | "bay";
export type Meal = "fish" | "freeze-dry" | "gorp" | "none";
export type Hang = "good" | "lazy" | "canister" | "tent";

export interface Body {
  energy: number;
  health: number;
  strain: number;
  warmth: number;
  morale: number;
  foodKg: number;
  wet: number;
  hoursSinceMeal: number;
  fishMeals: number;
  deerTickHours: number;
  leech: boolean;
  giardia: boolean;
}

export interface Effect {
  energy: number;
  health: number;
  strain: number;
  warmth: number;
  morale: number;
  foodKg: number;
  wet: number;
  minutes: number;
  notes: string[];
  fell?: boolean;
  capsized?: boolean;
  tick?: boolean;
  leech?: boolean;
  bear?: boolean;
  injured?: boolean;
  fishMeals?: number;
  hoursSinceMeal?: number;
  clearTick?: boolean;
  clearLeech?: boolean;
  setGiardia?: boolean;
}

export function freshBody(over: Partial<Body> = {}): Body {
  return {
    energy: 90,
    health: 100,
    strain: 6,
    warmth: 82,
    morale: 74,
    foodKg: 4,
    wet: 0,
    hoursSinceMeal: 1,
    fishMeals: 0,
    deerTickHours: 0,
    leech: false,
    giardia: false,
    ...over,
  };
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function applyEffect(body: Body, effect: Effect): Body {
  const tickHours = effect.clearTick
    ? 0
    : body.deerTickHours + (effect.tick ? 1 : 0);
  return {
    energy: clamp(body.energy + effect.energy),
    health: clamp(body.health + effect.health),
    strain: clamp(body.strain + effect.strain),
    warmth: clamp(body.warmth + effect.warmth),
    morale: clamp(body.morale + effect.morale),
    foodKg: Math.max(0, +(body.foodKg + effect.foodKg).toFixed(2)),
    wet: clamp(body.wet + effect.wet),
    hoursSinceMeal:
      effect.hoursSinceMeal ??
      +(body.hoursSinceMeal + effect.minutes / 60).toFixed(2),
    fishMeals: Math.max(0, body.fishMeals + (effect.fishMeals ?? 0)),
    deerTickHours: tickHours,
    leech: effect.clearLeech ? false : body.leech || Boolean(effect.leech),
    giardia: body.giardia || Boolean(effect.setGiardia),
  };
}

export function roll(seed: number, step: number) {
  let a = (seed + step * 0x9e3779b9) >>> 0;
  a = Math.imul(a ^ (a >>> 16), 0x7feb352d);
  a = Math.imul(a ^ (a >>> 15), 0x846ca68b);
  a = (a ^ (a >>> 16)) >>> 0;
  return a / 4294967296;
}

const FOOTING: Record<Footing, number> = { 1: 1, 2: 1.4, 3: 1.9 };

export interface PortageInput {
  rods: number;
  footing: Footing;
  mud: boolean;
  brush: boolean;
  carry: Carry;
  craft: Craft;
  energy: number;
  strain: number;
  season: Season;
  headnet: boolean;
}

export interface PortagePreview {
  energy: number;
  health: number;
  strain: number;
  morale: number;
  minutes: number;
  fall: number;
  tick: number;
  leech: number;
}

/** Expected costs. A fall, a tick, or a leech is extra and rolled in applyPortage. */
export function previewPortage(p: PortageInput): PortagePreview {
  const foot = FOOTING[p.footing] * (p.mud ? 1.25 : 1);
  // A sea kayak has no yoke and outweighs a kevlar canoe. Fewer trips, worse trips.
  const craftCarry = p.craft === "kayak" ? 2.05 : 1;
  const strainMod = 1 + p.strain / 140;

  let loadedRods: number;
  let emptyRods: number;
  let minutes: number;
  if (p.carry === "double") {
    loadedRods = p.rods;
    emptyRods = 0;
    minutes = p.rods * 0.42 * (p.mud ? 1.15 : 1);
  } else if (p.craft === "kayak") {
    loadedRods = p.rods * 2;
    emptyRods = p.rods;
    minutes =
      p.rods * (p.carry === "hustle" ? 0.7 : 0.95) * (p.mud ? 1.15 : 1);
  } else if (p.carry === "hustle") {
    loadedRods = p.rods * 3;
    emptyRods = p.rods * 2;
    minutes = p.rods * 0.62 * (p.mud ? 1.15 : 1);
  } else {
    loadedRods = p.rods * 3;
    emptyRods = p.rods * 2;
    minutes = p.rods * 0.85 * (p.mud ? 1.15 : 1);
  }

  const carryMul =
    p.carry === "double" ? 2.6 : p.carry === "hustle" ? 1.2 : 1;
  const energy =
    (loadedRods / 10) * 1.05 * foot * strainMod * craftCarry * carryMul +
    (emptyRods / 10) * 0.22 * foot;

  const bugPerMin =
    p.season === "may" ? 0.09 : p.season === "july" ? 0.055 : 0.012;
  const bug = (p.headnet ? 0.35 : 1) * bugPerMin * minutes;

  let health =
    (loadedRods / 10) *
    0.07 *
    (p.footing === 3 ? 1.35 : 1) *
    (0.35 + p.strain / 100);
  if (p.carry === "double") health += 1.4;
  if (p.energy - energy < 25) health += 1.4;
  if (p.energy - energy < 10) health += 2;

  const strain =
    (loadedRods / 90) *
    2.4 *
    craftCarry *
    (p.carry === "hustle" ? 1.3 : p.carry === "double" ? 1.7 : 1);

  let fall = 0.012 * (p.rods / 40) * foot;
  if (p.carry === "double") fall += 0.14;
  if (p.carry === "hustle") fall += 0.03;
  if (p.mud) fall += 0.04;
  if (p.craft === "kayak") fall += 0.035;
  if (p.energy - energy < 35) fall += 0.06;
  if (p.energy - energy < 15) fall += 0.08;
  fall = Math.min(0.75, fall);

  const tick = p.brush ? (p.season === "september" ? 0.1 : 0.22) : 0.03;
  const leech = p.mud ? 0.45 : 0.04;

  return {
    energy: energy + bug,
    health,
    strain,
    morale: -(bug * 0.45),
    minutes,
    fall,
    tick,
    leech,
  };
}

export function applyPortage(
  body: Body,
  p: Omit<PortageInput, "energy" | "strain">,
  seed: number,
  step: number,
): { effect: Effect; step: number } {
  const preview = previewPortage({
    ...p,
    energy: body.energy,
    strain: body.strain,
  });
  const fallRoll = roll(seed, step);
  const tickRoll = roll(seed, step + 1);
  const leechRoll = roll(seed, step + 2);
  const fell = fallRoll < preview.fall;
  const tick = tickRoll < preview.tick;
  const leech = leechRoll < preview.leech;

  const notes = [
    describeCarry(p.carry, p.craft, p.rods),
  ];
  let energy = -preview.energy;
  let health = -preview.health;
  let strain = preview.strain;
  let wet = p.mud ? 8 : 0;
  const morale = preview.morale;

  if (fell) {
    const severity = roll(seed, step + 3);
    const healthLoss = 8 + severity * 12;
    energy -= 10;
    health -= healthLoss;
    strain += 8;
    wet += 28;
    notes.push(
      severity > 0.66
        ? "You went down hard. The canoe rang on granite and the sleeping bag drank from a puddle."
        : "A root caught your boot. You caught the canoe with a shoulder it will remember.",
    );
  }
  if (tick) {
    notes.push(
      "Something small is already walking the warm edge of your belt line. You will not feel the bite.",
    );
  }
  if (leech) {
    notes.push(
      "A leech found the cut on your ankle where you stepped into the muck to float the bow.",
    );
  }
  if (!fell && !tick && !leech) {
    notes.push("The trail took what it always takes, and nothing extra.");
  }

  return {
    step: step + 4,
    effect: {
      energy,
      health,
      strain,
      warmth: wet > 20 ? -6 : -2,
      morale,
      foodKg: fell && roll(seed, step + 3) > 0.5 ? -0.3 : 0,
      wet,
      minutes: preview.minutes,
      notes,
      fell,
      tick,
      leech,
    },
  };
}

function describeCarry(carry: Carry, craft: Craft, rods: number) {
  if (carry === "double") {
    return `Double carry, ${rods} rods. One pass with the ${craft} and a pack, because the light is going.`;
  }
  if (craft === "kayak") {
    return carry === "hustle"
      ? `You hugged the kayak across ${rods} rods and hustled back for the hatch bag.`
      : `Kayak across ${rods} rods, then back for the bag. There is no yoke. Your arms know it.`;
  }
  if (carry === "hustle") {
    return `Three loaded crossings of ${rods} rods, walked fast. The canoe blocked the roots.`;
  }
  return `Careful solo carry. ${rods} rods on the map, five crossings on the trail: canoe, back, pack, back, pack.`;
}

export interface PaddleInput {
  km: number;
  wind: 0 | 1 | 2 | 3;
  exposure: Exposure;
  pace: Pace;
  craft: Craft;
  energy: number;
  fed: boolean;
  season: Season;
  fish: number;
  headnet: boolean;
}

export interface PaddlePreview {
  energy: number;
  health: number;
  morale: number;
  minutes: number;
  capsize: number;
  fishChance: number;
  wet: number;
}

export function windFelt(wind: 0 | 1 | 2 | 3, exposure: Exposure) {
  if (exposure === "sheltered") return Math.max(0, wind - 1) as 0 | 1 | 2 | 3;
  return wind;
}

export function previewPaddle(p: PaddleInput): PaddlePreview {
  const wind = windFelt(p.wind, p.exposure);
  const kayak = p.craft === "kayak";

  if (p.pace === "fish") {
    const fishChance = Math.min(
      0.85,
      p.fish * (wind >= 3 ? 0.25 : wind === 2 ? 0.6 : 1),
    );
    return {
      energy: wind >= 2 ? 3 : 9,
      health: 0.4,
      morale: wind >= 3 ? -2 : 7,
      minutes: 75,
      capsize: wind >= 3 && p.exposure === "open" ? (kayak ? 0.03 : 0.07) : 0,
      fishChance,
      wet: 0,
    };
  }

  let perKm: number;
  if (p.pace === "cruise") {
    if (wind >= 2 && p.exposure === "open") {
      perKm = -1.05 * (wind / 2);
    } else {
      perKm = 0.55 - wind * 0.85;
      if (!p.fed) perKm -= 0.35;
    }
  } else {
    perKm = -1.15 * (1 + wind * 0.4);
    if (p.exposure === "sheltered") perKm *= 0.75;
    if (kayak) perKm *= 0.82;
  }

  const bug =
    p.season === "july" && p.exposure === "open" && !p.headnet ? 0.35 * p.km : 0;

  let capsize = 0;
  if (p.exposure === "open" && wind >= 2 && p.pace === "push") {
    capsize = 0.045 * wind * (kayak ? 0.4 : 1) * (p.energy < 30 ? 1.8 : 1);
  } else if (p.exposure === "open" && wind >= 3 && p.pace === "cruise") {
    capsize = kayak ? 0.03 : 0.06;
  }

  const speed = p.pace === "push" ? 4.6 : 3.6;
  const minutes = (p.km / speed) * 60 * (1 + wind * 0.18);

  return {
    energy: perKm * p.km - bug,
    health: p.pace === "push" && p.energy < 30 ? -0.8 : 0.15,
    morale:
      (p.pace === "cruise" && wind === 0 ? 1.2 : 0) -
      (p.season === "july" && p.exposure === "open" ? 1.5 : 0) +
      (kayak && wind >= 2 ? 1 : 0),
    minutes,
    capsize: Math.min(0.55, capsize),
    fishChance: 0,
    wet: wind >= 2 && p.exposure === "open" ? 6 : 0,
  };
}

export function applyPaddle(
  body: Body,
  p: Omit<PaddleInput, "energy" | "fed">,
  seed: number,
  step: number,
): { effect: Effect; step: number } {
  const fed = body.hoursSinceMeal <= 5 && body.foodKg > 0;
  const preview = previewPaddle({ ...p, energy: body.energy, fed });
  const capRoll = roll(seed, step);
  const fishRoll = roll(seed, step + 1);
  const capsized = capRoll < preview.capsize;
  const caught = p.pace === "fish" && fishRoll < preview.fishChance;

  const notes: string[] = [];
  if (p.pace === "fish") {
    notes.push(
      caught
        ? "A walleye, legal and decent. Dinner is no longer a theory."
        : preview.fishChance < 0.2
          ? "You fished in a wind that wanted the canoe more than the fish did."
          : "An hour of water and no fish. The hour still fed your shoulders.",
    );
  } else if (preview.energy >= 0) {
    notes.push(
      "Cruise paddle. The stroke is a rest if the wind allows it. Yours did.",
    );
  } else if (p.pace === "push") {
    notes.push("You pushed. The bow slapped and your lower back kept the minutes.");
  } else {
    notes.push("A headwind turned the restful paddle into work.");
  }

  if (p.season === "july" && p.exposure === "open" && !p.headnet && p.pace !== "fish") {
    notes.push("Deer flies found the open water and the bare inch of wrist.");
  }
  if (p.season === "may" && !p.headnet) {
    notes.push("Black flies worked the collar. May is a headnet month.");
  }

  let energy = preview.energy;
  let health = preview.health;
  let morale = preview.morale;
  let wet = preview.wet;
  let warmth = 0;
  let foodKg = 0;

  if (capsized) {
    energy -= 14;
    health -= 12;
    morale -= 10;
    wet += 55;
    warmth -= 22;
    foodKg -= Math.min(body.foodKg, 0.35);
    notes.push(
      "You dumped. The water is tea-colored and colder than the air promised. You bailed, shivered, and counted the dry bags.",
    );
  }

  return {
    step: step + 2,
    effect: {
      energy,
      health,
      strain: p.pace === "push" ? 1.2 : 0.3,
      warmth,
      morale,
      foodKg,
      wet,
      minutes: preview.minutes + (capsized ? 25 : 0),
      notes,
      capsized,
      fishMeals: caught ? 1 : 0,
    },
  };
}

export interface NightInput {
  site: Site;
  meal: Meal;
  hang: Hang;
  tickCheck: boolean;
  headnet: boolean;
  filter: boolean;
  storm: boolean;
  season: Season;
  remote: boolean;
  plannedAhead: boolean;
}

export function applyNight(
  body: Body,
  night: NightInput,
  seed: number,
  step: number,
): { effect: Effect; step: number } {
  const notes: string[] = [];
  let energy = 0;
  let health = 0;
  let morale = 0;
  let foodKg = 0;
  let fishMeals = 0;
  let warmth = 0;
  let wet = 0;
  let hoursSinceMeal: number | undefined;
  let clearTick = false;
  let clearLeech = false;
  let setGiardia = false;
  let bear = false;
  let injured = false;

  if (night.meal === "fish" && body.fishMeals > 0) {
    foodKg -= 0.12;
    fishMeals -= 1;
    energy += 28;
    morale += 8;
    hoursSinceMeal = 0;
    notes.push("Fish, salt, and the last of the butter. Camp got quiet in the good way.");
  } else if (night.meal === "freeze-dry" && body.foodKg >= 0.5) {
    foodKg -= 0.55;
    energy += 20;
    morale += 2;
    hoursSinceMeal = 0;
    notes.push("Freeze-dried chili. Steam on your glasses. Enough.");
  } else if (night.meal === "gorp" && body.foodKg >= 0.2) {
    foodKg -= 0.25;
    energy += 8;
    morale -= 2;
    hoursSinceMeal = 0.4;
    notes.push("Gorp in the vestibule. You called it dinner so the day would end.");
  } else {
    energy -= 4;
    health -= 6;
    morale -= 8;
    notes.push("The food bag had nothing honest left. Sleep will not refill what you didn't eat.");
  }

  let bug = night.season === "may" ? 13 : night.season === "july" ? 10 : 2;
  if (night.site === "point") {
    bug *= 0.4;
    morale += 4;
    notes.push("A point camp. Wind in the pines, fewer mosquitoes, a sky that stays lit.");
  } else {
    bug *= 1.45;
    morale += 1;
    notes.push("A bay camp. Sheltered, and the bugs wrote the shelter into the lease.");
  }
  if (night.headnet) bug *= 0.35;
  else notes.push("You slept without the headnet. The tent mesh did some of the work and not all of it.");

  if (night.storm) {
    warmth -= night.site === "point" ? 16 : 7;
    wet += night.site === "point" ? 18 : 8;
    morale -= 3;
    notes.push(
      night.site === "point"
        ? "The storm walked across the point and found the tent."
        : "Rain in the bay. The tarp held. The point camps did not have this night.",
    );
  }

  if (night.tickCheck) {
    clearTick = body.deerTickHours > 0;
    clearLeech = body.leech;
    if (clearTick) {
      notes.push(
        body.deerTickHours > 18
          ? "You found the tick late. The head came out. Watch the skin for days. In this model the fever is already scheduled lighter, not cancelled."
          : "Tick check. You found it while it was still a small dark asterisk and you got it out.",
      );
      if (body.deerTickHours > 18) health -= 2;
    } else {
      notes.push("Tick check by headlamp. Nothing walking that you could find.");
    }
    if (clearLeech) {
      health -= 0.4;
      notes.push("Salt on the leech, then it let go. A small itch, not an infection.");
    }
    morale += 2;
  } else {
    if (body.leech) {
      health -= 4;
      notes.push("You skipped the body check. The leech stayed the night and the bite went hot.");
    }
    if (body.deerTickHours > 0) {
      notes.push(
        "The tick stayed through the night. Removal tomorrow is late. A fever is now part of the trip.",
      );
      health -= 6;
    } else {
      notes.push("No body check. You were tired, and tired is how a tick gets a day.");
    }
  }

  if (!night.filter && !body.giardia) {
    setGiardia = true;
    notes.push(
      "You drank the lake straight. Giardia does not announce itself tonight. It keeps a calendar.",
    );
  } else if (body.giardia) {
    health -= 8;
    energy -= 10;
    morale -= 6;
    notes.push("The cramps arrived on schedule. The filter you skipped two days ago is the whole story.");
  } else {
    notes.push("Water through the filter. Slow, boring, correct.");
  }

  let bearChance =
    night.hang === "tent"
      ? 0.62
      : night.hang === "lazy"
        ? 0.2
        : night.hang === "canister"
          ? 0.03
          : 0.035;
  if (night.site === "bay") bearChance += 0.02;
  if (night.season === "september") bearChance += 0.03;
  if (night.plannedAhead) bearChance *= 0.7;
  const bearRoll = roll(seed, step);
  if (bearRoll < bearChance) {
    bear = true;
    morale -= 12;
    energy -= 6;
    if (night.hang === "tent" && roll(seed, step + 1) < 0.4) {
      injured = true;
      health -= 18;
      notes.push(
        "The bear came into the vestibule because the food was in the vestibule. You were in the way.",
      );
    } else if (night.hang === "canister") {
      notes.push(
        "A bear rolled the canister into the lake shallows and left, offended. The food is wet and mostly yours.",
      );
      wet += 4;
    } else {
      const lost = Math.min(body.foodKg, Math.max(0.6, body.foodKg * 0.45));
      foodKg -= lost;
      notes.push(
        `A black bear took about ${lost.toFixed(1)} kg of food and did not stay to discuss it. The canoe was never the point.`,
      );
    }
  } else if (night.hang === "tent") {
    notes.push("Food in the tent and you got away with it. That is luck, and luck is a bad hang.");
  } else if (night.hang === "good" || night.hang === "canister") {
    notes.push(
      night.hang === "canister"
        ? "Canister closed, off the ground, away from the tent. The night smelled like pines, not chili."
        : "Hang: high, out from the trunk, and a walk from the tent. You did the boring geometry.",
    );
  } else {
    notes.push("A lazy hang. Low, close to the trunk. Tonight the bear walked a different shore.");
  }

  if (night.remote && roll(seed, step + 2) < 0.22) {
    morale += 3;
    notes.push(
      "Sometime after midnight a wolf howled north of camp, and another answered. You were not being hunted. You were being in a place that still has wolves.",
    );
  } else if (!night.remote && roll(seed, step + 2) < 0.08) {
    notes.push("Loons took the late light apart and put it back together.");
    morale += 3;
  }

  const sleepEnergy = 36 - bug * 0.5 - body.wet * 0.1;
  energy += sleepEnergy;
  warmth += night.storm ? 4 : 12;
  if (!night.storm) wet -= 40;

  const recovered =
    body.warmth + warmth > 50 && body.wet < 35 && night.meal !== "gorp" && night.meal !== "none";
  health += recovered ? 5 : 1;
  const strain = body.energy + energy > 45 ? -12 : -5;

  notes.push(
    recovered
      ? "You woke dry enough to trust the day."
      : "Morning came and the body was only half restored. Today has to be shorter than your pride.",
  );

  return {
    step: step + 3,
    effect: {
      energy,
      health,
      strain,
      warmth,
      morale,
      foodKg,
      wet,
      minutes: 8 * 60,
      notes,
      hoursSinceMeal,
      fishMeals,
      clearTick,
      clearLeech,
      setGiardia,
      bear,
      injured,
    },
  };
}

export function foodForDays(days: number) {
  // Packed kilograms before fishing. Long trips plan on fish replacing dinners.
  if (days <= 3) return 2.6;
  if (days <= 5) return 4.4;
  if (days <= 7) return 6.0;
  if (days <= 10) return 8.2;
  return 9.6;
}

export function formatClock(minsFromMidnight: number) {
  const wrapped = ((Math.round(minsFromMidnight) % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ampm = h < 12 ? "am" : "pm";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
}
