import { useEffect, useMemo, useRef } from "react"
import { color, graph, type } from "../design/tokens"
import {
  AI_CLUSTERS,
  AI_EDGES,
  AI_FRAME_1,
  AI_FRAME_2,
  AI_NODES,
  FLOW_COLOR,
  flowWeight,
  pointOn,
  type AiEdge,
  type AiNode,
  type FlowKind,
} from "../graph/aiNetwork"
import { KindMark } from "./KindMark"

/**
 * One flight: the companies and systems that have to participate when an agent
 * files and flies a turbulence-sensitive shipment. Packets are the traffic.
 * Hosting stays dim so the calls glow.
 */

const SIZE = graph.node

/**
 * Three altitudes on one picture. Beat 1 is the dispatch systems at filing.
 * The middle beats walk the network path — broken, then repaired. The last
 * pulls back so every participant in the flight loop is in frame.
 */
const SYS = [
  "wx:route",
  "wx:load",
  "wx:ride",
  "wx:slot",
  "wx:called",
  "wx:own",
  "wx:jet",
  "wx:turb",
  "wx:rides",
  "wx:forecast",
  "wx:aircraft",
  "wx:package",
]
const PATH = [
  ...SYS,
  "wx:sensors",
  "wx:accel",
  "wx:avionics",
  "wx:link-air",
  "wx:monitor",
  "wx:promise",
  "wx:met",
  "carrier:router",
  "carrier:own",
  "carrier:agents",
  "carrier:corpus",
  "airline:router",
  "site:sorthub",
  "site:gate",
  "staff:dispatcher",
  "gemini",
  "flash",
  "link",
  "infer",
  "tools",
  "embed",
]
const FORECAST = new Set([
  "wx:jet",
  "wx:turb",
  "wx:forecast",
  "wx:called",
  "gemini",
  "flash",
])
const PROVIDERS = new Set([
  "wx:jet",
  "wx:turb",
  "wx:forecast",
  "wx:met",
  "gemini",
  "flash",
  "infer",
  "embed",
  "link",
])

type StoryMode =
  | "systems"
  | "fanout"
  | "stream"
  | "stall"
  | "retry"
  | "crowd"
  | "trace"
  | "fresh"
  | "complete"
  | "once"
  | "isolate"
  | "measure"
  | "enroute"
  | "fabric"

const HOT = new Set(["wx:jet", "wx:turb"])

function storyMode(beat: number): StoryMode {
  if (beat <= 1) return "systems"
  if (beat === 2) return "fanout"
  if (beat === 3) return "stream"
  if (beat === 4) return "stall"
  if (beat === 5) return "retry"
  if (beat === 6) return "crowd"
  if (beat === 7) return "trace"
  if (beat === 8) return "fresh"
  if (beat === 9) return "complete"
  if (beat === 10) return "once"
  if (beat === 11) return "isolate"
  if (beat === 12) return "measure"
  if (beat === 13) return "enroute"
  return "fabric"
}

function frameNodes(ids: string[], pad: number) {
  const list = AI_NODES.filter((n) => ids.includes(n.id))
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const n of list) {
    minX = Math.min(minX, n.x - 100)
    maxX = Math.max(maxX, n.x + 100)
    minY = Math.min(minY, n.y - 70)
    maxY = Math.max(maxY, n.y + 48)
  }
  minX -= pad
  maxX += pad
  minY -= pad
  maxY += pad
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  let w = maxX - minX
  let h = maxY - minY
  if (w / h < 16 / 9) w = (h * 16) / 9
  else h = (w * 9) / 16
  return { x: cx - w / 2, y: cy - h / 2, w, h }
}

interface Packet {
  edge: number
  t: number
  /** -1 draws the packet back toward the source. */
  dir: 1 | -1
  speed: number
}

function edgePath(e: AiEdge) {
  return `M ${e.x1} ${e.y1} Q ${e.cx} ${e.cy} ${e.x2} ${e.y2}`
}

