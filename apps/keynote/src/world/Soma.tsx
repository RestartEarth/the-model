import { useEffect, useRef, useState } from "react";
import { color, graph, motion, type } from "../design/tokens";
import {
  BODY_PATH,
  BRAIN_CENTER,
  BRAIN_PATH,
  COSMOS_CENTER,
  COSMOS_RADIUS,
  COSMOS_SPIN_DEG,
  SATELLITE_COUNT,
  SATELLITE_ORBIT_R,
  SATELLITE_SPIN_DEG,
  SPACE_LAUNCH,
  EARTH_ATMOSPHERE,
  EARTH_BAND_LEFT,
  EARTH_BAND_RIGHT,
  EARTH_CLOUD_LINKS,
  EARTH_CLOUDS,
  EARTH_FOOD_LINKS,
  EARTH_GUT,
  EARTH_HORIZON_STARS,
  EARTH_HORIZON_Y,
  EARTH_HYPHAE,
  EARTH_LAND_VAPOR,
  EARTH_LIFE,
  EARTH_MOUTH,
  EARTH_MOUNTAIN_LINKS,
  EARTH_MOUNTAINS,
  EARTH_OCEAN,
  EARTH_OCEAN_LINKS,
  EARTH_PLANTS,
  EARTH_RAIN,
  EARTH_RIVERS,
  EARTH_ROOTS,
  EARTH_SOIL,
  EARTH_VAPOR,
  INK_GLYPHS,
  MYCELIUM_WEB_DY,
  NATURE_GRAPHS,
  SOMA_EDGES,
  SOMA_GALAXIES,
  SOMA_LOOP,
  SOMA_LOOP_PATH,
  SOLAR_ORBITS,
  TRANSIT_ROUTES,
  WATER_SOIL_JUNCTIONS,
  WATER_UPTAKE,
  WORLD_BRIDGES,
  WORLD_JUNCTIONS,
  companionByAppear,
  galaxyArmPaths,
  galaxyStars,
  haloGalaxy,
  satellitePoint,
  SENSE_LABELS,
  SOCIAL_CLUSTERS,
  solarGalaxy,
  spinPoint,
  arterialHop,
  bodyPacketTs,
  CHAKRA_IDS,
  CHAKRA_INK,
  energyClimbHop,
  heartEnvelope,
  HEART_PERIOD,
  BODY_BEAT,
  isSomaBrain,
  isSomaHandFinger,
  isWhisperStar,
  layerRevealed,
  natureNode,
  somaNode,
  venousReturnHop,
  visibleSoma,
  type BridgeKind,
  type EarthCloudStar,
  type EarthHypha,
  type EarthLife,
  type EarthLifeKind,
  type EarthOceanStar,
  type EarthPlant,
  type EarthRoot,
  type NatureGraph,
  type SomaCompanion,
  type SomaEarth,
  type SomaEdge,
  type SomaEdgeKind,
  type SomaEra,
  type SomaGalaxy,
  type SomaNode,
  type TransitKind,
  type TransitRoute,
  type WaterUptake,
  type WorldBridge,
  type WorldJunction,
  type JunctionHue,
} from "../graph/soma";
import type { WorldState } from "../stage/types";
import { usePrefersReducedMotion } from "../stage/hooks";

interface Cam {
  zoom: number;
  x: number;
  y: number;
  opacity: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function viewBoxFor(cam: Cam) {
  const w = graph.width / cam.zoom;
  const h = graph.height / cam.zoom;
  return `${cam.x - w / 2} ${cam.y - h / 2} ${w} ${h}`;
}

/** Bottom-left audience sentence — region names must not sit in this view band. */
function inTypeBand(x: number, y: number, cam: Cam) {
  const w = graph.width / cam.zoom;
  const h = graph.height / cam.zoom;
  const nx = (x - (cam.x - w / 2)) / w;
  const ny = (y - (cam.y - h / 2)) / h;
  return nx < 0.46 && ny > 0.64;
}

function quad(
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  t: number
) {
  const u = 1 - t;
  return {
    x: u * u * x1 + 2 * u * t * cx + t * t * x2,
    y: u * u * y1 + 2 * u * t * cy + t * t * y2,
  };
}

function easeOut(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) * (1 - x);
}

function mixHex(a: string, b: string, t: number) {
  const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = parse(a);
  const B = parse(b);
  const c = A.map((v, i) => Math.round(v + ((B[i] ?? v) - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function junctionInk(hue: JunctionHue) {
  if (hue === "water") return color.somaWater;
  if (hue === "soil") return color.somaNerve;
  if (hue === "plant" || hue === "food") return color.somaFood;
  return color.somaTrade;
}

function polyPath(pts: ReadonlyArray<{ x: number; y: number }>) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

/** Beat-local names fade out when leaving — graphic stays, name is done. */
const LABEL_FADE_MS = 520;

function labelFadeStyle(reduced: boolean) {
  return reduced ? undefined : { transition: `opacity ${LABEL_FADE_MS}ms ${motion.easing.standard}` };
}

function useSeen(on: boolean) {
  const [seen, setSeen] = useState(on);
  useEffect(() => {
    if (on) setSeen(true);
  }, [on]);
  return seen;
}

function RegionLabel({
  x,
  y,
  children,
  gold = false,
  size = 22,
  opacity = 1,
  anchor = "middle",
  cam,
  reduced = false,
}: {
  x: number;
  y: number;
  children: string;
  gold?: boolean;
  size?: number;
  opacity?: number;
  anchor?: "start" | "middle" | "end";
  cam?: Cam;
  reduced?: boolean;
}) {
  if (cam && inTypeBand(x, y, cam)) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={gold ? color.somaHormone : color.type}
      stroke={color.field}
      strokeWidth={3.5}
      paintOrder="stroke fill"
      fontFamily={type.family}
      fontSize={size}
      fontWeight={500}
      letterSpacing="0.12em"
      opacity={opacity}
      style={labelFadeStyle(reduced)}
    >
      {children}
    </text>
  );
}

function inkGlyph(i: number) {
  return INK_GLYPHS[i % INK_GLYPHS.length] ?? "a";
}

function useClock(run: boolean, speed: number, reduced: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!run || reduced) {
      setT(0);
      return;
    }
    let raf = 0;
    const started = performance.now();
    const step = (now: number) => {
      setT(((now - started) * speed) / 1000);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, speed, reduced]);
  return t;
}

/** One RAF for every body-traffic subscriber — blood, heart, nerves, loop. */
let beatElapsed = 0;
let beatRaf = 0;
let beatOrigin = 0;
const beatListeners = new Set<(t: number) => void>();

function ensureBeatClock() {
  if (beatRaf) return;
  beatOrigin = performance.now();
  const step = (now: number) => {
    beatElapsed = (now - beatOrigin) / 1000;
    beatListeners.forEach((fn) => fn(beatElapsed));
    beatRaf = requestAnimationFrame(step);
  };
  beatRaf = requestAnimationFrame(step);
}

function useBeatElapsed(run: boolean, reduced: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!run || reduced) {
      setT(0);
      return;
    }
    const on = (v: number) => setT(v);
    beatListeners.add(on);
    ensureBeatClock();
    on(beatElapsed);
    return () => {
      beatListeners.delete(on);
      if (beatListeners.size === 0 && beatRaf) {
        cancelAnimationFrame(beatRaf);
        beatRaf = 0;
        beatElapsed = 0;
      }
    };
  }, [run, reduced]);
  return t;
}

