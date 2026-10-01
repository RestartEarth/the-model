import type { GraphEdge, RelationType } from "../vendor/metaism/relationTraverse";

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
  | "agent";

export type ClusterId =
  | "campus"
  | "wan"
  | "security"
  | "cloud"
  | "apps"
  | "storage"
  | "gpu";

/** 0 = void, 1 = mainframe, … 9 = full GPU-era fabric. */
export type Era = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  cluster: ClusterId;
  x: number;
  y: number;
  /** First era this node exists. */
  era: Era;
}

export interface Cluster {
  id: ClusterId;
  label: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  era: Era;
}

export interface MeridianEdge extends GraphEdge {
  era: Era;
}

export interface MeridianGraph {
  nodes: GraphNode[];
  edges: MeridianEdge[];
  clusters: Cluster[];
}

export type { RelationType };
