import type { NodeKind } from "./types"

/**
 * One flight's closed loop: the parties that have to participate when an agent
 * files and flies a turbulence-sensitive shipment. Same fabric language as the
 * logistics enterprise — dashed rings, rounded nodes, packets on the edges.
 *
 * Names are architectural roles, not claimed contracts. Left → right reads
 * upstream models and serving into weather, dispatch, the aircraft and the
 * package, then the carrier, the airline partner, and the ground.
 */

export type FlowKind =
  | "infer"
  | "train"
  | "retrieve"
  | "tune"
  | "private"
  | "govern"
  | "tool"
  | "host"
  | "wan"
  | "reach"

export const FLOW_ORDER: FlowKind[] = [
  "infer",
  "train",
  "retrieve",
  "tune",
  "private",
  "govern",
  "tool",
  "host",
  "wan",
  "reach",
]

export const FLOW_LABEL: Record<FlowKind, string> = {
  infer: "Inference",
  train: "Training",
  retrieve: "Retrieval",
  tune: "Fine-tune",
  private: "Own model",
  govern: "Policy",
  tool: "Tools",
  host: "Hosting",
  wan: "WAN",
  reach: "Internet",
}

/** Edge ink. Same meanings as the stage palette: gold trains, cyan calls, teal stays home. */
export const FLOW_COLOR: Record<FlowKind, string> = {
  infer: "#5BA8FF",
  train: "#E8B86A",
  retrieve: "#A78BFA",
  tune: "#7EE0B0",
  private: "#3ECF8E",
  govern: "#8B97A8",
  tool: "#F1F5FE",
  host: "#4C5A72",
  wan: "#9EC4DE",
  reach: "#E07A8A",
}

export type AiTier =
  | "substrate"
  | "lab"
  | "model"
  | "serving"
  | "router"
  | "own"
  | "corpus"
  | "agents"
  | "site"
  | "staff"
  | "customer"
  | "remote"
  | "internet"

export interface AiNode {
  id: string
  label: string
  tier: AiTier
  kind: NodeKind
  x: number
  y: number
  named: boolean
  /** 1 = the flight loop. 2 = reserved for a wider pullback if needed. */
  phase: 1 | 2
  open?: boolean
  gemini?: boolean
}

export interface AiEdge {
  a: string
  b: string
  kind: FlowKind
  both: boolean
  phase: 1 | 2
  x1: number
  y1: number
  x2: number
  y2: number
  cx: number
  cy: number
}

export interface AiCluster {
  id: string
  label: string
  nodeIds: string[]
  phase: 1 | 2
}

export interface AiFrame {
  x: number
  y: number
  w: number
  h: number
}

export const AI_WORLD = { width: 1600, height: 900 }

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0
  return h
}

