import type { Cluster, GraphNode, FabricEdge } from "./types"

/**
 * The logistics enterprise — the show's second half, and the teaching vehicle
 * for everything the autonomy movement asks for.
 *
 * Deliberately generic: a global supply-chain operator five to fifteen years
 * out. No branding, no identifiable hubs, no city names beyond the two
 * endpoints of the one package we follow. The audience may well have just
 * watched a real logistics company present; this has to feel immediately
 * relevant without reading as a reference to, or a critique of, any company.
 *
 * Laid out left→right (Asia-Pacific → global hub → Americas) on purpose: it
 * reuses the same L→R ground axis the prelude's earth band runs on
 * (mountains → river → soil → ocean, see graph/soma.ts), so the planetary
 * enterprise lands in geography the audience has already been taught to read.
 *
 * Rendered by the same GraphView as Meridian — era-independent, gated only by
 * `entPhase` — so this reads as one fabric acquiring new kinds of nodes, not a
 * separate diagram. Bands, bottom to top:
 *
 *     ent-agents    y≈150   domain intelligences            (phase 8)
 *     ent-air       y≈300   aircraft + gateways             (phase 2)
 *     ent-asia      y≈560   origin: shipper → sort → ramp   (phase 1–2)
 *     ent-hub       y≈620   automated sort + robotics       (phase 2)
 *     ent-americas  y≈620   ramp → linehaul → doorstep      (phase 2)
 *     ent-ops       y≈820   humans, policy, planning        (phase 1, 5)
 *     ent-it        y≈820   applications, data, telemetry   (phase 7)
 *
 * Reveal is cumulative by `entPhase`:
 *   1 scale (humans + a skeleton of the world) · 2 every node and its role ·
 *   3 the shared model (policy/commitment semantics, no new nodes) ·
 *   4 one package in flight · 5 autonomy + humans moving up the stack ·
 *   6 disruption and reroute · 7 the IT substrate · 8 domain intelligences ·
 *   9 the whole autonomous enterprise.
 */

/** Order-independent edge identity, so lookups work from either endpoint. */
export function edgeKey(a: string, b: string) {
  return [a, b].sort().join("→")
}

const key = edgeKey

