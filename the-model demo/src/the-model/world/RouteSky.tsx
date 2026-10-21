import { useEffect, useRef, useState } from "react"
import { color } from "../design/tokens"
import { useClock } from "../stage/hooks"

/**
 * One freighter, left to right, trying to cross a sky.
 *
 * The world stays put: a field on the left, weather in the middle, a field
 * on the right. Four aircraft. The three ahead are always in the picture —
 * on the turbulence beats, one is entering the cell, one is in it, and one
 * is leaving it.
 *
 * Long-haul traffic does not hand a report from nose to nose. Each aircraft
 * uplinks to a satellite. The satellite downlinks to ground stations spread
 * along the route, and the ground system sends the report back up. The
 * spoken line is the only writing.
 *
 *   1  airborne, no one in the seat, cargo cannot take a shock
 *   2  the forecast jet stream is smooth, and the radar sees nothing
 *   3  the aircraft ahead reports the acceleration
 *   4  the forecast still says smooth; the air ahead does not
 *   5  every other flight climbs to that one altitude
 *   6  our divert stops at airspace this aircraft does not own
 *   7  one path, once, under the weather
 *   8  perceive the air, traverse to the report, verify the cargo
 *   9  those three things, live, across the network
 */

type Pt = { x: number; y: number }

const CELL = { x: 1040, y: 348 }
const FIELD_R = 1460
const HORIZON = 640

/**
 * Two footprints, one over each end of the leg. The earth stations are not
 * under the aircraft: one at the departure, one mid-route, one at the
 * arrival. The satellites drop to the stations at the ends. The stations
 * are tied together on the ground.
 */
const SATS: Pt[] = [
  { x: 168, y: 150 },
  { x: 1320, y: 118 },
]

const GROUNDS: Pt[] = [
  { x: 230, y: 606 },
  { x: 800, y: 612 },
  { x: 1540, y: 606 },
]

const BUS_Y = 618

/**
 * The other three, on the cruise band. Left edge of the cell, the middle,
 * the right edge — entering, inside, leaving — until they are offered one
 * altitude above it.
 */
const TRAFFIC: Pt[] = [
  { x: 860, y: 356 },
  { x: 1040, y: 348 },
  { x: 1210, y: 340 },
]

const CRAFT: Array<{ x: number; y: number; pitch: number }> = [
  { x: 0, y: 0, pitch: 0 },
  { x: 340, y: 430, pitch: 4 },
  { x: 490, y: 368, pitch: 1 },
  { x: 580, y: 358, pitch: 0 },
  { x: 640, y: 358, pitch: 0 },
  { x: 690, y: 372, pitch: -2 },
  { x: 800, y: 470, pitch: -9 },
  { x: 1000, y: 528, pitch: 1 },
  { x: 1348, y: 378, pitch: 3 },
  { x: 1468, y: 362, pitch: 0 },
]

const LANE_Y = 228

