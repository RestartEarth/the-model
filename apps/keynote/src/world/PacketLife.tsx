import { useEffect, useState } from "react";
import { color, type } from "../design/tokens";
import type { PacketLife, WorldState } from "../stage/types";

const SRC = { x: 280, y: 360 };
const DST = { x: 1320, y: 360 };
const HOPS = [
  { id: "h1", x: 560, y: 360, label: "HOP" },
  { id: "h2", x: 800, y: 360, label: "HOP" },
  { id: "h3", x: 1040, y: 360, label: "HOP" },
] as const;

const LAYERS = [
  { id: "thought", y: 160, label: "THOUGHT", ink: color.somaMedia },
  { id: "session", y: 250, label: "SESSION", ink: color.somaSpark },
  { id: "path", y: 360, label: "PATH", ink: color.somaFood },
  { id: "hop", y: 450, label: "HOP", ink: color.somaHormone },
  { id: "wire", y: 540, label: "WIRE", ink: color.somaWater },
] as const;

const CORE = [
  { id: "pe-w", x: 480, y: 300 },
  { id: "p-a", x: 700, y: 250 },
  { id: "p-b", x: 900, y: 300 },
  { id: "p-c", x: 800, y: 430 },
  { id: "pe-e", x: 1120, y: 300 },
] as const;

function useClock(run: boolean, speed: number, reduced: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!run || reduced) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      setT((v) => v + ((now - last) / 1000) * speed);
      last = now;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, speed, reduced]);
  return t;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function along(pts: ReadonlyArray<{ x: number; y: number }>, u: number) {
  if (pts.length < 2) return pts[0] ?? { x: 0, y: 0 };
  const t = ((u % 1) + 1) % 1;
  const segs = pts.length - 1;
  const f = t * segs;
  const i = Math.min(segs - 1, Math.floor(f));
  const s = f - i;
  return { x: lerp(pts[i]!.x, pts[i + 1]!.x, s), y: lerp(pts[i]!.y, pts[i + 1]!.y, s) };
}

function Label({
  x,
  y,
  children,
  opacity = 1,
  size = 22,
  gold = false,
}: {
  x: number;
  y: number;
  children: string;
  opacity?: number;
  size?: number;
  gold?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={gold ? color.somaHormone : color.type}
      stroke={color.field}
      strokeWidth={3.5}
      paintOrder="stroke fill"
      fontFamily={type.family}
      fontSize={size}
      fontWeight={500}
      letterSpacing="0.12em"
      opacity={opacity}
    >
      {children}
    </text>
  );
}

function Star({
  x,
  y,
  r,
  ink,
  opacity = 0.9,
}: {
  x: number;
  y: number;
  r: number;
  ink: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={r * 2.6} fill={ink} opacity={0.16} />
      <circle cx={x} cy={y} r={r} fill={ink} />
    </g>
  );
}

function pathMain() {
  return [SRC, ...HOPS.map((h) => ({ x: h.x, y: h.y })), DST];
}

function pathAlt() {
  return [
    SRC,
    { x: 560, y: 250 },
    { x: 800, y: 210 },
    { x: 1040, y: 270 },
    DST,
  ];
}

function pathReroute() {
  return [
    { x: 480, y: 300 },
    { x: 700, y: 430 },
    { x: 900, y: 430 },
    { x: 1120, y: 300 },
  ];
}

function pathDown() {
  return LAYERS.map((L) => ({ x: 800, y: L.y }));
}

function pathWire() {
  const y = LAYERS.find((L) => L.id === "wire")?.y ?? 540;
  return [
    { x: 220, y },
    { x: 1380, y },
  ];
}