export const ENT_NODES: GraphNode[] = [
  // ── Origin: Asia-Pacific ──────────────────────────────────────────────
  {
    id: "ent-shipper",
    label: "Shipper",
    kind: "user",
    cluster: "ent-asia",
    x: 96,
    y: 612,
    era: 9,
    entPhase: 1,
  },
  {
    id: "ent-pickup",
    label: "Pickup",
    kind: "truck",
    cluster: "ent-asia",
    x: 180,
    y: 686,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-origin-local",
    label: "Local facility",
    kind: "warehouse",
    cluster: "ent-asia",
    x: 268,
    y: 622,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-origin-sort",
    label: "Origin sort",
    kind: "hub",
    cluster: "ent-asia",
    x: 262,
    y: 520,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-origin-ramp",
    label: "Origin ramp",
    kind: "aircraft",
    cluster: "ent-asia",
    x: 360,
    y: 452,
    era: 9,
    entPhase: 2,
  },

  // ── Air network ───────────────────────────────────────────────────────
  {
    id: "ent-flight-long",
    label: "Long-haul freighter",
    kind: "aircraft",
    cluster: "ent-air",
    x: 548,
    y: 306,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-gateway",
    label: "Pacific gateway",
    kind: "hub",
    cluster: "ent-air",
    x: 740,
    y: 248,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-flight-feeder",
    label: "Feeder freighter",
    kind: "aircraft",
    cluster: "ent-air",
    x: 940,
    y: 308,
    era: 9,
    entPhase: 2,
  },

  // ── Global hub ────────────────────────────────────────────────────────
  {
    id: "ent-hub-ramp",
    label: "Hub ramp",
    kind: "aircraft",
    cluster: "ent-hub",
    x: 700,
    y: 500,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-hub-sort",
    label: "Automated sort",
    kind: "hub",
    cluster: "ent-hub",
    x: 790,
    y: 586,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-conveyor",
    label: "Conveyor",
    kind: "robot",
    cluster: "ent-hub",
    x: 700,
    y: 646,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-hub-robots",
    label: "Sort robotics",
    kind: "robot",
    cluster: "ent-hub",
    x: 876,
    y: 646,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-hub-crew",
    label: "Ramp crew",
    kind: "user",
    cluster: "ent-hub",
    x: 806,
    y: 466,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-hub-edge",
    label: "Edge systems",
    kind: "sensor",
    cluster: "ent-hub",
    x: 900,
    y: 552,
    era: 9,
    entPhase: 2,
  },

  // ── Destination: Americas ─────────────────────────────────────────────
  {
    id: "ent-dest-ramp",
    label: "Destination ramp",
    kind: "aircraft",
    cluster: "ent-americas",
    x: 1108,
    y: 452,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-dest-sort",
    label: "Regional sort",
    kind: "hub",
    cluster: "ent-americas",
    x: 1196,
    y: 540,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-linehaul",
    label: "Autonomous linehaul",
    kind: "truck",
    cluster: "ent-americas",
    x: 1118,
    y: 622,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-dest-local",
    label: "Local station",
    kind: "warehouse",
    cluster: "ent-americas",
    x: 1282,
    y: 630,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-van",
    label: "Delivery vehicle",
    kind: "truck",
    cluster: "ent-americas",
    x: 1376,
    y: 700,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-courier",
    label: "Courier",
    kind: "user",
    cluster: "ent-americas",
    x: 1300,
    y: 726,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-recipient",
    label: "Recipient",
    kind: "user",
    cluster: "ent-americas",
    x: 1486,
    y: 646,
    era: 9,
    entPhase: 1,
  },

  // ── Operations: the humans and the shared model ───────────────────────
  {
    id: "ent-ops",
    label: "Operations",
    kind: "user",
    cluster: "ent-ops",
    x: 352,
    y: 818,
    era: 9,
    entPhase: 1,
  },
  {
    id: "ent-policy",
    label: "Policy & safety",
    kind: "identity",
    cluster: "ent-ops",
    x: 206,
    y: 806,
    era: 9,
    entPhase: 3,
  },
  {
    id: "ent-planning",
    label: "Network planning",
    kind: "app",
    cluster: "ent-ops",
    x: 486,
    y: 844,
    era: 9,
    entPhase: 3,
  },
  {
    id: "ent-commitments",
    label: "Service commitments",
    kind: "app",
    cluster: "ent-ops",
    x: 620,
    y: 812,
    era: 9,
    entPhase: 3,
  },

  // ── The IT substrate it all actually runs on ──────────────────────────
  {
    id: "ent-apps",
    label: "Applications",
    kind: "app",
    cluster: "ent-it",
    x: 912,
    y: 820,
    era: 9,
    entPhase: 7,
  },
  {
    id: "ent-data",
    label: "Operational data",
    kind: "storage",
    cluster: "ent-it",
    x: 1042,
    y: 852,
    era: 9,
    entPhase: 7,
  },
  {
    id: "ent-fabric",
    label: "Network fabric",
    kind: "network",
    cluster: "ent-it",
    x: 1172,
    y: 820,
    era: 9,
    entPhase: 7,
  },
  {
    id: "ent-telemetry",
    label: "Telemetry",
    kind: "sensor",
    cluster: "ent-it",
    x: 1302,
    y: 852,
    era: 9,
    entPhase: 7,
  },
  {
    id: "ent-model",
    label: "Trained models",
    kind: "model",
    cluster: "ent-it",
    x: 1424,
    y: 816,
    era: 9,
    entPhase: 7,
  },

  // ── Domain intelligences ──────────────────────────────────────────────
  {
    id: "ent-agent-air",
    label: "Air operations",
    kind: "agent",
    cluster: "ent-agents",
    x: 356,
    y: 150,
    era: 9,
    entPhase: 8,
  },
  {
    id: "ent-agent-ground",
    label: "Ground transport",
    kind: "agent",
    cluster: "ent-agents",
    x: 516,
    y: 118,
    era: 9,
    entPhase: 8,
  },
  {
    id: "ent-agent-hub",
    label: "Hub & warehouse",
    kind: "agent",
    cluster: "ent-agents",
    x: 676,
    y: 144,
    era: 9,
    entPhase: 8,
  },
  {
    id: "ent-agent-plan",
    label: "Planning",
    kind: "agent",
    cluster: "ent-agents",
    x: 836,
    y: 112,
    era: 9,
    entPhase: 8,
  },
  {
    id: "ent-agent-customer",
    label: "Customer",
    kind: "agent",
    cluster: "ent-agents",
    x: 996,
    y: 144,
    era: 9,
    entPhase: 8,
  },
  {
    id: "ent-agent-net",
    label: "Network & IT",
    kind: "agent",
    cluster: "ent-agents",
    x: 1156,
    y: 118,
    era: 9,
    entPhase: 8,
  },
  {
    id: "ent-agent-sec",
    label: "Security",
    kind: "agent",
    cluster: "ent-agents",
    x: 1316,
    y: 150,
    era: 9,
    entPhase: 8,
  },
  {
    id: "ent-human-loop",
    label: "Human operators",
    kind: "user",
    cluster: "ent-agents",
    x: 1466,
    y: 186,
    era: 9,
    entPhase: 8,
  },
]