function useAssemble(era: SomaEra, reduced: boolean) {
  const [t, setT] = useState(reduced || era > 0 ? (reduced ? 1 : 0) : 0);
  useEffect(() => {
    if (reduced) {
      setT(1);
      return;
    }
    if (era <= 0) {
      setT(0);
      return;
    }
    let raf = 0;
    const started = performance.now();
    const step = (now: number) => {
      const u = Math.min(1, (now - started) / 2200);
      setT((prev) => Math.max(prev, u));
      if (u < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [era, reduced]);
  return t;
}

function starGate(n: SomaNode, assemble: number, era: SomaEra) {
  if (n.kind === "brain" && era >= 7) {
    const stagger =
      n.id === "brain" ? 0 : n.id.includes("-l") ? 0.08 : n.id.includes("-r") ? 0.14 : 0.06;
    return easeOut(Math.max(0, (assemble - stagger) / 0.52));
  }
  if (era !== 1) return easeOut(Math.min(1, assemble / 0.42));
  const bodyT = Math.max(0, Math.min(1, (n.y - 104) / 714));
  return easeOut(Math.max(0, (assemble - bodyT * 0.5) / 0.38));
}

function edgeLook(kind: SomaEdge["kind"], brainTraffic = false) {
  const look =
    kind === "bone"
      ? { stroke: color.somaBone, width: 0.95, opacity: 0.48, n: 0, speed: 0, r: 0 }
      : kind === "muscle"
        ? { stroke: color.somaMuscle, width: 0.72, opacity: 0.36, n: 0, speed: 0, r: 0 }
        : kind === "blood"
          ? { stroke: color.somaBlood, width: 0.85, opacity: 0.32, n: 2, speed: 0.022, r: 1.45 }
          : kind === "vein"
            ? { stroke: color.somaVein, width: 0.8, opacity: 0.3, n: 2, speed: 0.016, r: 1.35 }
            : kind === "hormone"
              ? { stroke: color.somaHormone, width: 0.85, opacity: 0.42, n: 1, speed: 0.012, r: 1.55 }
              : kind === "lymph"
                ? { stroke: color.somaLymph, width: 0.7, opacity: 0.38, n: 1, speed: 0.007, r: 1.4 }
                : kind === "energy"
                  ? { stroke: color.somaHormone, width: 0.95, opacity: 0.4, n: 2, speed: 0.008, r: 1.75 }
                  : kind === "sense"
                    ? { stroke: color.somaNerve, width: 0.95, opacity: 0.72, n: 2, speed: 0.08, r: 2.15 }
                    : kind === "motor"
                      ? { stroke: color.somaNerve, width: 1.0, opacity: 0.64, n: 2, speed: 0.075, r: 2.05 }
                      : { stroke: color.somaNerve, width: 0.95, opacity: 0.68, n: 2, speed: 0.09, r: 2.25 };
  if (!brainTraffic || look.n === 0 || kind === "energy") return look;
  return {
    ...look,
    n: look.n + 1,
    speed: look.speed * 1.08,
    r: look.r + 0.1,
    width: look.width + 0.08,
    opacity: Math.min(1, look.opacity + 0.05),
  };
}

function nodeInk(n: SomaNode) {
  if (n.kind === "organ") return color.somaOrgan;
  if (n.kind === "bone") return color.somaBone;
  if (n.kind === "muscle") return color.somaMuscle;
  if (n.kind === "gland") return color.somaHormone;
  if (n.kind === "lymph") return color.somaLymph;
  if (n.kind === "energy") return CHAKRA_INK[n.id] ?? color.somaHormone;
  return color.somaNerve;
}

function starRadius(n: SomaNode) {
  if (n.id === "brain") return 4.2;
  if (n.kind === "brain") return 2.55;
  if (n.kind === "energy") {
    if (n.id === "chakra-crown") return 9.4;
    if (n.id === "chakra-heart") return 8.6;
    if (n.id === "chakra-root") return 8.2;
    return 7.6;
  }
  if (n.kind === "organ") return 2.45;
  if (n.kind === "gland") return 1.65;
  if (n.kind === "lymph") return 1.85;
  if (n.kind === "muscle") return 1.55;
  if (n.kind === "sense") return 2.15;
  if (isSomaHandFinger(n.id)) return n.id.endsWith("-tip") ? 2.35 : 1.95;
  return 2.2;
}

function packetHop(edge: SomaEdge) {
  if (edge.kind === "blood") return arterialHop(edge);
  if (edge.kind === "vein") return venousReturnHop(edge);
  if (edge.kind === "energy") return energyClimbHop(edge);
  return 0;
}

function isElectricKind(kind: SomaEdge["kind"]) {
  return kind === "nerve" || kind === "sense" || kind === "motor";
}

function parkedTs(n: number) {
  return Array.from({ length: n }, (_, i) => (i + 1) / (n + 1));
}

function EdgePackets({
  edge,
  elapsed,
  reduced,
  haste,
  active,
}: {
  edge: SomaEdge;
  elapsed: number;
  reduced: boolean;
  haste: boolean;
  active: boolean;
}) {
  const a = somaNode(edge.source);
  const b = somaNode(edge.target);
  const look = edgeLook(edge.kind, isSomaBrain(edge.source) || isSomaBrain(edge.target));
  if (!a || !b || look.n === 0 || !active) return null;

  const vessel = edge.kind === "blood" || edge.kind === "vein";
  if (reduced && vessel) return null;

  const n = look.n;
  const ts = reduced
    ? parkedTs(n)
    : bodyPacketTs(edge.kind, packetHop(edge), n, elapsed * (haste ? 1.7 : 1));
  if (ts.length === 0) return null;

  const electric = isElectricKind(edge.kind);
  const baseOp =
    edge.kind === "blood" || edge.kind === "vein"
      ? 0.42
      : edge.kind === "hormone"
        ? 0.48
        : edge.kind === "lymph"
          ? 0.42
          : edge.kind === "energy"
            ? 0.52
            : 0.74;

  return (
    <g>
      {ts.map((t, i) => {
        const p = quad(a.x, a.y, edge.cx, edge.cy, b.x, b.y, t);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={look.r}
            fill={electric ? color.somaSpark : look.stroke}
            opacity={baseOp}
          />
        );
      })}
    </g>
  );
}

function BodySpikes({
  edges,
  reduced,
  haste,
  active,
}: {
  edges: readonly SomaEdge[];
  reduced: boolean;
  haste: boolean;
  active: boolean;
}) {
  const elapsed = useBeatElapsed(active && !reduced, reduced);
  return (
    <g>
      {edges.map((e) => (
        <EdgePackets
          key={`spk-${e.source}-${e.target}-${e.kind}`}
          edge={e}
          elapsed={elapsed}
          reduced={reduced}
          haste={haste}
          active={active}
        />
      ))}
    </g>
  );
}

function HeartStar({
  appear,
  bright,
  reduced,
  duration,
  ease,
}: {
  appear: number;
  bright: boolean;
  reduced: boolean;
  duration: string;
  ease: string;
}) {
  const heart = somaNode("heart");
  const elapsed = useBeatElapsed(!reduced && appear > 0, reduced);
  if (!heart) return null;
  const phase = HEART_PERIOD > 0 ? (elapsed / HEART_PERIOD) % 1 : 0;
  const throb = reduced || appear <= 0 ? 0 : heartEnvelope(phase);
  const r = starRadius(heart) * (bright ? 1.18 : 1) * (1 + 0.3 * throb);
  const halo = (bright ? 0.28 : 0.12) + 0.38 * throb;
  const ink = nodeInk(heart);
  return (
    <g
      opacity={appear}
      style={{ transition: `opacity ${duration} ${ease}` }}
    >
      <circle cx={heart.x} cy={heart.y} r={r * (bright ? 3.8 : 3.1)} fill={ink} opacity={halo} />
      <circle cx={heart.x} cy={heart.y} r={r} fill={ink} opacity={0.78 + 0.2 * throb + (bright ? 0.16 : 0)} />
    </g>
  );
}

function EarthPlantMark({
  plant,
  growth,
  food,
  foodT,
  ink,
  horizon,
}: {
  plant: EarthPlant;
  growth: number;
  food: boolean;
  foodT: number;
  ink: string;
  horizon: number;
}) {
  const h = plant.h * Math.min(1, growth);
  if (h < 2) return null;
  if (plant.kind === "shrub") {
    const arms = [-0.62, -0.04, 0.58];
    return (
      <g>
        {arms.map((a, i) => {
          const tx = plant.x + (plant.lean + a) * h * 0.82;
          const ty = horizon - h * (0.68 + Math.abs(a) * 0.16);
          const mx = plant.x + (plant.lean + a) * h * 0.38;
          const my = horizon - h * 0.36;
          return (
            <g key={i}>
              <path
                d={`M ${plant.x} ${horizon} Q ${mx} ${my} ${tx} ${ty}`}
                fill="none"
                stroke={ink}
                strokeWidth={0.85}
                strokeLinecap="round"
                opacity={0.58}
              />
              <circle cx={mx} cy={my} r={1.2} fill={ink} opacity={0.74} />
              <circle cx={tx} cy={ty} r={1.45} fill={ink} opacity={0.8} />
              <circle cx={tx + a * 7} cy={ty - 6} r={1.2} fill={ink} opacity={0.76} />
            </g>
          );
        })}
      </g>
    );
  }
  if (plant.kind === "reed") {
    const tip = { x: plant.x + plant.lean * h, y: horizon - h };
    const head = [
      { x: tip.x - 2.2, y: tip.y + 3, r: 1.25 },
      { x: tip.x + 2.6, y: tip.y + 1, r: 1.2 },
      { x: tip.x, y: tip.y - 7, r: 1.55 },
      { x: tip.x + 1.4, y: tip.y - 13, r: 1.3 },
    ];
    return (
      <g>
        <path
          d={`M ${plant.x} ${horizon} Q ${plant.x + plant.lean * h * 0.5} ${horizon - h * 0.52} ${tip.x} ${tip.y}`}
          fill="none"
          stroke={ink}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.6}
        />
        {[0.22, 0.44, 0.66, 0.88].map((t, i) => (
          <circle
            key={i}
            cx={plant.x + plant.lean * h * t}
            cy={horizon - h * t}
            r={1.15}
            fill={ink}
            opacity={0.74}
          />
        ))}
        {head.map((s, i) => (
          <g key={`hd-${i}`}>
            <path
              d={`M ${tip.x} ${tip.y} L ${s.x} ${s.y}`}
              fill="none"
              stroke={ink}
              strokeWidth={0.65}
              opacity={0.42}
            />
            <circle cx={s.x} cy={s.y} r={s.r} fill={ink} opacity={0.8} />
          </g>
        ))}
      </g>
    );
  }
  const steps = plant.kind === "tree" ? 6 : plant.kind === "stem" ? 4 : 3;
  const stars: { x: number; y: number; r: number }[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    stars.push({
      x: plant.x + plant.lean * h * t,
      y: horizon - h * t,
      r: plant.kind === "tree" && i === steps ? 2.15 : 1.3,
    });
  }
  const stemTip = stars[steps - 1] ?? { x: plant.x, y: horizon - h, r: 1.3 };
  if (plant.kind === "tree") {
    const canopy = food ? 1 + 0.28 * foodT : 1;
    stars.push(
      { x: stemTip.x - 16 * canopy, y: stemTip.y + 4, r: 1.35 },
      { x: stemTip.x + 15 * canopy, y: stemTip.y + 2, r: 1.35 },
      { x: stemTip.x - 8 * canopy, y: stemTip.y - 12, r: 1.5 },
      { x: stemTip.x + 9 * canopy, y: stemTip.y - 11, r: 1.45 },
      { x: stemTip.x, y: stemTip.y - 18 * canopy, r: 1.7 }
    );
    if (food && foodT > 0.2) {
      const bunch = 1 + 0.2 * foodT;
      stars.push(
        { x: stemTip.x - 10 * bunch, y: stemTip.y + 14, r: 1.55 },
        { x: stemTip.x - 4 * bunch, y: stemTip.y + 18, r: 1.7 },
        { x: stemTip.x + 5 * bunch, y: stemTip.y + 16, r: 1.6 },
        { x: stemTip.x + 12 * bunch, y: stemTip.y + 12, r: 1.45 },
        { x: stemTip.x, y: stemTip.y + 22, r: 1.8 }
      );
    }
  }
  if ((plant.kind === "stem" || plant.food) && food && foodT > 0.15) {
    const fan = 4 + (plant.kind === "stem" ? 1 : 0);
    for (let i = 0; i < fan; i++) {
      const a = -0.95 + (i / Math.max(1, fan - 1)) * 1.9;
      stars.push({
        x: stemTip.x + Math.sin(a) * 9 * foodT,
        y: stemTip.y - Math.cos(a) * 11 * foodT,
        r: 1.15 + (i % 2) * 0.25,
      });
    }
  }
  return (
    <g>
      <path
        d={`M ${plant.x} ${horizon} Q ${plant.x + plant.lean * h * 0.45} ${horizon - h * 0.5} ${stemTip.x} ${stemTip.y}`}
        fill="none"
        stroke={ink}
        strokeWidth={plant.kind === "tree" ? 1.15 : 0.85}
        strokeLinecap="round"
        opacity={0.62}
      />
      {plant.kind === "tree" &&
        stars.slice(steps).map((s, i) => (
          <path
            key={`can-${i}`}
            d={`M ${stemTip.x} ${stemTip.y} L ${s.x} ${s.y}`}
            fill="none"
            stroke={ink}
            strokeWidth={0.7}
            opacity={0.4}
          />
        ))}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ink} opacity={0.78} />
      ))}
    </g>
  );
}

function EarthRootMark({ root, ink, t }: { root: EarthRoot; ink: string; t: number }) {
  const nodeAt = (id: string) => root.nodes.find((n) => n.id === id);
  return (
    <g opacity={0.35 + 0.65 * t}>
      {root.edges.map((e) => {
        const a = nodeAt(e.source);
        const b = nodeAt(e.target);
        if (!a || !b) return null;
        return (
          <path
            key={e.source + e.target}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={ink}
            strokeWidth={1.05}
            strokeLinecap="round"
            opacity={0.62}
          />
        );
      })}
      {root.nodes.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.tip ? n.r + 0.15 : n.r}
          fill={ink}
          opacity={n.tip ? 0.86 : 0.7}
        />
      ))}
    </g>
  );
}

function nutrientPaths(food: boolean): EarthHypha[] {
  const hyphae = EARTH_HYPHAE.filter((h) => !h.food || food);
  const roots = EARTH_ROOTS.filter((r) => !r.food || food).flatMap((r) => {
    const crown = r.nodes[0];
    const tip = r.nodes.find((n) => n.tip);
    if (!crown || !tip) return [];
    const mid = r.nodes.find((n) => n.id.endsWith("-m")) ?? crown;
    return [
      {
        x1: tip.x,
        y1: tip.y,
        cx: mid.x,
        cy: mid.y,
        x2: crown.x,
        y2: crown.y,
      },
    ];
  });
  return [...hyphae, ...roots];
}

