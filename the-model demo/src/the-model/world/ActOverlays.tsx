import { color, type } from "../design/tokens"
import {
  ENT_DEPENDENCY_CHAIN,
  ENT_SIGNALS,
  nodeById,
} from "../graph/enterprise"
import type { WorldState } from "../stage/types"
import { ControlLoop } from "./ControlLoop"
import { DispatchMind } from "./DispatchMind"
import { Federation } from "./Federation"

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function offset(
  a: { x: number; y: number },
  b: { x: number; y: number },
  px: number
) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  return { x: (-dy / len) * px, y: (dx / len) * px }
}

/**
 * Everything drawn over the enterprise fabric. Each overlay belongs to exactly
 * one of the autonomy requirements, in the order the show asks for them:
 * perception (`EntSignals`), relationships (`EntRelationLabels`), the shared
 * operational model (`EntModelMarks`), distributed intelligence
 * (`Federation`), and the closed loop (`ControlLoop`).
 */
export function ActOverlays({
  world,
  reduced,
}: {
  world: WorldState
  reduced: boolean
}) {
  return (
    <g className="act-overlays">
      {world.entSignals && <EntSignals reduced={reduced} />}
      {world.dispatch > 0 && (
        <DispatchMind stage={world.dispatch} reduced={reduced} />
      )}
      {world.entRelations && <EntRelationLabels />}
      {world.entModel && <EntModelMarks />}
      {world.federation && (
        <Federation hold={world.federationHold} reduced={reduced} />
      )}
      {world.station !== "none" && (
        <ControlLoop
          active={world.station}
          tour={world.loopTour}
          verified={world.verified}
          reduced={reduced}
        />
      )}
    </g>
  )
}

/**
 * The enterprise's live signals — aircraft ETA, hub capacity, a vehicle
 * offline, a commitment at risk. Deliberately the same visual treatment as the
 * perception labels in Court.tsx: the beat's claim is that this is the
 * enterprise equivalent of the player reading the defender, and the rhyme has
 * to be visible rather than asserted.
 *
 * Each signal is a fact and nothing more — which is exactly the setup the
 * relationships beat then pays off.
 */
function EntSignals({ reduced }: { reduced: boolean }) {
  return (
    <g>
      {ENT_SIGNALS.map((s, i) => {
        const n = nodeById(s.nodeId)
        if (!n) return null
        return (
          <g
            key={s.nodeId + s.text}
            className={reduced ? undefined : "commitment-in"}
            style={reduced ? undefined : { animationDelay: `${i * 110}ms` }}
          >
            <line
              x1={n.x}
              y1={n.y}
              x2={n.x + s.dx}
              y2={n.y + s.dy}
              stroke={color.focus}
              strokeWidth={0.7}
              strokeDasharray="2 5"
              opacity={0.42}
            />
            <text
              x={n.x + s.dx}
              y={n.y + s.dy}
              textAnchor="middle"
              fill={color.focus}
              fontFamily={type.family}
              fontSize={10.5}
            >
              {s.text}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/**
 * The chain that turns "a flight is late" from a fact into an explanation:
 * which hub, which onward leg, which vehicle, whose commitment. Labelled with
 * the relation rather than a metric, because the beat is about the edges.
 */
function EntRelationLabels() {
  return (
    <g>
      {ENT_DEPENDENCY_CHAIN.slice(0, -1).map((id, i) => {
        const a = nodeById(id)
        const b = nodeById(ENT_DEPENDENCY_CHAIN[i + 1])
        if (!a || !b) return null
        const c = mid(a, b)
        const o = offset(a, b, -13)
        return (
          <text
            key={id}
            x={c.x + o.x}
            y={c.y + o.y}
            textAnchor="middle"
            fill={color.focus}
            fontFamily={type.family}
            fontSize={8}
            letterSpacing="0.14em"
          >
            {i === ENT_DEPENDENCY_CHAIN.length - 2 ? "commits" : "affects"}
          </text>
        )
      })}
    </g>
  )
}

/**
 * The organisation's shared model, shown as semantics on the network rather
 * than as a text panel: what each operating constraint actually governs. The
 * basketball team had a playbook; this is the enterprise's, and like the
 * playbook it is what lets distributed actors decide locally.
 */
function EntModelMarks() {
  const marks = [
    { nodeId: "ent-policy", label: "SAFETY POLICY" },
    { nodeId: "ent-planning", label: "ROUTING POLICY" },
    { nodeId: "ent-commitments", label: "SERVICE COMMITMENTS" },
    { nodeId: "ent-hub-sort", label: "CAPACITY" },
    { nodeId: "ent-recipient", label: "CUSTOMER PRIORITY" },
  ]
  return (
    <g>
      {marks.map((m) => {
        const n = nodeById(m.nodeId)
        if (!n) return null
        return (
          <text
            key={m.nodeId}
            x={n.x}
            y={n.y - 24}
            textAnchor="middle"
            fill={color.typeMuted}
            fontFamily={type.family}
            fontSize={9}
            letterSpacing="0.16em"
            opacity={0.9}
          >
            {m.label}
          </text>
        )
      })}
    </g>
  )
}
