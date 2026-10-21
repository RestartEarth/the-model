import { useEffect, useRef, useState } from "react"
import { color, type } from "../design/tokens"
import {
  COURT_BACKBOARD,
  COURT_FLOOR_LEFT,
  COURT_FLOOR_RIGHT,
  COURT_FLOOR_Y,
  COURT_HOOP,
  COURT_LOOP_PATH,
  COURT_LOOP_STATIONS,
  COURT_MOTOR_CHAIN,
  COURT_PERCEPTION,
  SHOT_ACTION,
  SHOT_SYSTEMS,
  COURT_POLE,
  COURT_RIM_RX,
  OG_BRANCHES,
  OG_PASS,
  OG_MIND,
  OG_SENSES,
  OG_SYSTEMS,
  TEAM_HOOP,
  courtLines,
  TEAM_LINKS,
  TEAM_POLE,
  TEAM_RIM_RX,
  TEAM_BACKBOARD,
  TIP_CYCLE,
  TIP_GATHER,
  TIP_HOLD,
  SOLO_CHAIN,
  possessionClock,
  possessionSpan,
  miniEdges,
  miniNode,
  soloShotClock,
  soloShotFrame,
  tipPlay,
} from "../graph/court"
import type { MiniNode } from "../graph/court"
import { somaNode } from "../graph/soma"
import { useClock } from "../stage/hooks"
import type { TeamMind } from "../graph/court"
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
 * crowd. The Knicks wear a blue wash and an orange number over that same
 * skeleton — the anatomy stays in front of the cloth.
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
 * Chest glyphs. Local +y points up the torso. Each digit is a stroke, not a
 * fill, so the ribs and the sternum still show through it.
 */
const JERSEY_GLYPH: Record<string, Array<Array<[number, number]>>> = {
  "0": [[[-0.62, 1.15], [0.62, 1.15], [0.62, -1.15], [-0.62, -1.15], [-0.62, 1.15]]],
  "1": [[[-0.38, 0.72], [0.08, 1.15], [0.08, -1.15]], [[-0.42, -1.15], [0.48, -1.15]]],
  "2": [[[-0.62, 0.62], [-0.28, 1.15], [0.5, 1.15], [0.68, 0.55], [-0.62, -1.15], [0.72, -1.15]]],
  "3": [[[-0.55, 1.05], [0.48, 1.15], [0.68, 0.55], [0.1, 0.12], [0.68, -0.28], [0.48, -1.15], [-0.58, -1.02]]],
  "5": [[[0.62, 1.15], [-0.58, 1.15], [-0.62, 0.12], [0.42, 0.22], [0.68, -0.42], [0.35, -1.15], [-0.62, -1.02]]],
  "8": [
    [[-0.5, 0.08], [-0.62, 0.62], [0, 1.15], [0.62, 0.62], [0.5, 0.08], [-0.5, 0.08]],
    [[-0.55, -0.02], [-0.68, -0.62], [0, -1.15], [0.68, -0.62], [0.55, -0.02]],
  ],
}

const SHIRT = ["shoulder-l", "neck", "shoulder-r", "rib-r", "rib-r2", "hip-r", "pelvis", "hip-l", "rib-l2", "rib-l"]

function shirtPoint(nodes: MiniNode[], id: string) {
  return miniNode(nodes, id)
}

/**
 * Knicks cloth over the torso only. The wash sits behind the skeleton; the
 * orange number and the neck/hem trim sit on the chest and leave the arms,
 * head, and legs alone.
 */