export const ENT_CLUSTERS: Cluster[] = [
  {
    id: "ent-asia",
    label: "ASIA–PACIFIC",
    cx: 222,
    cy: 578,
    rx: 212,
    ry: 148,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-air",
    label: "AIR NETWORK",
    cx: 744,
    cy: 282,
    rx: 300,
    ry: 104,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-hub",
    label: "GLOBAL HUB",
    cx: 792,
    cy: 562,
    rx: 182,
    ry: 136,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-americas",
    label: "AMERICAS",
    cx: 1292,
    cy: 584,
    rx: 236,
    ry: 152,
    era: 9,
    entPhase: 2,
  },
  {
    id: "ent-ops",
    label: "OPERATIONS",
    cx: 412,
    cy: 826,
    rx: 268,
    ry: 62,
    era: 9,
    entPhase: 3,
  },
  {
    id: "ent-it",
    label: "APPLICATIONS · DATA · INFRASTRUCTURE",
    cx: 1166,
    cy: 836,
    rx: 300,
    ry: 62,
    era: 9,
    entPhase: 7,
  },
  {
    id: "ent-agents",
    label: "DOMAIN INTELLIGENCE",
    cx: 898,
    cy: 148,
    rx: 620,
    ry: 92,
    era: 9,
    entPhase: 8,
  },
]

/**
 * Every edge carries `entPhase` as its reveal threshold. `relationType` is
 * only used by the bounded traversal (vendor/metaism/relationTraverse) that
 * computes blast radius for the disruption beat, so physical movement is
 * `path_to` and control/knowledge relationships are `depends_on`.
 */