export function PacketLife({ world }: { world: WorldState }) {
  const phase = world.packetLife;
  const token = world.packetKind === "token";
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const t = useClock(phase > 0 && !reduced, 0.22, reduced);
  const main = pathMain();
  const alt = pathAlt();
  const parcel = along(
    phase === 4 ? pathDown() : phase === 5 ? pathWire() : phase >= 10 ? pathReroute() : phase >= 3 && phase < 6 ? alt : main,
    reduced ? 0.42 : t,
  );
  const showLayers = phase >= 4 && phase <= 6;
  const showHops = phase >= 1;
  const circuit = phase === 2;
  const hopFind = phase === 3 || phase === 9;
  const wire = phase === 5;
  const rewrite = phase === 6;
  const ttl = phase === 7;
  const tcp = phase === 8;
  const mpls = phase >= 10 && phase <= 11;
  const vpn = phase === 11;
  const qos = phase === 12;
  const sdwan = phase === 13;
  const close = phase === 14;
  const failed = phase === 10;

  const ttlLeft = reduced ? 4 : Math.max(0, 8 - Math.floor((t * 8) % 9));

  return (
    <svg className="stage-graph" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      {showLayers &&
        LAYERS.map((L) => {
          const lit = wire ? L.id === "wire" : rewrite ? L.id === "hop" || L.id === "path" : true;
          return (
            <g key={L.id} opacity={lit ? 1 : 0.28}>
              <path
                d={`M 180 ${L.y} H 1420`}
                fill="none"
                stroke={L.ink}
                strokeWidth={L.id === "wire" && wire ? 1.8 : 0.9}
                opacity={0.38}
              />
              <Label x={118} y={L.y + 6} size={18} opacity={phase === 4 || (wire && L.id === "wire") ? 1 : 0.45}>
                {token && L.id === "session" ? "TOKEN" : L.label}
              </Label>
            </g>
          );
        })}

      {!showLayers && circuit && (
        <>
          <path
            d={`M ${SRC.x} ${SRC.y} H ${DST.x}`}
            fill="none"
            stroke={color.somaHormone}
            strokeWidth={2.4}
            opacity={0.72}
          />
          <path
            d={`M ${SRC.x} ${SRC.y - 48} H ${DST.x}`}
            fill="none"
            stroke={color.edge}
            strokeWidth={1.1}
            opacity={0.28}
          />
          <path
            d={`M ${SRC.x} ${SRC.y + 48} H ${DST.x}`}
            fill="none"
            stroke={color.edge}
            strokeWidth={1.1}
            opacity={0.28}
          />
          <Label x={800} y={SRC.y - 58} size={18} gold>
            RESERVED
          </Label>
        </>
      )}

      {!showLayers && !circuit && showHops && (
        <>
          <path
            d={main.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
            fill="none"
            stroke={color.somaHormone}
            strokeWidth={hopFind ? 1.35 : 1.15}
            opacity={0.55}
          />
          {hopFind && (
            <path
              d={alt.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
              fill="none"
              stroke={color.somaFood}
              strokeWidth={1.15}
              opacity={0.5}
            />
          )}
        </>
      )}

      {mpls && (
        <>
          <path
            d={`M ${CORE[0].x} ${CORE[0].y} L ${CORE[1].x} ${CORE[1].y} L ${CORE[4].x} ${CORE[4].y}`}
            fill="none"
            stroke={failed ? color.incident : color.somaHormone}
            strokeWidth={1.4}
            opacity={failed ? 0.35 : 0.62}
          />
          <path
            d={`M ${CORE[0].x} ${CORE[0].y} L ${CORE[3].x} ${CORE[3].y} L ${CORE[2].x} ${CORE[2].y} L ${CORE[4].x} ${CORE[4].y}`}
            fill="none"
            stroke={color.somaFood}
            strokeWidth={1.5}
            opacity={failed || phase >= 10 ? 0.7 : 0.2}
          />
          {CORE.map((n) => (
            <Star
              key={n.id}
              x={n.x}
              y={n.y}
              r={n.id === "p-a" && failed ? 4.2 : 3.2}
              ink={n.id === "p-a" && failed ? color.incident : color.somaHormone}
            />
          ))}
          {failed && (
            <text
              x={CORE[1].x}
              y={CORE[1].y - 22}
              textAnchor="middle"
              fill={color.incident}
              fontFamily={type.family}
              fontSize={22}
              fontWeight={500}
            >
              ×
            </text>
          )}
          <Label x={800} y={200} gold>
            {failed ? "CORE FAILS" : "LABELED PATH"}
          </Label>
        </>
      )}

      {vpn && (
        <path
          d={`M ${SRC.x} ${SRC.y - 70} C 560 240, 1040 240, ${DST.x} ${DST.y - 70} L ${DST.x} ${DST.y + 70} C 1040 660, 560 660, ${SRC.x} ${SRC.y + 70} Z`}
          fill="none"
          stroke={color.somaMedia}
          strokeWidth={1.4}
          strokeDasharray="8 10"
          opacity={0.55}
        />
      )}

      {sdwan && (
        <>
          <path
            d={`M ${SRC.x} ${SRC.y - 80} H ${DST.x}`}
            fill="none"
            stroke={color.somaWater}
            strokeWidth={1.5}
            opacity={0.55}
          />
          <path
            d={`M ${SRC.x} ${SRC.y + 80} H ${DST.x}`}
            fill="none"
            stroke={color.somaHormone}
            strokeWidth={1.5}
            opacity={0.7}
          />
          <Label x={800} y={SRC.y - 108} size={18}>
            INTERNET
          </Label>
          <Label x={800} y={SRC.y + 118} size={18} gold>
            MPLS
          </Label>
        </>
      )}

      {qos && (
        <>
          {[
            { x: 620, label: "DELAY" },
            { x: 800, label: "JITTER" },
            { x: 980, label: "LOSS" },
          ].map((q) => (
            <g key={q.label}>
              <Star x={q.x} y={SRC.y + 90} r={2.4} ink={color.somaBone} opacity={0.7} />
              <Label x={q.x} y={SRC.y + 126} size={16} opacity={0.85}>
                {q.label}
              </Label>
            </g>
          ))}
        </>
      )}

      {showHops && !mpls && (
        <>
          <Star x={SRC.x} y={SRC.y} r={4.4} ink={color.somaSpark} />
          <Star x={DST.x} y={DST.y} r={4.4} ink={color.healthy} />
          <Label x={SRC.x} y={SRC.y + 42} size={18} opacity={phase <= 6 || close ? 1 : 0.4}>
            {token ? "MIND" : "SOURCE"}
          </Label>
          <Label x={DST.x} y={DST.y + 42} size={18} opacity={phase <= 6 || close ? 1 : 0.4}>
            {token ? "MODEL" : "DESTINATION"}
          </Label>
          {HOPS.map((h, i) => (
            <g key={h.id}>
              <Star x={h.x} y={h.y} r={3.2} ink={rewrite ? color.somaHormone : color.focus} />
              {(phase === 3 || phase === 6 || phase === 9) && (
                <Label x={h.x} y={h.y - 28} size={16}>
                  {token ? (["GATEWAY", "RETRIEVAL", "TOOLS"] as const)[i]! : h.label}
                </Label>
              )}
            </g>
          ))}
        </>
      )}

      {tcp &&
        (token ? ["MCP", "TOOLS", "A2A"] : ["SYN", "SYN-ACK", "ACK"]).map((s, i) => {
          const u = reduced ? (i + 1) / 4 : (t * 0.7 + i * 0.22) % 1;
          const p = along(i === 1 ? [...main].reverse() : main, u);
          return (
            <g key={s}>
              <Star x={p.x} y={p.y} r={2.6} ink={color.somaSpark} />
              <Label x={p.x} y={p.y - 20} size={14}>
                {s}
              </Label>
            </g>
          );
        })}

      {ttl && (
        <Label x={800} y={SRC.y - 70} size={22}>
          {`TTL ${ttlLeft}`}
        </Label>
      )}

      {phase === 1 && (
        <>
          <Label x={800} y={SRC.y - 90} gold>
            {token ? "TOKEN" : "PARCEL"}
          </Label>
          <Label x={800} y={SRC.y + 90} size={18} opacity={0.85}>
            INTEGRITY
          </Label>
        </>
      )}

      {rewrite && (
        <Label x={800} y={SRC.y - 90} size={18} gold>
          STREET CHANGES
        </Label>
      )}

      {!tcp && phase >= 1 && phase !== 7 && (
        <Star
          x={parcel.x}
          y={sdwan ? SRC.y + 80 : qos ? parcel.y - 40 : parcel.y}
          r={qos ? 3.8 : 3.3}
          ink={qos ? color.somaHormone : wire ? color.somaWater : color.somaHormone}
          opacity={ttl && ttlLeft === 0 ? 0.15 : vpn ? 0.55 : 0.95}
        />
      )}

      {ttl && ttlLeft === 0 && (
        <Star x={HOPS[1].x} y={HOPS[1].y - 8} r={3.1} ink={color.incident} opacity={0.7} />
      )}

      {close && (
        <Label x={800} y={140} gold>
          {token ? "LIFE OF THE TOKEN" : "LIFE OF THE PACKET"}
        </Label>
      )}
    </svg>
  );
}

export function packetActive(phase: PacketLife) {
  return phase > 0;
}
