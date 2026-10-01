import { useEffect, useRef, useState } from "react"
import { color, type } from "../design/tokens"
import {
  COURT_BACKBOARD,
  COURT_DEFENDER,
  COURT_FLOOR_LEFT,
  COURT_FLOOR_RIGHT,
  COURT_FLOOR_Y,
  COURT_HOOP,
  COURT_LOOP_PATH,
  COURT_LOOP_STATIONS,
  COURT_MOTOR_CHAIN,
  COURT_PERCEPTION,
  COURT_POLE,
  COURT_RIM_RX,
  COURT_SHOT_ARC,
  TEAM_DEFENDERS,
  TEAM_LINKS,
  TEAM_PASS_ROUTE,
  TEAM_PLAYERS,
  TEAM_SIGNALS,
  teamPlayer,
} from "../graph/court"
import { somaNode } from "../graph/soma"
import { useClock } from "../stage/hooks"
import type { WorldState } from "../stage/types"

/**
 * Basketball — the shot, then the team.
 *
 * Rendered as a `<g>` inside Soma's SVG rather than as its own layer, so it
 * inherits the prelude camera and sits in the same gold-on-navy world the body
 * was disclosed in. The shooter is the soma figure itself; this file only adds
 * what the body cannot supply (a basket, a defender, a ball) and the motion
 * that makes the point (perception inward, motor command outward, feedback
 * around).
 *
 * Everything is dots and hairlines in `somaNerve` gold. No court markings, no
 * jerseys, no crowd — the visual claim is "this is the same network you have
 * been watching for four minutes," and any illustrative detail would break it.
 */

function quad(
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  t: number
) {
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  }
}

/**
 * A person as an asterism — same vocabulary as the society figures in the
 * prelude (`PersonAsterism` in Soma.tsx), rebuilt here for court-scale heights
 * and with an `armsUp` variant for defenders.
 */
function Figure({
  x,
  y,
  h,
  ink,
  opacity = 0.8,
  armsUp = false,
}: {
  x: number
  y: number
  h: number
  ink: string
  opacity?: number
  armsUp?: boolean
}) {
  const u = h / 24
  const pts = [
    { id: "head", x, y: y - 16 * u, r: 1.9 },
    { id: "neck", x, y: y - 8 * u, r: 1.2 },
    { id: "shoulder-l", x: x - 7 * u, y: y - 5 * u, r: 1.2 },
    { id: "shoulder-r", x: x + 7 * u, y: y - 5 * u, r: 1.2 },
    {
      id: "hand-l",
      x: x - (armsUp ? 10 : 12) * u,
      y: y - (armsUp ? 17 : 2) * u,
      r: 1.2,
    },
    {
      id: "hand-r",
      x: x + (armsUp ? 10 : 12) * u,
      y: y - (armsUp ? 17 : 2) * u,
      r: 1.2,
    },
    { id: "hip-l", x: x - 4.5 * u, y: y + 6 * u, r: 1.2 },
    { id: "hip-r", x: x + 4.5 * u, y: y + 6 * u, r: 1.2 },
    { id: "foot-l", x: x - 6 * u, y: y + 8 * u, r: 1.1 },
    { id: "foot-r", x: x + 6 * u, y: y + 8 * u, r: 1.1 },
  ]
  const links: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [2, 6],
    [3, 7],
    [6, 7],
    [6, 8],
    [7, 9],
  ]
  return (
    <g opacity={opacity}>
      {links.map(([a, b], i) => {
        const from = pts[a]!
        const to = pts[b]!
        return (
          <path
            key={i}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            fill="none"
            stroke={ink}
            strokeWidth={0.9}
            opacity={0.56}
          />
        )
      })}
      {pts.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r={p.r} fill={ink} opacity={0.86} />
      ))}
    </g>
  )
}