function lifeGlyph(kind: EarthLifeKind, ox: number, oy: number, s: number) {
  const p = (x: number, y: number, r = 1.25) => ({
    x: ox + x * s,
    y: oy + y * s,
    r: r * Math.sqrt(s),
  });
  if (kind === "hare") {
    return {
      pts: [
        p(-3.2, -15.5, 1.15),
        p(2.8, -15.2, 1.15),
        p(0, -8.2, 1.55),
        p(-7.5, -1.5, 1.35),
        p(6.5, 1.5, 1.45),
        p(13.5, -1, 1.2),
        p(-5.5, 11, 1.15),
        p(5, 12.5, 1.15),
      ],
      links: [
        [0, 2],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [3, 6],
        [4, 7],
      ] as Array<[number, number]>,
    };
  }
  if (kind === "fish") {
    return {
      pts: [
        p(-15, 0, 1.35),
        p(-5, -2, 1.4),
        p(1, -8, 1.2),
        p(2, 7.5, 1.15),
        p(6, 0, 1.5),
        p(13, 0, 1.25),
        p(19, -7, 1.15),
        p(19, 7, 1.15),
      ],
      links: [
        [0, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 5],
        [5, 6],
        [5, 7],
        [6, 7],
      ] as Array<[number, number]>,
    };
  }
  if (kind === "insect") {
    return {
      pts: [
        p(0, -6.5, 1.2),
        p(0, 0, 1.35),
        p(0, 6.8, 1.25),
        p(-7.5, -2.5, 1.0),
        p(7.5, -2.5, 1.0),
        p(-6, 5, 0.95),
        p(6, 5, 0.95),
      ],
      links: [
        [0, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
      ] as Array<[number, number]>,
    };
  }
  if (kind === "bird") {
    return {
      pts: [
        p(-13, -1, 1.15),
        p(-7, -4, 1.5),
        p(0, 1, 1.7),
        p(-6, -12, 1.2),
        p(-2, -20, 1.15),
        p(8, -11, 1.2),
        p(14, -18, 1.15),
        p(11, 8, 1.15),
      ],
      links: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [2, 5],
        [5, 6],
        [2, 7],
      ] as Array<[number, number]>,
    };
  }
  return {
    pts: [
      p(-16, 3, 1.2),
      p(-9, -9, 1.1),
      p(-3, -9, 1.1),
      p(-7, -1, 1.5),
      p(0, 1, 1.55),
      p(12, 3, 1.5),
      p(20, 0, 1.35),
      p(26, -7, 1.4),
      p(-3, 13, 1.15),
      p(10, 14, 1.15),
    ],
    links: [
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [4, 8],
      [5, 9],
    ] as Array<[number, number]>,
  };
}

function LifeAsterism({
  life,
  ink,
  t,
}: {
  life: EarthLife;
  ink: string;
  t: number;
}) {
  const { pts, links } = lifeGlyph(life.kind, life.x, life.y, life.scale ?? 1);
  return (
    <g opacity={0.32 + 0.68 * t}>
      {links.map(([a, b], i) => {
        const from = pts[a];
        const to = pts[b];
        if (!from || !to) return null;
        return (
          <path
            key={i}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            fill="none"
            stroke={ink}
            strokeWidth={life.tier === "predator" ? 0.85 : 0.7}
            opacity={0.5}
          />
        );
      })}
      {pts.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ink} opacity={0.82} />
      ))}
    </g>
  );
}

function FoodSink({ x, y, ink, t }: { x: number; y: number; ink: string; t: number }) {
  const ring = [
    { x, y, r: 2.15 },
    { x: x - 5.2, y: y + 2.4, r: 1.2 },
    { x: x + 5.4, y: y + 1.6, r: 1.2 },
  ];
  return (
    <g opacity={0.28 + 0.42 * t}>
      {ring.slice(1).map((s, i) => (
        <path
          key={i}
          d={`M ${x} ${y} L ${s.x} ${s.y}`}
          fill="none"
          stroke={ink}
          strokeWidth={0.7}
          opacity={0.45}
        />
      ))}
      {ring.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ink} opacity={i === 0 ? 0.72 : 0.55} />
      ))}
    </g>
  );
}

function EarthSection({
  mode,
  reduced,
  lit,
  names,
  frozen,
  cam,
}: {
  mode: Exclude<SomaEarth, "none">;
  reduced: boolean;
  lit: number;
  names: "none" | "mycelium" | "food";
  frozen: boolean;
  cam: Cam;
}) {
  const food = mode === "food";
  const [pulse, setPulse] = useState(0);
  const [foodPulse, setFoodPulse] = useState(0);
  const [growth, setGrowth] = useState(reduced || frozen ? (food ? 1 : 0.64) : food ? 0.58 : 0.04);
  const [foodT, setFoodT] = useState((reduced || frozen) && food ? 1 : 0);

  useEffect(() => {
    if (reduced || frozen) {
      setGrowth(food ? 1 : 0.64);
      setFoodT(food ? 1 : 0);
      return;
    }
    let raf = 0;
    const started = performance.now();
    const from = food ? 0.58 : 0.04;
    const to = food ? 1 : 0.64;
    const step = (now: number) => {
      const elapsed = (now - started) / 1000;
      setGrowth(from + (to - from) * easeOut(elapsed / (food ? 7.5 : 9)));
      setFoodT(food ? easeOut(elapsed / 6.5) : 0);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [food, reduced, frozen]);

  useEffect(() => {
    if (reduced) {
      setPulse(0);
      setFoodPulse(0);
      return;
    }
    let raf = 0;
    const started = performance.now();
    const step = (now: number) => {
      const elapsed = (now - started) / 1000;
      setPulse(elapsed * 0.055);
      setFoodPulse(elapsed * 0.028);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const gold = color.somaNerve;
  const leaf = color.somaFood;
  const grazer = mixHex(leaf, "#D4E06A", 0.3);
  const hunter = mixHex(leaf, "#FFFFFF", 0.38);
  const water = color.somaWater;
  const y = EARTH_HORIZON_Y;

  return (
    <g opacity={lit}>
      <path d={`M ${EARTH_BAND_LEFT} ${y} H ${EARTH_BAND_RIGHT}`} fill="none" stroke={gold} strokeWidth={0.9} opacity={0.38} />
      {EARTH_HORIZON_STARS.map((s, i) => (
        <circle key={`hz-${i}`} cx={s.x} cy={s.y} r={s.r} fill={gold} opacity={0.55} />
      ))}
      {EARTH_HYPHAE.filter((h) => !h.food || food).map((h, i) => (
        <g key={`hy-${i}`}>
          <path
            d={`M ${h.x1} ${h.y1} Q ${h.cx} ${h.cy} ${h.x2} ${h.y2}`}
            fill="none"
            stroke={gold}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.52}
          />
          <circle cx={h.x1} cy={h.y1} r={1.25} fill={gold} opacity={0.55} />
          <circle cx={h.x2} cy={h.y2} r={1.35} fill={gold} opacity={0.62} />
        </g>
      ))}
      {EARTH_ROOTS.filter((r) => !r.food || foodT > 0.08).map((root) => (
        <EarthRootMark key={`rt-${root.plantX}-${root.food ? "f" : "b"}`} root={root} ink={gold} t={root.food ? foodT : 1} />
      ))}
      {WATER_UPTAKE.map((u) => (
        <path
          key={`up-${u.id}`}
          d={`M ${u.x1} ${u.y1} Q ${u.cx} ${u.cy} ${u.x2} ${u.y2} L ${u.x3} ${u.y3}`}
          fill="none"
          stroke={water}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.28}
        />
      ))}
      {!reduced &&
        nutrientPaths(food).map((h, i) => {
          const t = (pulse + i * 0.13) % 1;
          const p = quad(h.x1, h.y1, h.cx, h.cy, h.x2, h.y2, t);
          const arriving = t > 0.82;
          return (
            <circle
              key={`np-${i}`}
              cx={p.x}
              cy={p.y}
              r={arriving ? 2.15 : 1.45}
              fill={gold}
              opacity={arriving ? 0.86 : 0.58}
            />
          );
        })}
      {!reduced &&
        WATER_UPTAKE.map((u, i) => (
          <UptakePulse key={`upk-${u.id}`} path={u} t={(pulse + i * 0.16) % 1} water={water} leaf={leaf} />
        ))}
      {reduced &&
        WATER_SOIL_JUNCTIONS.map((j) => (
          <g key={`park-${j.id}`}>
            <circle cx={j.x} cy={j.y} r={2.35} fill={water} opacity={0.92} />
            <circle cx={j.x + 4.2} cy={j.y + 0.5} r={1.85} fill={gold} opacity={0.88} />
            <circle cx={j.x - 3.6} cy={j.y - 3.2} r={1.85} fill={leaf} opacity={0.88} />
          </g>
        ))}
      {EARTH_PLANTS.map((p, i) => {
        if (p.food && foodT < 0.02) return null;
        const g = p.food ? growth * foodT : growth;
        const delay = (i % 7) * 0.04;
        const local = Math.max(0, g - delay);
        return (
          <EarthPlantMark
            key={`pl-${i}`}
            plant={p}
            growth={local}
            food={food}
            foodT={foodT}
            ink={leaf}
            horizon={y}
          />
        );
      })}
      {food && foodT > 0.12 && (
        <g>
          {EARTH_FOOD_LINKS.map((l, i) => (
            <path
              key={`hl-${i}`}
              d={`M ${l.x1} ${l.y1} Q ${l.cx} ${l.cy} ${l.x2} ${l.y2}`}
              fill="none"
              stroke={l.toBody ? hunter : leaf}
              strokeWidth={l.toBody ? 1.25 : 1.05}
              strokeLinecap="round"
              opacity={(l.toBody ? 0.62 : 0.48) * foodT}
            />
          ))}
          {EARTH_LIFE.map((life) => (
            <LifeAsterism
              key={life.id}
              life={life}
              ink={life.tier === "predator" ? hunter : grazer}
              t={foodT}
            />
          ))}
          <FoodSink x={EARTH_MOUTH.x} y={EARTH_MOUTH.y} ink={hunter} t={foodT} />
          <FoodSink x={EARTH_GUT.x} y={EARTH_GUT.y} ink={leaf} t={foodT} />
          {EARTH_FOOD_LINKS.map((l, i) => {
            if (reduced) {
              if (!l.toBody) return null;
              return <circle key={`fp-${i}`} cx={l.x2} cy={l.y2} r={2.2} fill={hunter} opacity={0.88} />;
            }
            const t = (foodPulse + i * 0.11) % 1;
            const p = quad(l.x1, l.y1, l.cx, l.cy, l.x2, l.y2, t);
            const arriving = t > 0.84;
            return (
              <circle
                key={`fp-${i}`}
                cx={p.x}
                cy={p.y}
                r={arriving ? 2.35 : l.toBody ? 1.95 : 1.55}
                fill={l.toBody ? hunter : grazer}
                opacity={arriving ? 0.94 : 0.78}
              />
            );
          })}
        </g>
      )}
      <RegionLabel
        x={932}
        y={EARTH_HORIZON_Y + 64 + MYCELIUM_WEB_DY}
        gold
        opacity={names === "mycelium" ? 1 : 0}
        cam={cam}
        reduced={reduced}
      >
        MYCELIUM
      </RegionLabel>
      <RegionLabel x={800} y={500} opacity={names === "food" ? 1 : 0} cam={cam} reduced={reduced}>
        FOOD WEB
      </RegionLabel>
    </g>
  );
}

function UptakePulse({
  path: u,
  t,
  water,
  leaf,
}: {
  path: WaterUptake;
  t: number;
  water: string;
  leaf: string;
}) {
  const climbing = t < 0.52;
  const p = climbing
    ? quad(u.x1, u.y1, u.cx, u.cy, u.x2, u.y2, t / 0.52)
    : {
        x: u.x2 + (u.x3 - u.x2) * ((t - 0.52) / 0.48),
        y: u.y2 + (u.y3 - u.y2) * ((t - 0.52) / 0.48),
      };
  const ink = mixHex(water, leaf, climbing ? 0.22 : 0.55 + 0.45 * ((t - 0.52) / 0.48));
  const atSplit = t < 0.06 || (t > 0.48 && t < 0.58);
  return <circle cx={p.x} cy={p.y} r={atSplit ? 2.35 : 1.7} fill={ink} opacity={0.92} />;
}

function companionInk(id: NatureGraph["id"]) {
  if (id === "cosmos") return color.type;
  if (id === "watercycle") return color.somaWater;
  if (id === "foodweb") return color.somaFood;
  if (id === "social") return color.type;
  if (id === "economy") return color.somaTrade;
  if (id === "writing" || id === "music" || id === "art" || id === "invention") {
    return color.somaMedia;
  }
  if (id === "internet") return color.lightning;
  return color.somaFood;
}

function bridgeInk(kind: BridgeKind) {
  if (kind === "food") return color.somaFood;
  if (kind === "water") return color.somaWater;
  if (kind === "social") return color.type;
  if (kind === "trade") return color.somaTrade;
  if (kind === "thought") return color.somaMedia;
  return color.type;
}

function transitInk(r: TransitRoute) {
  if (r.kind === "plane") return color.type;
  if (r.id.startsWith("truck-food")) return color.somaFood;
  if (r.id.startsWith("truck-soc")) return color.type;
  return color.somaTrade;
}

function JunctionMark({
  node,
  reduced,
}: {
  node: WorldJunction;
  reduced: boolean;
}) {
  const hues = node.hues.map(junctionInk);
  return (
    <g>
      {hues.map((ink, i) => (
        <circle
          key={ink + i}
          cx={node.x}
          cy={node.y}
          r={4.1 - i * 1.15}
          fill={i === hues.length - 1 ? ink : "none"}
          stroke={ink}
          strokeWidth={i === hues.length - 1 ? 0 : 1.15}
          opacity={i === hues.length - 1 ? 0.92 : 0.7}
        />
      ))}
      {reduced &&
        hues.map((ink, i) => {
          const a = -0.7 + i * 1.15;
          return (
            <circle
              key={`pk-${i}`}
              cx={node.x + Math.cos(a) * 7}
              cy={node.y + Math.sin(a) * 6}
              r={1.85}
              fill={ink}
              opacity={0.9}
            />
          );
        })}
    </g>
  );
}

function PersonAsterism({
  x,
  y,
  ink,
  scale = 1,
}: {
  x: number;
  y: number;
  ink: string;
  scale?: number;
}) {
  const s = scale;
  const pts = [
    { id: "h", x, y: y - 16 * s },
    { id: "n", x, y: y - 8 * s },
    { id: "sl", x: x - 8 * s, y: y - 4 * s },
    { id: "sr", x: x + 8 * s, y: y - 4 * s },
    { id: "hl", x: x - 5 * s, y: y + 8 * s },
    { id: "hr", x: x + 5 * s, y: y + 8 * s },
    { id: "al", x: x - 12 * s, y: y + 4 * s },
    { id: "ar", x: x + 12 * s, y: y + 4 * s },
  ];
  const links: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 5],
    [2, 6],
    [3, 7],
  ];
  return (
    <g>
      {links.map(([a, b], i) => {
        const from = pts[a];
        const to = pts[b];
        if (!from || !to) return null;
        return (
          <path
            key={i}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            fill="none"
            stroke={ink}
            strokeWidth={0.7}
            opacity={0.52}
          />
        );
      })}
      {pts.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={(p.id === "h" ? 1.7 : 1.15) * s}
          fill={ink}
          opacity={0.82}
        />
      ))}
    </g>
  );
}

