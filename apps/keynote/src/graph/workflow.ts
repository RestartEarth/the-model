/**
 * Meridian Order-to-Cash copilot — the emotional incident.
 * Training job meridian-pretrain-7 remains the GPU subplot.
 */

export const WORKFLOW_NAME = "Order-to-Cash copilot";
export const WORKFLOW_ID = "otc-copilot";
export const A2A_TASK = "task-4f1";

export type WorkflowPhase = "none" | "ask" | "tokens" | "fanout" | "broken" | "restored";

export type PacketKind = "tokens" | "mcp" | "a2a" | "rag" | "broken";

export interface SessionPath {
  id: string;
  kind: PacketKind;
  label: string;
  hops: string[];
  /** Dies at the inspect hop when the shared path is broken. */
  diesAtInspect?: boolean;
  density: number;
}

/** Healthy chain a Dallas user triggers. */
export const SESSIONS: SessionPath[] = [
  {
    id: "ask",
    kind: "tokens",
    label: "ASK",
    hops: ["users", "lan", "sdwan"],
    density: 3,
  },
  {
    id: "tokens",
    kind: "tokens",
    label: "TOKENS",
    hops: ["users", "lan", "sdwan", "security", "region", "lb"],
    diesAtInspect: true,
    density: 7,
  },
  {
    id: "mcp-net",
    kind: "mcp",
    label: "network.path",
    hops: ["agent-ops", "mcp-gw", "region", "security", "sdwan"],
    diesAtInspect: true,
    density: 4,
  },
  {
    id: "mcp-app",
    kind: "mcp",
    label: "checkout.status",
    hops: ["agent-ops", "mcp-gw", "checkout"],
    density: 3,
  },
  {
    id: "mcp-id",
    kind: "mcp",
    label: "identity.who",
    hops: ["agent-ops", "mcp-gw", "identity"],
    density: 2,
  },
  {
    id: "mcp-cloud",
    kind: "mcp",
    label: "cloud.region",
    hops: ["agent-ops", "mcp-gw", "region"],
    density: 2,
  },
  {
    id: "a2a",
    kind: "a2a",
    label: A2A_TASK,
    hops: ["agent-ops", "agent-peer"],
    density: 3,
  },
  {
    id: "rag",
    kind: "rag",
    label: "RAG",
    hops: ["agent-ops", "rag", "vectors"],
    density: 3,
  },
];

export const STRIP_STEPS: Array<{
  id: string;
  label: string;
  dies?: boolean;
}> = [
  { id: "ask", label: "ASK" },
  { id: "tokens", label: "TOKENS", dies: true },
  { id: "mcp-net", label: "MCP network.path", dies: true },
  { id: "mcp-app", label: "MCP checkout" },
  { id: "a2a", label: `A2A ${A2A_TASK}` },
  { id: "rag", label: "RAG" },
];

export function sessionsFor(phase: WorkflowPhase): SessionPath[] {
  if (phase === "none") return [];
  if (phase === "ask") return SESSIONS.filter((s) => s.id === "ask");
  if (phase === "tokens") return SESSIONS.filter((s) => s.id === "ask" || s.id === "tokens");
  return SESSIONS;
}
