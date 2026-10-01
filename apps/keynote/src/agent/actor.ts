/**
 * Scripted agent traveler — deterministic, no live LLM.
 * Act III: arrives, recites textbook intelligence, fails 10:37, restarts the GPU.
 * Act V: traces the real path and acts on the inspect hop.
 */

import { GPU_NODE_ID, INSPECT_NODE_ID } from "../graph/meridian";

export type AgentIntent = "idle" | "arrive" | "recite" | "ask" | "act" | "grounded";

export interface AgentScript {
  intent: AgentIntent;
  path: string[];
  line: string | null;
}

export const AGENT_SCRIPTS: Record<AgentIntent, AgentScript> = {
  idle: { intent: "idle", path: [], line: null },
  arrive: {
    intent: "arrive",
    path: ["site-east", "sdwan", "region", "k8s"],
    line: "operator",
  },
  recite: {
    intent: "recite",
    path: ["sdwan", "k8s", "region"],
    line: "BGP  ·  Kubernetes  ·  VPC",
  },
  ask: {
    intent: "ask",
    path: ["k8s"],
    line: "network.path timed out",
  },
  act: {
    intent: "act",
    path: ["k8s", "rdma", GPU_NODE_ID],
    line: "restart gpu-0",
  },
  grounded: {
    intent: "grounded",
    path: ["users", "lan", "sdwan", "security", "region", "k8s", INSPECT_NODE_ID],
    line: "restore path  ·  MCP returns",
  },
};

export function scriptFor(intent: AgentIntent): AgentScript {
  return AGENT_SCRIPTS[intent];
}

export const AGENT_IDLE: AgentIntent = "idle";