function Basket({ ink, lit }: { ink: string; lit: number }) {
  return (
    <g opacity={lit}>
      <path
        d={`M ${COURT_POLE.x} ${COURT_POLE.y} L ${COURT_POLE.x} ${COURT_POLE.y2}`}
        stroke={ink}
        strokeWidth={1.1}
        opacity={0.4}
      />
      <rect
        x={COURT_BACKBOARD.x}
        y={COURT_BACKBOARD.y}
        width={COURT_BACKBOARD.w}
        height={COURT_BACKBOARD.h}
        fill={ink}
        opacity={0.3}
      />
      <ellipse
        cx={COURT_HOOP.x}
        cy={COURT_HOOP.y}
        rx={COURT_RIM_RX}
        ry={7}
        fill="none"
        stroke={ink}
        strokeWidth={1.6}
        opacity={0.9}
      />
      {/* Net as four hanging hairlines, not a mesh. */}
      {[-0.7, -0.24, 0.24, 0.7].map((k, i) => (
        <path
          key={i}
          d={`M ${COURT_HOOP.x + k * COURT_RIM_RX} ${COURT_HOOP.y + 4} Q ${
            COURT_HOOP.x + k * COURT_RIM_RX * 0.5
          } ${COURT_HOOP.y + 24} ${COURT_HOOP.x + k * COURT_RIM_RX * 0.3} ${
            COURT_HOOP.y + 34
          }`}
          fill="none"
          stroke={ink}
          strokeWidth={0.8}
          opacity={0.45}
        />
      ))}
    </g>
  )
}

/**
 * Stage 1. Six streams converge on the brain, each labelled with what it
 * carries rather than which organ sensed it — the point is distributed input,
 * not a list of five senses. Dots travel inward so the direction of the claim
 * ("perception becomes a model") is legible without narration.
 */