function cogOutline(cx: number, cy: number, r: number, teeth: number, rot: number, tooth = 1.2) {
  const inner = r;
  const outer = r + tooth;
  const parts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const step = (Math.PI * 2) / teeth;
    const base = rot + i * step;
    const a0 = base;
    const a1 = base + step * 0.28;
    const a2 = base + step * 0.5;
    const a3 = base + step * 0.78;
    const pt = (a: number, rad: number) =>
      `${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)}`;
    parts.push(`${i === 0 ? "M" : "L"} ${pt(a0, inner)}`);
    parts.push(`L ${pt(a1, outer)}`);
    parts.push(`L ${pt(a2, outer)}`);
    parts.push(`L ${pt(a3, inner)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

function GearMark({ x, y, ink, variant = 0 }: { x: number; y: number; ink: string; variant?: number }) {
  const rot = ((variant % 6) * Math.PI) / 12;
  const a = { x: x - 2.3, y: y - 0.5, r: 3.35, teeth: 8 };
  const b = { x: x + 3.05, y: y + 1.55, r: 2.45, teeth: 6 };
  return (
    <g>
      <path
        d={cogOutline(a.x, a.y, a.r, a.teeth, rot)}
        fill="none"
        stroke={ink}
        strokeWidth={0.75}
        strokeLinejoin="round"
        opacity={0.8}
      />
      <circle cx={a.x} cy={a.y} r={1.15} fill="none" stroke={ink} strokeWidth={0.55} opacity={0.62} />
      <circle cx={a.x} cy={a.y} r={0.55} fill={ink} opacity={0.86} />
      <path
        d={cogOutline(b.x, b.y, b.r, b.teeth, rot + 0.28)}
        fill="none"
        stroke={ink}
        strokeWidth={0.7}
        strokeLinejoin="round"
        opacity={0.78}
      />
      <circle cx={b.x} cy={b.y} r={0.85} fill="none" stroke={ink} strokeWidth={0.5} opacity={0.58} />
      <circle cx={b.x} cy={b.y} r={0.45} fill={ink} opacity={0.84} />
    </g>
  );
}

function LetterMark({ x, y, ink, glyph }: { x: number; y: number; ink: string; glyph: string }) {
  return (
    <text
      x={x}
      y={y + 2.8}
      textAnchor="middle"
      fill={ink}
      fontFamily={type.family}
      fontSize={8}
      opacity={0.74}
    >
      {glyph}
    </text>
  );
}

function NoteMark({ x, y, ink }: { x: number; y: number; ink: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 1.5} rx={2.35} ry={1.65} fill={ink} opacity={0.8} />
      <path
        d={`M ${x + 2.15} ${y + 1.5} V ${y - 5.2}`}
        fill="none"
        stroke={ink}
        strokeWidth={0.85}
        opacity={0.78}
      />
    </g>
  );
}

function StrokeMark({ x, y, ink, i = 0 }: { x: number; y: number; ink: string; i?: number }) {
  const tilt = (i % 3) - 1;
  return (
    <g>
      <path
        d={`M ${x - 4.2} ${y + 2 + tilt} Q ${x - 0.4} ${y - 3.4} ${x + 3.6} ${y - 4.2}`}
        fill="none"
        stroke={ink}
        strokeWidth={1.05}
        strokeLinecap="round"
        opacity={0.78}
      />
      <path
        d={`M ${x - 2.4} ${y + 4} Q ${x + 1.6} ${y + 0.2} ${x + 4.8} ${y + 1.8 + tilt}`}
        fill="none"
        stroke={ink}
        strokeWidth={0.8}
        strokeLinecap="round"
        opacity={0.55}
      />
    </g>
  );
}

function NatureWeb({
  graph: g,
  reduced,
  ink,
  lit,
  labelOp,
  pulseOn,
  cam,
}: {
  graph: NatureGraph;
  reduced: boolean;
  ink: string;
  lit: number;
  cam?: Cam;
  labelOp: number;
  pulseOn: boolean;
}) {
  const letters = g.id === "writing" || g.pulse === "ink";
  const notes = g.id === "music" || g.pulse === "note";
  const strokes = g.id === "art" || g.pulse === "stroke";
  const gears = g.id === "invention" || g.pulse === "gear";
  const people = g.id === "social";
  const speed = letters || notes || strokes || gears ? 0.034 : 0.06;
  const pulse = useClock((pulseOn || people) && !reduced, speed, reduced);
  const run = Math.min(g.edges.length, letters || notes || people || gears ? 8 : 8);
  const cosmosFocus = g.id === "cosmos" && pulseOn;

  return (
    <g opacity={lit} style={{ transition: reduced ? "none" : "opacity 700ms ease" }}>
      {g.edges.map((e) => {
        const a = natureNode(g, e.source);
        const b = natureNode(g, e.target);
        if (!a || !b) return null;
        return (
          <path
            key={`${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={ink}
            strokeWidth={cosmosFocus ? 2 : pulseOn ? 1.05 : 0.8}
            strokeLinecap="round"
            opacity={cosmosFocus ? 0.68 : pulseOn ? 0.55 : 0.42}
          />
        );
      })}
      {g.nodes.map((n, ni) => {
        if (n.mark === "person") {
          return <PersonAsterism key={n.id} x={n.x} y={n.y} ink={ink} scale={n.scale ?? 1} />;
        }
        if (n.mark === "letter" || n.mark === "glyph") {
          return (
            <LetterMark
              key={n.id}
              x={n.x}
              y={n.y}
              ink={ink}
              glyph={inkGlyph(ni)}
            />
          );
        }
        if (n.mark === "note") {
          return <NoteMark key={n.id} x={n.x} y={n.y} ink={ink} />;
        }
        if (n.mark === "stroke") {
          return <StrokeMark key={n.id} x={n.x} y={n.y} ink={ink} i={ni} />;
        }
        if (n.mark === "gear") {
          return <GearMark key={n.id} x={n.x} y={n.y} ink={ink} variant={ni} />;
        }
        const nodeR = cosmosFocus ? (n.r >= 2.6 ? 3.6 : 2.6) : n.r;
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={nodeR * 2.4} fill={ink} opacity={0.12} />
            <circle cx={n.x} cy={n.y} r={nodeR} fill={ink} opacity={cosmosFocus ? 0.92 : 0.8} />
          </g>
        );
      })}
      {(pulseOn || people) &&
        (people || (!reduced && g.pulse !== "none")) &&
        g.edges.slice(0, people ? 12 : run).map((e, i) => {
          const a = natureNode(g, e.source);
          const b = natureNode(g, e.target);
          if (!a || !b) return null;
          const t = reduced && people ? (i % 3) * 0.22 + 0.2 : (pulse + i * (1 / (people ? 12 : run))) % 1;
          const p = quad(a.x, a.y, e.cx, e.cy, b.x, b.y, t);
          if (people) {
            return i % 2 === 0 ? (
              <LetterMark key={`p-${i}`} x={p.x} y={p.y} ink={ink} glyph={inkGlyph(i)} />
            ) : (
              <NoteMark key={`p-${i}`} x={p.x} y={p.y} ink={ink} />
            );
          }
          if (letters) {
            return (
              <LetterMark
                key={`p-${i}`}
                x={p.x}
                y={p.y}
                ink={ink}
                glyph={inkGlyph(i)}
              />
            );
          }
          if (notes) return <NoteMark key={`p-${i}`} x={p.x} y={p.y} ink={ink} />;
          if (strokes) return <StrokeMark key={`p-${i}`} x={p.x} y={p.y} ink={ink} i={i} />;
          if (gears) return <GearMark key={`p-${i}`} x={p.x} y={p.y} ink={ink} variant={i} />;
          return <circle key={`p-${i}`} cx={p.x} cy={p.y} r={1.95} fill={ink} opacity={0.88} />;
        })}
      <RegionLabel
        x={g.labelX}
        y={g.labelY}
        gold={g.id === "mycelium"}
        opacity={labelOp}
        cam={cam}
        reduced={reduced}
      >
        {g.label.toUpperCase()}
      </RegionLabel>
      {people &&
        SOCIAL_CLUSTERS.map((c) => (
          <RegionLabel key={c.id} x={c.x} y={c.y} opacity={labelOp} cam={cam} reduced={reduced}>
            {c.label.toUpperCase()}
          </RegionLabel>
        ))}
    </g>
  );
}

