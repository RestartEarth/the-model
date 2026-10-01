import { useEffect, useRef, useState } from "react";
import { scriptFor, type AgentIntent } from "../agent/actor";
import { color, type } from "../design/tokens";
import { INSPECT_NODE_ID, nodeById } from "../graph/meridian";

interface Pt {
  x: number;
  y: number;
}

function pointsFor(path: string[]): Pt[] {
  return path
    .map((id) => nodeById(id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n))
    .map((n) => ({ x: n.x, y: n.y }));
}

function along(pts: Pt[], t: number): Pt | null {
  if (pts.length === 0) return null;
  if (pts.length === 1 || t <= 0) return pts[0]!;
  if (t >= 1) return pts[pts.length - 1]!;
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push(d);
    total += d;
  }
  if (total === 0) return pts[0]!;
  let remain = t * total;
  for (let i = 0; i < segs.length; i++) {
    const d = segs[i]!;
    if (remain <= d) {
      const a = pts[i]!;
      const b = pts[i + 1]!;
      const k = d === 0 ? 0 : remain / d;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
    remain -= d;
  }
  return pts[pts.length - 1]!;
}

function isGrounded(intent: AgentIntent) {
  return intent === "grounded";
}

export function AgentTraveler({
  intent,
  reduced,
  visible,
}: {
  intent: AgentIntent;
  reduced: boolean;
  visible: boolean;
}) {
  const script = scriptFor(intent);
  const pts = pointsFor(script.path);
  const grounded = isGrounded(intent);
  const [t, setT] = useState(reduced || intent === "ask" ? 1 : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (!visible || script.path.length === 0) {
      setT(0);
      return;
    }
    if (reduced) {
      setT(1);
      return;
    }
    setT(0);
    const started = performance.now();
    const dur = intent === "act" || intent === "grounded" ? 2600 : 2000;
    const step = (now: number) => {
      const k = Math.min(1, (now - started) / dur);
      setT(k);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [intent, visible, reduced, script.path.join(">")]);

  if (!visible || intent === "idle") return null;
  const pos = along(pts, t);
  if (!pos) return null;

  const ink =
    intent === "act"
      ? color.incident
      : intent === "ask"
        ? color.typeMuted
        : grounded
          ? color.healthy
          : color.focus;
  const inspect = nodeById(INSPECT_NODE_ID);

  return (
    <g className="agent-traveler" style={{ pointerEvents: "none" }}>
      {pts.length > 1 && (
        <polyline
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={ink}
          strokeWidth={grounded ? 1.5 : 1.1}
          strokeDasharray={grounded ? undefined : "3 7"}
          opacity={grounded ? 0.7 : 0.4}
        />
      )}
      {grounded &&
        pts.map((p, i) => (
          <circle
            key={`${p.x}-${p.y}-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="none"
            stroke={color.healthy}
            strokeWidth={1}
            opacity={0.85}
          />
        ))}
      {grounded && inspect && (
        <g transform={`translate(${inspect.x + 18} ${inspect.y - 28})`}>
          <rect width="86" height="16" rx={3} fill={color.rail} stroke={color.healthy} strokeWidth={0.8} />
          <text
            x={8}
            y={12}
            fill={color.healthy}
            fontFamily={type.family}
            fontSize={8}
            letterSpacing="0.1em"
          >
            POLICY BOUNDARY
          </text>
        </g>
      )}
      <g className={!grounded && !reduced ? "agent-blind" : undefined}>
        <circle cx={pos.x} cy={pos.y} r={grounded ? 20 : 16} fill={ink} opacity={0.12} />
        <circle
          cx={pos.x}
          cy={pos.y}
          r={grounded ? 11 : 7}
          fill={color.field}
          stroke={ink}
          strokeWidth={grounded ? 1.8 : 1.6}
        />
        {grounded && (
          <circle cx={pos.x} cy={pos.y} r={16} fill="none" stroke={ink} strokeWidth={0.9} opacity={0.7} />
        )}
        <path
          d={`M${pos.x} ${pos.y - 4} L${pos.x + 4} ${pos.y} L${pos.x} ${pos.y + 4} L${pos.x - 4} ${pos.y} Z`}
          fill={ink}
        />
      </g>
      <g transform={`translate(${pos.x + 18} ${pos.y - 38})`}>
        <rect
          width={grounded ? 64 : 72}
          height={12}
          rx={2}
          fill={color.rail}
          stroke={ink}
          strokeWidth={0.6}
          opacity={0.9}
        />
        <text
          x={6}
          y={9}
          fill={ink}
          fontFamily={type.family}
          fontSize={8}
          letterSpacing="0.12em"
        >
          {grounded ? "GROUNDED" : "UNGROUNDED"}
        </text>
      </g>
      {script.line && (
        <g transform={`translate(${pos.x + 16} ${pos.y - 22})`}>
          <rect
            width={Math.min(228, 12 + script.line.length * 6.2)}
            height={22}
            rx={3}
            fill={color.rail}
            stroke={ink}
            strokeWidth={0.8}
            opacity={0.92}
          />
          <text
            x={8}
            y={15}
            fill={color.type}
            fontFamily={type.family}
            fontSize={10}
            letterSpacing="0.04em"
          >
            {script.line}
          </text>
        </g>
      )}
    </g>
  );
}