function build() {
  const nodes: AiNode[] = []
  const byId = new Map<string, AiNode>()

  const addNode = (n: Omit<AiNode, "phase"> & { phase?: 1 | 2 }) => {
    const node: AiNode = { phase: 1, ...n }
    nodes.push(node)
    byId.set(node.id, node)
  }

  // ── Models the operation calls, and the ones it can run ─────────────
  const models: { id: string; label: string; y: number; open?: boolean; gemini?: boolean }[] = [
    { id: "gemini", label: "Gemini", y: 160, gemini: true },
    { id: "flash", label: "Flash", y: 248, gemini: true },
    { id: "llama-s", label: "Llama small", y: 336, open: true },
    { id: "gemma", label: "Gemma", y: 424, open: true },
    { id: "g-embed", label: "G embed", y: 512 },
  ]
  for (const m of models) {
    addNode({
      id: m.id,
      label: m.label,
      tier: "model",
      kind: "model",
      x: 140,
      y: m.y,
      named: true,
      open: m.open,
      gemini: m.gemini,
    })
  }

  // ── Serving plane between models and the flight ─────────────────────
  const serving: { id: string; label: string; kind: NodeKind; tier: AiTier; y: number }[] = [
    { id: "infer", label: "Inference", kind: "network", tier: "serving", y: 140 },
    { id: "tools", label: "Tools", kind: "app", tier: "serving", y: 230 },
    { id: "embed", label: "Index", kind: "storage", tier: "serving", y: 320 },
    { id: "link", label: "Private link", kind: "network", tier: "serving", y: 410 },
    { id: "safety", label: "Safety", kind: "security", tier: "serving", y: 500 },
    { id: "cache", label: "Cache", kind: "storage", tier: "serving", y: 590 },
  ]
  for (const s of serving) {
    addNode({ ...s, x: 320, named: true })
  }

  // ── Weather systems the route cannot own ────────────────────────────
  const weather: { id: string; label: string; kind: NodeKind; tier: AiTier; x: number; y: number }[] = [
    { id: "wx:jet", label: "Jet stream", kind: "model", tier: "model", x: 520, y: 150 },
    { id: "wx:turb", label: "Turbulence", kind: "sensor", tier: "model", x: 620, y: 150 },
    { id: "wx:rides", label: "Ride reports", kind: "sensor", tier: "staff", x: 520, y: 250 },
    { id: "wx:forecast", label: "Forecast feed", kind: "network", tier: "serving", x: 620, y: 250 },
    { id: "wx:met", label: "Met office", kind: "cloud", tier: "lab", x: 570, y: 350 },
  ]
  for (const w of weather) {
    addNode({ ...w, named: true })
  }

  // ── Dispatch / routing — the agent files here ───────────────────────
  const route: { id: string; label: string; kind: NodeKind; tier: AiTier; x: number; y: number }[] = [
    { id: "wx:route", label: "Dispatch", kind: "agent", tier: "agents", x: 820, y: 180 },
    { id: "wx:load", label: "Load plan", kind: "hub", tier: "site", x: 740, y: 280 },
    { id: "wx:slot", label: "Slot", kind: "identity", tier: "serving", x: 900, y: 280 },
    { id: "wx:ride", label: "Ride limit", kind: "storage", tier: "corpus", x: 740, y: 380 },
    { id: "wx:called", label: "Called models", kind: "model", tier: "model", x: 900, y: 380 },
    { id: "wx:own", label: "House model", kind: "model", tier: "own", x: 820, y: 480 },
  ]
  for (const r of route) {
    addNode({ ...r, named: true })
  }

  // ── The aircraft and what it senses ─────────────────────────────────
  const aircraft: { id: string; label: string; kind: NodeKind; tier: AiTier; x: number; y: number }[] = [
    { id: "wx:aircraft", label: "Aircraft", kind: "aircraft", tier: "site", x: 1100, y: 160 },
    { id: "wx:sensors", label: "Air sensors", kind: "sensor", tier: "site", x: 1020, y: 260 },
    { id: "wx:accel", label: "Acceleration", kind: "sensor", tier: "staff", x: 1180, y: 260 },
    { id: "wx:avionics", label: "Avionics", kind: "device", tier: "serving", x: 1020, y: 360 },
    { id: "wx:link-air", label: "Air link", kind: "network", tier: "serving", x: 1180, y: 360 },
  ]
  for (const a of aircraft) {
    addNode({ ...a, named: true })
  }

  // ── The package and who is watching it ──────────────────────────────
  const pkg: { id: string; label: string; kind: NodeKind; tier: AiTier; x: number; y: number }[] = [
    { id: "wx:package", label: "Package", kind: "warehouse", tier: "corpus", x: 1100, y: 500 },
    { id: "wx:monitor", label: "Cargo monitor", kind: "sensor", tier: "site", x: 1020, y: 590 },
    { id: "wx:promise", label: "Promise", kind: "identity", tier: "corpus", x: 1180, y: 590 },
    { id: "wx:shipper", label: "Shipper wait", kind: "user", tier: "customer", x: 1100, y: 680 },
  ]
  for (const p of pkg) {
    addNode({ ...p, named: true })
  }

  // ── Carrier and airline — same company the show has already named ───
  const ops: { id: string; label: string; kind: NodeKind; tier: AiTier; x: number; y: number }[] = [
    { id: "carrier:router", label: "Carrier", kind: "hub", tier: "router", x: 1380, y: 160 },
    { id: "carrier:agents", label: "Agents", kind: "agent", tier: "agents", x: 1460, y: 160 },
    { id: "carrier:own", label: "Own model", kind: "model", tier: "own", x: 1380, y: 250 },
    { id: "carrier:corpus", label: "Ops corpus", kind: "storage", tier: "corpus", x: 1460, y: 250 },
    { id: "airline:router", label: "Airline", kind: "aircraft", tier: "router", x: 1420, y: 360 },
  ]
  for (const o of ops) {
    addNode({ ...o, named: true })
  }

  // ── Ground: hub, gate, people who still answer ──────────────────────
  const ground: { id: string; label: string; kind: NodeKind; tier: AiTier; x: number; y: number }[] = [
    { id: "site:sorthub", label: "Sort hub", kind: "hub", tier: "site", x: 1380, y: 500 },
    { id: "site:gate", label: "Gate", kind: "aircraft", tier: "site", x: 1460, y: 500 },
    { id: "site:ramp", label: "Ramp", kind: "warehouse", tier: "site", x: 1380, y: 590 },
    { id: "staff:dispatcher", label: "Dispatcher", kind: "user", tier: "staff", x: 1460, y: 590 },
    { id: "staff:planner", label: "Planner", kind: "user", tier: "staff", x: 1420, y: 680 },
  ]
  for (const g of ground) {
    addNode({ ...g, named: true })
  }

  const clusters: AiCluster[] = [
    { id: "models", label: "Models", phase: 1, nodeIds: models.map((m) => m.id) },
    { id: "serving", label: "Serving", phase: 1, nodeIds: serving.map((s) => s.id) },
    { id: "weather", label: "Weather", phase: 1, nodeIds: weather.map((w) => w.id) },
    { id: "dispatch", label: "Dispatch", phase: 1, nodeIds: route.map((r) => r.id) },
    { id: "aircraft", label: "Aircraft", phase: 1, nodeIds: aircraft.map((a) => a.id) },
    { id: "package", label: "Package", phase: 1, nodeIds: pkg.map((p) => p.id) },
    {
      id: "ops",
      label: "Ops",
      phase: 1,
      nodeIds: ops.map((o) => o.id),
    },
    {
      id: "ground",
      label: "Ground",
      phase: 1,
      nodeIds: ground.map((g) => g.id),
    },
  ]

  const raw: { a: string; b: string; kind: FlowKind; both: boolean }[] = []
  const seen = new Set<string>()
  const add = (a: string, b: string, kind: FlowKind, both = false) => {
    if (a === b || !byId.has(a) || !byId.has(b)) return
    const key = [a, b, kind].sort().join("|")
    if (seen.has(key)) return
    seen.add(key)
    raw.push({ a, b, kind, both })
  }

  // Models ↔ serving.
  for (const id of ["gemini", "flash", "llama-s", "gemma"]) add(id, "infer", "infer", true)
  add("g-embed", "embed", "retrieve", true)
  add("gemini", "cache", "infer")
  add("flash", "cache", "infer")
  add("infer", "tools", "tool", true)
  add("infer", "safety", "govern")
  add("safety", "link", "govern")
  add("link", "infer", "govern")
  add("embed", "infer", "retrieve")
  add("infer", "cache", "infer")

  // Weather mesh — north-south forecast traffic.
  add("wx:jet", "wx:turb", "retrieve", true)
  add("wx:jet", "wx:forecast", "retrieve", true)
  add("wx:turb", "wx:forecast", "infer", true)
  add("wx:rides", "wx:turb", "retrieve", true)
  add("wx:rides", "wx:forecast", "retrieve", true)
  add("wx:met", "wx:forecast", "host")
  add("wx:met", "wx:jet", "retrieve", true)
  add("wx:jet", "link", "govern", true)
  add("wx:turb", "link", "govern", true)
  add("wx:forecast", "gemini", "infer", true)
  add("wx:forecast", "flash", "infer", true)
  add("wx:forecast", "infer", "infer", true)

  // Dispatch files the route — east-west into weather, models, aircraft.
  add("wx:route", "wx:load", "tool", true)
  add("wx:route", "wx:slot", "govern", true)
  add("wx:route", "wx:ride", "private", true)
  add("wx:route", "wx:aircraft", "tool", true)
  add("wx:route", "wx:jet", "retrieve", true)
  add("wx:route", "wx:turb", "infer", true)
  add("wx:route", "wx:rides", "retrieve", true)
  add("wx:route", "wx:forecast", "retrieve", true)
  add("wx:route", "wx:called", "infer", true)
  add("wx:route", "wx:own", "private", true)
  add("wx:load", "wx:aircraft", "tool", true)
  add("wx:load", "wx:ride", "private", true)
  add("wx:slot", "wx:aircraft", "govern", true)
  add("wx:called", "gemini", "infer", true)
  add("wx:called", "flash", "infer", true)
  add("wx:called", "infer", "infer", true)
  add("wx:own", "llama-s", "tune")
  add("wx:own", "carrier:own", "private", true)
  add("wx:own", "wx:ride", "private", true)

  // Aircraft closed loop — sensors, avionics, air link.
  add("wx:aircraft", "wx:sensors", "tool", true)
  add("wx:aircraft", "wx:accel", "tool", true)
  add("wx:aircraft", "wx:avionics", "private", true)
  add("wx:aircraft", "wx:link-air", "wan", true)
  add("wx:sensors", "wx:accel", "retrieve", true)
  add("wx:sensors", "wx:rides", "retrieve", true)
  add("wx:accel", "wx:rides", "tool", true)
  add("wx:avionics", "wx:link-air", "wan", true)
  add("wx:link-air", "wx:route", "wan", true)
  add("wx:link-air", "airline:router", "wan", true)
  add("wx:rides", "wx:aircraft", "tool", true)

  // Package monitoring.
  add("wx:package", "wx:aircraft", "tool", true)
  add("wx:package", "wx:monitor", "tool", true)
  add("wx:package", "wx:promise", "private", true)
  add("wx:package", "wx:ride", "private", true)
  add("wx:monitor", "wx:accel", "retrieve", true)
  add("wx:monitor", "wx:route", "tool", true)
  add("wx:promise", "carrier:corpus", "private", true)
  add("wx:shipper", "wx:promise", "reach", true)
  add("wx:shipper", "carrier:router", "reach", true)

  // Carrier / airline / ground — the enterprise the audience already knows.
  add("wx:route", "carrier:agents", "tool", true)
  add("wx:route", "carrier:router", "tool", true)
  add("carrier:router", "carrier:agents", "tool", true)
  add("carrier:router", "carrier:own", "private", true)
  add("carrier:own", "carrier:corpus", "private", true)
  add("carrier:agents", "carrier:corpus", "retrieve", true)
  add("carrier:agents", "tools", "tool", true)
  add("carrier:router", "airline:router", "tool", true)
  add("wx:aircraft", "airline:router", "tool", true)
  add("airline:router", "site:gate", "wan", true)
  add("wx:load", "site:sorthub", "wan", true)
  add("wx:aircraft", "site:gate", "wan", true)
  add("site:sorthub", "site:gate", "wan", true)
  add("site:sorthub", "site:ramp", "wan", true)
  add("site:gate", "site:ramp", "wan", true)
  add("staff:dispatcher", "site:sorthub", "wan", true)
  add("staff:dispatcher", "carrier:agents", "tool", true)
  add("staff:planner", "carrier:router", "tool", true)
  add("staff:planner", "wx:route", "tool", true)
  add("carrier:router", "link", "govern", true)
  add("carrier:own", "infer", "private", true)

  const edges: AiEdge[] = raw.map((e) => {
    const na = byId.get(e.a)!
    const nb = byId.get(e.b)!
    const dx = nb.x - na.x
    const dy = nb.y - na.y
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len
    const mag = ((hash(e.a + e.b + e.kind) % 11) - 5) * Math.min(42, len * 0.09)
    const bend = len > 150 ? mag : 0
    const phase: 1 | 2 = na.phase === 2 || nb.phase === 2 ? 2 : 1
    return {
      ...e,
      phase,
      x1: na.x,
      y1: na.y,
      x2: nb.x,
      y2: nb.y,
      cx: (na.x + nb.x) / 2 + nx * bend,
      cy: (na.y + nb.y) / 2 + ny * bend,
    }
  })

  return { nodes, edges, clusters }
}

