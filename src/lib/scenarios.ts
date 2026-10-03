import { freshBody, type Body, type Season } from "./model";

export type PaddleSeg = {
  kind: "paddle";
  id: string;
  name: string;
  detail: string;
  km: number;
  exposure: "open" | "sheltered";
  wind: 0 | 1 | 2 | 3;
  fish: number;
};

export type PortageSeg = {
  kind: "portage";
  id: string;
  name: string;
  detail: string;
  rods: number;
  footing: 1 | 2 | 3;
  mud: boolean;
  brush: boolean;
};

export type EncounterSeg = {
  kind: "encounter";
  id: string;
  name: string;
  detail: string;
  options: {
    id: string;
    label: string;
    detail: string;
    energy: number;
    health: number;
    morale: number;
    strain: number;
    minutes: number;
    foodKg: number;
    wet: number;
    warmth: number;
    note: string;
    fishMeals?: number;
    hoursSinceMeal?: number;
    injuryChance?: number;
    planHang?: boolean;
  }[];
};

export type Segment = PaddleSeg | PortageSeg | EncounterSeg;

export type Scenario = {
  id: string;
  journeySlug: string;
  dayLabel: string;
  title: string;
  setup: string;
  season: Season;
  remote: boolean;
  storm: boolean;
  start: Body;
  segments: Segment[];
};