function ringFor(ids: string[], padX: number, padY: number) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const id of ids) {
    const n = AI_NODES.find((node) => node.id === id)
    if (!n) continue
    minX = Math.min(minX, n.x)
    maxX = Math.max(maxX, n.x)
    minY = Math.min(minY, n.y)
    maxY = Math.max(maxY, n.y)
  }
  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    rx: (maxX - minX) / 2 + padX,
    ry: (maxY - minY) / 2 + padY,
  }
}

function ink(n: AiNode) {
  if (n.gemini) return color.somaNerve
  if (n.open || n.tier === "own") return color.healthy
  if (n.tier === "model") return color.somaNerve
  if (n.tier === "corpus") return color.somaMedia
  if (n.tier === "agents" || n.tier === "lab") return color.focus
  if (n.tier === "customer" || n.tier === "remote") return color.somaInvent
  if (n.tier === "staff" || n.tier === "router") return color.type
  if (n.tier === "site") return "#9EC4DE"
  if (n.tier === "internet") return color.somaInvent
  if (n.id === "infer" || n.id === "tools") return color.focus
  if (n.tier === "serving") return color.edgeActive
  return color.healthy
}

function fill(n: AiNode) {
  if (n.gemini) return "rgba(232, 184, 106, 0.22)"
  if (n.open || n.tier === "own") return color.healthyFill
  if (n.tier === "model") return "rgba(232, 184, 106, 0.14)"
  if (n.tier === "corpus") return "rgba(167, 139, 250, 0.16)"
  if (n.tier === "customer" || n.tier === "remote" || n.tier === "internet")
    return "rgba(224, 122, 138, 0.16)"
  if (n.tier === "site") return "rgba(158, 196, 222, 0.16)"
  if (n.tier === "staff") return "rgba(241, 245, 254, 0.12)"
  if (n.tier === "agents" || n.tier === "lab" || n.id === "infer") return color.focusFill
  return "rgba(62, 207, 142, 0.12)"
}

function speedFor(kind: FlowKind) {
  if (kind === "infer" || kind === "tool" || kind === "reach") return 0.55
  if (kind === "retrieve" || kind === "private" || kind === "wan") return 0.38
  if (kind === "host") return 0.16
  return 0.24
}

function spawn(bag: number[], edges: AiEdge[], rng = Math.random): Packet {
  const edge = bag[Math.floor(rng() * bag.length)] ?? 0
  const spec = edges[edge]
  const kind = spec?.kind ?? "infer"
  return {
    edge,
    t: rng(),
    dir: spec?.both && rng() < 0.5 ? -1 : 1,
    speed: speedFor(kind) * (0.72 + rng() * 0.55),
  }
}

function place(edges: AiEdge[], p: Packet) {
  const edge = edges[p.edge]
  if (!edge) return { x: 0, y: 0 }
  const u = p.dir < 0 ? 1 - p.t : p.t
  return pointOn(edge, Math.min(1, Math.max(0, u)))
}

function bothEnds(edge: AiEdge, ids: Set<string>) {
  return ids.has(edge.a) && ids.has(edge.b)
}

function touchesId(edge: AiEdge, id: string) {
  return edge.a === id || edge.b === id
}

function isForecast(edge: AiEdge) {
  return FORECAST.has(edge.a) || FORECAST.has(edge.b)
}

function isFile(edge: AiEdge) {
  return (
    (edge.a === "wx:route" && edge.b === "wx:aircraft") ||
    (edge.b === "wx:route" && edge.a === "wx:aircraft")
  )
}

function isChoke(edge: AiEdge) {
  return touchesId(edge, "wx:jet") || touchesId(edge, "wx:slot") || isFile(edge)
}

function isHot(edge: AiEdge) {
  return HOT.has(edge.a) || HOT.has(edge.b)
}

function isTool(edge: AiEdge) {
  return isFile(edge) || touchesId(edge, "wx:aircraft")
}

function isStuck(edge: AiEdge) {
  return touchesId(edge, "wx:jet") || touchesId(edge, "wx:turb")
}

function isProviderEdge(edge: AiEdge) {
  return PROVIDERS.has(edge.a) || PROVIDERS.has(edge.b)
}