function satFor(p: Pt) {
  return p.x < 830 ? SATS[0]! : SATS[1]!
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function useGlide(stage: number, reduced: boolean) {
  const [from, setFrom] = useState(stage)
  const [glide, setGlide] = useState(1)
  const held = useRef(stage)

  useEffect(() => {
    if (reduced || held.current === stage) {
      held.current = stage
      setFrom(stage)
      setGlide(1)
      return
    }
    setFrom(held.current)
    held.current = stage
    setGlide(0)
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const u = Math.min(1, (now - start) / 1500)
      setGlide(u * u * (3 - 2 * u))
      if (u < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [stage, reduced])

  return { from, glide }
}

function rot(p: Pt, deg: number, scale: number): Pt {
  const th = (-deg * Math.PI) / 180
  const c = Math.cos(th)
  const s = Math.sin(th)
  return { x: p.x * c * scale - p.y * s * scale, y: p.x * s * scale + p.y * c * scale }
}

function worldPoint(at: Pt, local: Pt, pitch: number, scale: number): Pt {
  const r = rot(local, pitch, scale)
  return { x: at.x + r.x, y: at.y + r.y }
}

/** A freighter in side view. Nose at local +x. The cockpit is empty. */
function Jet({
  at,
  pitch,
  scale,
  ink,
  cargo,
  mind,
  shudder = 0,
  dim = 1,
}: {
  at: Pt
  pitch: number
  scale: number
  ink: string
  cargo: number
  mind: number
  shudder?: number
  dim?: number
}) {
  const bay = cargo > 0.4 ? color.warn : ink
  return (
    <g
      transform={`translate(${at.x} ${at.y + shudder}) rotate(${-pitch}) scale(${scale})`}
      opacity={dim}
      fill="none"
      stroke={ink}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M -80 2 C -120 6 -150 1 -176 5" strokeWidth={1.15} opacity={0.22} />
      <path d="M -4 -8 L 22 -20 L 12 -8" strokeWidth={1.2} opacity={0.4} />
      <path
        d="M -80 0 C -74 -13 -40 -15 8 -14 L 58 -9 C 74 -6 84 -2 88 0 C 84 3 74 8 58 10 L 8 15 C -40 16 -74 13 -80 0 Z"
        strokeWidth={1.7}
      />
      <path d="M -10 8 L 32 6 L 16 24 L -2 20 Z" strokeWidth={1.45} />
      <path d="M 4 14 C 6 11 18 11 20 14 C 18 17 6 17 4 14 Z" strokeWidth={1.2} opacity={0.8} />
      <path d="M -58 -3 L -78 -34 L -66 -31 L -46 -5" strokeWidth={1.5} />
      <path d="M -68 6 L -92 13 L -60 10" strokeWidth={1.35} />
      <path d="M 52 -11 C 60 -15 74 -12 78 -6" strokeWidth={1.5} />
      <path d="M 54 -9 L 74 -6" strokeWidth={1.1} opacity={0.55} />
      <path
        d="M -20 13 L 10 12"
        stroke={bay}
        strokeWidth={cargo > 0.4 ? 2.6 : 1.3}
        opacity={0.35 + cargo * 0.65}
      />
      <g opacity={0.35 + mind * 0.65}>
        <ellipse cx={28} cy={-3} rx={16} ry={7} fill="none" stroke={color.somaSpark} strokeWidth={1} />
        <path d="M 16 -4 L 28 -1 L 40 -5" fill="none" stroke={color.somaSpark} strokeWidth={1.1} />
        <circle cx={16} cy={-4} r={2.6} fill={color.somaSpark} />
        <circle cx={28} cy={-1} r={2.6} fill={color.somaSpark} />
        <circle cx={40} cy={-5} r={2.6} fill={color.somaSpark} />
      </g>
    </g>
  )
}

function Satellite({ at, dim }: { at: Pt; dim: number }) {
  return (
    <g
      transform={`translate(${at.x} ${at.y})`}
      opacity={dim}
      fill="none"
      stroke={color.somaSpark}
      strokeWidth={1.35}
      strokeLinecap="round"
    >
      <rect x={-8} y={-5} width={16} height={10} rx={1.4} />
      <path d="M -8 0 L -32 0 M 8 0 L 32 0" />
      <path d="M -32 -7 L -32 7 M 32 -7 L 32 7" />
      <path d="M 0 5 L 0 14" />
      <path d="M -5 14 Q 0 20 6 14" />
    </g>
  )
}

function Dish({ at, dim }: { at: Pt; dim: number }) {
  return (
    <g
      transform={`translate(${at.x} ${at.y})`}
      opacity={dim}
      fill="none"
      stroke={color.somaNerve}
      strokeWidth={1.35}
      strokeLinecap="round"
    >
      <path d="M 0 6 L 0 -14" />
      <path d="M -28 -16 Q 0 0 28 -16" />
      <path d="M -10 6 L 10 6" />
      <path d="M 0 -8 L 0 -18" />
    </g>
  )
}

function Person({ x, y, dim }: { x: number; y: number; dim: number }) {
  return (
    <g opacity={dim} stroke={color.somaNerve} fill={color.somaNerve} strokeWidth={1.25} strokeLinecap="round">
      <circle cx={x} cy={y - 11} r={2.3} stroke="none" />
      <path d={`M ${x} ${y - 8} L ${x} ${y + 1}`} fill="none" />
      <path d={`M ${x - 4} ${y - 3} L ${x + 4} ${y - 3}`} fill="none" />
    </g>
  )
}

function streamPath(base: number, amp: number, phase: number, rough: boolean) {
  let d = ""
  for (let x = 90; x <= 1520; x += 18) {
    const dx = (x - CELL.x) / 150
    const cell = Math.exp(-dx * dx)
    const calm = Math.sin(x * 0.011 + phase) * amp
    const shear = rough ? Math.sin(x * 0.07 + phase * 3.4) * 26 * cell : 0
    const y = base + calm + shear
    d += `${x === 90 ? "M" : "L"} ${x} ${y.toFixed(1)} `
  }
  return d
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => ({
    x: cx + Math.cos(a) * r,
    y: cy + Math.sin(a) * r,
  })
  const s = p(a0)
  const e = p(a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`
}

function sparkAt(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  }
}

function Link({
  a,
  b,
  bend,
  ink,
  phase,
  hot,
  bow,
}: {
  a: Pt
  b: Pt
  bend: number
  ink: string
  phase: number
  hot: boolean
  /** Pulls the curve off the straight line, so a downlink can stay in the margin. */
  bow?: Pt
}) {
  const c = bow ?? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + bend }
  const d = `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`
  const dot = sparkAt(a, c, b, phase)
  return (
    <g opacity={hot ? 0.9 : 0.2}>
      <path
        d={d}
        fill="none"
        stroke={ink}
        strokeWidth={hot ? 1.35 : 0.9}
        opacity={hot ? 0.8 : 0.7}
      />
      {hot && <circle cx={dot.x} cy={dot.y} r={2.5} fill={ink} />}
    </g>
  )
}

function radar(nose: Pt, aim: number, spread: number, reach: number) {
  const a0 = ((aim - spread) * Math.PI) / 180
  const a1 = ((aim + spread) * Math.PI) / 180
  const p = (a: number, r: number) => ({
    x: nose.x + Math.cos(a) * r,
    y: nose.y + Math.sin(a) * r,
  })
  const s = p(a0, reach)
  const e = p(a1, reach)
  return `M ${nose.x} ${nose.y} L ${s.x} ${s.y} A ${reach} ${reach} 0 0 1 ${e.x} ${e.y} Z`
}

const DIVERT =
  "M 490 368 C 640 352 720 400 800 470 C 900 560 1020 568 1120 500 C 1220 430 1280 390 1420 368"

const DIVERT_STOP = "M 640 358 C 720 390 760 440 810 478 C 880 530 960 548 1040 536"

export function RouteSky({ stage, reduced }: { stage: number; reduced: boolean }) {
  const t = useClock(stage > 0, reduced)
  const { from, glide } = useGlide(stage, reduced)
  if (stage <= 0) return null

  const a = CRAFT[from] ?? CRAFT[stage]!
  const b = CRAFT[stage]!
  const craft = {
    x: mix(a.x, b.x, glide),
    y: mix(a.y, b.y, glide),
    pitch: mix(a.pitch, b.pitch, glide),
  }
  const bob = reduced ? 0 : Math.sin(t * 1.15) * 2.2
  const at = { x: craft.x, y: craft.y + bob }
  const nose = worldPoint(at, { x: 88, y: 0 }, craft.pitch, 1)
  const brain = worldPoint(at, { x: 28, y: -4 }, craft.pitch, 1)
  const bay = worldPoint(at, { x: -6, y: 14 }, craft.pitch, 1)

  const phase = reduced ? 0.42 : (t * 0.22) % 1
  const flow = reduced ? 0.6 : t * 1.4
  const forecast = stage === 2 || stage === 4
  const cell = stage < 3 ? 0 : stage === 3 ? 0.62 : 1
  const streamInk = forecast ? color.healthy : color.somaNerve
  const streamOpacity = stage === 1 ? 0.14 : forecast ? 0.7 : 0.26
  const laneBoost = stage === 5 ? 0.55 : 0
  const people = stage === 1 ? 0.95 : 0.28
  const herdY = (home: number) => {
    const there = (s: number) => (s >= 5 ? LANE_Y : home)
    return mix(there(from), there(stage), glide)
  }
  const traffic = TRAFFIC.map((p) => ({ x: p.x, y: herdY(p.y) }))
  const witnessShake =
    stage >= 3 && stage <= 4 && !reduced ? Math.sin(t * 17) * 3.2 : 0
  const wall = stage === 6 ? 0.85 : stage === 7 ? 0.35 : 0
  const route = stage >= 6 ? 0.9 : 0
  const cargo = stage === 1 || stage === 5 || stage === 8 ? 1 : 0.35
  const mind = stage === 1 ? 0.45 : stage >= 8 ? 1 : 0.7

  const live = stage >= 9
  const forecastHop = stage === 2
  const report = stage === 3 || stage === 4 || stage === 8
  const offer = stage === 5
  const verifyLink = stage === 8
  const aim = reduced ? -8 : Math.sin(t * 0.7) * 18
  const craftSat = satFor(brain)
  const usReceives = (forecastHop || report) && !live

  return (
    <svg
      className="stage-graph"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Four aircraft. Each uplinks to a satellite, and the satellites downlink to ground stations spread along the route"
    >
      <path d={`M 70 ${HORIZON} L 1530 ${HORIZON}`} stroke={color.somaNerve} strokeWidth={1} opacity={0.22} />
      <path d={`M 130 ${HORIZON} L 300 ${HORIZON}`} stroke={color.somaNerve} strokeWidth={2.5} opacity={0.32} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M ${1380 + i * 28} ${HORIZON} L ${1380 + i * 28} ${HORIZON - 18 - (i % 3) * 10}`}
          stroke={color.somaNerve}
          strokeWidth={1.2}
          opacity={stage >= 7 ? 0.55 : 0.22}
        />
      ))}

      {GROUNDS.map((g, i) => (
        <Dish
          key={i}
          at={g}
          dim={live || (i === 0 && (forecastHop || report)) || (i === 2 && (report || offer)) || (i === 1 && (report || offer)) ? 1 : 0.62}
        />
      ))}
      <Person x={128} y={HORIZON - 2} dim={people} />
      <Person x={152} y={HORIZON - 2} dim={people} />
      <Person x={176} y={HORIZON - 2} dim={people} />
      {SATS.map((s, i) => (
        <Satellite key={i} at={s} dim={0.92} />
      ))}

      {[250, 330, 410, 490].map((y, i) => (
        <path
          key={y}
          d={streamPath(y, 10 + i * 2, flow + i, false)}
          fill="none"
          stroke={streamInk}
          strokeWidth={i === 0 && laneBoost ? 1.8 : 1.25}
          opacity={streamOpacity * (i === 0 ? 1 + laneBoost : 1)}
          strokeLinecap="round"
        />
      ))}

      <g opacity={cell}>
        <ellipse cx={CELL.x} cy={CELL.y} rx={188} ry={108} fill={color.warnFill} />
        {[
          { x: -100, y: -10, r: 36 },
          { x: 110, y: 24, r: 30 },
          { x: 20, y: 48, r: 22 },
        ].map((e, i) => {
          const spin = reduced ? i : t * 0.7 + i * 1.7
          return (
            <path
              key={i}
              d={arc(CELL.x + e.x, CELL.y + e.y, e.r, spin, spin + 2.4)}
              fill="none"
              stroke={color.warn}
              strokeWidth={1.6}
              opacity={0.8}
              strokeLinecap="round"
            />
          )
        })}
        <path
          d={streamPath(348, 8, flow, true)}
          fill="none"
          stroke={color.warn}
          strokeWidth={1.4}
          opacity={0.8}
          strokeLinecap="round"
        />
      </g>

      {stage >= 6 && (
        <path
          d={stage === 6 ? DIVERT_STOP : DIVERT}
          fill="none"
          stroke={stage >= 7 ? color.healthy : color.focus}
          strokeWidth={1.7}
          opacity={route}
          strokeLinecap="round"
          strokeDasharray={stage === 6 ? "7 8" : undefined}
        />
      )}

      {wall > 0 && (
        <g opacity={wall}>
          <path
            d={stage === 7 ? "M 1180 190 L 1180 470 M 1180 590 L 1180 630" : "M 1180 190 L 1180 630"}
            fill="none"
            stroke={color.focus}
            strokeWidth={1.4}
            strokeDasharray="3 7"
          />
        </g>
      )}

      {stage >= 2 && stage <= 4 && (
        <path
          d={radar(nose, aim, 14, stage === 2 ? 130 : 150)}
          fill={stage === 2 ? color.healthyFill : color.warnFill}
          stroke={stage === 2 ? color.healthy : color.warn}
          strokeWidth={0.8}
          opacity={0.32}
        />
      )}

      <Link
        a={usReceives ? craftSat : brain}
        b={usReceives ? brain : craftSat}
        bend={-32}
        ink={forecastHop && !live ? color.healthy : color.somaSpark}
        phase={phase}
        hot={live || forecastHop || report}
      />
      {traffic.map((p, i) => {
        const sat = satFor(p)
        const antenna = { x: p.x + 6, y: p.y - 12 }
        const sending = (report && i === 1) || live
        return (
          <Link
            key={i}
            a={sending ? antenna : sat}
            b={sending ? sat : antenna}
            bend={-26}
            ink={report && i === 1 && !live ? color.warn : color.somaSpark}
            phase={(phase + 0.19 * (i + 1)) % 1}
            hot={live || (report && i === 1) || offer}
          />
        )
      })}
      <Link
        a={forecastHop || (report && brain.x < 830) ? GROUNDS[0]! : SATS[0]!}
        b={forecastHop || (report && brain.x < 830) ? SATS[0]! : GROUNDS[0]!}
        bend={18}
        ink={forecastHop && !live ? color.healthy : color.somaSpark}
        phase={(phase + 0.4) % 1}
        hot={live || forecastHop || (report && brain.x < 830)}
      />
      <Link
        a={offer && !live ? GROUNDS[2]! : SATS[1]!}
        b={offer && !live ? SATS[1]! : GROUNDS[2]!}
        bend={0}
        bow={{ x: GROUNDS[2]!.x + 30, y: SATS[1]!.y + 16 }}
        ink={color.somaSpark}
        phase={(phase + 0.62) % 1}
        hot={live || report || offer}
      />
      <g opacity={live || report || offer ? 0.9 : 0.24}>
        <path
          d={`M ${GROUNDS[0]!.x} ${BUS_Y} L ${GROUNDS[2]!.x} ${BUS_Y}`}
          fill="none"
          stroke={color.somaSpark}
          strokeWidth={live || report || offer ? 1.3 : 0.85}
          strokeDasharray={live || report || offer ? undefined : "2 8"}
        />
        {(live || report || offer) && (
          <circle
            cx={
              report
                ? GROUNDS[2]!.x + (GROUNDS[0]!.x - GROUNDS[2]!.x) * phase
                : GROUNDS[0]!.x + (GROUNDS[2]!.x - GROUNDS[0]!.x) * phase
            }
            cy={BUS_Y}
            r={2.5}
            fill={color.somaSpark}
          />
        )}
      </g>
      {verifyLink && (
        <Link a={brain} b={bay} bend={16} ink={color.healthy} phase={(phase + 0.55) % 1} hot />
      )}
      {verifyLink && (
        <circle cx={bay.x} cy={bay.y} r={7} fill="none" stroke={color.healthy} strokeWidth={1.4} />
      )}

      {traffic.map((p, i) => (
        <Jet
          key={i}
          at={p}
          pitch={stage === 5 ? 7 * (1 - glide) : 0}
          scale={0.56}
          ink={color.somaNerve}
          cargo={0}
          mind={report && i === 1 ? 0.85 : 0.4}
          shudder={i === 1 ? witnessShake : 0}
          dim={report && i === 1 ? 1 : 0.84}
        />
      ))}

      <Jet at={at} pitch={craft.pitch} scale={1} ink={color.somaNerve} cargo={cargo} mind={mind} />

      <circle cx={FIELD_R} cy={HORIZON} r={3} fill={color.somaNerve} opacity={stage >= 7 ? 0.7 : 0.25} />
    </svg>
  )
}