function KnicksJersey({
  nodes,
  number,
  layer,
}: {
  nodes: MiniNode[]
  number: string
  /** Cloth behind the skeleton, marks in front of the lines and under the joints. */
  layer: "cloth" | "marks"
}) {
  const poly = SHIRT.map((id) => shirtPoint(nodes, id)).filter((p): p is MiniNode => Boolean(p))
  if (poly.length < 6) return null
  const shirt = poly.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z"
  if (layer === "cloth") return <path d={shirt} fill={color.knicksBlueFill} />

  const chain = (ids: string[]) => {
    const pts = ids.map((id) => shirtPoint(nodes, id)).filter((p): p is MiniNode => Boolean(p))
    if (pts.length < 2) return null
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  }
  const neck = chain(["shoulder-l", "neck", "shoulder-r"])
  const hem = chain(["hip-l", "pelvis", "hip-r"])
  const thorax = shirtPoint(nodes, "thorax")
  const pelvis = shirtPoint(nodes, "pelvis")
  const shoulderL = shirtPoint(nodes, "shoulder-l")
  const shoulderR = shirtPoint(nodes, "shoulder-r")
  const marks = (
    <>
      {neck && (
        <path d={neck} fill="none" stroke={color.knicksOrange} strokeWidth={1.35} strokeLinecap="round" opacity={0.9} />
      )}
      {hem && (
        <path d={hem} fill="none" stroke={color.knicksOrange} strokeWidth={1.15} strokeLinecap="round" opacity={0.75} />
      )}
    </>
  )
  if (!thorax || !pelvis || !shoulderL || !shoulderR) return <g>{marks}</g>

  const ux = thorax.x - pelvis.x
  const uy = thorax.y - pelvis.y
  const ulen = Math.hypot(ux, uy) || 1
  const upx = ux / ulen
  const upy = uy / ulen
  let rx = -upy
  let ry = upx
  const towardRight = (shoulderR.x - shoulderL.x) * rx + (shoulderR.y - shoulderL.y) * ry
  if (towardRight < 0) {
    rx = -rx
    ry = -ry
  }
  const shoulderW = Math.hypot(shoulderR.x - shoulderL.x, shoulderR.y - shoulderL.y)
  const numH = shoulderW * 0.36
  const scale = numH / 2.5
  const gap = 0.42
  const digitW = 1.5
  const total = number.length * digitW + (number.length - 1) * gap
  const origin = {
    x: thorax.x - upx * numH * 0.08,
    y: thorax.y - upy * numH * 0.08,
  }
  const stroke = Math.max(1.15, numH * 0.075)
  return (
    <g>
      {marks}
      {number.split("").map((ch, index) => {
        const glyph = JERSEY_GLYPH[ch]
        if (!glyph) return null
        const shift = index * (digitW + gap) + digitW / 2 - total / 2
        return glyph.map((strokePts, s) => {
          const d = strokePts
            .map(([x, y], i) => {
              const px = origin.x + rx * (x + shift) * scale + upx * y * scale
              const py = origin.y + ry * (x + shift) * scale + upy * y * scale
              return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`
            })
            .join(" ")
          return (
            <path
              key={`${ch}-${index}-${s}`}
              d={d}
              fill="none"
              stroke={color.knicksOrange}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.92}
            />
          )
        })
      })}
    </g>
  )
}

/**
 * The soma, reduced to its structural joints. Same proportions as the body
 * in the prelude — crown, ribs, shoulders, the two arms, the two legs — at
 * whatever height the court needs. `floorY` is where the feet plant.
 */
function SomaMini({
  nodes,
  ink,
  opacity = 0.86,
  number,
  accent,
  lead,
}: {
  nodes: MiniNode[]
  ink: string
  opacity?: number
  /** Knicks jersey number. */
  number?: string
  /** The hand that tips. Drawn brighter, with orange fingertips, on top of the body. */
  accent?: "r" | "l"
  /** The player the eye should follow when bodies cross. */
  lead?: boolean
}) {
  const edges = miniEdges()
  const onAccent = (id: string) =>
    Boolean(
      accent &&
        (id === `shoulder-${accent}` ||
          id === `humerus-${accent}` ||
          id === `elbow-${accent}` ||
          id === `radius-${accent}` ||
          id === `wrist-${accent}` ||
          id === `hand-${accent}` ||
          id.startsWith(`hand-${accent}-`))
    )
  const arm = "#F6E3B8"
  const body = lead ? "#F6E3B8" : ink
  return (
    <g opacity={opacity}>
      {number && <KnicksJersey nodes={nodes} number={number} layer="cloth" />}
      {edges.map(([a, b], i) => {
        const from = miniNode(nodes, a)
        const to = miniNode(nodes, b)
        if (!from || !to) return null
        const hot = onAccent(a) && onAccent(b)
        return (
          <path
            key={i}
            d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
            fill="none"
            stroke={hot ? arm : body}
            strokeWidth={hot ? 2.15 : lead ? 1.7 : 1.05}
            opacity={hot ? 1 : lead ? 0.95 : 0.62}
          />
        )
      })}
      {number && <KnicksJersey nodes={nodes} number={number} layer="marks" />}
      {nodes.map((p) => {
        const tip = Boolean(accent && p.id.startsWith(`hand-${accent}-`) && p.id.endsWith("-tip"))
        const hot = onAccent(p.id)
        return (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={tip ? p.r * 1.85 : lead ? p.r * 1.2 : p.r}
            fill={tip ? color.knicksOrange : hot || lead ? arm : ink}
            opacity={hot || lead ? 1 : 0.88}
          />
        )
      })}
    </g>
  )
}

function CourtMarks({ ink, opacity }: { ink: string; opacity: number }) {
  const lines = courtLines()
  return (
    <g fill="none" stroke={ink} strokeWidth={0.85} strokeLinejoin="round" opacity={opacity}>
      <path d={lines.boundary} />
      <path d={lines.lane} />
      <path d={lines.foul} />
      <path d={lines.three} />
    </g>
  )
}

function Basket({
  ink,
  lit,
  hoop,
  rimRx,
  backboard,
  pole,
}: {
  ink: string
  lit: number
  hoop: { x: number; y: number }
  rimRx: number
  backboard: { x: number; y: number; w: number; h: number }
  pole: { x: number; y: number; y2: number }
}) {
  return (
    <g opacity={lit}>
      <path
        d={`M ${pole.x} ${pole.y} L ${pole.x} ${pole.y2}`}
        stroke={ink}
        strokeWidth={1.1}
        opacity={0.4}
      />
      <rect
        x={backboard.x}
        y={backboard.y}
        width={backboard.w}
        height={backboard.h}
        fill={ink}
        opacity={0.3}
      />
      <ellipse
        cx={hoop.x}
        cy={hoop.y}
        rx={rimRx}
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
          d={`M ${hoop.x + k * rimRx} ${hoop.y + 4} Q ${
            hoop.x + k * rimRx * 0.5
          } ${hoop.y + 24} ${hoop.x + k * rimRx * 0.3} ${hoop.y + 34}`}
          fill="none"
          stroke={ink}
          strokeWidth={0.8}
          opacity={0.45}
        />
      ))}
    </g>
  )
}

function along(pts: { x: number; y: number }[], t: number) {
  if (pts.length === 0) return { x: 0, y: 0 }
  if (pts.length === 1 || t <= 0) return pts[0]!
  const lens: number[] = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1]!.x - pts[i]!.x, pts[i + 1]!.y - pts[i]!.y)
    lens.push(d)
    total += d
  }
  let remain = Math.min(1, t) * total
  for (let i = 0; i < lens.length; i++) {
    const len = lens[i]!
    if (remain <= len || i === lens.length - 1) {
      const f = len === 0 ? 0 : Math.min(1, remain / len)
      const a = pts[i]!
      const b = pts[i + 1]!
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
    }
    remain -= len
  }
  return pts[pts.length - 1]!
}

/**
 * The pause before the shot. Same picture as the inbound: what is arriving
 * at the brain, the systems already resident, and the network that will
 * take the action. The ball stays in the hand.
 */
function Perception({ t, reduced }: { t: number; reduced: boolean }) {
  const brain = somaNode("cortex-r") ?? { x: 818, y: 429 }
  const ink = color.somaNerve
  const phase = reduced ? 0.62 : (t * 0.32) % 1
  const arm = SHOT_ACTION.map((id) => somaNode(id)).filter(
    (n): n is NonNullable<ReturnType<typeof somaNode>> => Boolean(n)
  )
  const spark = along(arm, phase)
  const held = soloShotFrame(0).ball

  return (
    <g>
      <ellipse
        cx={brain.x - 10}
        cy={brain.y}
        rx={14}
        ry={10}
        fill="none"
        stroke={ink}
        strokeWidth={0.8}
        opacity={0.7}
      />
      <ellipse
        cx={brain.x + 10}
        cy={brain.y}
        rx={14}
        ry={10}
        fill="none"
        stroke={ink}
        strokeWidth={0.8}
        opacity={0.7}
      />

      {COURT_PERCEPTION.map((p) => {
        const from = p.id === "ball" ? held : p
        const c = {
          x: (from.x + brain.x) / 2,
          y: Math.min(from.y, brain.y) - 36,
        }
        const dot = quad(from, c, brain, phase)
        return (
          <g key={p.id}>
            <path
              d={`M ${from.x} ${from.y} Q ${c.x} ${c.y} ${brain.x} ${brain.y}`}
              fill="none"
              stroke={color.somaSpark}
              strokeWidth={0.9}
              opacity={0.55}
            />
            <circle cx={from.x} cy={from.y} r={2.6} fill={color.somaSpark} opacity={0.8} />
            <text
              x={from.x}
              y={from.y - 11}
              textAnchor="middle"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize={10}
              letterSpacing="0.16em"
            >
              {p.label}
            </text>
            <circle cx={dot.x} cy={dot.y} r={2.2} fill={color.somaSpark} opacity={0.95} />
          </g>
        )
      })}

      {SHOT_SYSTEMS.map((s) => (
        <g key={s.id}>
          <path
            d={`M ${s.x} ${s.y} L ${brain.x} ${brain.y}`}
            fill="none"
            stroke={ink}
            strokeWidth={0.8}
            opacity={0.55}
          />
          <circle cx={s.x} cy={s.y} r={2.6} fill={color.somaSpark} opacity={0.9} />
          <text
            x={s.x - 8}
            y={s.y + 3}
            textAnchor="end"
            fill={color.type}
            fontFamily={type.family}
            fontSize={10}
            letterSpacing="0.14em"
          >
            {s.label}
          </text>
        </g>
      ))}

      {arm.slice(0, -1).map((p, i) => {
        const n = arm[i + 1]!
        return (
          <path
            key={`${p.x}-${p.y}`}
            d={`M ${p.x} ${p.y} L ${n.x} ${n.y}`}
            fill="none"
            stroke={color.somaSpark}
            strokeWidth={1.6}
            strokeLinecap="round"
            opacity={0.8}
          />
        )
      })}
      <circle cx={spark.x} cy={spark.y} r={3.2} fill={color.somaSpark} />
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

  // 2.4s to travel the chain. The ball leaves the shooter's fingers on the same clock.
  const local = soloShotClock(t, reduced)
  const chainT = Math.min(1, local / SOLO_CHAIN)
  const seg = chainT * (pts.length - 1)
  const i = Math.max(0, Math.min(pts.length - 2, Math.floor(seg)))
  const f = seg - i
  const a = pts[i]!
  const b = pts[i + 1]!
  const head = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }

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
 * Game 4 board, above the inbounder. Spurs on the left, Knicks on the right,
 * the game clock between them. It stays up through the make and the huddle.
 * At 0.0 the columns give way to one line. The emergence beat takes the
 * board down so the sentence can sit on the five.
 */
function Scoreboard({
  spurs,
  knicks,
  clock,
  banner,
}: {
  spurs: number
  knicks: number
  clock: number
  banner: boolean
}) {
  const x = 560
  const y = 48
  const w = 520
  const h = 72
  const mid = x + w / 2
  const left = x + 108
  const right = x + w - 108
  const ink = color.somaNerve
  return (
    <g
      aria-label={
        banner ? "Knicks in Five!" : `Spurs ${spurs}, Knicks ${knicks}, ${clock.toFixed(1)} seconds`
      }
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={color.fieldDeep}
        stroke={ink}
        strokeWidth={1}
        opacity={0.94}
      />
      {banner ? (
        <text
          x={mid}
          y={y + 46}
          textAnchor="middle"
          fill={ink}
          fontFamily={type.family}
          fontSize={28}
          fontWeight={500}
          letterSpacing="-0.02em"
        >
          Knicks in Five!
        </text>
      ) : (
        <>
          <path
            d={`M ${mid - 54} ${y + 14} L ${mid - 54} ${y + h - 14} M ${mid + 54} ${y + 14} L ${mid + 54} ${y + h - 14}`}
            stroke={ink}
            strokeWidth={0.8}
            opacity={0.35}
          />
          <text
            x={left}
            y={y + 26}
            textAnchor="middle"
            fill={color.typeMuted}
            fontFamily={type.family}
            fontSize={12}
            letterSpacing="0.22em"
          >
            SPURS
          </text>
          <text
            x={left}
            y={y + 54}
            textAnchor="middle"
            fill={color.type}
            fontFamily={type.family}
            fontSize={26}
            fontWeight={500}
          >
            {spurs}
          </text>
          <text
            x={mid}
            y={y + 24}
            textAnchor="middle"
            fill={color.typeDim}
            fontFamily={type.family}
            fontSize={11}
            letterSpacing="0.2em"
          >
            4TH
          </text>
          <text
            x={mid}
            y={y + 54}
            textAnchor="middle"
            fill={ink}
            fontFamily={type.family}
            fontSize={26}
            fontWeight={500}
          >
            {clock.toFixed(1)}
          </text>
          <text
            x={right}
            y={y + 26}
            textAnchor="middle"
            fill={color.typeMuted}
            fontFamily={type.family}
            fontSize={12}
            letterSpacing="0.22em"
          >
            KNICKS
          </text>
          <text
            x={right}
            y={y + 54}
            textAnchor="middle"
            fill={color.type}
            fontFamily={type.family}
            fontSize={26}
            fontWeight={500}
          >
            {knicks}
          </text>
        </>
      )}
    </g>
  )
}

/**
 * The inbound, held. Sensory streams into the skull, then the two branches
 * the model already contains, then the moment they resolve and the crash
 * is the sequence this possession will run.
 */
function OgMind({
  stage,
  t,
  reduced,
}: {
  stage: TeamMind
  t: number
  reduced: boolean
}) {
  const ink = color.somaNerve
  const live = miniNode(
    tipPlay(0).actors.find((a) => a.id === "team-og")?.nodes ?? [],
    "skull"
  )
  const dx = (live?.x ?? OG_MIND.x) - OG_MIND.x
  const dy = (live?.y ?? OG_MIND.y) - OG_MIND.y
  const skull = { x: OG_MIND.x + dx, y: OG_MIND.y + dy }
  const place = (p: { x: number; y: number }) => ({ x: p.x + dx, y: p.y + dy })
  const showModel = stage >= 2
  const decided = stage >= 3
  if (stage === 0) return null
  const ball = tipPlay(0).ball

  return (
    <g>
      <ellipse
        cx={skull.x - 9}
        cy={skull.y + 2}
        rx={16}
        ry={12}
        fill="none"
        stroke={ink}
        strokeWidth={0.8}
        opacity={decided ? 0.85 : 0.5}
      />
      <ellipse
        cx={skull.x + 9}
        cy={skull.y + 2}
        rx={16}
        ry={12}
        fill="none"
        stroke={ink}
        strokeWidth={0.8}
        opacity={decided ? 0.85 : 0.5}
      />

      {OG_SENSES.map((sense, i) => {
        const from = place(sense)
        const c = {
          x: (from.x + skull.x) / 2,
          y: Math.min(from.y, skull.y) - 18,
        }
        const phase = decided
          ? reduced
            ? 0.7
            : (t * 0.42) % 1
          : reduced
            ? 0.55
            : (t * 0.45 + i * 0.14) % 1
        const dot = quad(from, c, skull, phase)
        return (
          <g key={sense.id}>
            <path
              d={`M ${from.x} ${from.y} Q ${c.x} ${c.y} ${skull.x} ${skull.y}`}
              fill="none"
              stroke={decided ? color.somaSpark : ink}
              strokeWidth={0.9}
              opacity={decided ? 0.7 : 0.4}
            />
            <circle cx={from.x} cy={from.y} r={2.4} fill={ink} opacity={0.8} />
            <text
              x={from.x}
              y={from.y - 9}
              textAnchor="middle"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize={8}
              letterSpacing="0.16em"
            >
              {sense.label}
            </text>
            <circle cx={dot.x} cy={dot.y} r={2.1} fill={color.somaSpark} opacity={0.95} />
          </g>
        )
      })}

      {ball && (
        <g>
          {(() => {
            const from = ball
            const c = { x: (from.x + skull.x) / 2 - 28, y: (from.y + skull.y) / 2 }
            const phase = decided
              ? reduced
                ? 0.7
                : (t * 0.42) % 1
              : reduced
                ? 0.4
                : (t * 0.45 + 0.5) % 1
            const dot = quad(from, c, skull, phase)
            return (
              <>
                <path
                  d={`M ${from.x} ${from.y} Q ${c.x} ${c.y} ${skull.x} ${skull.y}`}
                  fill="none"
                  stroke={decided ? color.somaSpark : ink}
                  strokeWidth={0.9}
                  opacity={0.45}
                />
                <text
                  x={from.x - 22}
                  y={from.y + 4}
                  textAnchor="end"
                  fill={color.typeMuted}
                  fontFamily={type.family}
                  fontSize={8}
                  letterSpacing="0.16em"
                >
                  BALL
                </text>
                <circle cx={dot.x} cy={dot.y} r={2.1} fill={color.somaSpark} opacity={0.95} />
              </>
            )
          })()}
        </g>
      )}

      {showModel &&
        OG_SYSTEMS.map((system) => {
          const s = place(system)
          return (
            <g key={system.id}>
              <path
                d={`M ${s.x} ${s.y} L ${skull.x} ${skull.y}`}
                fill="none"
                stroke={ink}
                strokeWidth={0.8}
                opacity={decided ? 0.75 : 0.4}
              />
              <circle
                cx={s.x}
                cy={s.y}
                r={2.6}
                fill={decided ? color.somaSpark : ink}
                opacity={0.9}
              />
              <text
                x={s.x}
                y={s.y - 8}
                textAnchor="middle"
                fill={decided ? color.type : color.typeMuted}
                fontFamily={type.family}
                fontSize={7.5}
                letterSpacing="0.14em"
              >
                {system.label}
              </text>
            </g>
          )
        })}

      {showModel &&
        (() => {
          const pass = place(OG_PASS)
          const trunkLit = decided
          return (
            <g>
              <path
                d={`M ${skull.x} ${skull.y} L ${pass.x} ${pass.y}`}
                fill="none"
                stroke={trunkLit ? color.somaSpark : ink}
                strokeWidth={trunkLit ? 1.4 : 0.9}
                opacity={trunkLit ? 0.95 : 0.62}
              />
              <circle
                cx={pass.x}
                cy={pass.y}
                r={2.6}
                fill={trunkLit ? color.somaSpark : ink}
                opacity={0.95}
              />
              <text
                x={pass.x}
                y={pass.y - 10}
                textAnchor="middle"
                fill={trunkLit ? color.type : color.typeMuted}
                fontFamily={type.family}
                fontSize={7.5}
                letterSpacing="0.12em"
              >
                {OG_PASS.label}
              </text>
              {OG_BRANCHES.map((b) => {
                const gate = place(b.gate)
                const act = place(b.act)
                const lit = decided && b.chosen
                const quiet = decided && !b.chosen
                const stroke = lit ? color.somaSpark : ink
                const opacity = quiet ? 0.28 : lit ? 0.95 : 0.62
                const phase = reduced ? 0.65 : (t * 0.5) % 1
                const spark = {
                  x: gate.x + (act.x - gate.x) * phase,
                  y: gate.y + (act.y - gate.y) * phase,
                }
                const above = gate.y < pass.y
                const midX = (pass.x + gate.x) / 2
                const midY = (pass.y + gate.y) / 2
                const half = b.ifLabel.length * 2.7
                const run = gate.x - pass.x
                const extra = Math.abs(run) > 1 ? Math.abs((gate.y - pass.y) / run) * half : 0
                return (
                  <g key={b.id}>
                    <g opacity={opacity}>
                    <path
                      d={`M ${pass.x} ${pass.y} L ${gate.x} ${gate.y} L ${act.x} ${act.y}`}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={lit ? 1.4 : 0.9}
                    />
                    <circle cx={gate.x} cy={gate.y} r={2.5} fill={stroke} />
                    <circle cx={act.x} cy={act.y} r={lit ? 3.4 : 2.5} fill={stroke} />
                    <text
                      x={act.x + 8}
                      y={act.y + 3}
                      textAnchor="start"
                      fill={lit ? color.somaSpark : color.type}
                      fontFamily={type.family}
                      fontSize={9}
                      letterSpacing="0.14em"
                    >
                      {b.thenLabel}
                    </text>
                    {lit && <circle cx={spark.x} cy={spark.y} r={2.4} fill={color.somaSpark} />}
                    </g>
                    <text
                      x={midX}
                      y={above ? midY - extra - 11 : midY + extra + 14}
                      textAnchor="middle"
                      fill={trunkLit ? color.type : color.typeMuted}
                      fontFamily={type.family}
                      fontSize={7.5}
                      letterSpacing="0.12em"
                    >
                      {b.ifLabel}
                    </text>
                  </g>
                )
              })}
            </g>
          )
        })()}
    </g>
  )
}

/**
 * Five reduced copies of the soma — the Knicks only. Stage 1 holds the
 * inbound. Stage 2 plays the possession once, holds the make, then brings
 * the five together with their hands stacked. Stage 3 leaves that
 * celebration up and draws the relationships over it.
 */
function Team({
  stage,
  t,
  reduced,
  mind,
}: {
  stage: 1 | 2 | 3
  t: number
  reduced: boolean
  mind: TeamMind
}) {
  const ink = color.somaNerve
  const origin = useRef<number | null>(null)
  if (stage < 2) origin.current = null
  else if (origin.current === null) origin.current = t
  const elapsed = origin.current === null ? 0 : Math.max(0, t - origin.current)
  const settled = reduced || stage === 3
  const played = stage === 1 ? 0 : settled ? 1 : Math.min(1, elapsed / TIP_CYCLE)
  const after = stage < 2 || settled ? 0 : Math.max(0, elapsed - TIP_CYCLE)
  const gather =
    stage === 1 ? 0 : settled ? 1 : after <= TIP_HOLD ? 0 : Math.min(1, (after - TIP_HOLD) / TIP_GATHER)
  const frame = tipPlay(played, gather)
  // The play clock and the huddle are one countdown. Stage 1 holds 5.7.
  // Reduced motion snaps to the horn. Stage 3 is the sentence, so the board
  // is already gone by then.
  const clockElapsed = stage < 2 ? 0 : reduced ? possessionSpan() : elapsed
  const clock = possessionClock(clockElapsed)
  const banner = stage >= 2 && clock <= 0
  const figureOpacity = stage === 3 ? 0.72 : 0.9
  const crashing = stage === 2 && gather < 0.35
  const edgeOpacity = stage === 3 ? 0.9 : stage === 2 ? 0.08 : 0.4
  const chest = (id: string) => {
    const actor = frame.actors.find((a) => a.id === id)
    return actor ? miniNode(actor.nodes, "thorax") : undefined
  }

  return (
    <g>
      {mind === 0 && stage < 3 && (
        <Scoreboard
          spurs={frame.board.spurs}
          knicks={frame.board.knicks}
          clock={clock}
          banner={banner}
        />
      )}
      {TEAM_LINKS.filter((l) => l.stage <= (stage === 1 ? 1 : 2)).map((l, i) => {
        const a = chest(l.source)
        const b = chest(l.target)
        if (!a || !b) return null
        const live = stage >= 2 && l.stage === 2
        return (
          <path
            key={`${l.source}-${l.target}`}
            d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
            fill="none"
            stroke={stage === 3 ? color.somaSpark : ink}
            strokeWidth={stage === 3 ? 1.5 : 1}
            strokeDasharray={live && !reduced ? "4 8" : undefined}
            opacity={mind > 0 ? 0.08 : edgeOpacity}
            className={live && !reduced ? "edge-flow" : undefined}
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        )
      })}

      {frame.actors.map((a) => (
        <SomaMini
          key={a.id}
          nodes={a.nodes}
          ink={ink}
          number={a.number}
          lead={crashing && a.id === "team-og"}
          accent={crashing && played > 0.5 && played < 0.9 && a.id === "team-og" ? "r" : undefined}
          opacity={
            mind > 0
              ? a.id === "team-og"
                ? 0.95
                : 0.12
              : crashing
                ? a.id === "team-og"
                  ? 1
                  : 0.7
                : figureOpacity
          }
        />
      ))}

      {frame.trail && (
        <path
          d={`M ${frame.trail.from.x} ${frame.trail.from.y} Q ${frame.trail.apex.x} ${frame.trail.apex.y} ${frame.trail.to.x} ${frame.trail.to.y}`}
          fill="none"
          stroke={color.somaOrgan}
          strokeWidth={0.9}
          strokeDasharray="3 7"
          opacity={0.4}
        />
      )}

      {frame.ball && (
        <circle
          cx={frame.ball.x}
          cy={frame.ball.y}
          r={7}
          fill={color.somaOrgan}
          opacity={0.94}
        />
      )}

      {mind > 0 && <OgMind stage={mind} t={t} reduced={reduced} />}

      {stage >= 2 && frame.call && (
        <text
          x={frame.call.x}
          y={frame.call.y}
          textAnchor="middle"
          fill={color.typeMuted}
          fontFamily={type.family}
          fontSize={10}
          letterSpacing="0.18em"
        >
          CALL
        </text>
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

  const teamCourt = world.team > 0 && world.court === 0
  const shot =
    world.court > 0
      ? soloShotFrame(world.court >= 2 ? soloShotClock(t, reduced) : 0)
      : null

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
      {world.court > 0 && (
        <Basket
          ink={color.somaNerve}
          lit={0.8}
          hoop={COURT_HOOP}
          rimRx={COURT_RIM_RX}
          backboard={COURT_BACKBOARD}
          pole={COURT_POLE}
        />
      )}
      {teamCourt && (
        <CourtMarks ink={color.somaNerve} opacity={world.teamMind > 0 ? 0.07 : 0.22} />
      )}
      {teamCourt && (
        <Basket
          ink={color.somaNerve}
          lit={0.8}
          hoop={TEAM_HOOP}
          rimRx={TEAM_RIM_RX}
          backboard={TEAM_BACKBOARD}
          pole={TEAM_POLE}
        />
      )}
      {shot && (
        <g>
          <SomaMini nodes={shot.nodes} ink={color.typeMuted} opacity={0.86} />
          {shot.trail && (
            <path
              d={`M ${shot.trail.from.x} ${shot.trail.from.y} Q ${shot.trail.apex.x} ${shot.trail.apex.y} ${shot.trail.to.x} ${shot.trail.to.y}`}
              fill="none"
              stroke={color.somaOrgan}
              strokeWidth={0.9}
              strokeDasharray="3 7"
              opacity={0.4}
            />
          )}
          <circle cx={shot.ball.x} cy={shot.ball.y} r={7} fill={color.somaOrgan} opacity={0.94} />
        </g>
      )}
      {world.courtMind && <Perception t={t} reduced={reduced} />}
      {world.court === 2 && <Motor t={t} reduced={reduced} />}
      {world.court === 3 && (
        <>
          <Motor t={t} reduced={reduced} />
          <BodyLoop t={t} reduced={reduced} />
        </>
      )}
      {world.team > 0 && (
        <Team
          stage={world.team as 1 | 2 | 3}
          t={t}
          reduced={reduced}
          mind={world.teamMind}
        />
      )}
    </g>
  )
}