function storyPace(edge: AiEdge, mode: StoryMode) {
  if (mode === "systems") return 0.58
  if (mode === "fanout") return touchesId(edge, "wx:jet") ? 0.05 : 0.28
  if (mode === "stream") return isForecast(edge) ? 0.07 : 0.16
  if (mode === "stall") return isChoke(edge) ? 0.03 : 0.1
  if (mode === "trace") return 0.12
  if (mode === "fresh" || mode === "complete" || mode === "once") return 0.2
  if (mode === "isolate") return touchesId(edge, "wx:jet") && touchesId(edge, "wx:route") ? 0.22 : 0.12
  if (mode === "enroute") return 0.26
  return speedFor(edge.kind) * (0.72 + Math.random() * 0.55)
}

function storyDir(edge: AiEdge, mode: StoryMode): 1 | -1 {
  const towardLeft: 1 | -1 = edge.x1 < edge.x2 ? -1 : 1
  const towardRight: 1 | -1 = towardLeft === 1 ? -1 : 1
  if (mode === "systems" || mode === "retry" || mode === "enroute") return Math.random() < 0.5 ? 1 : -1
  if (mode === "fanout" || mode === "fresh" || mode === "complete") return towardRight
  if (mode === "stream" || mode === "stall" || mode === "trace" || mode === "isolate") return towardLeft
  return Math.random() < 0.5 ? 1 : -1
}

function packetInk(edge: AiEdge, mode: StoryMode) {
  if (mode === "stall" && isChoke(edge)) return color.warn
  if (mode === "retry" && isTool(edge)) return color.warn
  if (mode === "crowd" && isHot(edge)) return color.warn
  if (mode === "fanout" && touchesId(edge, "wx:jet")) return color.warn
  if (mode === "trace" && isStuck(edge)) return color.warn
  if (mode === "isolate" && touchesId(edge, "wx:jet") && touchesId(edge, "wx:route")) return color.healthy
  return FLOW_COLOR[edge.kind]
}

function vanishes(edge: AiEdge, mode: StoryMode, u: number) {
  return mode === "stream" && isForecast(edge) && u > 0.42
}

function edgeStyle(edge: AiEdge, mode: StoryMode, focus: Set<string> | null) {
  const focused = !focus || bothEnds(edge, focus)
  const base = FLOW_COLOR[edge.kind]
  if (mode === "fabric") {
    return {
      stroke: base,
      width: edge.kind === "infer" || edge.kind === "private" ? 1.25 : 1,
      opacity: edge.kind === "govern" ? 0.45 : 0.72,
      glow: 0.07,
      dash: undefined as string | undefined,
    }
  }
  if (mode === "crowd") {
    if (isHot(edge)) return { stroke: color.warn, width: 2.4, opacity: 0.95, glow: 0.22, dash: undefined }
    if (!focused) return { stroke: base, width: 0.7, opacity: 0.08, glow: 0, dash: undefined }
    return { stroke: base, width: 1.1, opacity: 0.35, glow: 0.04, dash: undefined }
  }
  if (mode === "systems" && focused) {
    return { stroke: base, width: 2.4, opacity: 1, glow: 0.28, dash: undefined }
  }
  if (!focused) return { stroke: base, width: 0.7, opacity: 0.04, glow: 0, dash: undefined }
  if (mode === "measure" && isProviderEdge(edge)) {
    return { stroke: color.typeMuted, width: 1.3, opacity: 0.45, glow: 0, dash: "5 7" }
  }
  if (mode === "trace" && isStuck(edge)) {
    return { stroke: color.typeMuted, width: 1.3, opacity: 0.4, glow: 0, dash: "5 7" }
  }
  if (mode === "fanout" && touchesId(edge, "wx:jet")) {
    return { stroke: color.warn, width: 2.6, opacity: 0.95, glow: 0.2, dash: undefined }
  }
  if (mode === "stall" && isChoke(edge)) {
    return { stroke: color.warn, width: 2.5, opacity: 0.95, glow: 0.2, dash: undefined }
  }
  if (mode === "retry" && isTool(edge)) {
    return { stroke: color.warn, width: 2.6, opacity: 0.95, glow: 0.18, dash: undefined }
  }
  if (mode === "isolate" && touchesId(edge, "wx:jet") && touchesId(edge, "wx:route")) {
    return { stroke: color.healthy, width: 2.8, opacity: 1, glow: 0.24, dash: undefined }
  }
  if (mode === "complete" && isFile(edge)) {
    return { stroke: base, width: 1.2, opacity: 0.28, glow: 0.04, dash: "4 6" }
  }
  if (mode === "once" && isFile(edge)) {
    return { stroke: color.healthy, width: 2.4, opacity: 1, glow: 0.2, dash: undefined }
  }
  return { stroke: base, width: 1.7, opacity: 0.9, glow: 0.12, dash: undefined }
}