export const ENT_EDGES: FabricEdge[] = [
  // Origin
  {
    source: "ent-shipper",
    target: "ent-pickup",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-pickup",
    target: "ent-origin-local",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-origin-local",
    target: "ent-origin-sort",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-origin-sort",
    target: "ent-origin-ramp",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },

  // Air
  {
    source: "ent-origin-ramp",
    target: "ent-flight-long",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-flight-long",
    target: "ent-gateway",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-gateway",
    target: "ent-flight-feeder",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-flight-feeder",
    target: "ent-hub-ramp",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },

  // Hub
  {
    source: "ent-hub-ramp",
    target: "ent-hub-sort",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-hub-ramp",
    target: "ent-hub-crew",
    relationType: "related_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-hub-sort",
    target: "ent-conveyor",
    relationType: "part_of",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-hub-sort",
    target: "ent-hub-robots",
    relationType: "part_of",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-hub-sort",
    target: "ent-hub-edge",
    relationType: "depends_on",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-hub-sort",
    target: "ent-dest-ramp",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },

  // Destination
  {
    source: "ent-dest-ramp",
    target: "ent-dest-sort",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-dest-sort",
    target: "ent-linehaul",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-linehaul",
    target: "ent-dest-local",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-dest-local",
    target: "ent-van",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-dest-local",
    target: "ent-courier",
    relationType: "related_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-van",
    target: "ent-recipient",
    relationType: "path_to",
    era: 9,
    entPhase: 2,
  },
  {
    source: "ent-courier",
    target: "ent-van",
    relationType: "related_to",
    era: 9,
    entPhase: 2,
  },

  // The shared model: policy, planning and commitments reach the whole network
  {
    source: "ent-ops",
    target: "ent-planning",
    relationType: "related_to",
    era: 9,
    entPhase: 3,
  },
  {
    source: "ent-policy",
    target: "ent-ops",
    relationType: "related_to",
    era: 9,
    entPhase: 3,
  },
  {
    source: "ent-planning",
    target: "ent-commitments",
    relationType: "related_to",
    era: 9,
    entPhase: 3,
  },
  {
    source: "ent-planning",
    target: "ent-origin-sort",
    relationType: "depends_on",
    era: 9,
    entPhase: 3,
  },
  {
    source: "ent-commitments",
    target: "ent-hub-sort",
    relationType: "depends_on",
    era: 9,
    entPhase: 3,
  },
  {
    source: "ent-commitments",
    target: "ent-dest-sort",
    relationType: "depends_on",
    era: 9,
    entPhase: 3,
  },
  {
    source: "ent-policy",
    target: "ent-linehaul",
    relationType: "depends_on",
    era: 9,
    entPhase: 3,
  },
  {
    source: "ent-ops",
    target: "ent-gateway",
    relationType: "depends_on",
    era: 9,
    entPhase: 3,
  },

  // The IT substrate
  {
    source: "ent-apps",
    target: "ent-data",
    relationType: "depends_on",
    era: 9,
    entPhase: 7,
  },
  {
    source: "ent-data",
    target: "ent-fabric",
    relationType: "depends_on",
    era: 9,
    entPhase: 7,
  },
  {
    source: "ent-fabric",
    target: "ent-telemetry",
    relationType: "related_to",
    era: 9,
    entPhase: 7,
  },
  {
    source: "ent-telemetry",
    target: "ent-model",
    relationType: "related_to",
    era: 9,
    entPhase: 7,
    entTag: "telemetry",
  },
  {
    source: "ent-apps",
    target: "ent-commitments",
    relationType: "depends_on",
    era: 9,
    entPhase: 7,
  },
  {
    source: "ent-fabric",
    target: "ent-hub-edge",
    relationType: "depends_on",
    era: 9,
    entPhase: 7,
  },
  {
    source: "ent-data",
    target: "ent-dest-local",
    relationType: "depends_on",
    era: 9,
    entPhase: 7,
  },
  {
    source: "ent-model",
    target: "ent-agent-plan",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
  },

  // Agents own domains, coordinate with each other, escalate to humans
  {
    source: "ent-agent-air",
    target: "ent-origin-ramp",
    relationType: "depends_on",
    era: 9,
    entPhase: 8,
    entTag: "MCP · tool",
  },
  {
    source: "ent-agent-air",
    target: "ent-gateway",
    relationType: "depends_on",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-agent-ground",
    target: "ent-linehaul",
    relationType: "depends_on",
    era: 9,
    entPhase: 8,
    entTag: "MCP · tool",
  },
  {
    source: "ent-agent-hub",
    target: "ent-hub-sort",
    relationType: "depends_on",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-agent-plan",
    target: "ent-commitments",
    relationType: "depends_on",
    era: 9,
    entPhase: 8,
    entTag: "RAG · retrieve",
  },
  {
    source: "ent-agent-customer",
    target: "ent-recipient",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-agent-net",
    target: "ent-fabric",
    relationType: "depends_on",
    era: 9,
    entPhase: 8,
    entTag: "MCP · tool",
  },
  {
    source: "ent-agent-sec",
    target: "ent-policy",
    relationType: "depends_on",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-agent-air",
    target: "ent-agent-ground",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
    entTag: "A2A · task",
  },
  {
    source: "ent-agent-ground",
    target: "ent-agent-hub",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-agent-hub",
    target: "ent-agent-plan",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
    entTag: "A2A · task",
  },
  {
    source: "ent-agent-plan",
    target: "ent-agent-customer",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-agent-customer",
    target: "ent-agent-net",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-agent-net",
    target: "ent-agent-sec",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
    entTag: "A2A · task",
  },
  {
    source: "ent-agent-sec",
    target: "ent-human-loop",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
  },
  {
    source: "ent-human-loop",
    target: "ent-agent-plan",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
    entTag: "verify",
  },
  {
    source: "ent-ops",
    target: "ent-agent-air",
    relationType: "related_to",
    era: 9,
    entPhase: 8,
  },
]

