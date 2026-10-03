"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { scenarios, type EncounterSeg, type Scenario, type Segment } from "@/lib/scenarios";
import { getJourney } from "@/lib/journeys";
import {
  applyEffect,
  applyNight,
  applyPaddle,
  applyPortage,
  formatClock,
  previewPaddle,
  previewPortage,
  roll,
  type Body,
  type Carry,
  type Craft,
  type Effect,
  type Hang,
  type Meal,
  type Season,
  type Site,
} from "@/lib/model";

type Phase = "travel" | "camp" | "morning" | "evacuated";

type LogLine = { clock: string; text: string };

type RunState = {
  scenario: Scenario;
  body: Body;
  start: Body;
  index: number;
  clock: number;
  step: number;
  seed: number;
  phase: Phase;
  log: LogLine[];
  windRelief: Record<string, number>;
  plannedHang: boolean;
  collapsed: boolean;
  craft: Craft;
  headnet: boolean;
  showOdds: boolean;
  season: Season;
  camp: {
    site: Site;
    meal: Meal;
    hang: Hang;
    tickCheck: boolean;
    filter: boolean;
  };
};

function boot(scenario: Scenario, seed: number): RunState {
  return {
    scenario,
    body: { ...scenario.start },
    start: { ...scenario.start },
    index: 0,
    clock: 7 * 60,
    step: 0,
    seed,
    phase: "travel",
    log: [
      {
        clock: "7:00 am",
        text: scenario.setup,
      },
    ],
    windRelief: {},
    plannedHang: false,
    collapsed: false,
    craft: "canoe",
    headnet: true,
    showOdds: true,
    season: scenario.season,
    camp: {
      site: "point",
      meal: scenario.start.fishMeals > 0 ? "fish" : "freeze-dry",
      hang: "good",
      tickCheck: true,
      filter: true,
    },
  };
}