function nodeStroke(node: AiNode, mode: StoryMode, look: string) {
  if (mode === "stall" && (node.id === "wx:slot" || node.id === "wx:aircraft" || node.id === "wx:jet")) return color.warn
  if (mode === "crowd" && HOT.has(node.id)) return color.warn
  if (mode === "fanout" && node.id === "wx:jet") return color.warn
  if (mode === "retry" && node.id === "wx:aircraft") return color.warn
  if (mode === "trace" && (node.id === "wx:jet" || node.id === "wx:turb")) return color.typeMuted
  if (mode === "isolate" && node.id === "wx:jet") return color.healthy
  if (mode === "fresh" && node.id === "wx:jet") return color.healthy
  if (mode === "enroute" && (node.id === "wx:rides" || node.id === "wx:aircraft")) return color.focus
  return look
}

const DESIGN_MARKS: { word: string; a: string; b: string; fill: string }[] = [
  { word: "LIVE", a: "wx:route", b: "wx:jet", fill: color.healthy },
  { word: "ONCE", a: "wx:route", b: "wx:aircraft", fill: color.type },
  { word: "ISOLATED", a: "wx:route", b: "wx:turb", fill: color.focus },
  { word: "MEASURED", a: "wx:jet", b: "link", fill: color.typeMuted },
]

const BRANDS = new Set(["gemini", "flash", "gemma", "g-embed", "llama-s"])

/** Modes that keep the full flight loop in frame while lighting a path. */
const WIDE_STORY = new Set<StoryMode>([
  "crowd",
  "trace",
  "fresh",
  "complete",
  "once",
  "isolate",
  "measure",
  "enroute",
  "fabric",
])

