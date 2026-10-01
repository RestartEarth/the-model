import { useEffect, useRef, useState } from "react";
import { color, type } from "../design/tokens";
import {
  STALL_SET,
  edgesFor,
  pairKey,
  type PayloadKind,
} from "../graph/payload";
import { INSPECT_NODE_ID, nodeById, visibleEdges } from "../graph/meridian";
import type { Era } from "../graph/types";

function look(kind: PayloadKind, dead: boolean, elephant: boolean, dense: boolean) {
  if (dead) return { fill: color.incident, r: 2.3, n: 3, speed: 0.09, square: false };
  if (kind === "flows" && elephant) return { fill: color.edgeHot, r: 3.6, n: 2, speed: 0.07, square: false };
  if (kind === "rpc") return { fill: color.focus, r: 2.4, n: 3, speed: 0.13, square: true };
  if (kind === "tokens") return { fill: color.type, r: 1.9, n: 7, speed: 0.26, square: false };
  if (kind === "knowledge") return { fill: color.mcp, r: 2.2, n: 4, speed: 0.16, square: false };
  if (dense) return { fill: color.typeMuted, r: 1.7, n: 9, speed: 0.18, square: false };
  return { fill: color.typeMuted, r: 2.1, n: 3, speed: 0.1, square: false };
}

function EdgeRun({
  x1,
  y1,
  x2,
  y2,
  kind,
  dead,
  elephant,
  reduced,
  dense,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kind: PayloadKind;
  dead: boolean;
  elephant: boolean;
  reduced: boolean;
  dense: boolean;
}) {
  const [ts, setTs] = useState<number[]>([]);
  const g = look(kind, dead, elephant, dense);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      setTs(Array.from({ length: g.n }, (_, i) => (i + 1) / (g.n + 1)));
      return;
    }
    const started = performance.now();
    const step = (now: number) => {
      const t = ((now - started) * g.speed) / 1000;
      const next: number[] = [];
      for (let i = 0; i < g.n; i++) {
        const u = (t + i / g.n) % 1;
        next.push(dead ? Math.min(u, 0.58) : u);
      }
      setTs(next);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [kind, dead, elephant, reduced, dense, g.n, g.speed]);

  return (
    <g>
      {ts.map((u, i) => {
        const x = x1 + (x2 - x1) * u;
        const y = y1 + (y2 - y1) * u;
        if (g.square) {
          return (
            <rect
              key={i}
              x={x - g.r}
              y={y - g.r}
              width={g.r * 2}
              height={g.r * 2}
              fill={g.fill}
              opacity={0.82}
            />
          );
        }
        return <circle key={i} cx={x} cy={y} r={g.r} fill={g.fill} opacity={dead && i === 0 ? 0.95 : 0.84} />;
      })}
    </g>
  );
}

function inEra(id: string, era: Era) {
  const n = nodeById(id);
  return Boolean(n && n.era <= era);
}

function Whisper({
  source,
  target,
  label,
  value,
  ink,
  era,
}: {
  source: string;
  target: string;
  label: string;
  value: string;
  ink: string;
  era: Era;
}) {
  const a = nodeById(source);
  const b = nodeById(target);
  if (!a || !b || !inEra(source, era) || !inEra(target, era)) return null;
  const x = (a.x + b.x) / 2;
  const y = (a.y + b.y) / 2 - 12;
  return (
    <g transform={`translate(${x} ${y})`}>
      <text
        textAnchor="middle"
        fill={color.typeMuted}
        fontFamily={type.family}
        fontSize={7}
        letterSpacing="0.14em"
      >
        {label}
      </text>
      <text y={10} textAnchor="middle" fill={ink} fontFamily={type.family} fontSize={10}>
        {value}
      </text>
    </g>
  );
}

export function PayloadGlyphs({
  era,
  kind,
  broken,
  reduced,
  inspectionHop,
  dense,
}: {
  era: Era;
  kind: PayloadKind;
  broken: boolean;
  reduced: boolean;
  inspectionHop: boolean;
  dense?: boolean;
}) {
  if (kind === "none") return null;

  const packed = Boolean(dense);
  const pairs = packed
    ? visibleEdges(era).map((e) => [e.source, e.target] as [string, string])
    : edgesFor(kind).filter(([s, t]) => {
        const a = nodeById(s);
        const b = nodeById(t);
        return Boolean(a && b && a.era <= era && b.era <= era);
      });

  const inspect = nodeById(INSPECT_NODE_ID);
  const security = nodeById("security");
  const lb = nodeById("lb");

  return (
    <g className="payload-glyphs">
      {pairs.map(([s, t]) => {
        const a = nodeById(s);
        const b = nodeById(t);
        if (!a || !b) return null;
        const stall = broken && (kind === "tokens" || kind === "knowledge") && STALL_SET.has(pairKey(s, t));
        const elephant = kind === "flows" && (s === "gpu-0" || t === "gpu-0" || s === "rdma" || t === "rdma");
        return (
          <EdgeRun
            key={`${s}-${t}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            kind={kind}
            dead={stall}
            elephant={elephant}
            reduced={reduced}
            dense={packed}
          />
        );
      })}

      {broken && inspectionHop && inspect && security && (
        <EdgeRun
          x1={security.x}
          y1={security.y}
          x2={inspect.x}
          y2={inspect.y}
          kind="tokens"
          dead
          elephant={false}
          reduced={reduced}
          dense={false}
        />
      )}

      {kind === "packets" && (
        <Whisper era={era} source="lan" target="sdwan" label="pkt/s" value="12.4k" ink={color.typeMuted} />
      )}
      {kind === "flows" && (
        <Whisper era={era} source="gpu-0" target="gpu-1" label="flow" value="elephant" ink={color.edgeHot} />
      )}
      {kind === "rpc" && (
        <Whisper era={era} source="k8s" target="checkout" label="rpc" value="api call" ink={color.focus} />
      )}
      {kind === "tokens" && !broken && (
        <>
          <Whisper era={era} source="lan" target="sdwan" label="pkt/s" value="12.4k" ink={color.typeMuted} />
          <Whisper era={era} source="users" target="lan" label="tok/s" value="840" ink={color.type} />
          <Whisper era={era} source="region" target="lb" label="TTFT" value="first thought" ink={color.focus} />
        </>
      )}
      {kind === "tokens" && broken && (
        <>
          <Whisper era={era} source="users" target="lan" label="tok/s" value="stalled" ink={color.incident} />
          <Whisper era={era} source="region" target="lb" label="TTFT" value="then silence" ink={color.incident} />
        </>
      )}
      {kind === "knowledge" && !broken && (
        <Whisper era={era} source="region" target="lb" label="tok/s" value="clears" ink={color.healthy} />
      )}
      {kind === "knowledge" && broken && (
        <Whisper era={era} source="security" target="region" label="path" value="uncleared" ink={color.incident} />
      )}

      {kind === "tokens" && !broken && lb && (
        <text
          x={lb.x + 18}
          y={lb.y - 16}
          fill={color.typeDim}
          fontFamily={type.family}
          fontSize={8}
          letterSpacing="0.08em"
        >
          first packet of thought
        </text>
      )}
      {broken && inspect && (
        <text
          x={inspect.x + 14}
          y={inspect.y - 12}
          fill={color.incident}
          fontFamily={type.family}
          fontSize={8}
          letterSpacing="0.1em"
        >
          STREAM RESET
        </text>
      )}
    </g>
  );
}