function Perception({ t, reduced }: { t: number; reduced: boolean }) {
  const ink = color.somaSpark
  return (
    <g>
      {COURT_PERCEPTION.map((p, i) => {
        const end = p.via ? somaNode(p.via) : null
        const to = end ?? { x: 800, y: 440 }
        const cx = (p.x + to.x) / 2
        const cy = Math.min(p.y, to.y) - 52
        const phase = reduced ? 0.55 : (t * 0.5 + i * 0.17) % 1
        const dot = quad(p, { x: cx, y: cy }, to, phase)
        return (
          <g key={p.id}>
            <path
              d={`M ${p.x} ${p.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
              fill="none"
              stroke={ink}
              strokeWidth={0.9}
              opacity={0.34}
            />
            <circle cx={p.x} cy={p.y} r={2.6} fill={ink} opacity={0.72} />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize={10}
              letterSpacing="0.16em"
            >
              {p.label}
            </text>
            <circle cx={dot.x} cy={dot.y} r={2.2} fill={ink} opacity={0.95} />
          </g>
        )
      })}
    </g>
  )
}

/**
 * Stage 2. One pulse runs the motor chain in order, then the ball leaves the
 * hand. The chain is drawn over the body's own nerve edges, so what the
 * audience sees is the network they already know firing in sequence — no
 * single node of it produces the shot.
 */
function Motor({ t, reduced }: { t: number; reduced: boolean }) {
  const pts = COURT_MOTOR_CHAIN.map((id) => somaNode(id)).filter(
    (n): n is NonNullable<ReturnType<typeof somaNode>> => Boolean(n)
  )
  if (pts.length < 2) return null

  // 2.4s to travel the chain, then the ball flies for 1.1s, then a 0.9s rest.
  const cycle = 4.4
  const local = reduced ? 1.6 : t % cycle
  const chainT = Math.min(1, local / 2.4)
  const flightT = local > 2.4 ? Math.min(1, (local - 2.4) / 1.1) : 0
  const seg = chainT * (pts.length - 1)
  const i = Math.max(0, Math.min(pts.length - 2, Math.floor(seg)))
  const f = seg - i
  const a = pts[i]!
  const b = pts[i + 1]!
  const head = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
  const ball =
    flightT > 0
      ? quad(COURT_SHOT_ARC.from, COURT_SHOT_ARC.apex, COURT_SHOT_ARC.to, flightT)
      : COURT_SHOT_ARC.from

  return (
    <g>
      {pts.slice(0, -1).map((p, k) => {
        const n = pts[k + 1]!
        const lit = seg >= k
        return (
          <path
            key={`${p.x}-${p.y}-${k}`}
            d={`M ${p.x} ${p.y} L ${n.x} ${n.y}`}
            fill="none"
            stroke={lit ? color.somaSpark : color.somaNerve}
            strokeWidth={lit ? 2.1 : 1.1}
            strokeLinecap="round"
            opacity={lit ? 0.85 : 0.3}
          />
        )
      })}
      <circle
        cx={head.x}
        cy={head.y}
        r={9}
        fill={color.somaSpark}
        opacity={0.16}
      />
      <circle cx={head.x} cy={head.y} r={3.2} fill={color.somaSpark} />

      {flightT > 0 && (
        <path
          d={`M ${COURT_SHOT_ARC.from.x} ${COURT_SHOT_ARC.from.y} Q ${COURT_SHOT_ARC.apex.x} ${COURT_SHOT_ARC.apex.y} ${COURT_SHOT_ARC.to.x} ${COURT_SHOT_ARC.to.y}`}
          fill="none"
          stroke={color.somaOrgan}
          strokeWidth={0.9}
          strokeDasharray="3 7"
          opacity={0.4}
        />
      )}
      <circle cx={ball.x} cy={ball.y} r={7} fill={color.somaOrgan} opacity={0.9} />
    </g>
  )
}

/**
 * Stage 3. The same five-station loop the enterprise will run at the end of
 * the show, at the scale of one nervous system. Named with the body's verbs
 * (perceive/predict/sense) rather than the operations verbs, so the final beat
 * can land the rhyme instead of repeating a label.
 */
function BodyLoop({ t, reduced }: { t: number; reduced: boolean }) {
  const ink = color.somaNerve
  const pathRef = useRef<SVGPathElement>(null)
  const [pt, setPt] = useState<{ x: number; y: number }>({
    x: COURT_LOOP_STATIONS[0].x,
    y: COURT_LOOP_STATIONS[0].y,
  })

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    const frac = reduced ? 0.12 : (t * 0.22) % 1
    const p = path.getPointAtLength(frac * len)
    setPt({ x: p.x, y: p.y })
  }, [t, reduced])

  const active = reduced
    ? 0
    : Math.floor(((t * 0.22) % 1) * COURT_LOOP_STATIONS.length)

  return (
    <g>
      <path
        ref={pathRef}
        d={COURT_LOOP_PATH}
        fill="none"
        stroke={ink}
        strokeWidth={1}
        strokeDasharray="3 9"
        opacity={0.42}
      />
      {COURT_LOOP_STATIONS.map((s, i) => (
        <g key={s.id}>
          <circle
            cx={s.x}
            cy={s.y}
            r={i === active ? 9 : 5}
            fill={i === active ? ink : "none"}
            stroke={ink}
            strokeWidth={1.1}
            opacity={i === active ? 0.32 : 0.7}
          />
          <text
            x={s.x}
            y={s.y + (s.y < 340 ? -14 : 20)}
            textAnchor="middle"
            fill={i === active ? color.type : color.typeMuted}
            fontFamily={type.family}
            fontSize={i === active ? 12 : 10.5}
            letterSpacing="0.16em"
          >
            {s.label.toUpperCase()}
          </text>
        </g>
      ))}
      <circle cx={pt.x} cy={pt.y} r={14} fill={ink} opacity={0.14} />
      <circle
        cx={pt.x}
        cy={pt.y}
        r={4.4}
        fill={color.field}
        stroke={ink}
        strokeWidth={1.6}
      />
    </g>
  )
}

/**
 * The team. Stage 1 shows only relationships — the structure practice built,
 * before any ball moves. Stage 2 adds the live signals and one pass. Stage 3
 * drops the figures' weight and lifts the edges, so what is left on screen is
 * the system rather than the five people in it: the visual form of "the
 * intelligence lives in the system."
 */
function Team({
  stage,
  t,
  reduced,
}: {
  stage: 1 | 2 | 3
  t: number
  reduced: boolean
}) {
  const ink = color.somaNerve
  const figureOpacity = stage === 3 ? 0.3 : 0.82
  const edgeOpacity = stage === 3 ? 0.9 : 0.42
  const passSeg = TEAM_PASS_ROUTE.length - 1
  const passLocal = reduced ? 0.6 : (t * 0.42) % 1
  const passIdx = Math.min(passSeg - 1, Math.floor(passLocal * passSeg))
  const passF = passLocal * passSeg - passIdx
  const from = teamPlayer(TEAM_PASS_ROUTE[passIdx])
  const to = teamPlayer(TEAM_PASS_ROUTE[passIdx + 1])
  const ball =
    from && to
      ? {
          x: from.x + (to.x - from.x) * passF,
          y: from.y - 40 + (to.y - 40 - (from.y - 40)) * passF,
        }
      : null

  return (
    <g>
      <path
        d={`M ${COURT_FLOOR_LEFT} ${COURT_FLOOR_Y} L ${COURT_FLOOR_RIGHT} ${COURT_FLOOR_Y}`}
        stroke={ink}
        strokeWidth={0.9}
        opacity={0.22}
      />

      {TEAM_LINKS.filter((l) => l.stage <= (stage === 1 ? 1 : 2)).map((l, i) => {
        const a = teamPlayer(l.source)
        const b = teamPlayer(l.target)
        if (!a || !b) return null
        const live = stage >= 2 && l.stage === 2
        return (
          <path
            key={`${l.source}-${l.target}`}
            d={`M ${a.x} ${a.y - 40} L ${b.x} ${b.y - 40}`}
            fill="none"
            stroke={stage === 3 ? color.somaSpark : ink}
            strokeWidth={stage === 3 ? 1.5 : 1}
            strokeDasharray={live && !reduced ? "4 8" : undefined}
            opacity={edgeOpacity}
            className={live && !reduced ? "edge-flow" : undefined}
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        )
      })}

      {stage >= 2 &&
        TEAM_SIGNALS.map((sig) => {
          const a = teamPlayer(sig.source)
          const b = teamPlayer(sig.target)
          if (!a || !b) return null
          return (
            <text
              key={sig.id}
              x={(a.x + b.x) / 2}
              y={(a.y + b.y) / 2 - 48}
              textAnchor="middle"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize={9.5}
              letterSpacing="0.18em"
              opacity={0.85}
            >
              {sig.label}
            </text>
          )
        })}

      {TEAM_DEFENDERS.map((d, i) => (
        <Figure
          key={i}
          x={d.x}
          y={d.y}
          h={d.h}
          ink={color.typeDim}
          opacity={stage === 3 ? 0.16 : 0.42}
          armsUp
        />
      ))}

      {TEAM_PLAYERS.map((p) => (
        <Figure
          key={p.id}
          x={p.x}
          y={p.y}
          h={p.h}
          ink={ink}
          opacity={figureOpacity}
        />
      ))}

      {stage === 2 && ball && (
        <circle cx={ball.x} cy={ball.y} r={6.5} fill={color.somaOrgan} opacity={0.92} />
      )}
    </g>
  )
}

export function Court({
  world,
  reduced,
}: {
  world: WorldState
  reduced: boolean
}) {
  const active = world.court > 0 || world.team > 0
  const t = useClock(active, reduced)
  if (!active) return null

  // The basket only belongs to the shot sequence; the team beats are about
  // relationships between actors, and a rim on screen pulls the eye to a
  // target the beat is not about.
  const showBasket = world.court > 0

  return (
    <g className="court">
      {world.court > 0 && (
        <path
          d={`M ${COURT_FLOOR_LEFT} ${COURT_FLOOR_Y} L ${COURT_FLOOR_RIGHT} ${COURT_FLOOR_Y}`}
          stroke={color.somaNerve}
          strokeWidth={0.9}
          opacity={0.24}
        />
      )}
      {showBasket && <Basket ink={color.somaNerve} lit={0.8} />}
      {world.court > 0 && (
        <Figure
          x={COURT_DEFENDER.x}
          y={COURT_DEFENDER.y}
          h={COURT_DEFENDER.h}
          ink={color.typeMuted}
          opacity={0.62}
          armsUp
        />
      )}
      {world.court === 1 && <Perception t={t} reduced={reduced} />}
      {world.court === 2 && <Motor t={t} reduced={reduced} />}
      {world.court === 3 && (
        <>
          <Motor t={t} reduced={reduced} />
          <BodyLoop t={t} reduced={reduced} />
        </>
      )}
      {world.team > 0 && (
        <Team stage={world.team as 1 | 2 | 3} t={t} reduced={reduced} />
      )}
    </g>
  )
}