export const ENT_NODE_IDS = new Set(ENT_NODES.map((n) => n.id))

export const ENT_EDGE_PHASE = new Map<string, number>(
  ENT_EDGES.map((e) => [key(e.source, e.target), e.entPhase ?? 1])
)

export const ENT_EDGE_TAG = new Map<string, NonNullable<FabricEdge["entTag"]>>(
  ENT_EDGES.filter((e) => e.entTag).map((e) => [
    key(e.source, e.target),
    e.entTag!,
  ])
)

export function entNodesFor(phase: number): GraphNode[] {
  if (phase <= 0) return []
  return ENT_NODES.filter((n) => (n.entPhase ?? 1) <= phase)
}

export function entEdgesFor(phase: number): FabricEdge[] {
  if (phase <= 0) return []
  return ENT_EDGES.filter((e) => (e.entPhase ?? 1) <= phase)
}

export function entClustersFor(phase: number): Cluster[] {
  if (phase <= 0) return []
  return ENT_CLUSTERS.filter((c) => (c.entPhase ?? 1) <= phase)
}

/**
 * The one package we follow, in order — the enterprise equivalent of the
 * basketball shot. Origin and destination are the only place names in the
 * movement; everything else stays generic. Rendered as a single travelling
 * glyph in GraphView so the audience sees one objective crossing the whole
 * system rather than a highlighted subgraph.
 */
export const ENT_PACKAGE_ROUTE = [
  "ent-shipper",
  "ent-pickup",
  "ent-origin-local",
  "ent-origin-sort",
  "ent-origin-ramp",
  "ent-flight-long",
  "ent-gateway",
  "ent-flight-feeder",
  "ent-hub-ramp",
  "ent-hub-sort",
  "ent-dest-ramp",
  "ent-dest-sort",
  "ent-linehaul",
  "ent-dest-local",
  "ent-van",
  "ent-recipient",
] as const

export const ENT_PACKAGE_KEYS = new Set(
  ENT_PACKAGE_ROUTE.slice(0, -1).map((id, i) => key(id, ENT_PACKAGE_ROUTE[i + 1]))
)

/**
 * The package's own identity, source, destination, priority and commitment —
 * the four properties that make it addressable. Shown as a small card, not
 * narrated as a packet-header analogy (the audience can see that themselves).
 */
export const ENT_PACKAGE_CARD = {
  /**
   * A plain grouped number, not a carrier format. The earlier draft used a
   * `1Z…` tracking id, which is distinctly UPS — §18 asks for a company the
   * room cannot identify, and a recognisable label format identifies it.
   */
  id: "4408 9931 2250",
  from: "Tokyo",
  to: "Boston",
  priority: "Priority",
  commit: "Tomorrow, 10:30",
} as const

/**
 * Weather closes the Pacific gateway. Chosen because it is universally
 * understood, nobody's fault, and genuinely a system-level problem rather
 * than a component failure — the point of the beat is the enterprise's
 * response, not the drama of the event.
 */
export const ENT_DISRUPT_NODE = "ent-gateway"

export const ENT_DISRUPT_NODES = new Set([
  "ent-gateway",
  "ent-flight-long",
  "ent-flight-feeder",
])

export const ENT_DISRUPT_KEYS = new Set([
  key("ent-origin-ramp", "ent-flight-long"),
  key("ent-flight-long", "ent-gateway"),
  key("ent-gateway", "ent-flight-feeder"),
  key("ent-flight-feeder", "ent-hub-ramp"),
])

/**
 * The alternate path the system finds: origin ramp direct to the hub ramp,
 * bypassing the closed gateway. Drawn as a new edge rather than a recolour so
 * the audience sees capacity move, not just a warning light.
 */