export const scenarios: Scenario[] = [
  {
    id: "first-permit",
    journeySlug: "first-permit",
    dayLabel: "Day 1 of 3",
    title: "Thirty rods",
    setup:
      "Morning at the Moose Lake landing. The permit is in the dry bag. Breakfast was oatmeal. Found Lake is one short portage and one campsite away.",
    season: "september",
    remote: false,
    storm: false,
    start: freshBody({
      energy: 92,
      health: 100,
      strain: 4,
      morale: 76,
      foodKg: 2.6,
      hoursSinceMeal: 1,
    }),
    segments: [
      {
        kind: "paddle",
        id: "moose",
        name: "Moose Lake to Newfound",
        detail:
          "Wide water, a few wakes from tow boats, then quieter narrows. Sheltered enough to practice the cruise stroke.",
        km: 6,
        exposure: "sheltered",
        wind: 1,
        fish: 0.2,
      },
      {
        kind: "paddle",
        id: "newfound",
        name: "Along Newfound",
        detail: "Find the Found Lake portage before you find someone’s dock story. There is time to fish a weed edge.",
        km: 3,
        exposure: "sheltered",
        wind: 0,
        fish: 0.45,
      },
      {
        kind: "portage",
        id: "found",
        name: "Into Found Lake",
        detail: "Thirty rods. A rise in the middle. Brush on both sides. Your first real carry.",
        rods: 30,
        footing: 1,
        mud: false,
        brush: true,
      },
      {
        kind: "encounter",
        id: "site",
        name: "The only site",
        detail: "You beach at Found. One designated site, empty, with a red squirrel who has opinions.",
        options: [
          {
            id: "claim",
            label: "Claim it and start camp",
            detail: "Daylight left for a hang you will not rush.",
            energy: -2,
            health: 0,
            morale: 6,
            strain: 0,
            minutes: 15,
            foodKg: 0,
            wet: 0,
            warmth: 0,
            note: "The site is yours. You start water and wood while you can still see the knots.",
          },
          {
            id: "look",
            label: "Paddle the shore for a better landing",
            detail: "There is not another legal site.",
            energy: -6,
            health: 0,
            morale: -3,
            strain: 1,
            minutes: 40,
            foodKg: 0,
            wet: 0,
            warmth: 0,
            note: "You toured the shoreline and came back to the same grate. The squirrel looks unsurprised.",
          },
        ],
      },
    ],
  },
  {
    id: "knife-day",
    journeySlug: "tow-to-knife",
    dayLabel: "Day 2 of 5",
    title: "The stairs into Knife",
    setup:
      "You slept on Birch. The tow was yesterday. Today is a stack of short portages and then Knife Lake, which is already pushing a west wind around the points.",
    season: "july",
    remote: false,
    storm: false,
    start: freshBody({
      energy: 74,
      health: 94,
      strain: 22,
      morale: 70,
      foodKg: 3.6,
      warmth: 78,
      hoursSinceMeal: 1.2,
    }),
    segments: [
      {
        kind: "portage",
        id: "birch-out",
        name: "Off Birch",
        detail: "A maintained trail. Forty-five rods. The pack is still honest.",
        rods: 45,
        footing: 1,
        mud: false,
        brush: false,
      },
      {
        kind: "paddle",
        id: "carp",
        name: "Across Carp",
        detail: "Open enough for the wind to find the bow. Deer-fly water if you are not covered.",
        km: 4,
        exposure: "open",
        wind: 2,
        fish: 0.25,
      },
      {
        kind: "portage",
        id: "stairs",
        name: "The stairs toward Knife",
        detail: "Several short trails played as one 90-rod effort. Roots, a little brush, repetition.",
        rods: 90,
        footing: 2,
        mud: false,
        brush: true,
      },
      {
        kind: "portage",
        id: "big-knife",
        name: "Big Knife portage",
        detail: "The last carry before the lake you came for. Forty rods. People are usually on it.",
        rods: 40,
        footing: 2,
        mud: false,
        brush: false,
      },
      {
        kind: "paddle",
        id: "knife",
        name: "West end of Knife",
        detail:
          "Isle of Pines sits out there. Dorothy Molter lived on it. You are looking for a campsite, not a souvenir.",
        km: 5,
        exposure: "open",
        wind: 2,
        fish: 0.55,
      },
      {
        kind: "encounter",
        id: "taken",
        name: "The site you wanted",
        detail: "A group of nine is loading their canoe off the point you had circled on the map.",
        options: [
          {
            id: "wait",
            label: "Wait for them to clear",
            detail: "Twenty minutes, a landing, and no extra miles.",
            energy: 2,
            health: 0,
            morale: 3,
            strain: 0,
            minutes: 25,
            foodKg: -0.05,
            wet: 0,
            warmth: 0,
            note: "You drifted in the lee and ate a handful of gorp. They left the grate clean.",
          },
          {
            id: "next",
            label: "Push on to the next site",
            detail: "Another hour into the wind.",
            energy: -8,
            health: -1,
            morale: -2,
            strain: 2,
            minutes: 55,
            foodKg: 0,
            wet: 4,
            warmth: -2,
            note: "The next site was empty and farther. You made it. Your shoulders filed a complaint.",
          },
        ],
      },
    ],
  },
  {
    id: "vera-door",
    journeySlug: "vera-door",
    dayLabel: "Day 6 of 7",
    title: "The Vera door",
    setup:
      "South Arm of Knife, morning six. You are tired in the specific way a week makes. The retreat west is still open. This day is the other door: Vera, then Ensign, then home by a harder trail.",
    season: "july",
    remote: false,
    storm: true,
    start: freshBody({
      energy: 56,
      health: 82,
      strain: 48,
      morale: 64,
      foodKg: 2.1,
      warmth: 70,
      wet: 8,
      hoursSinceMeal: 1,
      fishMeals: 1,
    }),
    segments: [
      {
        kind: "paddle",
        id: "arm",
        name: "Off the South Arm",
        detail: "Open water to the Vera portage. A wind is already combing the arm.",
        km: 4,
        exposure: "open",
        wind: 2,
        fish: 0.2,
      },
      {
        kind: "portage",
        id: "vera-1",
        name: "The long Vera carry",
        detail: "Footing that paddlers mention by name. Mud in the lows. Brush in the cuts. One hundred twenty rods.",
        rods: 120,
        footing: 3,
        mud: true,
        brush: true,
      },
      {
        kind: "portage",
        id: "vera-2",
        name: "The second trail",
        detail: "Seventy more rods before the shore you want. Your knees have started billing you twice.",
        rods: 70,
        footing: 3,
        mud: false,
        brush: true,
      },
      {
        kind: "encounter",
        id: "rain",
        name: "Rain on the landing",
        detail: "It opens as you set the canoe down. Ensign is still a paddle away.",
        options: [
          {
            id: "tarp",
            label: "Pitch the tarp and wait",
            detail: "Lose an hour. Keep the bag dry.",
            energy: 4,
            health: 0,
            morale: 2,
            strain: -1,
            minutes: 60,
            foodKg: -0.1,
            wet: 4,
            warmth: 2,
            note: "You waited the cell out under the tarp. The sleeping bag stayed a sleeping bag.",
          },
          {
            id: "push-rain",
            label: "Push for Ensign in the rain",
            detail: "Faster to camp. Wetter to live with.",
            energy: -7,
            health: -2,
            morale: -4,
            strain: 2,
            minutes: 35,
            foodKg: 0,
            wet: 22,
            warmth: -8,
            note: "You paddled the rain. Camp will be a negotiation with everything that got wet.",
          },
        ],
      },
    ],
  },
  {
    id: "turnaround",
    journeySlug: "ottertrack",
    dayLabel: "Day 8 of 10",
    title: "Same trail, lighter pack",
    setup:
      "Swamp Lake is behind you. The food bag is lighter than it was on day 1 and your knees do not care. Ottertrack is the way west. Yesterday’s moose may still like the narrows.",
    season: "september",
    remote: true,
    storm: false,
    start: freshBody({
      energy: 51,
      health: 78,
      strain: 62,
      morale: 66,
      foodKg: 1.7,
      warmth: 68,
      wet: 6,
      hoursSinceMeal: 11,
      fishMeals: 0,
      deerTickHours: 6,
    }),
    segments: [
      {
        kind: "encounter",
        id: "breakfast",
        name: "Food audit",
        detail: "Cold camp. Two travel days and a buffer still on the permit in your head. The bag can do a real breakfast or a handful of gorp.",
        options: [
          {
            id: "real",
            label: "Cook a real breakfast",
            detail: "Spend food. Buy a morning.",
            energy: 14,
            health: 1,
            morale: 4,
            strain: 0,
            minutes: 40,
            foodKg: -0.45,
            wet: 0,
            warmth: 3,
            hoursSinceMeal: 0,
            note: "Oats, coffee, and an honest count of what is left. The day looks shorter, which is the idea.",
          },
          {
            id: "gorp",
            label: "Gorp, and go",
            detail: "Save the bag. Start hungry-adjacent.",
            energy: 5,
            health: 0,
            morale: -2,
            strain: 0,
            minutes: 12,
            foodKg: -0.2,
            wet: 0,
            warmth: 0,
            hoursSinceMeal: 2,
            note: "You ate standing up. The trail will collect the difference.",
          },
        ],
      },
      {
        kind: "portage",
        id: "mud-carry",
        name: "The muddy carry",
        detail: "Eighty rods you walked east a few days ago. Less weight. More strain. Mud at the landing.",
        rods: 80,
        footing: 2,
        mud: true,
        brush: true,
      },
      {
        kind: "paddle",
        id: "otter",
        name: "Ottertrack narrows",
        detail: "Sheltered water. A good place to cruise, or to fish if the morning was thin.",
        km: 5,
        exposure: "sheltered",
        wind: 1,
        fish: 0.7,
      },
      {
        kind: "encounter",
        id: "moose",
        name: "Moose in the channel",
        detail: "A cow stands in the shallows where the lake pinches. The calf is a darker shape against the cedars. The portage forward is behind them.",
        options: [
          {
            id: "wait",
            label: "Hold the canoe and wait",
            detail: "They leave, or they don’t, on their clock.",
            energy: 3,
            health: 0,
            morale: 8,
            strain: 0,
            minutes: 35,
            foodKg: 0,
            wet: 0,
            warmth: 0,
            note: "You waited. She fed. The calf crossed. The channel opened like a courtesy, which it was not.",
          },
          {
            id: "slip",
            label: "Slip past along the rock",
            detail: "Short. Stupid if she disagrees.",
            energy: -4,
            health: 0,
            morale: -4,
            strain: 1,
            minutes: 10,
            foodKg: 0,
            wet: 0,
            warmth: 0,
            injuryChance: 0.28,
            note: "You tried to be small. Moose do not grade on effort.",
          },
        ],
      },
    ],
  },
  {
    id: "sag-wind",
    journeySlug: "border-route",
    dayLabel: "Day 11 of 14",
    title: "Saganaga",
    setup:
      "Day eleven. The shuttle at Sea Gull is real and so is the whitecap field between you and the next portage. You are remote, a little wet from yesterday, and done being impressed by your own itinerary.",
    season: "september",
    remote: true,
    storm: false,
    start: freshBody({
      energy: 47,
      health: 74,
      strain: 68,
      morale: 61,
      foodKg: 2.4,
      warmth: 60,
      wet: 18,
      hoursSinceMeal: 2,
      fishMeals: 1,
    }),
    segments: [
      {
        kind: "paddle",
        id: "sag",
        name: "The Sag crossing",
        detail:
          "Seven kilometers of open border lake. Wind is already a 3. Waiting an hour may drop it. Pushing it is how canoes become swimming stories.",
        km: 7,
        exposure: "open",
        wind: 3,
        fish: 0.15,
      },
      {
        kind: "portage",
        id: "granite",
        name: "Granite toward Sea Gull",
        detail: "Sixty rods of slab and root. The canoe rings when you set it down. No mud. Plenty of ways to twist an ankle.",
        rods: 60,
        footing: 2,
        mud: false,
        brush: false,
      },
      {
        kind: "encounter",
        id: "sign",
        name: "Bear sign at the landing",
        detail: "Old scat and a chewed paddle someone left under a cedar. Not a bear. A reminder with a schedule.",
        options: [
          {
            id: "plan",
            label: "Plan the hang before you unpack the tent",
            detail: "Cook, eat, and hang while the geometry is still a decision.",
            energy: -2,
            health: 0,
            morale: 3,
            strain: 0,
            minutes: 10,
            foodKg: 0,
            wet: 0,
            warmth: 0,
            planHang: true,
            note: "You picked the tree before you picked the tent pad. That order is the whole trick.",
          },
          {
            id: "later",
            label: "Deal with it after camp is up",
            detail: "Reasonable, until dark and fatigue rewrite it.",
            energy: 0,
            health: 0,
            morale: -1,
            strain: 0,
            minutes: 0,
            foodKg: 0,
            wet: 0,
            warmth: 0,
            note: "You noted the scat and went about the pleasant chores first.",
          },
        ],
      },
    ],
  },
];

export function getScenario(id: string | undefined) {
  return scenarios.find((s) => s.id === id) ?? scenarios[0];
}
