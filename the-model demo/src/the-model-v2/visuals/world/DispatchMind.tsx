import { color, type } from "../design/tokens"
import {
  DISPATCH_MIND,
  DISPATCH_STREAMS,
  ENT_REROUTE,
  nodeById,
} from "../graph/enterprise"
import { useClock } from "../stage/hooks"

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

function poly(
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  t0: number,
  t1: number
) {
  const steps = 12
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const p = quad(a, c, b, t0 + ((t1 - t0) * i) / steps)
    d += `${i === 0 ? "M" : "L"} ${p.x} ${p.y} `
  }
  return d
}

/**
 * The storm, told the way the shot is told. Five facts have to reach one
 * place at once. The aircraft call leaves and dies on the path. The hub's
 * own capacity still arrives, and it looks fine. The dispatcher can see the
 * difference and wait. The system already knows how storms get rerouted, so
 * it acts on the gateway — the thing that looks like the fault. When the
 * path actually answers, the packages move.
 */
export function DispatchMind({
  stage,
  reduced,
}: {
  stage: 0 | 1 | 2 | 3 | 4 | 5
  reduced: boolean
}) {
  const t = useClock(stage > 0, reduced)
  if (stage === 0) return null
  const system = stage >= 3
  const live = stage === 2 || stage === 5
  const wrong = stage === 4
  const agent = nodeById("ent-agent-plan")
  const person = nodeById("ent-ops")
  const mind = system && agent ? agent : DISPATCH_MIND
  const phase = reduced ? 0.66 : (t * 0.3) % 1
  const gateway = nodeById("ent-gateway")
  const around = nodeById("ent-hub-ramp")
  const actionTo = wrong ? gateway : live ? around : null
  /** The human's path is short and vertical; the system's crosses open sky. */
  const callBreak = system ? 0.2 : 0.62
  const spark = actionTo ? along([mind, actionTo], phase) : null

  return (
    <g className="dispatch-mind">
      {!system && person && (
        <path
          d={`M ${mind.x} ${mind.y} L ${person.x} ${person.y}`}
          fill="none"
          stroke={color.somaNerve}
          strokeWidth={0.9}
          opacity={0.45}
        />
      )}

      <ellipse
        cx={mind.x - 11}
        cy={mind.y}
        rx={15}
        ry={11}
        fill="none"
        stroke={wrong ? color.incident : color.somaNerve}
        strokeWidth={0.9}
        opacity={0.85}
      />
      <ellipse
        cx={mind.x + 11}
        cy={mind.y}
        rx={15}
        ry={11}
        fill="none"
        stroke={wrong ? color.incident : color.somaNerve}
        strokeWidth={0.9}
        opacity={0.85}
      />

      {DISPATCH_STREAMS.map((s) => {
        const n = nodeById(s.nodeId)
        if (!n) return null
        const from = { x: n.x, y: n.y }
        const label = { x: n.x + s.lx, y: n.y + s.ly }
        const broken = Boolean(s.late) && !live
        const tone =
          !live && s.id === "capacity"
            ? color.healthy
            : !live && s.id === "commitment"
              ? color.warn
              : color.somaSpark
        const c = {
          x: (from.x + mind.x) / 2,
          y: Math.min(from.y, mind.y) - 28,
        }
        const dot = broken
          ? quad(from, c, mind, (reduced ? 1 : phase) * callBreak)
          : quad(from, c, mind, phase)
        const breakPt = quad(from, c, mind, callBreak)
        return (
          <g key={s.id}>
            {broken ? (
              <>
                <path
                  d={poly(from, c, mind, 0, callBreak - 0.04)}
                  fill="none"
                  stroke={color.somaSpark}
                  strokeWidth={0.9}
                  opacity={0.85}
                />
                <path
                  d={poly(from, c, mind, callBreak + 0.08, 1)}
                  fill="none"
                  stroke={color.typeDim}
                  strokeWidth={0.9}
                  strokeDasharray="3 5"
                  opacity={0.55}
                />
                <text
                  x={breakPt.x - (system ? 62 : 0)}
                  y={breakPt.y - 12}
                  textAnchor="middle"
                  fill={color.type}
                  fontFamily={type.family}
                  fontSize={9}
                  letterSpacing="0.14em"
                >
                  NO RETURN
                </text>
              </>
            ) : (
              <path
                d={`M ${from.x} ${from.y} Q ${c.x} ${c.y} ${mind.x} ${mind.y}`}
                fill="none"
                stroke={tone}
                strokeWidth={0.9}
                opacity={0.7}
              />
            )}
            {s.id !== "weather" && (
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                fill={tone}
                fontFamily={type.family}
                fontSize={9}
                letterSpacing="0.14em"
              >
                {s.label}
              </text>
            )}
            <circle cx={dot.x} cy={dot.y} r={2.3} fill={broken ? color.somaSpark : tone} />
          </g>
        )
      })}

      {(stage === 3 || stage === 4) && (
        <text
          x={mind.x + 118}
          y={mind.y - 6}
          textAnchor="middle"
          fill={color.typeDim}
          fontFamily={type.family}
          fontSize={9}
          letterSpacing="0.16em"
        >
          STORMS GET REROUTED
        </text>
      )}

      {stage === 1 && (
        <text
          x={mind.x}
          y={mind.y - 28}
          textAnchor="middle"
          fill={color.type}
          fontFamily={type.family}
          fontSize={11}
          letterSpacing="0.18em"
        >
          WAIT
        </text>
      )}

      {spark && actionTo && (
        <g>
          <path
            d={`M ${mind.x} ${mind.y} L ${actionTo.x} ${actionTo.y}`}
            fill="none"
            stroke={wrong ? color.incident : color.somaSpark}
            strokeWidth={wrong ? 2.2 : 1.5}
            opacity={0.95}
          />
          <circle
            cx={spark.x}
            cy={spark.y}
            r={3.2}
            fill={wrong ? color.incident : color.somaSpark}
          />
          {wrong && (
            <circle
              cx={actionTo.x}
              cy={actionTo.y}
              r={16}
              fill="none"
              stroke={color.incident}
              strokeWidth={1.6}
            />
          )}
        </g>
      )}

      {stage === 5 &&
        ENT_REROUTE.map((e, i) => {
          const a = nodeById(e.source)
          const b = nodeById(e.target)
          if (!a || !b) return null
          const p = (phase + i * 0.33) % 1
          const dot = { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p }
          return (
            <circle
              key={`${e.source}-${e.target}`}
              cx={dot.x}
              cy={dot.y}
              r={3.4}
              fill={color.somaSpark}
            />
          )
        })}
    </g>
  )
}