/** Disc/mark scale on top of the ~2.1–2.4× geometry already in GALAXY_SPEC. */
const GALAXY_MARK_SCALE = 1.8;

/**
 * Muted constellation chroma on navy `#191D26` — distinct per ring mark,
 * not Hubble posters. Stroke weights stay at the projection floor.
 */
const GALAXY_CHROMA: Record<string, { disc: string; arm: string; core: string; glow: string; star: string }> = {
  "g-spiral-a": { disc: "#6AA8B0", arm: "#E0C48A", core: "#8EC4FF", glow: "#8EC4FF", star: "#E0C48A" },
  "g-halo": { disc: "#8EC4FF", arm: "#A78BFA", core: "#F2E6C4", glow: "#A78BFA", star: "#EDE4C8" },
  "g-elliptical": { disc: "#8EC4FF", arm: "#E0C48A", core: "#F0E6C8", glow: "#8EC4FF", star: "#EDE6C4" },
  "g-solar": { disc: "#E0C48A", arm: "#E0C48A", core: "#F0C02E", glow: "#F0C02E", star: "#E0C48A" },
  "g-spiral-b": { disc: "#C49078", arm: "#E8B07A", core: "#E8A888", glow: "#D4A080", star: "#E8C49A" },
  "g-cluster": { disc: "#A78BFA", arm: "#E0C48A", core: "#F2E8C8", glow: "#A78BFA", star: "#E8DCC8" },
};

function galaxyChroma(id: string) {
  return (
    GALAXY_CHROMA[id] ?? {
      disc: color.type,
      arm: color.somaHormone,
      core: color.type,
      glow: color.somaHormone,
      star: color.type,
    }
  );
}

function GalaxyMark({
  g,
  reduced,
  spin,
  focused,
}: {
  g: SomaGalaxy;
  reduced: boolean;
  spin: number;
  focused: boolean;
}) {
  const palette = galaxyChroma(g.id);
  const scaled: SomaGalaxy = { ...g, rx: g.rx * GALAXY_MARK_SCALE, ry: g.ry * GALAXY_MARK_SCALE };
  const stars = galaxyStars(scaled).map((s) => ({ ...s, r: s.r * GALAXY_MARK_SCALE }));
  const deg = g.tilt + (reduced ? 0 : (spin * g.spin * 180) / Math.PI);
  const coreR =
    (g.kind === "halo" ? 5.4 : g.kind === "solar" ? 4.8 : g.kind === "spiral" ? 3.9 : g.kind === "cluster" ? 3.2 : 2.6) *
    GALAXY_MARK_SCALE;

  return (
    <g transform={`translate(${g.cx} ${g.cy}) rotate(${deg})`}>
      <ellipse cx={0} cy={0} rx={scaled.rx} ry={scaled.ry} fill={palette.disc} opacity={focused ? 0.12 : 0.08} />
      <ellipse
        cx={0}
        cy={0}
        rx={scaled.rx}
        ry={scaled.ry}
        fill="none"
        stroke={palette.disc}
        strokeWidth={focused ? 1.15 : 0.7}
        opacity={g.kind === "solar" ? (focused ? 0.28 : 0.12) : focused ? 0.34 : 0.2}
      />
      {g.kind === "spiral" &&
        galaxyArmPaths(scaled).map((d, i) => (
          <path
            key={`arm-${i}`}
            d={d}
            fill="none"
            stroke={palette.arm}
            strokeWidth={focused ? 1.35 : 0.85}
            strokeLinecap="round"
            opacity={focused ? 0.55 : 0.42}
          />
        ))}
      {g.kind === "elliptical" &&
        [0.42, 0.7, 0.94].map((s) => (
          <ellipse
            key={s}
            cx={0}
            cy={0}
            rx={scaled.rx * s}
            ry={scaled.ry * s}
            fill="none"
            stroke={s === 0.94 ? palette.glow : palette.arm}
            strokeWidth={s === 0.42 ? (focused ? 1.15 : 0.8) : focused ? 0.9 : 0.6}
            opacity={s === 0.42 ? (focused ? 0.48 : 0.36) : focused ? 0.32 : 0.22}
          />
        ))}
      {g.kind === "halo" &&
        Array.from({ length: 5 }, (_, i) => {
          const t = (i / 5) * Math.PI * 2 + 0.28;
          return (
            <path
              key={`ray-${i}`}
              d={`M ${Math.cos(t) * scaled.rx * 0.1} ${Math.sin(t) * scaled.ry * 0.1} L ${Math.cos(t) * scaled.rx * 0.9} ${Math.sin(t) * scaled.ry * 0.9}`}
              fill="none"
              stroke={palette.glow}
              strokeWidth={focused ? 1.05 : 0.65}
              opacity={focused ? 0.4 : 0.28}
            />
          );
        })}
      {g.kind === "solar" &&
        SOLAR_ORBITS.map((s, i) => (
          <ellipse
            key={s}
            cx={0}
            cy={0}
            rx={scaled.rx * s}
            ry={scaled.ry * s}
            fill="none"
            stroke={i % 2 === 0 ? "#E0C48A" : "#F0C02E"}
            strokeWidth={focused ? 1 : 0.6}
            opacity={focused ? 0.5 : 0.38}
          />
        ))}
      {g.kind === "cluster" &&
        stars.slice(0, 10).map((s, i) => {
          const next = stars[(i + 3) % stars.length];
          if (!next) return null;
          return (
            <path
              key={`cl-${i}`}
              d={`M ${s.x} ${s.y} L ${next.x} ${next.y}`}
              fill="none"
              stroke={palette.glow}
              strokeWidth={focused ? 0.95 : 0.55}
              opacity={focused ? 0.4 : 0.28}
            />
          );
        })}
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={palette.star}
          opacity={g.kind === "halo" && i >= 7 ? (focused ? 0.7 : 0.58) : focused ? 0.92 : 0.84}
        />
      ))}
      <circle cx={0} cy={0} r={coreR * 2.8} fill={palette.glow} opacity={0.18} />
      <circle cx={0} cy={0} r={coreR} fill={palette.core} opacity={0.94} />
    </g>
  );
}

function GalaxyField({
  lit,
  reduced,
  spin,
  focused,
}: {
  lit: number;
  reduced: boolean;
  spin: number;
  focused: boolean;
}) {
  const ink = color.type;
  return (
    <g opacity={lit}>
      <circle
        cx={COSMOS_CENTER.x}
        cy={COSMOS_CENTER.y}
        r={COSMOS_RADIUS}
        fill="none"
        stroke={ink}
        strokeWidth={focused ? 1.35 : 0.7}
        opacity={focused ? 0.4 : 0.22}
      />
      {SOMA_GALAXIES.map((g) => (
        <GalaxyMark key={g.id} g={g} reduced={reduced} spin={spin} focused={focused} />
      ))}
    </g>
  );
}

function SatelliteMark({ x, y, ink }: { x: number; y: number; ink: string }) {
  return (
    <g>
      <path
        d={`M ${x - 5.2} ${y} L ${x + 5.2} ${y}`}
        fill="none"
        stroke={ink}
        strokeWidth={0.7}
        opacity={0.55}
      />
      <circle cx={x} cy={y} r={1.85} fill={ink} opacity={0.9} />
      <circle cx={x - 4.6} cy={y} r={1.15} fill={ink} opacity={0.7} />
      <circle cx={x + 4.6} cy={y} r={1.15} fill={ink} opacity={0.7} />
    </g>
  );
}

function ShipMark({ x, y, angle, ink }: { x: number; y: number; angle: number; ink: string }) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const tip = { x: x + c * 7, y: y + s * 7 };
  const left = { x: x - c * 4.2 - s * 2.6, y: y - s * 4.2 + c * 2.6 };
  const right = { x: x - c * 4.2 + s * 2.6, y: y - s * 4.2 - c * 2.6 };
  return (
    <g>
      <path
        d={`M ${tip.x} ${tip.y} L ${left.x} ${left.y} L ${x - c * 1.4} ${y - s * 1.4} L ${right.x} ${right.y} Z`}
        fill="none"
        stroke={ink}
        strokeWidth={0.85}
        strokeLinejoin="round"
        opacity={0.82}
      />
      <circle cx={x} cy={y} r={1.35} fill={ink} opacity={0.88} />
    </g>
  );
}

