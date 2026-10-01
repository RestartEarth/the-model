import { useEffect, useMemo, useRef, useState } from "react";
import { color, type } from "../design/tokens";
import { INSPECT_NODE_ID, nodeById } from "../graph/meridian";
import {
  STRIP_STEPS,
  sessionsFor,
  type PacketKind,
  type WorkflowPhase,
} from "../graph/workflow";

function ink(kind: PacketKind, dead: boolean) {
  if (dead) return color.incident;
  if (kind === "mcp") return color.mcp;
  if (kind === "a2a") return color.a2a;
  if (kind === "rag") return color.healthy;
  return color.type;
}

function hopsToPoints(hops: string[], cutAtInspect: boolean) {
  const pts: Array<{ x: number; y: number; id: string }> = [];
  for (const id of hops) {
    const n = nodeById(id);
    if (!n) continue;
    pts.push({ x: n.x, y: n.y, id });
    if (cutAtInspect && id === "security") {
      const inspect = nodeById(INSPECT_NODE_ID);
      if (inspect) pts.push({ x: inspect.x, y: inspect.y, id: INSPECT_NODE_ID });
      break;
    }
  }
  return pts;
}

function dFor(pts: Array<{ x: number; y: number }>) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function PacketRun({
  hops,
  kind,
  density,
  dead,
  reduced,
}: {
  hops: string[];
  kind: PacketKind;
  density: number;
  dead: boolean;
  reduced: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [dots, setDots] = useState<number[]>([]);
  const pts = useMemo(() => hopsToPoints(hops, dead), [hops.join(">"), dead]);
  const stroke = ink(kind, dead);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || pts.length < 2) return;
    const len = path.getTotalLength();
    if (reduced) {
      setDots(Array.from({ length: Math.min(density, 3) }, (_, i) => ((i + 1) / (density + 1)) * len));
      return;
    }
    let raf = 0;
    const started = performance.now();
    const speed = kind === "tokens" ? 0.22 : kind === "a2a" ? 0.14 : 0.16;
    const step = (now: number) => {
      const t = (now - started) * speed;
      const next: number[] = [];
      for (let i = 0; i < density; i++) {
        const raw = (t + (i / density) * len) % (len + 12);
        next.push(dead ? Math.min(raw, len * 0.92) : raw % len);
      }
      setDots(next);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pts, density, dead, kind, reduced]);

  if (pts.length < 2) return null;
  const pathD = dFor(pts);

  return (
    <g>
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={kind === "tokens" ? 0.9 : 1.2}
        strokeDasharray={kind === "mcp" ? "4 6" : kind === "a2a" ? "1 8" : "2 5"}
        opacity={dead ? 0.35 : 0.28}
      />
      {dots.map((off, i) => {
        const path = pathRef.current;
        if (!path) return null;
        const p = path.getPointAtLength(Math.min(off, path.getTotalLength()));
        const r = kind === "tokens" ? 2.1 : kind === "rag" ? 2.4 : 3.1;
        return <circle key={i} cx={p.x} cy={p.y} r={r} fill={stroke} opacity={dead && i === 0 ? 0.95 : 0.85} />;
      })}
      {dead && pts[pts.length - 1] && (
        <text
          x={pts[pts.length - 1]!.x + 10}
          y={pts[pts.length - 1]!.y - 10}
          fill={color.incident}
          fontFamily={type.family}
          fontSize={8}
          letterSpacing="0.1em"
        >
          {kind === "tokens" ? "TTFT · SILENCE" : kind === "a2a" ? "NO RETURN" : "TIMEOUT"}
        </text>
      )}
    </g>
  );
}

export function Sessions({
  phase,
  broken,
  reduced,
}: {
  phase: WorkflowPhase;
  broken: boolean;
  reduced: boolean;
}) {
  const sessions = sessionsFor(phase);
  const dallas = nodeById("users");
  return (
    <g className="otc-sessions">
      {dallas && (phase === "ask" || phase === "tokens") && (
        <text
          x={dallas.x}
          y={dallas.y - 22}
          textAnchor="middle"
          fill={color.typeMuted}
          fontFamily={type.family}
          fontSize={8}
          letterSpacing="0.16em"
        >
          DALLAS
        </text>
      )}
      {sessions.map((s) => (
        <PacketRun
          key={s.id}
          hops={s.hops}
          kind={s.kind}
          density={s.density}
          dead={broken && Boolean(s.diesAtInspect)}
          reduced={reduced}
        />
      ))}
    </g>
  );
}

export function WorkflowStrip({
  phase,
  y,
}: {
  phase: WorkflowPhase;
  y: number;
}) {
  if (phase === "none") return null;
  const live =
    phase === "ask"
      ? ["ask"]
      : phase === "tokens"
        ? ["ask", "tokens"]
        : STRIP_STEPS.map((s) => s.id);
  const broken = phase === "broken";
  const restored = phase === "restored";

  return (
    <g className="workflow-strip">
      <text
        x={200}
        y={y - 8}
        fill={color.typeMuted}
        fontFamily={type.family}
        fontSize={8}
        letterSpacing="0.16em"
      >
        OTC COPILOT
      </text>
      {STRIP_STEPS.map((s, i) => {
        const on = live.includes(s.id);
        const dead = broken && s.dies;
        const ink = dead ? color.incident : restored ? color.healthy : on ? color.type : color.typeDim;
        const w = Math.max(72, s.label.length * 6.4);
        const x = 200 + i * 196;
        return (
          <g key={s.id} transform={`translate(${x} ${y})`} opacity={on ? 1 : 0.35}>
            <rect width={w} height={16} rx={3} fill={color.rail} stroke={ink} strokeWidth={0.8} />
            <text
              x={8}
              y={12}
              fill={ink}
              fontFamily={type.family}
              fontSize={8}
              letterSpacing="0.06em"
            >
              {dead ? (s.id === "tokens" ? `${s.label}  SILENCE` : `${s.label}  TIMEOUT`) : s.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
