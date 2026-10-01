/**
 * Payload evolution on the same edges.
 * Tokens still ride IP/TCP/HTTP/SSE. The economically meaningful unit
 * became the token; the network is still the clearing system.
 */

export type PayloadKind = "none" | "packets" | "flows" | "rpc" | "tokens" | "knowledge";

/** Campus → cloud bus. Glyphs change here so Act II can rhyme with Act I. */
export const CLEARING_EDGES: Array<[string, string]> = [
  ["users", "lan"],
  ["lan", "sdwan"],
  ["sdwan", "isp"],
  ["isp", "region"],
  ["sdwan", "security"],
  ["security", "region"],
  ["region", "lb"],
  ["lb", "k8s"],
  ["k8s", "checkout"],
];

export const FLOW_EDGES: Array<[string, string]> = [
  ["gpu-0", "gpu-1"],
  ["rdma", "gpu-0"],
  ["rdma", "gpu-1"],
  ["rdma", "k8s"],
];

export const RPC_EDGES: Array<[string, string]> = [
  ["lb", "k8s"],
  ["k8s", "checkout"],
  ["checkout", "db"],
  ["api-gw", "region"],
  ["rag", "api-gw"],
];

/** Edges that die when the inspect hop breaks the token stream. */
export const TOKEN_STALL_EDGES: Array<[string, string]> = [
  ["users", "lan"],
  ["lan", "sdwan"],
  ["sdwan", "security"],
  ["security", "region"],
  ["region", "lb"],
];

export function edgesFor(kind: PayloadKind): Array<[string, string]> {
  if (kind === "flows") return [...FLOW_EDGES, ...CLEARING_EDGES.slice(0, 4)];
  if (kind === "rpc") return [...RPC_EDGES, ...CLEARING_EDGES.slice(0, 3)];
  if (kind === "none") return [];
  return CLEARING_EDGES;
}

export function pairKey(a: string, b: string) {
  return [a, b].sort().join("→");
}

export const STALL_SET = new Set(TOKEN_STALL_EDGES.map(([a, b]) => pairKey(a, b)));
