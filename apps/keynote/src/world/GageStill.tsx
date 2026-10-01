import { useEffect, useState } from "react";
import { color, type } from "../design/tokens";
import { periodNode, visiblePeriod } from "../graph/period";
import { usePrefersReducedMotion } from "../stage/hooks";
import type { WorldState } from "../stage/types";
import gageStill from "../assets/gage/john-gage-2008.jpg";

/**
 * Archival still of John Gage, graded into the keynote field.
 * The photograph stays clean — no soma cosmos, gold nerves, or starfield
 * on the face. Teal period scaffolding (workstations, Ethernet, earliest
 * internet) stays left of the portrait while the still is up, then the
 * photo yields so the 1984 graph can take the frame.
 * Source: Wikimedia Commons File:John Gage (2).jpg — Joi Ito, 5 Oct 2008, CC BY 2.0.
 * Not a Sun labs interior. Attribution lives on the presenter HUD.
 */
export function GageStill({ world }: { world: WorldState }) {
  const reduced = usePrefersReducedMotion();
  const [fadedIn, setFadedIn] = useState(reduced);
  const [pulse, setPulse] = useState(0.28);
  const layer = world.periodTech;
  const recede = layer >= 2 || world.showTitle;
  const hidePhoto = world.showTitle;
  const portrait = !recede && !hidePhoto;
  const period = visiblePeriod(layer);

  useEffect(() => {
    if (reduced) {
      setFadedIn(true);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setFadedIn(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || layer === 0) {
      setPulse(0.28);
      return;
    }
    let raf = 0;
    const started = performance.now();
    const step = (now: number) => {
      setPulse(((now - started) * 0.05) / 1000);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, layer]);

  return (
    <div
      className={`gage-still${fadedIn ? " is-in" : ""}${recede ? " is-receding" : ""}${hidePhoto ? " is-title" : ""}`}
      aria-label="John Gage, Sun Microsystems, 1984"
    >
      <img
        className="gage-still-photo"
        src={gageStill}
        alt="John Gage, photographed by Joi Ito, 5 October 2008"
      />
      <div className="gage-still-grade" />

      {layer > 0 && !hidePhoto && (
        <svg
          className="gage-still-period"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {portrait && (
            <defs>
              <clipPath id="gage-period-left">
                <rect x="0" y="0" width="480" height="900" />
              </clipPath>
            </defs>
          )}
          <g clipPath={portrait ? "url(#gage-period-left)" : undefined}>
            {period.edges.map((e) => {
              const a = periodNode(e.source);
              const b = periodNode(e.target);
              if (!a || !b) return null;
              return (
                <line
                  key={`${e.source}-${e.target}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={e.bus ? color.healthy : color.edgeActive}
                  strokeWidth={e.bus ? 1.7 : 1.1}
                  strokeLinecap="round"
                  opacity={e.bus ? 0.72 : 0.5}
                />
              );
            })}
            {period.nodes.map((n) => (
              <g key={n.id}>
                <rect
                  x={n.x - 22}
                  y={n.y - 11}
                  width={44}
                  height={22}
                  rx={4}
                  fill={color.healthyFill}
                  stroke={color.healthy}
                  strokeWidth={1.1}
                />
                <text
                  x={n.x}
                  y={n.y + 22}
                  textAnchor="middle"
                  fill={color.typeMuted}
                  fontFamily={type.family}
                  fontSize={9}
                  letterSpacing="0.12em"
                >
                  {n.label.toUpperCase()}
                </text>
              </g>
            ))}
            {period.edges
              .filter((e) => e.bus || layer >= 2)
              .slice(0, layer >= 2 ? 4 : 2)
              .map((e, i) => {
                const a = periodNode(e.source);
                const b = periodNode(e.target);
                if (!a || !b) return null;
                const t = reduced ? 0.28 + i * 0.18 : (pulse + i * 0.25) % 1;
                return (
                  <circle
                    key={`pkt-${i}`}
                    cx={a.x + (b.x - a.x) * t}
                    cy={a.y + (b.y - a.y) * t}
                    r={2.2}
                    fill={color.healthy}
                    opacity={0.85}
                  />
                );
              })}
          </g>
        </svg>
      )}
    </div>
  );
}
