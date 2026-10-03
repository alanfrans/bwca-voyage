# Canoe Country

A technical design and playable day-model for a 3D canoe and kayak game set in the Boundary Waters Canoe Area Wilderness, Minnesota.

You carry a canoe, cook at a fire grate, and manage a body across permits of 3, 5, 7, 10, and 14 days. Energy comes back when you eat, cruise calm water, or fish. Energy and health fall when you portage, get worked over by flies and mosquitoes, fall, dump, or sleep wet and hungry. Bears want the food bag. Wolves are a sound. Moose are the large animal that can hurt you.

This repository is the field manual and the executable spec (`src/lib/model.ts`). The shipping game described in the manual is an Unreal Engine 5 lake-chain, not this website.

## Run the manual

```bash
npm install
npm run dev
```

Open the site and start with **Paddle a day**. The body lab on **The body** uses the same formulas.

```bash
npm test
npm run lint
```

## What is designed

- A day loop from dawn chores to a hang, a tick check, and sleep
- Portage math, including the solo five-crossing carry and the double-carry gamble
- A kevlar canoe as the default craft and a sea kayak as the big-water, bad-portage variant
- Hazards: mosquitoes, black flies, deer flies, leeches, ticks, wind, bears, wolves, moose, giardia
- Five routes that share an Ely-side lake graph from Moose Lake (Entry Point 25) toward Knife, Ottertrack, and, on the 14-day, Sea Gull Lake
- A production sequence that starts with one lake, one portage, and one campsite

Rod counts are design values grounded in published Ely-side travel. They are not a Fisher map, a permit, or a weather forecast. The stretch from Swamp Lake to Saganaga is condensed on purpose and called out as such.

## Stack

Next.js, TypeScript, Tailwind, shadcn/ui.
