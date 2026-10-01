import { useEffect, useState } from "react"
import { color, type } from "../design/tokens"
import type { WorldState } from "../stage/types"

/**
 * Life of the Packet — a thirty-second visual callback, not a lesson.
 *
 * This used to be a fifteen-beat walk through circuit switching, TTL, TCP,
 * MPLS, VPN, QoS and SD-WAN. In the recast show it exists for one reason: to
 * earn the jump from Gage's sentence to a planet-scale enterprise by showing,
 * without narration, that we did build computing this way. The audience
 * already understands networking conceptually; four stages is enough.
 *
 *   1 open     a parcel with a source, a destination, and evidence it arrived
 *   2 circuit  a path reserved for the whole call — fair, wasteful
 *   3 hop      a path chosen per hop — efficient, not fair
 *   4 layers   thought descends through layers to become a pulse on a wire
 *
 * After `credit` (After Robert M. Kettles — Life of the Packet, 2022).
 */

const SRC = { x: 280, y: 360 }
const DST = { x: 1320, y: 360 }
const HOPS = [
  { id: "h1", x: 560, y: 360, label: "HOP" },
  { id: "h2", x: 800, y: 360, label: "HOP" },
  { id: "h3", x: 1040, y: 360, label: "HOP" },
] as const

const LAYERS = [
  { id: "thought", y: 160, label: "THOUGHT", ink: color.somaMedia },
  { id: "session", y: 250, label: "SESSION", ink: color.somaSpark },
  { id: "path", y: 360, label: "PATH", ink: color.somaFood },
  { id: "hop", y: 450, label: "HOP", ink: color.somaHormone },
  { id: "wire", y: 540, label: "WIRE", ink: color.somaWater },
] as const

function useClock(run: boolean, speed: number, reduced: boolean) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!run || reduced) return
    let raf = 0
    let last = performance.now()
    const step = (now: number) => {
      setT((v) => v + ((now - last) / 1000) * speed)
      last = now
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, speed, reduced])
  return t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function along(pts: ReadonlyArray<{ x: number; y: number }>, u: number) {
  if (pts.length < 2) return pts[0] ?? { x: 0, y: 0 }
  const t = ((u % 1) + 1) % 1
  const segs = pts.length - 1
  const f = t * segs
  const i = Math.min(segs - 1, Math.floor(f))
  const s = f - i
  return {
    x: lerp(pts[i]!.x, pts[i + 1]!.x, s),
    y: lerp(pts[i]!.y, pts[i + 1]!.y, s),
  }
}

function Label({
  x,
  y,
  children,
  opacity = 1,
  size = 22,
  gold = false,
}: {
  x: number
  y: number
  children: string
  opacity?: number
  size?: number
  gold?: boolean
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
  )
}

function Star({
  x,
  y,
  r,
  ink,
  opacity = 0.9,
}: {
  x: number
  y: number
  r: number
  ink: string
  opacity?: number
}) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={r * 2.6} fill={ink} opacity={0.16} />
      <circle cx={x} cy={y} r={r} fill={ink} />
    </g>
  )
}

const PATH_MAIN = [SRC, ...HOPS.map((h) => ({ x: h.x, y: h.y })), DST]
/** The per-hop choice: same endpoints, a different way across. */
const PATH_ALT = [
  SRC,
  { x: 560, y: 250 },
  { x: 800, y: 210 },
  { x: 1040, y: 270 },
  DST,
]
const PATH_DOWN = LAYERS.map((L) => ({ x: 800, y: L.y }))

export function PacketLife({ world }: { world: WorldState }) {
  const phase = world.packetLife
  const reduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  const t = useClock(phase > 0 && !reduced, 0.22, reduced)

  const route = phase === 4 ? PATH_DOWN : phase === 3 ? PATH_ALT : PATH_MAIN
  const parcel = along(route, reduced ? 0.42 : t)
  const showLayers = phase === 4
  const circuit = phase === 2
  const hopFind = phase === 3

  return (
    <svg
      className="stage-graph"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A packet crossing a network"
    >
      {showLayers &&
        LAYERS.map((L) => (
          <g key={L.id}>
            <line
              x1={220}
              y1={L.y}
              x2={1380}
              y2={L.y}
              stroke={L.ink}
              strokeWidth={1.1}
              opacity={0.42}
            />
            <text
              x={200}
              y={L.y + 4}
              textAnchor="end"
              fill={L.ink}
              fontFamily={type.family}
              fontSize={12}
              letterSpacing="0.18em"
              opacity={1}
            >
              {L.label}
            </text>
          </g>
        ))}

      {!showLayers && (
        <>
          {/* The reserved circuit is drawn solid and thick; the packet-switched
              path stays a thin dashed hairline, so the "fair but wasteful /
              efficient but not fair" contrast is carried by weight. */}
          <polyline
            points={PATH_MAIN.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={circuit ? color.somaFood : color.edge}
            strokeWidth={circuit ? 4.2 : 1.3}
            strokeDasharray={circuit ? undefined : "4 9"}
            opacity={circuit ? 0.85 : 0.55}
          />
          {hopFind && (
            <polyline
              points={PATH_ALT.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={color.focus}
              strokeWidth={1.8}
              strokeDasharray="6 7"
              opacity={0.8}
            />
          )}

          <Star x={SRC.x} y={SRC.y} r={5} ink={color.somaSpark} />
          <Star x={DST.x} y={DST.y} r={5} ink={color.somaSpark} />
          <Label x={SRC.x} y={SRC.y - 30} size={15}>
            SOURCE
          </Label>
          <Label x={DST.x} y={DST.y - 30} size={15}>
            DESTINATION
          </Label>

          {HOPS.map((h) => (
            <g key={h.id}>
              <Star x={h.x} y={h.y} r={3.2} ink={color.focus} />
              {hopFind && (
                <Label x={h.x} y={h.y - 28} size={16}>
                  {h.label}
                </Label>
              )}
            </g>
          ))}
        </>
      )}

      <Star x={parcel.x} y={parcel.y} r={7} ink={color.somaHormone} />
      {phase === 1 && (
        <Label x={parcel.x} y={parcel.y - 28} size={16} gold>
          PARCEL
        </Label>
      )}

      <text
        x={800}
        y={858}
        textAnchor="middle"
        fill={color.typeDim}
        fontFamily={type.family}
        fontSize={10}
        letterSpacing="0.2em"
      >
        LIFE OF THE PACKET
      </text>
    </svg>
  )
}
