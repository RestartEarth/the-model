import { useEffect, useRef, useState } from "react"
import { color, graph, motion, type } from "../design/tokens"
import {
  ENT_AGENT_IDS,
  ENT_AUTONOMOUS_IDS,
  ENT_DEPENDENCY_KEYS,
  ENT_DEPENDENCY_SET,
  ENT_DISRUPT_KEYS,
  ENT_DISRUPT_NODE,
  ENT_DISRUPT_NODES,
  ENT_EDGE_TAG,
  ENT_HUMAN_IDS,
  ENT_PACKAGE_CARD,
  ENT_PACKAGE_KEYS,
  ENT_PACKAGE_ROUTE,
  ENT_REROUTE_KEYS,
  edgeKey,
  entClustersFor,
  nodeById,
  resolveGraph,
} from "../graph/enterprise"
import type { GraphNode } from "../graph/types"
import { useClock, usePrefersReducedMotion } from "../stage/hooks"
import type { WorldState } from "../stage/types"
import { ActOverlays } from "./ActOverlays"
import { KindMark } from "./KindMark"

/**
 * The node/edge fabric. In the recast show this renders exactly one world —
 * the logistics enterprise of graph/enterprise.ts — through movements 5 to 7,
 * which means it carries the enterprise, the autonomy requirements, the agent
 * team and the control loop without ever cutting to a different component.
 *
 * The Meridian incident this used to render (blast radius, GPU blame, inspect
 * hop, token sessions, the AI-transaction fan-out) is gone along with its
 * beats. What survived is the part that was always the valuable bit: a camera
 * that lerps between framings, cumulative phase-gated reveal, and colour used
 * as meaning rather than decoration.
 */

