import type { Cluster, Era, GraphNode, MeridianEdge, MeridianGraph } from "./types";

/**
 * Meridian — a compact, recognizable enterprise.
 * Layout rhymes with UNI: peripheral site clusters, denser core, GPU fabric
 * as the region a later incident will live in. Not a product inventory.
 */

const clusters: Cluster[] = [
  { id: "campus", label: "Campus", cx: 250, cy: 560, rx: 175, ry: 150, era: 2 },
  { id: "wan", label: "WAN", cx: 530, cy: 430, rx: 155, ry: 130, era: 3 },
  { id: "security", label: "Security", cx: 790, cy: 195, rx: 145, ry: 115, era: 7 },
  { id: "cloud", label: "Cloud", cx: 1000, cy: 400, rx: 195, ry: 165, era: 4 },
  { id: "apps", label: "Applications", cx: 1210, cy: 230, rx: 140, ry: 115, era: 8 },
  { id: "storage", label: "Storage", cx: 930, cy: 680, rx: 150, ry: 120, era: 6 },
  { id: "gpu", label: "GPU fabric", cx: 1285, cy: 640, rx: 170, ry: 145, era: 9 },
];

const nodes: GraphNode[] = [
  {
    id: "mainframe",
    label: "Compute",
    kind: "compute",
    cluster: "cloud",
    x: 800,
    y: 450,
    era: 1,
  },
  { id: "users", label: "Users", kind: "user", cluster: "campus", x: 180, y: 515, era: 2 },
  { id: "devices", label: "Devices", kind: "device", cluster: "campus", x: 290, y: 545, era: 2 },
  { id: "lan", label: "LAN", kind: "network", cluster: "campus", x: 230, y: 630, era: 2 },
  { id: "sdwan", label: "SD-WAN", kind: "network", cluster: "wan", x: 480, y: 395, era: 3 },
  { id: "isp", label: "ISP", kind: "network", cluster: "wan", x: 575, y: 480, era: 3 },
  { id: "site-east", label: "East", kind: "network", cluster: "wan", x: 430, y: 175, era: 3 },
  { id: "site-west", label: "West", kind: "network", cluster: "campus", x: 140, y: 310, era: 3 },
  { id: "region", label: "Region", kind: "cloud", cluster: "cloud", x: 940, y: 365, era: 4 },
  { id: "lb", label: "Load balancer", kind: "network", cluster: "cloud", x: 1045, y: 330, era: 4 },
  { id: "k8s", label: "Kubernetes", kind: "cloud", cluster: "cloud", x: 1085, y: 455, era: 5 },
  { id: "overlay", label: "Overlay", kind: "network", cluster: "cloud", x: 915, y: 475, era: 5 },
  { id: "san", label: "SAN", kind: "storage", cluster: "storage", x: 930, y: 680, era: 6 },
  { id: "security", label: "Security", kind: "security", cluster: "security", x: 740, y: 185, era: 7 },
  { id: "identity", label: "Identity", kind: "identity", cluster: "security", x: 845, y: 230, era: 7 },
  { id: "checkout", label: "Checkout", kind: "app", cluster: "apps", x: 1165, y: 205, era: 8 },
  { id: "db", label: "Database", kind: "app", cluster: "apps", x: 1260, y: 265, era: 8 },
  { id: "gpu-0", label: "GPU", kind: "gpu", cluster: "gpu", x: 1240, y: 590, era: 9 },
  { id: "gpu-1", label: "GPU", kind: "gpu", cluster: "gpu", x: 1340, y: 640, era: 9 },
  { id: "rdma", label: "Fabric", kind: "network", cluster: "gpu", x: 1265, y: 715, era: 9 },
];