const BUILT = build()

export const AI_NODES = BUILT.nodes
export const AI_EDGES = BUILT.edges
export const AI_CLUSTERS = BUILT.clusters

/** Tight frame for the dispatch systems altitude. */
export const AI_FRAME_1: AiFrame = { x: 400, y: 40, w: 900, h: 506 }

function frameAround(list: AiNode[], pad: number): AiFrame {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const n of list) {
    minX = Math.min(minX, n.x - 78)
    maxX = Math.max(maxX, n.x + 78)
    minY = Math.min(minY, n.y - 36)
    maxY = Math.max(maxY, n.y + 28)
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

/** Wide pullback — every participant in the flight loop. */
export const AI_FRAME_2: AiFrame = frameAround(AI_NODES, 48)

export function pointOn(edge: AiEdge, t: number) {
  const u = 1 - t
  return {
    x: u * u * edge.x1 + 2 * u * t * edge.cx + t * t * edge.x2,
    y: u * u * edge.y1 + 2 * u * t * edge.cy + t * t * edge.y2,
  }
}

export function flowWeight(kind: FlowKind) {
  switch (kind) {
    case "infer":
      return 5
    case "private":
      return 4
    case "retrieve":
      return 4
    case "tool":
      return 3
    case "tune":
      return 2
    case "train":
      return 2
    case "govern":
      return 2
    case "host":
      return 1
    case "wan":
      return 5
    case "reach":
      return 5
  }
}
