import { useEffect, useMemo, useRef, useState } from "react";
import { inspectBlast, wrongBlast } from "../agent/incident";
import { color, graph, motion, type } from "../design/tokens";
import {
  CHECKOUT_NODE_ID,
  GPU_NODE_ID,
  GPU_PEER_ID,
  INFERENCE_IDS,
  INSPECT_NODE_ID,
  JCT_EDGE,
  PATH_BLAST_KEYS,
  PATH_BLAST_NODES,
  SAN_NODE_ID,
  SPINE_SET,
  TRAINING_KEYS,
  edgeKey,
  meridian,
  nodeById,
  resolveGraph,
  visibleClusters,
} from "../graph/meridian";
import type { GraphNode } from "../graph/types";
import { subgraphWithin } from "../graph/traverse";
import type { WorldState } from "../stage/types";
import { usePrefersReducedMotion } from "../stage/hooks";
import { ActOverlays } from "./ActOverlays";
import { AgentTraveler } from "./AgentTraveler";
import { KindMark } from "./KindMark";

interface Cam {
  zoom: number;
  x: number;
  y: number;
  opacity: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function viewBoxFor(cam: Cam) {
  const w = graph.width / cam.zoom;
  const h = graph.height / cam.zoom;
  return `${cam.x - w / 2} ${cam.y - h / 2} ${w} ${h}`;
}

function isGpu(id: string) {
  return id === GPU_NODE_ID || id === GPU_PEER_ID;
}

function nodeFill(n: GraphNode, world: WorldState, blasted: Set<string>) {
  if (world.verified && !world.jobBroken) {
    return { fill: color.healthyFill, stroke: color.healthy, ink: color.healthy };
  }
  if (world.blastKind === "wrong" && n.id === GPU_NODE_ID) {
    return { fill: color.focusFill, stroke: color.focus, ink: color.focus };
  }
  if (world.checkoutDown && n.id === CHECKOUT_NODE_ID) {
    return { fill: color.incidentFill, stroke: color.incident, ink: color.incident };
  }
  if (world.inspectionHop && n.id === INSPECT_NODE_ID) {
    return { fill: color.incidentFill, stroke: color.incident, ink: color.incident };
  }
  if (world.blastKind === "path" && PATH_BLAST_NODES.has(n.id) && !isGpu(n.id)) {
    return { fill: color.incidentFill, stroke: color.incident, ink: color.incident };
  }
  if (world.blastKind === "inspect" && blasted.has(n.id)) {
    return { fill: color.focusFill, stroke: color.focus, ink: color.focus };
  }
  const blameGpu =
    (world.jobBroken || world.blastKind === "gpu" || world.blast) &&
    world.blastKind !== "path" &&
    world.blastKind !== "wrong" &&
    world.blastKind !== "inspect";
  if (blameGpu && blasted.has(n.id) && !isGpu(n.id)) {
    return { fill: color.incidentFill, stroke: color.incident, ink: color.incident };
  }
  if ((world.jobBroken || world.blastKind === "path") && isGpu(n.id)) {
    return { fill: color.healthyFill, stroke: color.healthy, ink: color.healthy };
  }
  if (world.emphasizeSan && n.id === SAN_NODE_ID) {
    return { fill: color.focusFill, stroke: color.focus, ink: color.focus };
  }
  if (world.inferencePath && INFERENCE_IDS.has(n.id)) {
    return { fill: color.focusFill, stroke: color.focus, ink: color.focus };
  }
  if (world.spineHighlight && SPINE_SET.has(n.id)) {
    return { fill: color.focusFill, stroke: color.focus, ink: color.focus };
  }
  return { fill: color.healthyFill, stroke: color.healthy, ink: color.healthy };
}

export function GraphView({ world }: { world: WorldState }) {
  const reduced = usePrefersReducedMotion();
  const target: Cam = {
    zoom: world.zoom,
    x: world.focusX,
    y: world.focusY,
    opacity: world.graphOpacity,
  };
  const cam = useRef<Cam>({ ...target });
  const [, setTick] = useState(0);

  useEffect(() => {
    if (reduced) {
      cam.current = { ...target };
      setTick((n) => n + 1);
      return;
    }
    let raf = 0;
    const step = () => {
      const k = 0.085;
      cam.current = {
        zoom: lerp(cam.current.zoom, target.zoom, k),
        x: lerp(cam.current.x, target.x, k),
        y: lerp(cam.current.y, target.y, k),
        opacity: lerp(cam.current.opacity, target.opacity, k),
      };
      setTick((n) => n + 1);
      const settled =
        Math.abs(cam.current.zoom - target.zoom) < 0.003 &&
        Math.abs(cam.current.x - target.x) < 0.4 &&
        Math.abs(cam.current.y - target.y) < 0.4 &&
        Math.abs(cam.current.opacity - target.opacity) < 0.01;
      if (!settled) raf = requestAnimationFrame(step);
      else cam.current = { ...target };
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, target.zoom, target.x, target.y, target.opacity]);

  const era = world.era;
  const { nodes, edges } = resolveGraph(era, {
    inference: world.inferencePath || world.workflowPhase === "fanout" || world.workflowPhase === "restored",
    inspect: world.inspectionHop || world.blastKind === "inspect" || world.blastKind === "path" || world.sessionBreak,
    protocols: world.protocolEdges !== "none" || world.workflowPhase !== "none",
  });
  const clusters =
    world.shot === "gpu-close" || world.shot === "training"
      ? visibleClusters(era).filter((c) => c.id === "gpu")
      : visibleClusters(era);
  const size = graph.node;

  const blast = useMemo(() => {
    if (world.blastKind === "wrong") return wrongBlast();
    if (world.blastKind === "inspect") return inspectBlast();
    if (world.blastKind === "path") {
      return { nodeIds: PATH_BLAST_NODES, edgeKeys: PATH_BLAST_KEYS };
    }
    if (world.blast || world.blastKind === "gpu") {
      return subgraphWithin(meridian.edges, GPU_NODE_ID, 2);
    }
    return { nodeIds: new Set<string>(), edgeKeys: new Set<string>() };
  }, [world.blast, world.blastKind]);

  const gpu = nodeById(GPU_NODE_ID);
  const inspect = nodeById(INSPECT_NODE_ID);
  const busTilt = world.emphasizeEdges && world.shot === "bus" && !reduced ? 4 : 0;
  const duration = reduced ? "0ms" : `${motion.duration.emphasized}ms`;
  const ease = motion.easing.standard;
  const glowOrigin =
    world.blastKind === "inspect" && inspect
      ? inspect
      : gpu && (world.blast || world.blastKind === "gpu" || world.blastKind === "wrong" || world.blastKind === "path")
        ? gpu
        : null;
  const glowR = world.blastKind === "path" ? 280 : world.blastKind === "wrong" ? 260 : 210;

  return (
    <svg
      className="stage-graph"
      viewBox={viewBoxFor(cam.current)}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Meridian operational fabric"
      style={{ opacity: cam.current.opacity }}
    >
      <defs>
        <radialGradient id="blast-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.incident} stopOpacity="0.28" />
          <stop offset="55%" stopColor={color.incident} stopOpacity="0.10" />
          <stop offset="100%" stopColor={color.incident} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="verify-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.healthy} stopOpacity="0.22" />
          <stop offset="70%" stopColor={color.healthy} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g
        style={{
          transform: `rotate(${busTilt}deg)`,
          transformOrigin: "800px 450px",
          transition: `transform ${duration} ${ease}`,
        }}
      >
        {glowOrigin && world.blastKind !== "inspect" && (
          <circle
            cx={glowOrigin.x}
            cy={glowOrigin.y}
            r={glowR}
            fill="url(#blast-glow)"
            style={{ transition: `opacity ${duration} ${ease}` }}
          />
        )}
        {world.verified && gpu && (
          <circle cx={gpu.x} cy={gpu.y} r={240} fill="url(#verify-glow)" />
        )}

        {clusters.map((c) => (
          <g key={c.id} opacity={world.graphDark ? 0.18 : 1}>
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
          const a = nodeById(e.source);
          const b = nodeById(e.target);
          if (!a || !b) return null;
          const key = edgeKey(e.source, e.target);
          const jct =
            (e.source === JCT_EDGE.source && e.target === JCT_EDGE.target) ||
            (e.source === JCT_EDGE.target && e.target === JCT_EDGE.source);
          const failed =
            (world.jobBroken && (jct || blast.edgeKeys.has(key)) && world.blastKind !== "inspect") ||
            (world.blastKind === "path" && PATH_BLAST_KEYS.has(key)) ||
            (world.blastKind === "wrong" && blast.edgeKeys.has(key));
          const hot = world.thickenTraining && TRAINING_KEYS.has(key);
          const infer =
            world.inferencePath &&
            (INFERENCE_IDS.has(e.source) || INFERENCE_IDS.has(e.target));
          const spine =
            world.spineHighlight && SPINE_SET.has(e.source) && SPINE_SET.has(e.target);
          const bus = world.emphasizeEdges;
          const san = world.emphasizeSan && (e.source === SAN_NODE_ID || e.target === SAN_NODE_ID);
          const inspectHop =
            world.inspectionHop && (e.source === INSPECT_NODE_ID || e.target === INSPECT_NODE_ID);
          const stroke = failed
            ? color.incident
            : inspectHop
              ? color.incident
              : world.verified
                ? color.healthy
                : infer || spine
                  ? color.focus
                  : hot
                    ? color.edgeHot
                    : san
                      ? color.focus
                      : bus
                        ? color.edgeActive
                        : color.edge;
          const width = hot
            ? 3.1
            : failed || bus || infer || spine
              ? graph.edgeWidthBus
              : graph.edgeWidth;
          return (
            <line
              key={`${e.source}-${e.target}-${e.relationType}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={stroke}
              strokeWidth={width}
              strokeLinecap="round"
              opacity={world.graphDark ? 0.16 : failed ? 0.95 : 0.85}
              className={hot && !reduced ? "edge-flow" : undefined}
            />
          );
        })}

        {nodes.map((n) => {
          const look = nodeFill(n, world, blast.nodeIds);
          const selected = world.selectedId === n.id;
          const dimGpuClose =
            world.shot === "gpu-close" && n.id !== GPU_NODE_ID
              ? 0.18
              : world.shot === "training" && n.cluster !== "gpu"
                ? 0.2
                : 1;
          const dark = world.graphDark ? 0.14 : 1;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x - size / 2} ${n.y - size / 2})`}
              opacity={dimGpuClose * dark}
              style={{ color: look.ink, transition: `opacity ${duration} ${ease}` }}
            >
              {selected && (
                <rect
                  x={-5}
                  y={-5}
                  width={size + 10}
                  height={size + 10}
                  rx={graph.nodeRadius + 2}
                  fill="none"
                  stroke={color.focus}
                  strokeWidth={1.6}
                />
              )}
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
                fill={selected ? color.type : color.typeMuted}
                fontFamily={type.family}
                fontSize={10}
                letterSpacing="0.01em"
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {world.jobBroken && gpu && world.blastKind !== "wrong" && (
          <g transform={`translate(${gpu.x + 36} ${gpu.y - 48})`}>
            <rect width="168" height="36" rx="4" fill={color.rail} stroke={color.incident} strokeWidth="1" />
            <text
              x="12"
              y="14"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize="9"
              letterSpacing="0.14em"
            >
              JOB COMPLETION TIME
            </text>
            <text x="12" y="28" fill={color.incident} fontFamily={type.family} fontSize="13">
              stalled · GPU still healthy
            </text>
          </g>
        )}

        {world.blastKind === "wrong" && gpu && (
          <g transform={`translate(${gpu.x + 36} ${gpu.y - 48})`}>
            <rect width="176" height="36" rx="4" fill={color.rail} stroke={color.incident} strokeWidth="1" />
            <text
              x="12"
              y="14"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize="9"
              letterSpacing="0.14em"
            >
              WRONG BLAST RADIUS
            </text>
            <text x="12" y="28" fill={color.incident} fontFamily={type.family} fontSize="13">
              restart gpu-0 · checkout down
            </text>
          </g>
        )}

        {world.verified && gpu && (
          <g transform={`translate(${gpu.x + 36} ${gpu.y - 48})`}>
            <rect width="176" height="36" rx="4" fill={color.rail} stroke={color.healthy} strokeWidth="1" />
            <text
              x="12"
              y="14"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize="9"
              letterSpacing="0.14em"
            >
              JOB COMPLETION TIME
            </text>
            <text x="12" y="28" fill={color.healthy} fontFamily={type.family} fontSize="13">
              resumed · inspect hop gone
            </text>
          </g>
        )}

        <ActOverlays
          world={world}
          reduced={reduced}
          visibleIds={new Set(nodes.map((n) => n.id))}
        />
        <AgentTraveler
          intent={world.agentIntent}
          reduced={reduced}
          visible={world.agentIntent !== "idle"}
        />
      </g>
    </svg>
  );
}