function SpaceField({
  revealed,
  reduced,
  pullback,
  ringDeg,
}: {
  revealed: SomaCompanion;
  reduced: boolean;
  pullback: boolean;
  ringDeg: number;
}) {
  const on = layerRevealed(9, revealed);
  const orbit = useClock(on && !reduced, 1, reduced);
  const pulse = useClock(on && !reduced, 0.04, reduced);
  if (!on) return null;

  const satDeg = reduced ? 0 : orbit * SATELLITE_SPIN_DEG;
  const solar = solarGalaxy();
  const halo = haloGalaxy();
  const destA = spinPoint(solar.cx, solar.cy, ringDeg);
  const destB = spinPoint(halo.cx, halo.cy, ringDeg);
  const ships = [
    { id: "ship-solar", x2: destA.x, y2: destA.y, cx: 520, cy: 780 },
    { id: "ship-halo", x2: destB.x, y2: destB.y, cx: 1280, cy: 120 },
  ] as const;
  const ink = color.type;
  const gold = color.somaHormone;

  return (
    <g opacity={pullback ? 0.78 : 0.92}>
      <circle
        cx={COSMOS_CENTER.x}
        cy={COSMOS_CENTER.y}
        r={SATELLITE_ORBIT_R}
        fill="none"
        stroke={ink}
        strokeWidth={0.65}
        opacity={0.2}
      />
      {Array.from({ length: SATELLITE_COUNT }, (_, i) => {
        const p = satellitePoint(i, satDeg);
        return <SatelliteMark key={`sat-${i}`} x={p.x} y={p.y} ink={ink} />;
      })}
      {ships.map((s, i) => {
        const t = reduced ? 1 : (pulse + i * 0.38) % 1;
        const p = reduced
          ? { x: s.x2, y: s.y2 }
          : quad(SPACE_LAUNCH.x, SPACE_LAUNCH.y, s.cx, s.cy, s.x2, s.y2, t);
        const dx = 2 * (1 - t) * (s.cx - SPACE_LAUNCH.x) + 2 * t * (s.x2 - s.cx);
        const dy = 2 * (1 - t) * (s.cy - SPACE_LAUNCH.y) + 2 * t * (s.y2 - s.cy);
        return (
          <g key={s.id}>
            <path
              d={`M ${SPACE_LAUNCH.x} ${SPACE_LAUNCH.y} Q ${s.cx} ${s.cy} ${s.x2} ${s.y2}`}
              fill="none"
              stroke={gold}
              strokeWidth={0.75}
              opacity={0.28}
            />
            <ShipMark x={p.x} y={p.y} angle={Math.atan2(dy, dx)} ink={gold} />
          </g>
        );
      })}
      <RegionLabel
        x={COSMOS_CENTER.x}
        y={COSMOS_CENTER.y - SATELLITE_ORBIT_R + 22}
        size={28}
        opacity={pullback ? 0 : 1}
        reduced={reduced}
      >
        SATELLITES
      </RegionLabel>
    </g>
  );
}

function mountainAt(id: string) {
  return EARTH_MOUNTAINS.find((m) => m.id === id);
}

function oceanAt(id: string) {
  return EARTH_OCEAN.find((s) => s.id === id);
}

const STONE_CREST = "#D4C4A8";
/** Soft white-blue — vapor, not another river. */
const CLOUD_INK = "#8EC4FF";

function cloudAt(id: string): EarthCloudStar | undefined {
  return EARTH_CLOUDS.find((s) => s.id === id);
}

function EarthHydrology({
  revealed,
  reduced,
  lit,
  focused,
  names,
  cam,
}: {
  revealed: SomaCompanion;
  reduced: boolean;
  lit: number;
  focused: boolean;
  names: boolean;
  cam: Cam;
}) {
  const cycle = layerRevealed(2, revealed);
  const pulse = useClock(cycle && !reduced, 0.06, reduced);
  const water = color.somaWater;
  const stone = color.somaBone;
  if (!cycle) return null;

  const place = (pts: ReadonlyArray<{ x: number; y: number }>, t: number) => {
    if (pts.length < 2) return pts[0];
    const u = ((t % 1) + 1) % 1;
    const scaled = u * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(scaled));
    const f = scaled - i;
    const a = pts[i];
    const b = pts[i + 1];
    if (!a || !b) return pts[0];
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  };

  const flows = [EARTH_RAIN, EARTH_VAPOR, EARTH_LAND_VAPOR, ...EARTH_RIVERS.map((r) => r.pts)];

  return (
    <g opacity={lit}>
      {EARTH_MOUNTAIN_LINKS.map(([a, b], i) => {
        const from = mountainAt(a);
        const to = mountainAt(b);
        if (!from || !to) return null;
        const crestLine = Boolean(from.crest && to.crest);
        return (
          <path
            key={`ml-${i}`}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            fill="none"
            stroke={crestLine ? STONE_CREST : stone}
            strokeWidth={crestLine ? 1.35 : 0.9}
            opacity={crestLine ? 0.82 : 0.52}
          />
        );
      })}
      {EARTH_MOUNTAINS.map((m) => (
        <circle
          key={m.id}
          cx={m.x}
          cy={m.y}
          r={m.r}
          fill={m.crest ? STONE_CREST : stone}
          opacity={m.crest ? 0.95 : 0.8}
        />
      ))}
      <path
        d={`M ${EARTH_BAND_LEFT} ${EARTH_HORIZON_Y} H ${EARTH_BAND_RIGHT}`}
        fill="none"
        stroke={color.typeDim}
        strokeWidth={0.8}
        opacity={0.28}
      />
      {EARTH_SOIL.map((s, i) => (
        <circle key={`sl-${i}`} cx={s.x} cy={s.y} r={s.r} fill={color.somaNerve} opacity={0.55} />
      ))}
      {EARTH_RIVERS.map((r) => (
        <g key={r.id}>
          <path
            d={polyPath(r.pts)}
            fill="none"
            stroke={water}
            strokeWidth={1.45}
            strokeLinecap="round"
            opacity={0.7}
          />
          {r.pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === 0 || i === r.pts.length - 1 ? 2.0 : 1.45} fill={water} opacity={0.8} />
          ))}
        </g>
      ))}
      {EARTH_OCEAN_LINKS.map(([a, b], i) => {
        const from = oceanAt(a);
        const to = oceanAt(b);
        if (!from || !to) return null;
        const surface = from.band === "surface" && to.band === "surface";
        return (
          <path
            key={`ol-${i}`}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            fill="none"
            stroke={water}
            strokeWidth={surface ? 0.95 : 0.75}
            opacity={surface ? 0.5 : 0.34}
          />
        );
      })}
      {EARTH_OCEAN.map((s: EarthOceanStar) => (
        <circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={water}
          opacity={s.band === "surface" ? 0.9 : 0.62}
        />
      ))}
      {EARTH_ATMOSPHERE.map((s, i) => {
        const next = EARTH_ATMOSPHERE[i + 1];
        if (!next) return null;
        return (
          <path
            key={`at-${i}`}
            d={`M ${s.x} ${s.y} Q ${(s.x + next.x) / 2} ${Math.min(s.y, next.y) - 28} ${next.x} ${next.y}`}
            fill="none"
            stroke={CLOUD_INK}
            strokeWidth={focused ? 1.0 : 0.7}
            opacity={focused ? 0.42 : 0.28}
          />
        );
      })}
      {EARTH_CLOUD_LINKS.map(([a, b], i) => {
        const from = cloudAt(a);
        const to = cloudAt(b);
        if (!from || !to) return null;
        return (
          <path
            key={`cl-${i}`}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            fill="none"
            stroke={CLOUD_INK}
            strokeWidth={0.85}
            opacity={focused ? 0.62 : 0.42}
          />
        );
      })}
      {EARTH_CLOUDS.map((s) => (
        <circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={CLOUD_INK}
          opacity={focused ? (s.id.endsWith("-core") ? 0.92 : 0.74) : 0.58}
        />
      ))}
      <path
        d={polyPath(EARTH_VAPOR)}
        fill="none"
        stroke={water}
        strokeWidth={focused ? 1.0 : 0.8}
        opacity={focused ? 0.48 : 0.38}
      />
      <path
        d={polyPath(EARTH_LAND_VAPOR)}
        fill="none"
        stroke={CLOUD_INK}
        strokeWidth={focused ? 0.9 : 0.7}
        opacity={focused ? 0.4 : 0.28}
      />
      <path
        d={polyPath(EARTH_RAIN)}
        fill="none"
        stroke={water}
        strokeWidth={focused ? 1.15 : 0.85}
        opacity={focused ? 0.55 : 0.42}
      />
      {!reduced &&
        flows.map((pts, i) => {
          const p = place(pts, pulse + i * 0.18);
          if (!p) return null;
          return <circle key={`wp-${i}`} cx={p.x} cy={p.y} r={2.15} fill={water} opacity={0.92} />;
        })}
      <RegionLabel x={188} y={620} opacity={names ? 1 : 0} cam={cam} reduced={reduced}>
        MOUNTAINS
      </RegionLabel>
      <RegionLabel x={812} y={864} opacity={names ? 1 : 0} cam={cam} reduced={reduced}>
        RIVERS
      </RegionLabel>
      <RegionLabel x={1380} y={796} opacity={names ? 1 : 0} cam={cam} reduced={reduced}>
        OCEAN
      </RegionLabel>
      <RegionLabel x={428} y={276} opacity={names ? 1 : 0} cam={cam} reduced={reduced}>
        CLOUDS
      </RegionLabel>
      <RegionLabel x={90} y={360} anchor="start" opacity={names ? 1 : 0} cam={cam} reduced={reduced}>
        WATER CYCLE
      </RegionLabel>
    </g>
  );
}

function PlaneMark({ x, y, angle, ink }: { x: number; y: number; angle: number; ink: string }) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const tip = { x: x + c * 6, y: y + s * 6 };
  const left = { x: x - c * 4 - s * 3.2, y: y - s * 4 + c * 3.2 };
  const right = { x: x - c * 4 + s * 3.2, y: y - s * 4 - c * 3.2 };
  return (
    <g>
      <path
        d={`M ${tip.x} ${tip.y} L ${left.x} ${left.y} M ${tip.x} ${tip.y} L ${right.x} ${right.y}`}
        fill="none"
        stroke={ink}
        strokeWidth={0.85}
        strokeLinecap="round"
        opacity={0.78}
      />
      <circle cx={x} cy={y} r={1.15} fill={ink} opacity={0.86} />
    </g>
  );
}

function TrainMark({ x, y, ink }: { x: number; y: number; ink: string }) {
  return (
    <g>
      <path d={`M ${x - 5} ${y} L ${x + 5} ${y}`} fill="none" stroke={ink} strokeWidth={0.75} opacity={0.7} />
      <circle cx={x - 4.2} cy={y} r={1.35} fill={ink} opacity={0.84} />
      <circle cx={x + 4.2} cy={y} r={1.35} fill={ink} opacity={0.84} />
      <circle cx={x} cy={y} r={1.05} fill={ink} opacity={0.7} />
    </g>
  );
}

function TruckMark({ x, y, ink }: { x: number; y: number; ink: string }) {
  return (
    <g>
      <path d={`M ${x - 3.6} ${y} L ${x + 3.2} ${y}`} fill="none" stroke={ink} strokeWidth={0.7} opacity={0.65} />
      <circle cx={x - 3.4} cy={y} r={1.15} fill={ink} opacity={0.82} />
      <circle cx={x} cy={y} r={1.05} fill={ink} opacity={0.78} />
      <circle cx={x + 3.2} cy={y} r={1.2} fill={ink} opacity={0.84} />
    </g>
  );
}

function transitGlyph(kind: TransitKind, x: number, y: number, angle: number, ink: string) {
  if (kind === "plane") return <PlaneMark x={x} y={y} angle={angle} ink={ink} />;
  if (kind === "train") return <TrainMark x={x} y={y} ink={ink} />;
  return <TruckMark x={x} y={y} ink={ink} />;
}

