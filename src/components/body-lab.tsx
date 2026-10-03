"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  previewPaddle,
  previewPortage,
  type Carry,
  type Craft,
  type Exposure,
  type Footing,
  type Pace,
  type Season,
} from "@/lib/model";

function num(value: number | readonly number[]) {
  return typeof value === "number" ? value : value[0];
}

function Choice<T extends string | number>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-2.5 py-1 text-sm ${
            option.value === value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function BodyLab() {
  const [mode, setMode] = useState<"portage" | "paddle">("portage");
  const [rods, setRods] = useState(40);
  const [footing, setFooting] = useState<Footing>(2);
  const [carry, setCarry] = useState<Carry>("careful");
  const [craft, setCraft] = useState<Craft>("canoe");
  const [energy, setEnergy] = useState(75);
  const [strain, setStrain] = useState(20);
  const [season, setSeason] = useState<Season>("july");
  const [mud, setMud] = useState(false);
  const [brush, setBrush] = useState(true);
  const [headnet, setHeadnet] = useState(true);
  const [km, setKm] = useState(6);
  const [wind, setWind] = useState<0 | 1 | 2 | 3>(1);
  const [exposure, setExposure] = useState<Exposure>("open");
  const [pace, setPace] = useState<Pace>("cruise");
  const [fed, setFed] = useState(true);

  const portage = useMemo(
    () =>
      previewPortage({
        rods,
        footing,
        mud,
        brush,
        carry,
        craft,
        energy,
        strain,
        season,
        headnet,
      }),
    [rods, footing, mud, brush, carry, craft, energy, strain, season, headnet],
  );

  const paddle = useMemo(
    () =>
      previewPaddle({
        km,
        wind,
        exposure,
        pace,
        craft,
        energy,
        fed,
        season,
        fish: 0.5,
        headnet,
      }),
    [km, wind, exposure, pace, craft, energy, fed, season, headnet],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <Choice
          value={mode}
          onChange={setMode}
          options={[
            { value: "portage", label: "Portage" },
            { value: "paddle", label: "Paddle" },
          ]}
        />
        <Field label={`Incoming energy ${energy}`}>
          <Slider min={5} max={100} value={[energy]} onValueChange={(v) => setEnergy(num(v))} />
        </Field>
        <Field label={`Strain already in the joints ${strain}`}>
          <Slider min={0} max={90} value={[strain]} onValueChange={(v) => setStrain(num(v))} />
        </Field>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Season</p>
          <Choice
            value={season}
            onChange={setSeason}
            options={[
              { value: "may", label: "Late May" },
              { value: "july", label: "July" },
              { value: "september", label: "September" },
            ]}
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Craft</p>
          <Choice
            value={craft}
            onChange={setCraft}
            options={[
              { value: "canoe", label: "Kevlar canoe" },
              { value: "kayak", label: "Sea kayak" },
            ]}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={headnet} onChange={(e) => setHeadnet(e.target.checked)} />
          Headnet on
        </label>

        {mode === "portage" ? (
          <>
            <Field label={`${rods} rods on the map`}>
              <Slider min={10} max={180} value={[rods]} onValueChange={(v) => setRods(num(v))} />
            </Field>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Footing</p>
              <Choice
                value={footing}
                onChange={setFooting}
                options={[
                  { value: 1, label: "Maintained" },
                  { value: 2, label: "Roots" },
                  { value: 3, label: "Nasty" },
                ]}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">How you carry</p>
              <Choice
                value={carry}
                onChange={setCarry}
                options={[
                  { value: "careful", label: "Careful solo" },
                  { value: "hustle", label: "Hustle" },
                  { value: "double", label: "Double carry" },
                ]}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={mud} onChange={(e) => setMud(e.target.checked)} />
              Mud at the landing
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={brush} onChange={(e) => setBrush(e.target.checked)} />
              Brush (ticks)
            </label>
          </>
        ) : (
          <>
            <Field label={`${km} kilometers`}>
              <Slider min={1} max={12} value={[km]} onValueChange={(v) => setKm(num(v))} />
            </Field>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pace</p>
              <Choice
                value={pace}
                onChange={setPace}
                options={[
                  { value: "cruise", label: "Cruise" },
                  { value: "push", label: "Push" },
                  { value: "fish", label: "Fish" },
                ]}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Wind</p>
              <Choice
                value={wind}
                onChange={setWind}
                options={[0, 1, 2, 3].map((w) => ({ value: w as 0 | 1 | 2 | 3, label: String(w) }))}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Water</p>
              <Choice
                value={exposure}
                onChange={setExposure}
                options={[
                  { value: "sheltered", label: "Sheltered" },
                  { value: "open", label: "Open" },
                ]}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={fed} onChange={(e) => setFed(e.target.checked)} />
              Fed in the last five hours
            </label>
          </>
        )}
      </div>
      <aside className="space-y-3 rounded-xl bg-paper p-5 text-ink">
        <p className="font-mono text-xs tracking-wide uppercase">Expected, before luck</p>
        {mode === "portage" ? (
          <Result
            rows={[
              ["Energy", `−${portage.energy.toFixed(1)}`],
              ["Health", `−${portage.health.toFixed(1)}`],
              ["Strain", `+${portage.strain.toFixed(1)}`],
              ["Minutes", Math.round(portage.minutes).toString()],
              ["Fall", `${Math.round(portage.fall * 100)}%`],
              ["Tick", `${Math.round(portage.tick * 100)}%`],
              ["Leech", `${Math.round(portage.leech * 100)}%`],
            ]}
          />
        ) : (
          <Result
            rows={[
              [
                "Energy",
                `${paddle.energy >= 0 ? "+" : "−"}${Math.abs(paddle.energy).toFixed(1)}`,
              ],
              ["Morale", paddle.morale.toFixed(1)],
              ["Minutes", Math.round(paddle.minutes).toString()],
              ["Capsize", `${Math.round(paddle.capsize * 100)}%`],
              ["Fish", pace === "fish" ? `${Math.round(paddle.fishChance * 100)}%` : "—"],
            ]}
          />
        )}
        <p className="text-xs leading-relaxed text-ink/70">
          A fall, a dump, a tick, or a leech is rolled on top of this. The day simulator uses the
          same function and then tells you what the trail actually did.
        </p>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Result({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="space-y-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-1">
          <dt className="text-sm">{k}</dt>
          <dd className="font-display text-2xl">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