const edges: MeridianEdge[] = [
  { source: "mainframe", target: "lan", relationType: "path_to", era: 2 },
  { source: "lan", target: "users", relationType: "path_to", era: 2 },
  { source: "lan", target: "devices", relationType: "path_to", era: 2 },
  { source: "lan", target: "sdwan", relationType: "path_to", era: 3 },
  { source: "sdwan", target: "isp", relationType: "path_to", era: 3 },
  { source: "sdwan", target: "site-east", relationType: "path_to", era: 3 },
  { source: "lan", target: "site-west", relationType: "path_to", era: 3 },
  { source: "isp", target: "region", relationType: "path_to", era: 4 },
  { source: "mainframe", target: "region", relationType: "related_to", era: 4 },
  { source: "region", target: "lb", relationType: "path_to", era: 4 },
  { source: "region", target: "overlay", relationType: "part_of", era: 5 },
  { source: "overlay", target: "k8s", relationType: "path_to", era: 5 },
  { source: "lb", target: "k8s", relationType: "path_to", era: 5 },
  { source: "region", target: "san", relationType: "depends_on", era: 6 },
  { source: "k8s", target: "san", relationType: "depends_on", era: 6 },
  { source: "sdwan", target: "security", relationType: "path_to", era: 7 },
  { source: "security", target: "region", relationType: "path_to", era: 7 },
  { source: "security", target: "identity", relationType: "related_to", era: 7 },
  { source: "k8s", target: "checkout", relationType: "path_to", era: 8 },
  { source: "checkout", target: "db", relationType: "depends_on", era: 8 },
  { source: "db", target: "san", relationType: "depends_on", era: 8 },
  { source: "k8s", target: "rdma", relationType: "path_to", era: 9 },
  { source: "rdma", target: "gpu-0", relationType: "path_to", era: 9 },
  { source: "rdma", target: "gpu-1", relationType: "path_to", era: 9 },
  { source: "gpu-0", target: "gpu-1", relationType: "related_to", era: 9 },
  { source: "san", target: "rdma", relationType: "depends_on", era: 9 },
];

export const meridian: MeridianGraph = { nodes, edges, clusters };

export function nodeById(id: string): GraphNode | undefined {
  return (
    nodes.find((n) => n.id === id) ??
    INFERENCE_NODES.find((n) => n.id === id) ??
    PROTOCOL_NODES.find((n) => n.id === id) ??
    (id === INSPECT_NODE_ID ? INSPECT_NODE : undefined)
  );
}

export function visibleNodes(era: Era): GraphNode[] {
  if (era <= 0) return [];
  return nodes.filter((n) => n.era <= era);
}

export function visibleEdges(era: Era): MeridianEdge[] {
  if (era <= 0) return [];
  return edges.filter((e) => e.era <= era);
}

export function visibleClusters(era: Era): Cluster[] {
  if (era <= 0) return [];
  return clusters.filter((c) => c.era <= era);
}

export const GPU_NODE_ID = "gpu-0";
export const GPU_PEER_ID = "gpu-1";
export const SAN_NODE_ID = "san";
export const CHECKOUT_NODE_ID = "checkout";
export const INSPECT_NODE_ID = "inspect";
export const JCT_EDGE = { source: "rdma", target: "k8s" } as const;

export function edgeKey(a: string, b: string): string {
  return [a, b].sort().join("→");
}

/** Inference stack — Act II only. Not part of the Act I era reveal. */
export const INFERENCE_NODES: GraphNode[] = [
  { id: "model", label: "Model", kind: "gpu", cluster: "gpu", x: 1415, y: 545, era: 9 },
  { id: "vectors", label: "Vectors", kind: "storage", cluster: "storage", x: 1055, y: 765, era: 9 },
  { id: "rag", label: "RAG", kind: "app", cluster: "apps", x: 1348, y: 168, era: 9 },
  { id: "api-gw", label: "APIs", kind: "network", cluster: "cloud", x: 990, y: 268, era: 9 },
  { id: "edge-site", label: "Edge", kind: "network", cluster: "wan", x: 355, y: 215, era: 9 },
];

export const INFERENCE_EDGES: MeridianEdge[] = [
  { source: "gpu-0", target: "model", relationType: "depends_on", era: 9 },
  { source: "model", target: "vectors", relationType: "depends_on", era: 9 },
  { source: "vectors", target: "san", relationType: "part_of", era: 9 },
  { source: "model", target: "rag", relationType: "path_to", era: 9 },
  { source: "rag", target: "api-gw", relationType: "path_to", era: 9 },
  { source: "api-gw", target: "region", relationType: "path_to", era: 9 },
  { source: "api-gw", target: "edge-site", relationType: "path_to", era: 9 },
  { source: "edge-site", target: "site-east", relationType: "path_to", era: 9 },
];