function TransitField({
  revealed,
  reduced,
  pullback,
}: {
  revealed: SomaCompanion;
  reduced: boolean;
  pullback: boolean;
}) {
  const pulse = useClock(!reduced && revealed >= 5, 0.045, reduced);
  const routes = TRANSIT_ROUTES.filter((r) => layerRevealed(r.appear, revealed));
  if (routes.length === 0) return null;

  return (
    <g opacity={pullback ? 0.72 : 0.88}>
      {routes.map((r: TransitRoute, i) => {
        const ink = transitInk(r);
        const t = reduced ? 1 : (pulse + i * 0.17) % 1;
        const p = reduced
          ? { x: r.x2, y: r.y2 }
          : quad(r.x1, r.y1, r.cx, r.cy, r.x2, r.y2, t);
        const dx = 2 * (1 - t) * (r.cx - r.x1) + 2 * t * (r.x2 - r.cx);
        const dy = 2 * (1 - t) * (r.cy - r.y1) + 2 * t * (r.y2 - r.cy);
        const angle = Math.atan2(dy, dx);
        return (
          <g key={r.id}>
            <path
              d={`M ${r.x1} ${r.y1} Q ${r.cx} ${r.cy} ${r.x2} ${r.y2}`}
              fill="none"
              stroke={ink}
              strokeWidth={r.kind === "plane" ? 0.7 : 0.85}
              strokeLinecap="round"
              opacity={r.kind === "plane" ? 0.28 : 0.36}
            />
            {transitGlyph(r.kind, p.x, p.y, angle, ink)}
          </g>
        );
      })}
    </g>
  );
}

const LOOP_PACKETS = 4;

function AutonomyLoop({
  active,
  reduced,
}: {
  active: boolean;
  reduced: boolean;
}) {
  const seen = useSeen(active);
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const elapsed = useBeatElapsed(active && !reduced, reduced);
  const ink = color.somaNerve;

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !active) {
      setLen(0);
      return;
    }
    setLen(path.getTotalLength());
  }, [active]);

  const period = HEART_PERIOD * BODY_BEAT.loopBeats;
  const loopT = period > 0 ? (elapsed / period) % 1 : 0;
  const pts =
    !reduced && active && len > 0
      ? Array.from({ length: LOOP_PACKETS }, (_, i) => {
          const u = (((loopT + i / LOOP_PACKETS) % 1) + 1) % 1;
          const p = pathRef.current?.getPointAtLength(u * len);
          return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
        })
      : [];

  if (!seen) return null;

  return (
    <g opacity={active ? 1 : 0} style={labelFadeStyle(reduced)}>
      <path
        ref={pathRef}
        d={SOMA_LOOP_PATH}
        fill="none"
        stroke={ink}
        strokeWidth={1.05}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
      {SOMA_LOOP.map((s) => (
        <g key={s.id}>
          <circle cx={s.x} cy={s.y} r={16} fill="none" stroke={ink} strokeWidth={0.8} opacity={0.22} />
          <circle cx={s.x} cy={s.y} r={7.5} fill={ink} opacity={0.12} />
          <circle cx={s.x} cy={s.y} r={2.8} fill={ink} opacity={0.9} />
          <RegionLabel x={s.labelX} y={s.labelY} anchor={s.textAnchor} reduced={reduced}>
            {s.label.toUpperCase()}
          </RegionLabel>
        </g>
      ))}
      {!reduced &&
        pts.map((p, i) => (
          <g key={`pkt-${i}`}>
            <circle cx={p.x} cy={p.y} r={14} fill={ink} opacity={0.1} />
            <circle cx={p.x} cy={p.y} r={3.4} fill={color.field} stroke={ink} strokeWidth={1.4} />
          </g>
        ))}
    </g>
  );
}