export function DayRunner({ initialId }: { initialId?: string }) {
  const initial = scenarios.find((s) => s.id === initialId) ?? scenarios[0];
  const [run, setRun] = useState<RunState>(() => boot(initial, 1842));

  const segment = run.scenario.segments[run.index];
  const journey = getJourney(run.scenario.journeySlug);

  function push(next: RunState, effect: Effect, extra?: string) {
    let body = applyEffect(next.body, effect);
    let clock = next.clock + effect.minutes;
    let phase: Phase = next.phase;
    let collapsed = next.collapsed;
    const lines: LogLine[] = effect.notes.map((text) => ({
      clock: formatClock(clock),
      text,
    }));
    if (extra) lines.push({ clock: formatClock(clock), text: extra });

    if (body.energy <= 0 && phase === "travel" && !collapsed) {
      collapsed = true;
      body = { ...body, energy: 16, health: Math.max(0, body.health - 6) };
      clock += 40;
      lines.push({
        clock: formatClock(clock),
        text: "Energy hit the floor. You sat in the moss with the canoe beside you until the ringing eased.",
      });
    }
    if (clock >= 20 * 60 && phase === "travel") {
      body = { ...body, morale: Math.max(0, body.morale - 3), health: Math.max(0, body.health - 1) };
      lines.push({
        clock: formatClock(clock),
        text: "The light is going. Headlamp travel spends health even when the footing is kind.",
      });
    }
    if (body.health <= 0) {
      phase = "evacuated";
      lines.push({
        clock: formatClock(clock),
        text: "Health reached the bottom. The ending is an evacuation, a float plane or a hard assist out. The permit ends here.",
      });
    }
    return {
      ...next,
      body,
      clock,
      phase,
      collapsed,
      log: [...lines.reverse(), ...next.log].slice(0, 40),
    };
  }

  function actPortage(carry: Carry) {
    if (!segment || segment.kind !== "portage") return;
    const result = applyPortage(
      run.body,
      {
        rods: segment.rods,
        footing: segment.footing,
        mud: segment.mud,
        brush: segment.brush,
        carry,
        craft: run.craft,
        season: run.season,
        headnet: run.headnet,
      },
      run.seed,
      run.step,
    );
    setRun((prev) => {
      const advanced = push({ ...prev, step: result.step, index: prev.index + 1 }, result.effect);
      return finishIfDone(advanced);
    });
  }

  function actPaddle(pace: "cruise" | "push" | "fish") {
    if (!segment || segment.kind !== "paddle") return;
    const wind = feltWind(segment.wind, run.windRelief[segment.id] ?? 0);
    const result = applyPaddle(
      run.body,
      {
        km: segment.km,
        wind,
        exposure: segment.exposure,
        pace,
        craft: run.craft,
        season: run.season,
        fish: segment.fish,
        headnet: run.headnet,
      },
      run.seed,
      run.step,
    );
    setRun((prev) => {
      const advanced = push({ ...prev, step: result.step, index: prev.index + 1 }, result.effect);
      return finishIfDone(advanced);
    });
  }

  function actWait() {
    if (!segment || segment.kind !== "paddle") return;
    const effect: Effect = {
      energy: 3,
      health: 0,
      strain: -0.4,
      warmth: 0,
      morale: 2,
      foodKg: -0.05,
      wet: 0,
      minutes: 60,
      notes: ["You waited in the lee and watched the whitecaps. An hour is a legal paddle stroke."],
    };
    setRun((prev) =>
      push(
        {
          ...prev,
          windRelief: {
            ...prev.windRelief,
            [segment.id]: (prev.windRelief[segment.id] ?? 0) + 1,
          },
        },
        effect,
      ),
    );
  }

  function actEncounter(option: EncounterSeg["options"][number]) {
    const injury = option.injuryChance ? roll(run.seed, run.step) < option.injuryChance : false;
    const effect: Effect = {
      energy: option.energy - (injury ? 10 : 0),
      health: option.health - (injury ? 16 : 0),
      strain: option.strain,
      warmth: option.warmth,
      morale: option.morale - (injury ? 6 : 0),
      foodKg: option.foodKg,
      wet: option.wet + (injury ? 12 : 0),
      minutes: option.minutes,
      notes: injury
        ? [
            option.note,
            "She came off the bank. You got the canoe around and still took the hit. Health moved. Pride did not help.",
          ]
        : [option.note],
      hoursSinceMeal: option.hoursSinceMeal,
    };
    setRun((prev) => {
      const advanced = push(
        {
          ...prev,
          step: prev.step + 1,
          index: prev.index + 1,
          plannedHang: prev.plannedHang || Boolean(option.planHang),
        },
        effect,
      );
      return finishIfDone(advanced);
    });
  }

  function sleep() {
    const result = applyNight(
      run.body,
      {
        site: run.camp.site,
        meal: legalMeal(run.body, run.camp.meal),
        hang: run.camp.hang,
        tickCheck: run.camp.tickCheck,
        headnet: run.headnet,
        filter: run.camp.filter,
        storm: run.scenario.storm,
        season: run.season,
        remote: run.scenario.remote,
        plannedAhead: run.plannedHang,
      },
      run.seed,
      run.step,
    );
    setRun((prev) => {
      const next = push({ ...prev, step: result.step, phase: "morning" }, result.effect);
      return next.phase === "evacuated" ? next : { ...next, phase: "morning" };
    });
  }

  const windNow = useMemo(() => {
    if (!segment || segment.kind !== "paddle") return 0;
    return feltWind(segment.wind, run.windRelief[segment.id] ?? 0);
  }, [segment, run.windRelief]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => setRun(boot(scenario, run.seed))}
            className={`rounded-md px-2.5 py-1 text-left text-sm ${
              scenario.id === run.scenario.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {scenario.dayLabel}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="space-y-4">
          <Meter label="Energy" value={run.body.energy} tone="moss" />
          <Meter label="Health" value={run.body.health} tone="clay" />
          <Meter label="Strain" value={run.body.strain} tone="ink" />
          <Meter label="Warmth" value={run.body.warmth} tone="amber" />
          <Meter label="Morale" value={run.body.morale} tone="lake" />
          <dl className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <dt>Food</dt>
              <dd className="font-mono text-foreground">{run.body.foodKg.toFixed(1)} kg</dd>
            </div>
            <div className="flex justify-between">
              <dt>Fish dinners</dt>
              <dd className="font-mono text-foreground">{run.body.fishMeals}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Wet</dt>
              <dd className="font-mono text-foreground">{Math.round(run.body.wet)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Since a meal</dt>
              <dd className="font-mono text-foreground">{run.body.hoursSinceMeal.toFixed(1)} h</dd>
            </div>
            {run.body.deerTickHours > 0 && (
              <p className="text-clay">A tick is on you.</p>
            )}
            {run.body.leech && <p className="text-clay">A leech is still attached.</p>}
            {run.body.giardia && <p className="text-clay">Giardia is on the calendar.</p>}
          </dl>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={run.headnet}
              onChange={(e) => setRun({ ...run, headnet: e.target.checked })}
            />
            Headnet on
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={run.showOdds}
              onChange={(e) => setRun({ ...run, showOdds: e.target.checked })}
            />
            Show the odds
          </label>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Craft lens</p>
            <div className="flex gap-1">
              {(["canoe", "kayak"] as Craft[]).map((craft) => (
                <button
                  key={craft}
                  type="button"
                  className={`rounded-md px-2 py-1 text-xs ${
                    run.craft === craft ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setRun({ ...run, craft })}
                >
                  {craft}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Season lens</p>
            <div className="flex flex-wrap gap-1">
              {(["may", "july", "september"] as Season[]).map((season) => (
                <button
                  key={season}
                  type="button"
                  className={`rounded-md px-2 py-1 text-xs ${
                    run.season === season ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setRun({ ...run, season })}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <header>
            <p className="font-mono text-xs text-primary uppercase">
              {run.scenario.dayLabel} · {formatClock(run.clock)} · seed {run.seed}
            </p>
            <h1 className="font-display text-4xl tracking-tight">{run.scenario.title}</h1>
            {journey && (
              <p className="mt-1 text-sm text-muted-foreground">
                From{" "}
                <Link className="text-primary hover:underline" href={`/journeys/${journey.slug}`}>
                  {journey.name}
                </Link>
                . Odds are on because this page is the spec. The 3D game keeps them in the body.
              </p>
            )}
          </header>

          {run.phase === "travel" && segment && (
            <SegmentCard
              segment={segment}
              run={run}
              windNow={windNow}
              onPortage={actPortage}
              onPaddle={actPaddle}
              onWait={actWait}
              onEncounter={actEncounter}
            />
          )}

          {run.phase === "camp" && (
            <CampCard
              run={run}
              setRun={setRun}
              onSleep={sleep}
            />
          )}

          {run.phase === "morning" && <Morning run={run} />}
          {run.phase === "evacuated" && (
            <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
              <h2 className="font-display text-2xl">Evacuated</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The trip stops when the body does. There is no combat to win it back. Run the day
                again with different luck, or choose a carry you can walk.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => setRun(boot(run.scenario, run.seed))}>
              Replay this luck
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRun(boot(run.scenario, Math.floor(Math.random() * 9000) + 1))}
            >
              Different luck
            </Button>
          </div>
        </section>

        <aside className="space-y-3">
          <h2 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">Notebook</h2>
          <ol className="space-y-3">
            {run.log.map((line, i) => (
              <li key={`${line.clock}-${i}`} className="border-t border-border pt-3 text-sm">
                <span className="font-mono text-xs text-primary">{line.clock}</span>
                <p className="mt-1 text-muted-foreground">{line.text}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function finishIfDone(run: RunState): RunState {
  if (run.phase === "evacuated") return run;
  if (run.index >= run.scenario.segments.length) {
    return {
      ...run,
      phase: "camp",
      log: [
        {
          clock: formatClock(run.clock),
          text: "You are on a site, or what will have to pass for one. Build the night.",
        },
        ...run.log,
      ],
    };
  }
  return run;
}

function feltWind(base: 0 | 1 | 2 | 3, relief: number): 0 | 1 | 2 | 3 {
  return Math.max(0, base - relief) as 0 | 1 | 2 | 3;
}

function legalMeal(body: Body, meal: Meal): Meal {
  if (meal === "fish" && body.fishMeals > 0) return "fish";
  if (meal === "freeze-dry" && body.foodKg >= 0.5) return "freeze-dry";
  if (meal === "gorp" && body.foodKg >= 0.2) return "gorp";
  if (body.foodKg >= 0.5) return "freeze-dry";
  if (body.fishMeals > 0) return "fish";
  if (body.foodKg >= 0.2) return "gorp";
  return "none";
}

function SegmentCard({
  segment,
  run,
  windNow,
  onPortage,
  onPaddle,
  onWait,
  onEncounter,
}: {
  segment: Segment;
  run: RunState;
  windNow: 0 | 1 | 2 | 3;
  onPortage: (carry: Carry) => void;
  onPaddle: (pace: "cruise" | "push" | "fish") => void;
  onWait: () => void;
  onEncounter: (option: EncounterSeg["options"][number]) => void;
}) {
  return (
    <div className="space-y-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <p className="font-mono text-xs text-muted-foreground">
        {run.index + 1} / {run.scenario.segments.length} · {segment.kind}
      </p>
      <h2 className="font-display text-3xl">{segment.name}</h2>
      <p className="text-sm text-muted-foreground">{segment.detail}</p>
      <div className="flex flex-col gap-2">
        {segment.kind === "portage" &&
          (["careful", "hustle", "double"] as Carry[]).map((carry) => {
            const preview = previewPortage({
              rods: segment.rods,
              footing: segment.footing,
              mud: segment.mud,
              brush: segment.brush,
              carry,
              craft: run.craft,
              energy: run.body.energy,
              strain: run.body.strain,
              season: run.season,
              headnet: run.headnet,
            });
            return (
              <ActionButton key={carry} onClick={() => onPortage(carry)} danger={carry === "double"}>
                <span>{carryLabel[carry]}</span>
                {run.showOdds && (
                  <span className="text-xs font-normal opacity-80">
                    −{preview.energy.toFixed(0)} energy · −{preview.health.toFixed(1)} health ·{" "}
                    {Math.round(preview.minutes)} min · fall {Math.round(preview.fall * 100)}%
                  </span>
                )}
              </ActionButton>
            );
          })}
        {segment.kind === "paddle" && (
          <>
            {(["cruise", "push", "fish"] as const)
              .filter((pace) => pace !== "fish" || segment.fish > 0)
              .map((pace) => {
                const preview = previewPaddle({
                  km: segment.km,
                  wind: windNow,
                  exposure: segment.exposure,
                  pace,
                  craft: run.craft,
                  energy: run.body.energy,
                  fed: run.body.hoursSinceMeal <= 5 && run.body.foodKg > 0,
                  season: run.season,
                  fish: segment.fish,
                  headnet: run.headnet,
                });
                const energy =
                  preview.energy >= 0
                    ? `+${preview.energy.toFixed(0)} energy`
                    : `${preview.energy.toFixed(0)} energy`;
                return (
                  <ActionButton key={pace} onClick={() => onPaddle(pace)}>
                    <span>{paceLabel[pace]}</span>
                    {run.showOdds && (
                      <span className="text-xs font-normal opacity-80">
                        {energy} · {Math.round(preview.minutes)} min
                        {preview.capsize > 0.01
                          ? ` · capsize ${Math.round(preview.capsize * 100)}%`
                          : ""}
                        {pace === "fish" ? ` · fish ${Math.round(preview.fishChance * 100)}%` : ""}
                        {` · wind ${windNow}`}
                      </span>
                    )}
                  </ActionButton>
                );
              })}
            {segment.exposure === "open" && windNow >= 2 && (
              <ActionButton onClick={onWait} danger>
                Wait out an hour
              </ActionButton>
            )}
          </>
        )}
        {segment.kind === "encounter" &&
          segment.options.map((option) => (
            <ActionButton key={option.id} onClick={() => onEncounter(option)}>
              <span>{option.label}</span>
              <span className="text-xs font-normal opacity-80">{option.detail}</span>
            </ActionButton>
          ))}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left text-sm ${
        danger
          ? "bg-transparent ring-1 ring-border hover:bg-muted"
          : "bg-secondary hover:bg-secondary/80"
      }`}
    >
      {children}
    </button>
  );
}

const carryLabel: Record<Carry, string> = {
  careful: "Careful solo carry",
  hustle: "Hustle the crossings",
  double: "Double carry it",
};

const paceLabel = {
  cruise: "Cruise",
  push: "Push",
  fish: "Ship the paddle and fish",
};

function CampCard({
  run,
  setRun,
  onSleep,
}: {
  run: RunState;
  setRun: (run: RunState) => void;
  onSleep: () => void;
}) {
  const camp = run.camp;
  function set<K extends keyof RunState["camp"]>(key: K, value: RunState["camp"][K]) {
    setRun({ ...run, camp: { ...camp, [key]: value } });
  }
  return (
    <div className="space-y-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <h2 className="font-display text-3xl">Build the night</h2>
      {run.scenario.storm && (
        <p className="text-sm text-primary">A storm is on the lake. A point camp will feel it.</p>
      )}
      {run.plannedHang && (
        <p className="text-sm text-muted-foreground">You planned the hang before the tent. That still helps.</p>
      )}
      <Choice
        label="Site"
        value={camp.site}
        options={[
          ["point", "Breezy point"],
          ["bay", "Sheltered bay"],
        ]}
        onChange={(site) => set("site", site as Site)}
      />
      <Choice
        label="Dinner"
        value={camp.meal}
        options={[
          ["fish", run.body.fishMeals > 0 ? "Fish in the pan" : "Fish (you have none)"],
          ["freeze-dry", "Freeze-dried meal"],
          ["gorp", "Gorp and call it dinner"],
        ]}
        onChange={(meal) => set("meal", meal as Meal)}
      />
      <Choice
        label="Food storage"
        value={camp.hang}
        options={[
          ["good", "A real hang"],
          ["canister", "Canister"],
          ["lazy", "Lazy hang"],
          ["tent", "Bag in the tent"],
        ]}
        onChange={(hang) => set("hang", hang as Hang)}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={camp.tickCheck}
          onChange={(e) => set("tickCheck", e.target.checked)}
        />
        Body check for ticks and leeches
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={camp.filter} onChange={(e) => set("filter", e.target.checked)} />
        Filter the water
      </label>
      <Button type="button" onClick={onSleep}>
        Sleep
      </Button>
    </div>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-md px-2.5 py-1 text-sm ${
              value === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function Morning({ run }: { run: RunState }) {
  const rows: [string, string][] = [
    ["Energy", delta(run.start.energy, run.body.energy)],
    ["Health", delta(run.start.health, run.body.health)],
    ["Strain", delta(run.start.strain, run.body.strain)],
    ["Morale", delta(run.start.morale, run.body.morale)],
    ["Food left", `${run.body.foodKg.toFixed(1)} kg`],
  ];
  return (
    <div className="space-y-3 rounded-xl bg-paper p-5 text-ink">
      <h2 className="font-display text-3xl">Morning</h2>
      <p className="text-sm">
        {run.body.health > 70 && run.body.energy > 55
          ? "You can travel. The next day would start from this body, not from the brochure."
          : "You can travel only if the next day is shorter than your pride. That is the whole 10-day lesson."}
      </p>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs uppercase tracking-wide text-ink/60">{k}</dt>
            <dd className="font-display text-2xl">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function delta(from: number, to: number) {
  const d = Math.round(to - from);
  const sign = d > 0 ? "+" : "";
  return `${Math.round(to)} (${sign}${d})`;
}

function Meter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "moss" | "clay" | "ink" | "amber" | "lake";
}) {
  const color = {
    moss: "bg-moss",
    clay: "bg-clay",
    ink: "bg-foreground/70",
    amber: "bg-primary",
    lake: "bg-lake",
  }[tone];
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