/** Security hop inserted at 10:29 — sits on the GPU / cloud path. */
export const INSPECT_NODE: GraphNode = {
  id: INSPECT_NODE_ID,
  label: "Inspect 10:29",
  kind: "security",
  cluster: "security",
  x: 1172,
  y: 518,
  era: 9,
};

export const INSPECT_EDGES: MeridianEdge[] = [
  { source: "k8s", target: INSPECT_NODE_ID, relationType: "path_to", era: 9 },
  { source: INSPECT_NODE_ID, target: "rdma", relationType: "path_to", era: 9 },
];

export const INFERENCE_IDS = new Set(INFERENCE_NODES.map((n) => n.id));

/** Operator, peer, MCP gateway — Act II+ protocol plane. Not in the Act I reveal. */
export const PROTOCOL_NODES: GraphNode[] = [
  { id: "agent-ops", label: "Operator", kind: "agent", cluster: "apps", x: 1435, y: 318, era: 9 },
  { id: "agent-peer", label: "Peer agent", kind: "agent", cluster: "security", x: 620, y: 92, era: 9 },
  { id: "mcp-gw", label: "MCP gateway", kind: "network", cluster: "cloud", x: 990, y: 198, era: 9 },
];

export const PROTOCOL_IDS = new Set(PROTOCOL_NODES.map((n) => n.id));

export const MCP_HOPS: Array<{ source: string; target: string; label: string; dies?: boolean }> = [
  { source: "agent-ops", target: "mcp-gw", label: "MCP" },
  { source: "mcp-gw", target: "sdwan", label: "network.path", dies: true },
  { source: "mcp-gw", target: "region", label: "cloud.region" },
  { source: "mcp-gw", target: "security", label: "security.policy" },
  { source: "mcp-gw", target: "checkout", label: "checkout.status" },
  { source: "mcp-gw", target: "identity", label: "identity.who" },
];

export const A2A_HOPS: Array<{ source: string; target: string; label: string }> = [
  { source: "agent-ops", target: "agent-peer", label: "A2A · task-4f1" },
  { source: "agent-peer", target: "identity", label: "Agent Card" },
];

export const TRAINING_KEYS = new Set([
  edgeKey("gpu-0", "gpu-1"),
  edgeKey("rdma", "gpu-0"),
  edgeKey("rdma", "gpu-1"),
  edgeKey("rdma", "k8s"),
  edgeKey("san", "rdma"),
]);

/** User → data spine for Act IV. */
export const SPINE_IDS = [
  "users",
  "devices",
  "lan",
  "sdwan",
  "isp",
  "security",
  "region",
  "lb",
  "k8s",
  "checkout",
  "db",
  "san",
] as const;

export const SPINE_SET = new Set<string>(SPINE_IDS);

export const API_PORTS: Array<{ nodeId: string; label: string }> = [
  { nodeId: "overlay", label: "SDN" },
  { nodeId: "region", label: "IaC" },
  { nodeId: "sdwan", label: "Controller" },
  { nodeId: "k8s", label: "Orchestration" },
  { nodeId: "security", label: "Intent" },
];

export interface EdgeMetric {
  source: string;
  target: string;
  label: string;
  value: string;
  tone: "incident" | "warn" | "ok";
}

/** Metrics live on the edges — never as chart chrome. */
export const EDGE_METRICS: EdgeMetric[] = [
  { source: "rdma", target: "k8s", label: "JCT", value: "stalled", tone: "incident" },
  { source: "gpu-0", target: "gpu-1", label: "elephant", value: "polarized", tone: "incident" },
  { source: "rdma", target: "gpu-0", label: "RDMA", value: "congested", tone: "incident" },
  { source: "overlay", target: "k8s", label: "ECMP", value: "hash fail", tone: "incident" },
  { source: "region", target: "lb", label: "TTFT", value: "840ms", tone: "warn" },
  { source: "lb", target: "k8s", label: "tail p99", value: "1.4s", tone: "warn" },
  { source: "sdwan", target: "isp", label: "microburst", value: "12ms", tone: "warn" },
  { source: "k8s", target: "checkout", label: "checkout", value: "degraded", tone: "incident" },
  { source: "agent-ops", target: "mcp-gw", label: "MCP fan-out", value: "6 tools", tone: "warn" },
  { source: "agent-ops", target: "agent-peer", label: "A2A task", value: "pending", tone: "warn" },
];