function WorldFilaments({
  bridges,
  reduced,
  pullback,
  revealed,
}: {
  bridges: readonly WorldBridge[];
  reduced: boolean;
  pullback: boolean;
  revealed: number;
}) {
  const pulse = useClock(!reduced && !pullback, 0.055, reduced);
  return (
    <g>
      {bridges.map((b, i) => {
        const ink = bridgeInk(b.kind);
        const focused = !pullback && revealed === b.appear;
        const op = pullback ? 0.5 : focused ? 0.78 : 0.36;
        const t = (pulse + i * 0.13) % 1;
        const p = quad(b.x1, b.y1, b.cx, b.cy, b.x2, b.y2, t);
        return (
          <g key={b.id}>
            <path
              d={`M ${b.x1} ${b.y1} Q ${b.cx} ${b.cy} ${b.x2} ${b.y2}`}
              fill="none"
              stroke={ink}
              strokeWidth={focused ? 1.15 : 0.85}
              strokeLinecap="round"
              opacity={op}
            />
            <circle cx={b.x1} cy={b.y1} r={1.3} fill={ink} opacity={op} />
            <circle cx={b.x2} cy={b.y2} r={1.4} fill={ink} opacity={op + 0.08} />
            {reduced ? (
              <circle cx={b.x2} cy={b.y2} r={focused ? 2.35 : 1.9} fill={ink} opacity={0.9} />
            ) : (
              <circle
                cx={p.x}
                cy={p.y}
                r={focused ? 2.25 : 1.7}
                fill={ink}
                opacity={focused ? 0.94 : 0.72}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

export function Soma({ world }: { world: WorldState }) {
  const reduced = usePrefersReducedMotion();
  const target: Cam = {
    zoom: world.zoom,
    x: world.focusX,
    y: world.focusY,
    opacity: world.somaDissolve ? 0 : 1,
  };
  const cam = useRef<Cam>({ ...target, opacity: 1 });
  const [, setTick] = useState(0);

  useEffect(() => {
    if (reduced) {
      cam.current = { ...target };
      setTick((n) => n + 1);
      return;
    }
    let raf = 0;
    const step = () => {
      const k = 0.055;
      cam.current = {
        zoom: lerp(cam.current.zoom, target.zoom, k),
        x: lerp(cam.current.x, target.x, k),
        y: lerp(cam.current.y, target.y, k),
        opacity: lerp(cam.current.opacity, target.opacity, k),
      };
      setTick((n) => n + 1);
      const settled =
        Math.abs(cam.current.zoom - target.zoom) < 0.003 &&
        Math.abs(cam.current.x - target.x) < 0.4 &&
        Math.abs(cam.current.y - target.y) < 0.4 &&
        Math.abs(cam.current.opacity - target.opacity) < 0.01;
      if (!settled) raf = requestAnimationFrame(step);
      else cam.current = { ...target };
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, target.zoom, target.x, target.y, target.opacity]);

  const era = world.somaEra;
  const visible = visibleSoma(era);
  const nodes = visible.nodes;
  const edges = visible.edges;
  const mind = world.somaMind;
  const revealed = world.somaCompanion;
  const pullback = world.somaPullback;
  const companion = companionByAppear(revealed);
  const rhymeKinds = new Set<SomaEdgeKind>(world.somaRhyme ? companion?.rhyme ?? [] : []);
  const earth = world.somaEarth !== "none";
  const foodOn = world.somaEarth === "food";
  const assemble = useAssemble(era, reduced);
  const filamentT = easeOut(Math.max(0, (assemble - 0.28) / 0.42));
  const pulseOn = reduced || assemble > 0.58;
  const duration = reduced ? "0ms" : `${motion.duration.emphasized}ms`;
  const ease = motion.easing.standard;
  const eye = somaNode("eye");
  const loopOn = world.somaLoop && !mind && revealed < 5;
  const earthLit = pullback ? 0.62 : revealed <= 4 ? 1 : 0.48;
  const bridges = WORLD_BRIDGES.filter((b) => {
    if (!layerRevealed(b.appear, revealed)) return false;
    // Presence only densifies the figure — do not grow harvest spokes into the body.
    if (b.kind === "food" && b.appear <= 4 && !foodOn) return false;
    if (b.kind === "food" && b.needsBody && b.appear <= 4) return false;
    if (b.needsBody && era < 3) return false;
    return true;
  });
  const earthNames =
    era >= 1 ? "none" : foodOn && revealed === 4 ? "food" : revealed === 3 ? "mycelium" : "none";
  const waterNames = era < 1 && revealed === 2 && !pullback;
  const cosmosOn = layerRevealed(1, revealed);
  const cosmosClock = useClock(cosmosOn && !reduced, 1, reduced);
  const ringDeg = reduced ? 0 : cosmosClock * COSMOS_SPIN_DEG;
  const cosmosGraph = NATURE_GRAPHS.find((g) => g.id === "cosmos");
  const junctions = WORLD_JUNCTIONS.filter((j) => {
    if (!layerRevealed(j.appear, revealed)) return false;
    if (j.appear === 4 && j.hues.includes("food") && !foodOn) return false;
    return true;
  });

  const bones = edges.filter((e) => e.kind === "bone");
  const muscles = edges.filter((e) => e.kind === "muscle");
  const blood = edges.filter((e) => e.kind === "blood");
  const veins = edges.filter((e) => e.kind === "vein");
  const hormones = edges.filter((e) => e.kind === "hormone");
  const lymph = edges.filter((e) => e.kind === "lymph");
  const energies = edges.filter((e) => e.kind === "energy");
  const fabric = edges.filter(
    (e) =>
      e.kind !== "bone" &&
      e.kind !== "muscle" &&
      e.kind !== "blood" &&
      e.kind !== "vein" &&
      e.kind !== "hormone" &&
      e.kind !== "lymph" &&
      e.kind !== "energy"
  );
  const spikeEdges = edges.filter((e) => {
    if (e.kind === "bone" || e.kind === "muscle") return false;
    if (e.kind === "blood" || e.kind === "vein") return era >= 4;
    if (e.kind === "hormone") return era >= 4;
    if (e.kind === "lymph") return era >= 6;
    if (e.kind === "energy") return era >= 2;
    if (e.kind === "sense") return world.somaSense || world.somaSpikes;
    if (e.kind === "motor") return world.somaSpikes || world.somaLoop;
    return world.somaSpikes;
  });
  const energyClock = useBeatElapsed(era >= 2 && !reduced, reduced);
  const whisperLinks = SOMA_EDGES.filter(
    (e) =>
      e.kind === "bone" &&
      e.era === 3 &&
      isWhisperStar(e.source) &&
      isWhisperStar(e.target)
  );
  const whisperOp = era < 1 ? (reduced ? 0.26 : 0.22) : 0.16;

  const filamentDash = 160;
  const filamentOffset = filamentDash * (1 - filamentT);
  const heartNode = somaNode("heart");
  const heartAppear =
    heartNode && era >= 4 ? starGate(heartNode, assemble, era) : 0;

  return (
    <svg
      className="stage-graph"
      viewBox={viewBoxFor(cam.current)}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="One living body at the center of connected natural, social, and technical networks"
      style={{ opacity: cam.current.opacity }}
    >
      <defs>
        <radialGradient id="soma-head" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.somaNerve} stopOpacity="0.2" />
          <stop offset="70%" stopColor={color.somaNerve} stopOpacity="0" />
        </radialGradient>
      </defs>

      {era >= 7 && (
        <>
          <ellipse
            cx={BRAIN_CENTER.x - 20}
            cy={BRAIN_CENTER.y}
            rx={pullback || mind ? 48 : 38}
            ry={pullback || mind ? 42 : 34}
            fill="url(#soma-head)"
            opacity={reduced ? 0.7 : mind ? 1 : pullback ? 0.88 : 0.58}
          />
          <ellipse
            cx={BRAIN_CENTER.x + 20}
            cy={BRAIN_CENTER.y}
            rx={pullback || mind ? 48 : 38}
            ry={pullback || mind ? 42 : 34}
            fill="url(#soma-head)"
            opacity={reduced ? 0.7 : mind ? 1 : pullback ? 0.88 : 0.58}
          />
          <path
            d={BRAIN_PATH}
            fill="none"
            stroke={color.somaNerve}
            strokeWidth={0.85}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={reduced ? 0.42 : mind ? 0.55 : pullback ? 0.48 : 0.36}
          />
        </>
      )}
      {mind && (
        <ellipse
          cx={BRAIN_CENTER.x}
          cy={BRAIN_CENTER.y}
          rx={108}
          ry={78}
          fill="url(#soma-head)"
        />
      )}

      {earth && (
        <EarthSection
          mode={world.somaEarth === "food" ? "food" : "mycelium"}
          reduced={reduced}
          lit={earthLit}
          names={earthNames}
          frozen={era >= 1}
          cam={cam.current}
        />
      )}

      <EarthHydrology
        revealed={revealed}
        reduced={reduced}
        lit={pullback ? 0.64 : revealed === 2 ? 0.92 : 0.52}
        focused={!pullback && revealed === 2}
        names={waterNames}
        cam={cam.current}
      />

      {NATURE_GRAPHS.filter((g) => {
        if (g.id === "mycelium" || g.id === "foodweb" || g.id === "watercycle" || g.id === "cosmos") {
          return false;
        }
        return layerRevealed(g.appear, revealed);
      }).map((g) => {
        const focused = !pullback && g.appear === revealed;
        const lit = pullback ? 0.7 : focused ? 0.92 : 0.4;
        return (
          <NatureWeb
            key={g.id}
            graph={g}
            reduced={reduced}
            ink={companionInk(g.id)}
            lit={lit}
            labelOp={focused ? 1 : 0}
            pulseOn={focused || g.id === "social"}
            cam={cam.current}
          />
        );
      })}

      {cosmosOn && cosmosGraph && (
        <g transform={`rotate(${ringDeg} ${COSMOS_CENTER.x} ${COSMOS_CENTER.y})`}>
          <NatureWeb
            graph={cosmosGraph}
            reduced={reduced}
            ink={companionInk("cosmos")}
            lit={pullback ? 0.7 : revealed === 1 ? 0.92 : 0.42}
            labelOp={0}
            pulseOn={revealed === 1}
            cam={cam.current}
          />
          <GalaxyField
            lit={pullback ? 0.78 : revealed === 1 ? 0.92 : 0.8}
            reduced={reduced}
            spin={cosmosClock}
            focused={revealed === 1}
          />
        </g>
      )}
      {cosmosOn && (
        <RegionLabel
          x={COSMOS_CENTER.x}
          y={COSMOS_CENTER.y - COSMOS_RADIUS + 28}
          size={28}
          opacity={era < 1 && revealed === 1 && !pullback ? 1 : 0}
          cam={cam.current}
          reduced={reduced}
        >
          COSMOS
        </RegionLabel>
      )}

      <TransitField revealed={revealed} reduced={reduced} pullback={pullback} />
      <SpaceField revealed={revealed} reduced={reduced} pullback={pullback} ringDeg={ringDeg} />

      {bridges.length > 0 && (
        <WorldFilaments
          bridges={bridges}
          reduced={reduced}
          pullback={pullback}
          revealed={revealed}
        />
      )}

      {junctions.map((j) => (
        <JunctionMark key={j.id} node={j} reduced={reduced} />
      ))}

      <path
        d={BODY_PATH}
        fill="none"
        stroke={color.somaNerve}
        strokeWidth={era < 1 ? 0.9 : 0.55}
        strokeOpacity={whisperOp}
      />
      {era < 3 &&
        whisperLinks.map((e) => {
          const a = somaNode(e.source);
          const b = somaNode(e.target);
          if (!a || !b) return null;
          return (
            <path
              key={`w-${e.source}-${e.target}`}
              d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
              fill="none"
              stroke={color.somaNerve}
              strokeWidth={0.7}
              strokeLinecap="round"
              opacity={whisperOp}
            />
          );
        })}

      {bones.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook("bone");
        const finger = isSomaHandFinger(e.source) || isSomaHandFinger(e.target);
        return (
          <path
            key={`k-${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={finger ? look.width + 0.35 : look.width}
            strokeLinecap="round"
            strokeDasharray={filamentT < 0.99 ? filamentDash : undefined}
            strokeDashoffset={filamentT < 0.99 ? filamentOffset : undefined}
            opacity={(finger ? 0.72 : look.opacity) * filamentT}
          />
        );
      })}

      {muscles.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook("muscle");
        return (
          <path
            key={`m-${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={look.width}
            strokeLinecap="round"
            strokeDasharray={filamentT < 0.99 ? filamentDash : undefined}
            strokeDashoffset={filamentT < 0.99 ? filamentOffset : undefined}
            opacity={look.opacity * filamentT}
          />
        );
      })}

      {blood.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook("blood");
        const rhyme = rhymeKinds.has("blood");
        return (
          <path
            key={`b-${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={rhyme ? look.width + 0.35 : look.width}
            strokeLinecap="round"
            opacity={(rhyme ? 0.72 : look.opacity) * filamentT}
          />
        );
      })}

      {veins.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook("vein");
        const rhyme = rhymeKinds.has("blood") || rhymeKinds.has("vein");
        return (
          <path
            key={`v-${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={rhyme ? look.width + 0.3 : look.width}
            strokeLinecap="round"
            opacity={(rhyme ? 0.68 : look.opacity) * filamentT}
          />
        );
      })}

      {hormones.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook("hormone");
        const rhyme = rhymeKinds.has("hormone");
        return (
          <path
            key={`h-${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={look.width}
            strokeLinecap="round"
            strokeDasharray="5 7"
            opacity={(rhyme ? 0.78 : look.opacity) * filamentT}
          />
        );
      })}

      {lymph.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook("lymph");
        return (
          <path
            key={`ly-${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={look.width}
            strokeLinecap="round"
            strokeDasharray="3 10"
            opacity={look.opacity * filamentT}
          />
        );
      })}

      {energies.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook("energy");
        return (
          <path
            key={`en-${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={look.width}
            strokeLinecap="round"
            opacity={look.opacity * filamentT}
          />
        );
      })}

      {fabric.map((e) => {
        const a = somaNode(e.source);
        const b = somaNode(e.target);
        if (!a || !b) return null;
        const look = edgeLook(e.kind, isSomaBrain(e.source) || isSomaBrain(e.target));
        const rhyme = rhymeKinds.has(e.kind);
        return (
          <path
            key={`${e.source}-${e.target}`}
            d={`M ${a.x} ${a.y} Q ${e.cx} ${e.cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={look.stroke}
            strokeWidth={rhyme ? look.width + 0.45 : look.width}
            strokeLinecap="round"
            opacity={(rhyme ? 0.96 : look.opacity) * filamentT}
          />
        );
      })}

      <BodySpikes edges={spikeEdges} reduced={reduced} haste={false} active={pulseOn} />

      {nodes.map((n) => {
        if (n.id === "heart") return null;
        const brain = n.kind === "brain";
        const energy = n.kind === "energy";
        const energyPhase = HEART_PERIOD > 0 ? (energyClock / HEART_PERIOD) % BODY_BEAT.energyBeats : 0;
        const energyHop = energy ? CHAKRA_IDS.indexOf(n.id as (typeof CHAKRA_IDS)[number]) : 0;
        const energyLocal = energyHop >= 0 ? energyPhase - (energyHop / 6) * BODY_BEAT.energyBeats : 0;
        const flash =
          energy && !reduced && energyLocal >= 0 && energyLocal <= 0.55
            ? heartEnvelope(energyLocal)
            : 0;
        const peel = era === 0 ? 0 : starGate(n, assemble, era);
        const appear = Math.max(isWhisperStar(n.id) ? whisperOp : 0, peel);
        const ink = nodeInk(n);
        const bright = pullback && brain;
        const r = starRadius(n) * (bright ? 1.18 : 1) * (energy ? 1 + 0.08 * flash : 1);
        const halo = (energy ? 0.22 : bright ? 0.28 : 0.12) + flash * 0.18;
        return (
          <g
            key={n.id}
            opacity={appear}
            style={{ transition: `opacity ${duration} ${ease}` }}
          >
            {energy ? (
              <>
                <circle cx={n.x} cy={n.y} r={r * 4.4} fill={ink} opacity={0.16 + flash * 0.08} />
                <circle cx={n.x} cy={n.y} r={r * 2.4} fill={ink} opacity={0.38 + flash * 0.1} />
                <circle cx={n.x} cy={n.y} r={r} fill={ink} opacity={0.92 + flash * 0.06} />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r * 0.38}
                  fill={n.id === "chakra-crown" ? "#FFFFFF" : "#F7F3FF"}
                  opacity={0.9}
                />
              </>
            ) : (
              <>
                <circle cx={n.x} cy={n.y} r={r * (bright ? 3.4 : 2.6)} fill={ink} opacity={halo} />
                <circle cx={n.x} cy={n.y} r={r} fill={ink} opacity={0.78 + flash * 0.22 + (bright ? 0.16 : 0)} />
              </>
            )}
          </g>
        );
      })}

      {heartNode && era >= 4 && (
        <HeartStar
          appear={heartAppear}
          bright={false}
          reduced={reduced}
          duration={duration}
          ease={ease}
        />
      )}

      {era >= 2 && (
        <RegionLabel x={458} y={148} opacity={era === 2 ? 1 : 0} cam={cam.current} reduced={reduced}>
          ENERGY
        </RegionLabel>
      )}
      {era >= 6 && (
        <RegionLabel x={458} y={200} opacity={era === 6 ? 1 : 0} cam={cam.current} reduced={reduced}>
          LYMPH
        </RegionLabel>
      )}
      {era >= 8 &&
        SENSE_LABELS.map((s) => (
          <RegionLabel
            key={s.id}
            x={s.x}
            y={s.y}
            opacity={era === 8 ? 1 : 0}
            cam={cam.current}
            reduced={reduced}
          >
            {s.label}
          </RegionLabel>
        ))}

      {mind && eye && (
        <>
          <circle cx={eye.x} cy={eye.y} r={10} fill={color.somaNerve} opacity={0.1} />
          <circle cx={eye.x} cy={eye.y} r={2.4} fill={color.type} opacity={0.9} />
        </>
      )}

      <AutonomyLoop active={loopOn} reduced={reduced} />
    </svg>
  );
}
