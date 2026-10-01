import type {
  GraphEdge,
  RelationType,
} from "../vendor/metaism/relationTraverse"

export type NodeKind =
  | "compute"
  | "user"
  | "device"
  | "network"
  | "storage"
  | "security"
  | "identity"
  | "app"
  | "gpu"
  | "cloud"
  | "agent"
  /**
   * Physical kinds for the logistics enterprise (graph/enterprise.ts). Same
   * rounded-rect node as everything else — only the inner glyph differs — so
   * an aircraft reads as another node on the same fabric, which is the whole
   * argument of that movement.
   */
  | "aircraft"
  | "truck"
  | "hub"
  | "warehouse"
  | "robot"
  | "sensor"
  /** A trained model, as distinct from the operational model it acts upon. */
  | "model"

export type ClusterId =
  | "campus"
  | "wan"
  | "security"
  | "cloud"
  | "apps"
  | "storage"
  | "gpu"
  | "portsmouth"
  | "gcp-txn"
  | "onprem"
  | "nevada"
  /** Logistics enterprise bands — see graph/enterprise.ts. */
  | "ent-agents"
  | "ent-air"
  | "ent-asia"
  | "ent-hub"
  | "ent-americas"
  | "ent-ops"
  | "ent-it"

/** 0 = void, 1 = mainframe, … 9 = full GPU-era fabric. */
export type Era = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface GraphNode {
  id: string
  label: string
  kind: NodeKind
  cluster: ClusterId
  x: number
  y: number
  /** First era this node exists. */
  era: Era
  /** Life of the AI Transaction only — cumulative reveal stage (1–5), unrelated to `era`. */
  txnPhase?: number
  /** Logistics enterprise only — cumulative reveal stage (1–9), unrelated to `era`. */
  entPhase?: number
}

export interface Cluster {
  id: ClusterId
  label: string
  cx: number
  cy: number
  rx: number
  ry: number
  era: Era
  /** Life of the AI Transaction only — cumulative reveal stage (1–5), unrelated to `era`. */
  txnPhase?: number
  /** Logistics enterprise only — cumulative reveal stage (1–9), unrelated to `era`. */
  entPhase?: number
}

export interface FabricEdge extends GraphEdge {
  era: Era
  /** Life of the AI Transaction only — reveal stage AND the resolved/pending cutoff. */
  txnPhase?: number
  /** Logistics enterprise only — cumulative reveal stage (1–9), unrelated to `era`. */
  entPhase?: number
  /**
   * Enterprise edges only. Subtle technical detail for the agentic movement —
   * rendered as a small edge label, never explained by the presenter (the
   * audience should read the architecture without knowing the protocol).
   */
  entTag?: "MCP · tool" | "A2A · task" | "RAG · retrieve" | "telemetry" | "verify"
}

export interface FabricGraph {
  nodes: GraphNode[]
  edges: FabricEdge[]
  clusters: Cluster[]
}

export type { RelationType }
