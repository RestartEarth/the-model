import { useEffect, useRef, useState } from "react";
import { color, type } from "../design/tokens";
import { LOOP_STATIONS } from "../graph/meridian";
import type { LoopStation } from "../stage/types";

const ORBIT =
  "M 250 90 C 500 40, 650 40, 800 70 C 1100 40, 1400 80, 1480 140 C 1540 300, 1560 600, 1500 780 C 1300 880, 1000 890, 800 860 C 450 880, 200 860, 160 820 C 80 600, 80 250, 250 90";

const ORDER = LOOP_STATIONS.map((s) => s.id);

function fractionFor(station: LoopStation): number {
  if (station === "none") return 0;
  const i = ORDER.indexOf(station);
  return i < 0 ? 0 : i / ORDER.length;
}

export function ControlLoop({
  active,
  tour,
  verified,
  reduced,
}: {
  active: LoopStation;
  tour: boolean;
  verified: boolean;
  reduced: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pt, setPt] = useState({ x: LOOP_STATIONS[0]!.x, y: LOOP_STATIONS[0]!.y });
  const tRef = useRef(0);
  const ink = verified ? color.healthy : color.focus;
  const activeIdx = active === "none" ? -1 : ORDER.indexOf(active);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const place = (t: number) => {
      const p = path.getPointAtLength(((t % 1) + 1) % 1 * len);
      setPt({ x: p.x, y: p.y });
    };

    if (reduced) {
      tRef.current = fractionFor(active);
      place(tRef.current);
      return;
    }

    let raf = 0;
    const started = performance.now();
    const from = tRef.current;
    const to = tour ? from + 1 : fractionFor(active);
    const dur = tour ? 4200 : 1400;

    const step = (now: number) => {
      const k = Math.min(1, (now - started) / dur);
      const ease = 1 - Math.pow(1 - k, 3);
      const t = from + (to - from) * ease;
      tRef.current = ((t % 1) + 1) % 1;
      place(t);
      if (k < 1) raf = requestAnimationFrame(step);
      else if (tour) {
        tRef.current = fractionFor(active);
        place(tRef.current);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, tour, reduced]);

  return (
    <g className="control-loop">
      <path
        ref={pathRef}
        d={ORBIT}
        fill="none"
        stroke={ink}
        strokeWidth={1.05}
        strokeDasharray="3 10"
        opacity={0.4}
      />
      {LOOP_STATIONS.map((s, i) => {
        const current = active === s.id;
        const on = activeIdx >= 0 && i <= activeIdx;
        return (
          <g key={s.id}>
            <circle
              cx={s.x}
              cy={s.y}
              r={current ? 11 : 6}
              fill={current ? ink : "none"}
              stroke={on || current ? ink : color.typeDim}
              strokeWidth={1.1}
              opacity={current ? 0.28 : 0.8}
            />
            <text
              x={s.x}
              y={s.y + (s.y < 200 ? -16 : 22)}
              textAnchor="middle"
              fill={current ? color.type : on ? ink : color.typeDim}
              fontFamily={type.family}
              fontSize={current ? 13 : 11}
              letterSpacing="0.16em"
            >
              {s.label.toUpperCase()}
            </text>
          </g>
        );
      })}
      <circle cx={pt.x} cy={pt.y} r={18} fill={ink} opacity={0.14} />
      <circle cx={pt.x} cy={pt.y} r={6} fill={color.field} stroke={ink} strokeWidth={1.8} />
    </g>
  );
}
