import { COMMITMENTS } from "../content/copy";
import { color, type } from "../design/tokens";
import {
  API_PORTS,
  COMMITMENT_ANCHORS,
  EDGE_METRICS,
  FACTS,
  LIGHTNING_PATHS,
  edgeKey,
  nodeById,
} from "../graph/meridian";
import type { WorldState } from "../stage/types";
import { ControlLoop } from "./ControlLoop";
import { Federation } from "./Federation";
import { PayloadGlyphs } from "./PayloadGlyphs";
import { ProtocolEdges } from "./ProtocolEdges";
import { Sessions, WorkflowStrip } from "./Sessions";

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function offset(
  a: { x: number; y: number },
  b: { x: number; y: number },
  px: number
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len * px, y: dx / len * px };
}

export function ActOverlays({
  world,
  reduced,
  visibleIds,
}: {
  world: WorldState;
  reduced: boolean;
  visibleIds: Set<string>;
}) {
  return (
    <g className="act-overlays">
      {world.payload !== "none" && (
        <PayloadGlyphs
          era={world.era}
          kind={world.payload}
          broken={world.sessionBreak}
          reduced={reduced}
          inspectionHop={world.inspectionHop}
          dense={world.densePackets}
        />
      )}
      {world.protocolEdges !== "none" && (
        <ProtocolEdges
          mode={world.protocolEdges}
          verified={world.verified}
          reduced={reduced}
          sessionBreak={world.sessionBreak}
        />
      )}
      {world.workflowPhase !== "none" && (
        <>
          <Sessions phase={world.workflowPhase} broken={world.sessionBreak} reduced={reduced} />
          <WorkflowStrip
            phase={world.workflowPhase}
            y={world.federation || world.station !== "none" ? 874 : 28}
          />
        </>
      )}
      {world.lightning && <Lightning reduced={reduced} visibleIds={visibleIds} />}
      {world.edgeMetrics && <EdgeMetrics visibleIds={visibleIds} />}
      {world.apiPorts && <ApiPorts />}
      {world.inferencePath && <InferenceGwMark />}
      {(world.floatingFacts || world.factsSnap) && (
        <FloatingFacts snap={world.factsSnap} reduced={reduced} />
      )}
      {world.knowledgeEdges && <RelationLabels />}
      {world.federation && <Federation hold={world.federationHold} reduced={reduced} />}
      {world.station !== "none" && (
        <ControlLoop
          active={world.station}
          tour={world.loopTour}
          verified={world.verified}
          reduced={reduced}
        />
      )}
      {world.commitments && <CommitmentMarks reduced={reduced} />}
    </g>
  );
}

function Lightning({ reduced, visibleIds }: { reduced: boolean; visibleIds: Set<string> }) {
  return (
    <g>
      {LIGHTNING_PATHS.map((path, i) => {
        const pts = path
          .filter((id) => visibleIds.has(id))
          .map((id) => nodeById(id))
          .filter((n): n is NonNullable<typeof n> => Boolean(n));
        if (pts.length < 2) return null;
        const d = pts
          .map((p, idx) => {
            if (idx === 0) return `M ${p.x} ${p.y}`;
            const prev = pts[idx - 1]!;
            const mx = (prev.x + p.x) / 2 + (idx % 2 === 0 ? 8 : -8);
            const my = (prev.y + p.y) / 2 + (idx % 2 === 0 ? -10 : 10);
            return `Q ${mx} ${my} ${p.x} ${p.y}`;
          })
          .join(" ");
        return (
          <path
            key={path.join("-")}
            d={d}
            fill="none"
            stroke={color.lightning}
            strokeWidth={1.35}
            strokeLinecap="round"
            strokeDasharray={i % 2 === 0 ? "5 9" : "2 7"}
            className={reduced ? undefined : "lightning"}
            style={
              reduced
                ? { opacity: 0.4 }
                : {
                    animationDelay: `${i * 140 + (i % 3) * 90}ms`,
                    animationDuration: `${0.85 + (i % 4) * 0.22}s`,
                  }
            }
          />
        );
      })}
    </g>
  );
}