export const ENT_REROUTE: FabricEdge[] = [
  {
    source: "ent-origin-ramp",
    target: "ent-hub-ramp",
    relationType: "path_to",
    era: 9,
    entPhase: 6,
  },
  {
    source: "ent-origin-sort",
    target: "ent-dest-ramp",
    relationType: "path_to",
    era: 9,
    entPhase: 6,
  },
]

export const ENT_REROUTE_KEYS = new Set(
  ENT_REROUTE.map((e) => key(e.source, e.target))
)

/**
 * Live signals for the perception beat — the enterprise's senses, deliberately
 * mirroring `SENSE_LABELS` in graph/soma.ts (vision/hearing/balance feeding one
 * brain) so the rhyme with the body is structural, not stated.
 */
export const ENT_SIGNALS: Array<{
  nodeId: string
  text: string
  dx: number
  dy: number
}> = [
  { nodeId: "ent-flight-long", text: "ETA +38m", dx: -16, dy: -30 },
  { nodeId: "ent-gateway", text: "wx: closing", dx: 10, dy: -32 },
  { nodeId: "ent-hub-sort", text: "capacity 94%", dx: 26, dy: -26 },
  { nodeId: "ent-linehaul", text: "offline", dx: -72, dy: 34 },
  { nodeId: "ent-hub-robots", text: "12 of 14 up", dx: 28, dy: 30 },
  { nodeId: "ent-recipient", text: "commit at risk", dx: -34, dy: 34 },
  { nodeId: "ent-fabric", text: "path degraded", dx: -20, dy: -28 },
  { nodeId: "ent-apps", text: "p99 1.4s", dx: -18, dy: -28 },
]

/**
 * The dependency chain the relationships beat snaps into place: "a flight is
 * late" is a fact; this is what understanding it actually requires. Ordered
 * origin→consequence so the reveal reads as a sentence.
 */
export const ENT_DEPENDENCY_CHAIN = [
  "ent-flight-long",
  "ent-gateway",
  "ent-hub-sort",
  "ent-dest-ramp",
  "ent-linehaul",
  "ent-dest-local",
  "ent-recipient",
] as const

export const ENT_DEPENDENCY_SET = new Set<string>(ENT_DEPENDENCY_CHAIN)

export const ENT_DEPENDENCY_KEYS = new Set(
  ENT_DEPENDENCY_CHAIN.slice(0, -1).map((id, i) =>
    key(id, ENT_DEPENDENCY_CHAIN[i + 1])
  )
)

export const ENT_AGENT_IDS = new Set(
  ENT_NODES.filter((n) => n.kind === "agent").map((n) => n.id)
)

/** Humans stay visible at every phase — see the `ent-humans` beat. */
export const ENT_HUMAN_IDS = new Set(
  ENT_NODES.filter((n) => n.kind === "user").map((n) => n.id)
)

/** The machines that act on their own within policy. */
export const ENT_AUTONOMOUS_IDS = new Set([
  "ent-linehaul",
  "ent-van",
  "ent-conveyor",
  "ent-hub-robots",
  "ent-flight-long",
  "ent-flight-feeder",
  "ent-hub-sort",
])

export function nodeById(id: string): GraphNode | undefined {
  return ENT_NODES.find((n) => n.id === id)
}

export function resolveGraph(
  phase: number,
  reroute: boolean
): { nodes: GraphNode[]; edges: FabricEdge[] } {
  const edges = entEdgesFor(phase)
  return {
    nodes: entNodesFor(phase),
    edges: reroute ? [...edges, ...ENT_REROUTE] : edges,
  }
}

/**
 * The autonomy loop's orbit. Lives here rather than in its own module because
 * it is the enterprise's loop — the same five stations the body runs
 * (`COURT_LOOP_STATIONS` in graph/court.ts), at enterprise scale, which is
 * the callback the closing movement depends on.
 */
export const LOOP_STATIONS: Array<{
  id: "observe" | "understand" | "decide" | "act" | "verify"
  label: string
  x: number
  y: number
}> = [
  { id: "observe", label: "Observe", x: 290, y: 84 },
  { id: "understand", label: "Understand", x: 1180, y: 74 },
  { id: "decide", label: "Decide", x: 1510, y: 520 },
  { id: "act", label: "Act", x: 940, y: 852 },
  { id: "verify", label: "Verify", x: 170, y: 700 },
]
