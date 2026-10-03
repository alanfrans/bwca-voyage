import { cn } from "cn";

type Lake = {
  id: string;
  name: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
};

const lakes: Lake[] = [
  { id: "found", name: "Found", x: 78, y: 78, rx: 22, ry: 14 },
  { id: "splash", name: "Splash", x: 210, y: 78, rx: 20, ry: 13 },
  { id: "ensign", name: "Ensign", x: 340, y: 78, rx: 36, ry: 16 },
  { id: "vera", name: "Vera", x: 470, y: 78, rx: 26, ry: 14 },
  { id: "moose", name: "Moose", x: 90, y: 230, rx: 50, ry: 24 },
  { id: "newfound", name: "Newfound", x: 210, y: 175, rx: 40, ry: 18 },
  { id: "sucker", name: "Sucker", x: 330, y: 175, rx: 32, ry: 15 },
  { id: "birch", name: "Birch", x: 250, y: 310, rx: 46, ry: 22 },
  { id: "knife", name: "Knife", x: 520, y: 250, rx: 86, ry: 30 },
  { id: "eddy", name: "Eddy", x: 640, y: 360, rx: 22, ry: 14 },
  { id: "ottertrack", name: "Ottertrack", x: 700, y: 175, rx: 62, ry: 16 },
  { id: "swamp", name: "Swamp", x: 860, y: 120, rx: 30, ry: 16 },
  { id: "border", name: "Border lakes", x: 860, y: 250, rx: 42, ry: 20 },
  { id: "sag", name: "Saganaga", x: 860, y: 360, rx: 48, ry: 24 },
  { id: "seagull", name: "Sea Gull", x: 700, y: 430, rx: 40, ry: 20 },
];

const paddle: [string, string][] = [
  ["moose", "newfound"],
  ["newfound", "sucker"],
];

const portage: [string, string][] = [
  ["newfound", "found"],
  ["newfound", "splash"],
  ["splash", "ensign"],
  ["ensign", "vera"],
  ["vera", "knife"],
  ["sucker", "birch"],
  ["birch", "knife"],
  ["knife", "eddy"],
  ["knife", "ottertrack"],
  ["ottertrack", "swamp"],
  ["swamp", "border"],
  ["border", "sag"],
  ["sag", "seagull"],
];

function byId(id: string) {
  const lake = lakes.find((l) => l.id === id);
  if (!lake) throw new Error(id);
  return lake;
}

export function RouteMap({
  highlight,
  className,
}: {
  highlight?: string[];
  className?: string;
}) {
  const active = highlight ? new Set(highlight) : null;
  return (
    <figure className={cn("overflow-x-auto rounded-xl bg-paper text-ink shadow-sm", className)}>
      <svg viewBox="0 0 980 500" role="img" className="h-auto min-w-[720px] w-full">
        <title>Schematic of the Ely-to-Gunflint lake chain used by the five journeys</title>
        <rect width="980" height="500" fill="oklch(0.91 0.025 95)" />
        <text x="28" y="36" fill="oklch(0.4 0.03 70)" fontSize="13" fontFamily="Georgia, serif">
          Ely side
        </text>
        <text x="860" y="36" fill="oklch(0.4 0.03 70)" fontSize="13" fontFamily="Georgia, serif">
          Gunflint side
        </text>
        {paddle.map(([a, b]) => {
          const A = byId(a);
          const B = byId(b);
          return (
            <line
              key={`${a}-${b}-p`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="oklch(0.45 0.04 215)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        {portage.map(([a, b]) => {
          const A = byId(a);
          const B = byId(b);
          const on =
            !active || (active.has(a) && active.has(b));
          return (
            <line
              key={`${a}-${b}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={on ? "oklch(0.5 0.14 32)" : "oklch(0.55 0.04 70 / 0.35)"}
              strokeWidth="2"
              strokeDasharray="5 4"
            />
          );
        })}
        {lakes.map((lake) => {
          const on = !active || active.has(lake.id);
          return (
            <g key={lake.id} opacity={on ? 1 : 0.28}>
              <ellipse
                cx={lake.x}
                cy={lake.y}
                rx={lake.rx}
                ry={lake.ry}
                fill="oklch(0.55 0.06 220)"
                stroke="oklch(0.32 0.04 230)"
                strokeWidth="1.5"
              />
              <text
                x={lake.x}
                y={lake.y + lake.ry + 14}
                textAnchor="middle"
                fill="oklch(0.28 0.02 70)"
                fontSize="14"
                fontFamily="Georgia, serif"
              >
                {lake.name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 text-xs text-ink/75">
        <span>Blue stroke: paddle, no portage.</span>
        <span>Dashed rust: a portage in the game graph.</span>
        <span>Not to scale. Border lakes between Swamp and Saganaga are condensed.</span>
      </figcaption>
    </figure>
  );
}