function EdgeMetrics({ visibleIds }: { visibleIds: Set<string> }) {
  return (
    <g>
      {EDGE_METRICS.filter((m) => visibleIds.has(m.source) && visibleIds.has(m.target)).map((m) => {
        const a = nodeById(m.source);
        const b = nodeById(m.target);
        if (!a || !b) return null;
        const c = mid(a, b);
        const o = offset(a, b, 14);
        const ink = m.tone === "incident" ? color.incident : m.tone === "ok" ? color.healthy : color.focus;
        return (
          <g key={edgeKey(m.source, m.target)} transform={`translate(${c.x + o.x} ${c.y + o.y})`}>
            <text
              textAnchor="middle"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize={8}
              letterSpacing="0.12em"
            >
              {m.label}
            </text>
            <text
              y={11}
              textAnchor="middle"
              fill={ink}
              fontFamily={type.family}
              fontSize={11}
            >
              {m.value}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function InferenceGwMark() {
  const n = nodeById("lb");
  if (!n) return null;
  return (
    <g transform={`translate(${n.x + 16} ${n.y - 22})`}>
      <rect width="92" height="16" rx={3} fill={color.rail} stroke={color.focus} strokeWidth={0.8} />
      <text
        x={6}
        y={12}
        fill={color.focus}
        fontFamily={type.family}
        fontSize={8}
        letterSpacing="0.08em"
      >
        INFERENCE GW
      </text>
    </g>
  );
}

function ApiPorts() {
  return (
    <g>
      {API_PORTS.map((p, i) => {
        const n = nodeById(p.nodeId);
        if (!n) return null;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <g key={p.label} transform={`translate(${n.x + 20} ${n.y + side * 18})`}>
            <rect width="8" height="8" rx="1.5" fill={color.focusFill} stroke={color.focus} strokeWidth={1} />
            <text
              x={12}
              y={7}
              fill={color.focus}
              fontFamily={type.family}
              fontSize={9}
              letterSpacing="0.08em"
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function FloatingFacts({ snap, reduced }: { snap: boolean; reduced: boolean }) {
  return (
    <g>
      {FACTS.map((f) => {
        const a = nodeById(f.source);
        const b = nodeById(f.target);
        if (!a || !b) return null;
        const c = mid(a, b);
        const x = snap || reduced ? c.x : c.x + f.dx;
        const y = snap || reduced ? c.y - 8 : c.y + f.dy;
        return (
          <text
            key={f.text}
            x={x}
            y={y}
            textAnchor="middle"
            fill={snap ? color.type : color.typeMuted}
            fontFamily={type.family}
            fontSize={11}
            style={{
              transition: reduced ? "none" : "x 480ms cubic-bezier(0.22, 1, 0.36, 1), y 480ms cubic-bezier(0.22, 1, 0.36, 1), fill 320ms ease",
            }}
          >
            {f.text}
          </text>
        );
      })}
    </g>
  );
}

function RelationLabels() {
  const shown = [
    { source: "users", target: "lan", label: "path" },
    { source: "lan", target: "sdwan", label: "path" },
    { source: "sdwan", target: "isp", label: "path" },
    { source: "security", target: "region", label: "path" },
    { source: "k8s", target: "checkout", label: "path" },
    { source: "checkout", target: "db", label: "depends" },
    { source: "db", target: "san", label: "depends" },
    { source: "region", target: "san", label: "depends" },
  ];
  return (
    <g>
      {shown.map((e) => {
        const a = nodeById(e.source);
        const b = nodeById(e.target);
        if (!a || !b) return null;
        const c = mid(a, b);
        const o = offset(a, b, -12);
        return (
          <text
            key={`${e.source}-${e.target}`}
            x={c.x + o.x}
            y={c.y + o.y}
            textAnchor="middle"
            fill={color.focus}
            fontFamily={type.family}
            fontSize={8}
            letterSpacing="0.14em"
          >
            {e.label}
          </text>
        );
      })}
    </g>
  );
}

function CommitmentMarks({ reduced }: { reduced: boolean }) {
  return (
    <g>
      {COMMITMENT_ANCHORS.map((a, i) => {
        const n = nodeById(a.nodeId);
        const copy = COMMITMENTS.find((c) => c.id === a.id);
        if (!n || !copy) return null;
        const w = 168;
        return (
          <g
            key={a.id}
            className={reduced ? undefined : "commitment-in"}
            style={reduced ? undefined : { animationDelay: `${i * 220}ms` }}
          >
            <line
              x1={a.x + w / 2}
              y1={a.y + 13}
              x2={n.x}
              y2={n.y}
              stroke={color.healthy}
              strokeWidth={0.7}
              strokeDasharray="2 6"
              opacity={0.4}
            />
            <rect
              x={a.x}
              y={a.y}
              width={w}
              height={26}
              rx="4"
              fill={color.rail}
              stroke={color.healthy}
              strokeWidth={0.8}
            />
            <text
              x={a.x + 8}
              y={a.y + 17}
              fill={color.type}
              fontFamily={type.family}
              fontSize={9}
            >
              {copy.short}
            </text>
          </g>
        );
      })}
    </g>
  );
}