interface Cam {
  zoom: number
  x: number
  y: number
  opacity: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function viewBoxFor(cam: Cam) {
  const w = graph.width / cam.zoom
  const h = graph.height / cam.zoom
  return `${cam.x - w / 2} ${cam.y - h / 2} ${w} ${h}`
}

/**
 * The enterprise has no incident narrative to express — no blast radius, no
 * component to blame. The only states it needs are: at risk (amber), the thing
 * this beat is arguing about (focus), and running (healthy).
 */
function nodeFill(n: GraphNode, world: WorldState) {
  const warn = { fill: color.warnFill, stroke: color.warn, ink: color.warn }
  const focus = { fill: color.focusFill, stroke: color.focus, ink: color.focus }
  const ok = {
    fill: color.healthyFill,
    stroke: color.healthy,
    ink: color.healthy,
  }

  if (world.verified) return ok
  if (world.entDisrupt !== "none" && ENT_DISRUPT_NODES.has(n.id)) {
    // Once alternates are up the gateway is still shut, but the aircraft
    // around it have been re-tasked — so only the hub itself stays amber.
    if (world.entDisrupt === "reroute" && n.kind === "aircraft") return ok
    return warn
  }
  if (world.entRelations && ENT_DEPENDENCY_SET.has(n.id)) return focus
  // Humans are checked before machines so they never dim on the autonomy
  // beat: the whole argument of `ent-humans` is that they are still here.
  if (world.entHumans && ENT_HUMAN_IDS.has(n.id)) return focus
  if (world.entAutonomy && ENT_AUTONOMOUS_IDS.has(n.id)) return focus
  if (world.ent >= 7 && ENT_AGENT_IDS.has(n.id)) return focus
  return ok
}

export function GraphView({ world }: { world: WorldState }) {
  const reduced = usePrefersReducedMotion()
  const target: Cam = {
    zoom: world.zoom,
    x: world.focusX,
    y: world.focusY,
    opacity: world.graphOpacity,
  }
  const camRef = useRef<Cam>({ ...target })
  const [cam, setCam] = useState<Cam>({ ...target })

  useEffect(() => {
    if (reduced) {
      camRef.current = { ...target }
      setCam(camRef.current)
      return
    }
    let raf = 0
    const step = () => {
      const k = 0.085
      camRef.current = {
        zoom: lerp(camRef.current.zoom, target.zoom, k),
        x: lerp(camRef.current.x, target.x, k),
        y: lerp(camRef.current.y, target.y, k),
        opacity: lerp(camRef.current.opacity, target.opacity, k),
      }
      setCam(camRef.current)
      const settled =
        Math.abs(camRef.current.zoom - target.zoom) < 0.003 &&
        Math.abs(camRef.current.x - target.x) < 0.4 &&
        Math.abs(camRef.current.y - target.y) < 0.4 &&
        Math.abs(camRef.current.opacity - target.opacity) < 0.01
      if (!settled) raf = requestAnimationFrame(step)
      else {
        camRef.current = { ...target }
        setCam(camRef.current)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [reduced, target.zoom, target.x, target.y, target.opacity])

  const ent = world.ent
  const { nodes, edges } = resolveGraph(ent, world.entDisrupt === "reroute")
  const clusters = entClustersFor(ent)
  const size = graph.node
  const duration = reduced ? "0ms" : `${motion.duration.emphasized}ms`
  const ease = motion.easing.standard
  const disruptNode = nodeById(ENT_DISRUPT_NODE)

  // One package crossing the whole route, 15s end to end. Under reduced
  // motion it parks two thirds along — past the hub, mid-linehaul — which is
  // the most legible single frame of the journey.
  const clock = useClock(world.entPackage, reduced)
  const packageAt = (() => {
    if (!world.entPackage) return null
    const legs = ENT_PACKAGE_ROUTE.length - 1
    const frac = reduced ? 0.66 : (clock / 15) % 1
    const seg = frac * legs
    const i = Math.min(legs - 1, Math.floor(seg))
    const f = seg - i
    const a = nodeById(ENT_PACKAGE_ROUTE[i])
    const b = nodeById(ENT_PACKAGE_ROUTE[i + 1])
    if (!a || !b) return null
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
  })()

  return (
    <svg
      className="stage-graph"
      viewBox={viewBoxFor(cam)}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A global logistics enterprise as one connected system"
      style={{ opacity: cam.opacity }}
    >
      <defs>
        <radialGradient id="verify-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.healthy} stopOpacity="0.18" />
          <stop offset="70%" stopColor={color.healthy} stopOpacity="0" />
        </radialGradient>
      </defs>

      {world.verified && (
        <circle cx={800} cy={450} r={520} fill="url(#verify-glow)" />
      )}

      {clusters.map((c) => (
        <g key={c.id}>
          <ellipse
            cx={c.cx}
            cy={c.cy}
            rx={c.rx}
            ry={c.ry}
            fill="none"
            stroke={color.ring}
            strokeWidth={1}
            strokeDasharray={graph.ringDash}
            opacity={0.72}
          />
          <text
            x={c.cx}
            y={c.cy - c.ry - 10}
            textAnchor="middle"
            fill={color.typeMuted}
            fontFamily={type.family}
            fontSize={11}
            letterSpacing="0.08em"
          >
            {c.label}
          </text>
        </g>
      ))}

      {edges.map((e) => {
        const a = nodeById(e.source)
        const b = nodeById(e.target)
        if (!a || !b) return null
        const key = edgeKey(e.source, e.target)
        const disrupted =
          world.entDisrupt !== "none" && ENT_DISRUPT_KEYS.has(key)
        const rerouted = ENT_REROUTE_KEYS.has(key)
        const onDependency = world.entRelations && ENT_DEPENDENCY_KEYS.has(key)
        const onRoute = world.entPackage && ENT_PACKAGE_KEYS.has(key)
        const tag = world.entTags ? ENT_EDGE_TAG.get(key) : undefined
        const dim = world.entRelations && !onDependency ? 0.2 : 1
        const stroke = world.verified
          ? color.healthy
          : disrupted
            ? color.warn
            : rerouted || onDependency
              ? color.focus
              : onRoute
                ? color.edgeActive
                : color.edge
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        return (
          <g key={`${e.source}-${e.target}-${e.relationType}`}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={stroke}
              strokeWidth={
                disrupted || rerouted || onDependency
                  ? graph.edgeWidthBus
                  : graph.edgeWidth
              }
              strokeLinecap="round"
              strokeDasharray={disrupted ? "5 6" : rerouted ? "6 5" : undefined}
              /*
               * Resting edges sit at 0.68, not the 0.5 Meridian used. That
               * graph was mostly a backdrop for an incident; here the
               * relationships are the subject — "this is not an org chart,
               * it is an organism" fails if the room can only see the nodes.
               */
              opacity={
                (disrupted
                  ? 0.92
                  : rerouted || onDependency
                    ? 0.9
                    : onRoute
                      ? 0.82
                      : 0.68) * dim
              }
              className={
                (onRoute || rerouted) && !reduced ? "edge-flow" : undefined
              }
            />
            {tag && (
              <text
                x={mx}
                y={my - 5}
                textAnchor="middle"
                fill={color.typeDim}
                fontFamily={type.family}
                fontSize={8.5}
                letterSpacing="0.1em"
              >
                {tag}
              </text>
            )}
          </g>
        )
      })}

      {nodes.map((n) => {
        const look = nodeFill(n, world)
        // Isolating the dependency chain is the visual argument of
        // `aut-relationships` — everything the late flight does not touch has
        // to recede, or "understanding lives in the relationships" is just a
        // sentence over an unchanged picture.
        const dim =
          world.entRelations && !ENT_DEPENDENCY_SET.has(n.id) ? 0.22 : 1
        return (
          <g
            key={n.id}
            transform={`translate(${n.x - size / 2} ${n.y - size / 2})`}
            opacity={dim}
            style={{
              color: look.ink,
              transition: `opacity ${duration} ${ease}`,
            }}
          >
            <rect
              width={size}
              height={size}
              rx={graph.nodeRadius}
              fill={look.fill}
              stroke={look.stroke}
              strokeWidth={1.25}
            />
            <KindMark kind={n.kind} />
            <text
              x={size / 2}
              y={size + 14}
              textAnchor="middle"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize={10}
              letterSpacing="0.01em"
            >
              {n.label}
            </text>
          </g>
        )
      })}

      {world.entDisrupt !== "none" && disruptNode && !world.verified && (
        <g transform={`translate(${disruptNode.x + 24} ${disruptNode.y - 56})`}>
          <rect
            width="158"
            height="36"
            rx="4"
            fill={color.rail}
            stroke={color.warn}
            strokeWidth="1"
          />
          <text
            x="12"
            y="14"
            fill={color.typeMuted}
            fontFamily={type.family}
            fontSize="9"
            letterSpacing="0.14em"
          >
            WEATHER
          </text>
          <text
            x="12"
            y="28"
            fill={color.warn}
            fontFamily={type.family}
            fontSize="13"
          >
            {world.entDisrupt === "reroute"
              ? "closed · rerouted"
              : "gateway closing"}
          </text>
        </g>
      )}

      {packageAt && (
        <g>
          <circle
            cx={packageAt.x}
            cy={packageAt.y}
            r={16}
            fill={color.focus}
            opacity={0.14}
          />
          <rect
            x={packageAt.x - 5.5}
            y={packageAt.y - 5.5}
            width={11}
            height={11}
            rx={1.4}
            fill={color.focus}
          />
        </g>
      )}

      {/* Identity, origin, destination, priority, commitment. Deliberately a
          shipping label rather than a packet header — the audience can find
          the resemblance on their own, which is the instruction in §17. */}
      {world.entPackage && (
        <g transform="translate(40 150)">
          <rect
            width="214"
            height="92"
            rx="5"
            fill={color.rail}
            stroke={color.railBorder}
            strokeWidth="1"
          />
          <text
            x="14"
            y="22"
            fill={color.typeMuted}
            fontFamily={type.family}
            fontSize="11"
            letterSpacing="0.18em"
          >
            {ENT_PACKAGE_CARD.id}
          </text>
          <text
            x="14"
            y="46"
            fill={color.type}
            fontFamily={type.family}
            fontSize="16"
          >
            {ENT_PACKAGE_CARD.from} → {ENT_PACKAGE_CARD.to}
          </text>
          <text
            x="14"
            y="66"
            fill={color.focus}
            fontFamily={type.family}
            fontSize="11"
            letterSpacing="0.08em"
          >
            {ENT_PACKAGE_CARD.priority}
          </text>
          <text
            x="14"
            y="82"
            fill={color.typeMuted}
            fontFamily={type.family}
            fontSize="11"
          >
            Commit · {ENT_PACKAGE_CARD.commit}
          </text>
        </g>
      )}

      <ActOverlays world={world} reduced={reduced} />
    </svg>
  )
}