export function AiNetwork({
  reduced,
  beat,
  quietBrands = false,
}: {
  reduced: boolean
  beat: number
  /** Wide shot. The traffic stays. Vendor names do not. */
  quietBrands?: boolean
}) {
  const glowRef = useRef<SVGGElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const phase = 2
  const mode = storyMode(beat)
  const focus = useMemo(() => {
    if (mode === "fabric") return null
    if (mode === "systems") return new Set(SYS)
    if (mode === "fresh" || mode === "complete" || mode === "once") {
      return new Set([
        "wx:route",
        "wx:jet",
        "wx:turb",
        "wx:forecast",
        "wx:aircraft",
        "wx:ride",
        "wx:called",
        "wx:own",
        "wx:package",
      ])
    }
    if (mode === "isolate") {
      return new Set(["wx:route", "wx:jet", "wx:turb", "wx:forecast", "carrier:router", "link", "wx:aircraft"])
    }
    if (mode === "enroute") {
      return new Set([
        "wx:route",
        "wx:rides",
        "wx:aircraft",
        "wx:sensors",
        "wx:accel",
        "wx:monitor",
        "site:gate",
        "airline:router",
      ])
    }
    if (mode === "measure") {
      return new Set([
        "wx:route",
        "wx:jet",
        "wx:own",
        "wx:called",
        "flash",
        "link",
        "carrier:own",
        "wx:met",
      ])
    }
    if (mode === "crowd") {
      return new Set([...PATH, "wx:forecast", "wx:met"])
    }
    return new Set(PATH)
  }, [mode])
  const frame = useMemo(() => {
    if (WIDE_STORY.has(mode)) return AI_FRAME_2
    if (mode === "systems") return frameNodes(SYS, 36)
    return frameNodes(PATH, 40)
  }, [mode])
  const camRef = useRef(frame)
  const viewHold = useRef(`${AI_FRAME_1.x} ${AI_FRAME_1.y} ${AI_FRAME_1.w} ${AI_FRAME_1.h}`)
  const edges = useMemo(() => AI_EDGES.filter((e) => e.phase <= phase), [phase])
  const nodes = useMemo(() => AI_NODES.filter((n) => n.phase <= phase), [phase])
  const clusters = AI_CLUSTERS.filter((c) => c.phase <= phase)
  const bag = useMemo(() => {
    const out: number[] = []
    edges.forEach((e, i) => {
      let n = 0
      if (mode === "fabric") {
        n = e.kind === "host" ? (i % 4 === 0 ? 1 : 0) : flowWeight(e.kind)
      } else if (mode === "crowd" && focus && bothEnds(e, focus)) {
        n = isHot(e) ? 8 : 1
      } else if (focus && bothEnds(e, focus)) {
        if (mode === "trace" && isStuck(e)) n = 0
        else if (mode === "systems") n = 3
        else if (mode === "fanout" && isForecast(e)) n = 4
        else if (mode === "stream" && isForecast(e)) n = 5
        else if (mode === "stall" && isChoke(e)) n = 8
        else if (mode === "retry" && isTool(e)) n = 8
        else if (mode === "once" && isFile(e)) n = 2
        else if (mode === "once") n = 0
        else if (mode === "complete" && isFile(e)) n = 0
        else if (mode === "isolate" && !(touchesId(e, "wx:jet") && touchesId(e, "wx:route"))) n = 1
        else if (mode === "fresh" && !isForecast(e) && !isFile(e)) n = 1
        else n = 2
      }
      for (let k = 0; k < n; k++) out.push(i)
    })
    if (out.length === 0) out.push(0)
    return out
  }, [edges, mode, focus])
  const packetCount =
    mode === "fabric" ? 420
    : mode === "systems" ? 72
    : mode === "fanout" ? 36
    : mode === "stream" ? 28
    : mode === "stall" ? 36
    : mode === "retry" ? 40
    : mode === "crowd" ? 80
    : mode === "once" ? 6
    : mode === "enroute" ? 24
    : 22
  const packets = useMemo(() => {
    const born = (rng = Math.random) => {
      const packet = spawn(bag, edges, rng)
      const edge = edges[packet.edge]
      if (!edge || mode === "fabric" || mode === "crowd") return packet
      return { ...packet, dir: storyDir(edge, mode), speed: storyPace(edge, mode) }
    }
    const out: Packet[] = []
    const still = (i: number) => () => ((i * 17 + 3) % 100) / 100
    for (let i = 0; i < packetCount; i++) out.push(born(still(i)))
    if (!reduced) {
      for (let i = 0; i < packetCount; i++) out[i] = born()
    }
    return out
  }, [reduced, bag, edges, packetCount, mode])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (reduced) {
      camRef.current = frame
      viewHold.current = `${frame.x} ${frame.y} ${frame.w} ${frame.h}`
      svg.setAttribute("viewBox", viewHold.current)
      return
    }
    let raf = 0
    const step = () => {
      const c = camRef.current
      const k = 0.065
      const next = {
        x: c.x + (frame.x - c.x) * k,
        y: c.y + (frame.y - c.y) * k,
        w: c.w + (frame.w - c.w) * k,
        h: c.h + (frame.h - c.h) * k,
      }
      camRef.current = next
      viewHold.current = `${next.x} ${next.y} ${next.w} ${next.h}`
      svg.setAttribute("viewBox", viewHold.current)
      const settled =
        Math.abs(next.w - frame.w) < 0.8 &&
        Math.abs(next.x - frame.x) < 0.6 &&
        Math.abs(next.y - frame.y) < 0.6
      if (!settled) raf = requestAnimationFrame(step)
      else {
        camRef.current = frame
        viewHold.current = `${frame.x} ${frame.y} ${frame.w} ${frame.h}`
        svg.setAttribute("viewBox", viewHold.current)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [frame, reduced])

  useEffect(() => {
    if (reduced) return
    const root = glowRef.current
    if (!root) return
    const halos = root.querySelectorAll<SVGCircleElement>("[data-halo]")
    const cores = root.querySelectorAll<SVGCircleElement>("[data-core]")
    const hots = root.querySelectorAll<SVGCircleElement>("[data-hot]")
    const tails = root.querySelectorAll<SVGCircleElement>("[data-tail]")
    const live = packets.map((p) => ({ ...p }))
    let raf = 0
    let last = performance.now()

    const paint = (i: number) => {
      const p = live[i]
      const edge = edges[p.edge]
      if (!edge) return
      const pos = place(edges, p)
      const u = p.dir < 0 ? 1 - p.t : p.t
      const tail = pointOn(edge, Math.min(1, Math.max(0, u - 0.045)))
      const c = packetInk(edge, mode)
      const gone = vanishes(edge, mode, u) ? "0" : null
      halos[i]?.setAttribute("cx", String(pos.x))
      halos[i]?.setAttribute("cy", String(pos.y))
      halos[i]?.setAttribute("fill", c)
      if (gone) halos[i]?.setAttribute("opacity", gone)
      else halos[i]?.setAttribute("opacity", "0.32")
      cores[i]?.setAttribute("cx", String(pos.x))
      cores[i]?.setAttribute("cy", String(pos.y))
      cores[i]?.setAttribute("fill", c)
      if (gone) cores[i]?.setAttribute("opacity", gone)
      else cores[i]?.removeAttribute("opacity")
      hots[i]?.setAttribute("cx", String(pos.x))
      hots[i]?.setAttribute("cy", String(pos.y))
      if (gone) hots[i]?.setAttribute("opacity", gone)
      else hots[i]?.setAttribute("opacity", "0.95")
      tails[i]?.setAttribute("cx", String(tail.x))
      tails[i]?.setAttribute("cy", String(tail.y))
      tails[i]?.setAttribute("fill", c)
      if (gone) tails[i]?.setAttribute("opacity", gone)
      else tails[i]?.setAttribute("opacity", "0.45")
    }

    for (let i = 0; i < live.length; i++) paint(i)

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      for (let i = 0; i < live.length; i++) {
        const p = live[i]
        p.t += p.speed * dt
        if (p.t >= 1) {
          const next = spawn(bag, edges)
          const nextEdge = edges[next.edge]
          p.edge = next.edge
          p.t = 0
          p.dir = nextEdge && mode !== "fabric" && mode !== "crowd" ? storyDir(nextEdge, mode) : next.dir
          p.speed = nextEdge && mode !== "fabric" && mode !== "crowd" ? storyPace(nextEdge, mode) : next.speed
        }
        paint(i)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, packets, edges, bag, mode])

  const host = edges.filter((e) => e.kind === "host")
  const traffic = edges.filter((e) => e.kind !== "host")

  return (
    <svg
      ref={svgRef}
      className="stage-graph"
      viewBox={viewHold.current}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Companies and systems that participate in one autonomous flight"
    >
      <defs>
        <radialGradient id="ai-gemini-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.somaNerve} stopOpacity="0.2" />
          <stop offset="68%" stopColor={color.somaNerve} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ai-enterprise-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.focus} stopOpacity="0.1" />
          <stop offset="70%" stopColor={color.focus} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g opacity={mode === "fabric" ? 1 : 0.15}>
        <circle cx={500} cy={200} r={150} fill="url(#ai-gemini-glow)" />
        <circle cx={1280} cy={470} r={420} fill="url(#ai-enterprise-glow)" />
      </g>

      {clusters.map((c) => {
        const wide = WIDE_STORY.has(mode) || mode === "fanout"
        const ring = ringFor(c.nodeIds, wide ? 52 : 40, wide ? 64 : 36)
        const dim = !WIDE_STORY.has(mode) && mode !== "systems"
        const labelY = ring.cy - ring.ry + (wide ? 34 : mode === "systems" ? 20 : 72)
        return (
          <g key={c.id}>
            <ellipse
              cx={ring.cx}
              cy={ring.cy}
              rx={ring.rx}
              ry={ring.ry}
              fill="none"
              stroke={color.ring}
              strokeWidth={1}
              strokeDasharray={graph.ringDash}
              opacity={dim ? 0.28 : 0.72}
            />
            <text
              x={ring.cx}
              y={labelY}
              textAnchor="middle"
              fill={color.typeMuted}
              fontFamily={type.family}
              fontSize={wide ? 28 : 12}
              letterSpacing="0.14em"
              opacity={dim ? 0.85 : 1}
            >
              {c.label.toUpperCase()}
            </text>
          </g>
        )
      })}

      {host.map((e, i) => {
        const on = !focus || bothEnds(e, focus)
        return (
          <path
            key={`h-${i}`}
            d={edgePath(e)}
            fill="none"
            stroke={FLOW_COLOR.host}
            strokeWidth={0.8}
            strokeLinecap="round"
            opacity={mode === "fabric" ? 0.35 : on ? 0.2 : 0.04}
          />
        )
      })}

      {traffic.map((e, i) => {
        const look = edgeStyle(e, mode, focus)
        return (
          <g key={`t-${i}`}>
            <path
              d={edgePath(e)}
              fill="none"
              stroke={look.stroke}
              strokeWidth={3.4}
              strokeLinecap="round"
              opacity={look.glow}
            />
            <path
              d={edgePath(e)}
              fill="none"
              stroke={look.stroke}
              strokeWidth={look.width}
              strokeLinecap="round"
              strokeDasharray={look.dash}
              opacity={look.opacity}
            />
          </g>
        )
      })}

      {nodes.map((n) => {
        const look = nodeStroke(n, mode, ink(n))
        const dim = focus && !focus.has(n.id) ? 0.08 : 1
        return (
          <g key={n.id} opacity={dim} transform={`translate(${n.x - SIZE / 2} ${n.y - SIZE / 2})`}>
            {n.gemini && (
              <circle cx={SIZE / 2} cy={SIZE / 2} r={16} fill={color.somaNerve} opacity={0.18} />
            )}
            <rect
              width={SIZE}
              height={SIZE}
              rx={graph.nodeRadius}
              fill={fill(n)}
              stroke={look}
              strokeWidth={n.gemini ? 1.6 : 1.15}
            />
            <g style={{ color: look }}>
              <KindMark kind={n.kind} />
            </g>
            {n.named && n.tier === "router" && (
              <text
                x={-8}
                y={SIZE / 2 + 3}
                textAnchor="end"
                fill={color.type}
                fontFamily={type.family}
                fontSize={11}
              >
                {n.label}
              </text>
            )}
            {n.named && n.tier !== "router" && !(quietBrands && (n.gemini || BRANDS.has(n.id))) && (
              <text
                x={SIZE / 2}
                y={SIZE + 13}
                textAnchor="middle"
                fill={n.gemini ? color.somaNerve : color.typeMuted}
                fontFamily={type.family}
                fontSize={10}
              >
                {n.label}
              </text>
            )}
          </g>
        )
      })}

      {mode === "fabric" && !quietBrands &&
        DESIGN_MARKS.map((mark) => {
          const edge = AI_EDGES.find(
            (e) => (e.a === mark.a && e.b === mark.b) || (e.a === mark.b && e.b === mark.a),
          )
          if (!edge) return null
          const at = pointOn(edge, 0.5)
          return (
            <text
              key={mark.word}
              x={at.x}
              y={at.y - 16}
              textAnchor="middle"
              fill={mark.fill}
              fontFamily={type.family}
              fontSize={22}
              letterSpacing="0.16em"
            >
              {mark.word}
            </text>
          )
        })}

      <g ref={glowRef}>
        {packets.map((p, i) => {
          const edge = edges[p.edge]
          const pos = place(edges, p)
          const c = edge ? packetInk(edge, mode) : FLOW_COLOR.infer
          const u = p.dir < 0 ? 1 - p.t : p.t
          const tail = edge ? pointOn(edge, Math.min(1, Math.max(0, u - 0.045))) : pos
          return (
            <g key={i}>
              <circle data-tail cx={tail.x} cy={tail.y} r={1.7} fill={c} opacity={0.45} />
              <circle data-halo cx={pos.x} cy={pos.y} r={8} fill={c} opacity={0.32} />
              <circle data-core cx={pos.x} cy={pos.y} r={2.5} fill={c} />
              <circle data-hot cx={pos.x} cy={pos.y} r={1.1} fill={color.type} opacity={0.95} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