export const PATH_BLAST_NODES = new Set([
  "rdma",
  "k8s",
  "overlay",
  INSPECT_NODE_ID,
  "region",
  "security",
  "lb",
  CHECKOUT_NODE_ID,
]);

export const PATH_BLAST_KEYS = new Set([
  edgeKey("gpu-0", "rdma"),
  edgeKey("gpu-1", "rdma"),
  edgeKey("gpu-0", "gpu-1"),
  edgeKey("rdma", "k8s"),
  edgeKey("rdma", INSPECT_NODE_ID),
  edgeKey("k8s", INSPECT_NODE_ID),
  edgeKey("k8s", "overlay"),
  edgeKey("region", "k8s"),
  edgeKey("region", "security"),
  edgeKey("region", "lb"),
  edgeKey("k8s", "checkout"),
]);

export const LIGHTNING_PATHS: string[][] = [
  ["gpu-0", "rdma", "k8s", "checkout", "db"],
  ["gpu-1", "rdma", "k8s", "api-gw"],
  ["model", "rag", "api-gw", "edge-site", "site-east"],
  ["users", "lan", "sdwan", "security", "region"],
  ["checkout", "k8s", "overlay", "region", "isp"],
  ["devices", "lan", "sdwan", "isp", "region", "lb"],
  ["gpu-0", "gpu-1", "rdma", "san"],
  ["identity", "security", "sdwan", "lan", "users"],
];

export const FACTS: Array<{ source: string; target: string; text: string; dx: number; dy: number }> = [
  { source: "lan", target: "users", text: "CPU 87%", dx: -70, dy: -48 },
  { source: "sdwan", target: "isp", text: "42ms", dx: 54, dy: -40 },
  { source: "region", target: "lb", text: "util 73%", dx: -20, dy: 46 },
  { source: "security", target: "region", text: "route changed", dx: -80, dy: -36 },
  { source: "checkout", target: "db", text: "txn failed", dx: 56, dy: -28 },
];

export const LOOP_STATIONS: Array<{
  id: "observe" | "model" | "understand" | "reason" | "act" | "verify";
  label: string;
  x: number;
  y: number;
}> = [
  { id: "observe", label: "Observe", x: 250, y: 90 },
  { id: "model", label: "Model", x: 800, y: 70 },
  { id: "understand", label: "Understand", x: 1480, y: 140 },
  { id: "reason", label: "Reason", x: 1500, y: 780 },
  { id: "act", label: "Act", x: 800, y: 860 },
  { id: "verify", label: "Verify", x: 160, y: 820 },
];

/** Cards live in the void. Hairlines reach the graph. */
export const COMMITMENT_ANCHORS: Array<{ id: string; nodeId: string; x: number; y: number }> = [
  { id: "rel", nodeId: "sdwan", x: 56, y: 64 },
  { id: "domains", nodeId: "region", x: 1288, y: 40 },
  { id: "input", nodeId: "k8s", x: 1288, y: 836 },
  { id: "gov", nodeId: "identity", x: 56, y: 390 },
  { id: "verify", nodeId: "lan", x: 56, y: 836 },
];

export function resolveGraph(
  era: Era,
  extras: { inference?: boolean; inspect?: boolean; protocols?: boolean }
): { nodes: GraphNode[]; edges: MeridianEdge[] } {
  const seen = new Set<string>();
  const nodes: GraphNode[] = [];
  for (const n of visibleNodes(era)) {
    nodes.push(n);
    seen.add(n.id);
  }
  if (extras.inference) {
    for (const n of INFERENCE_NODES) {
      if (!seen.has(n.id)) {
        nodes.push(n);
        seen.add(n.id);
      }
    }
  }
  if (extras.inspect && !seen.has(INSPECT_NODE_ID)) {
    nodes.push(INSPECT_NODE);
    seen.add(INSPECT_NODE_ID);
  }
  if (extras.protocols) {
    for (const n of PROTOCOL_NODES) {
      if (!seen.has(n.id)) {
        nodes.push(n);
        seen.add(n.id);
      }
    }
  }

  const edges = [...visibleEdges(era)];
  if (extras.inference) edges.push(...INFERENCE_EDGES);
  if (extras.inspect) edges.push(...INSPECT_EDGES);
  return { nodes, edges };
}
