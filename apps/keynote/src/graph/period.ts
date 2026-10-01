/**
 * 1984 period scaffolding — workstations, Ethernet, earliest internet.
 * Same node/edge grammar as Meridian, not a Sun-campus photograph.
 * Teal arrives here. Gold stays on Gage.
 * Keep this cluster on the left of the 1600×900 frame so edges never
 * run through the Gage portrait while the still is up (clip at x=480).
 */

export interface PeriodNode {
  id: string;
  label: string;
  x: number;
  y: number;
  appear: 1 | 2;
}

export interface PeriodEdge {
  source: string;
  target: string;
  appear: 1 | 2;
  bus?: boolean;
}

export const PERIOD_NODES: PeriodNode[] = [
  { id: "eth", label: "Ethernet", x: 300, y: 560, appear: 1 },
  { id: "sun", label: "Sun", x: 300, y: 420, appear: 1 },
  { id: "ws-l", label: "Workstation", x: 140, y: 480, appear: 1 },
  { id: "ws-r", label: "Workstation", x: 400, y: 480, appear: 1 },
  { id: "files", label: "File server", x: 300, y: 720, appear: 1 },
  { id: "arpa", label: "ARPANET", x: 100, y: 280, appear: 2 },
  { id: "nsf", label: "NSFNET", x: 220, y: 180, appear: 2 },
  { id: "csnet", label: "CSNET", x: 60, y: 420, appear: 2 },
  { id: "site", label: "Remote site", x: 160, y: 720, appear: 2 },
];

export const PERIOD_EDGES: PeriodEdge[] = [
  { source: "sun", target: "eth", appear: 1, bus: true },
  { source: "ws-l", target: "eth", appear: 1, bus: true },
  { source: "ws-r", target: "eth", appear: 1, bus: true },
  { source: "files", target: "eth", appear: 1, bus: true },
  { source: "eth", target: "arpa", appear: 2 },
  { source: "arpa", target: "nsf", appear: 2 },
  { source: "arpa", target: "csnet", appear: 2 },
  { source: "eth", target: "site", appear: 2 },
  { source: "csnet", target: "site", appear: 2 },
];

export function periodNode(id: string) {
  return PERIOD_NODES.find((n) => n.id === id);
}

export function visiblePeriod(layer: 0 | 1 | 2) {
  return {
    nodes: PERIOD_NODES.filter((n) => n.appear <= layer && layer > 0),
    edges: PERIOD_EDGES.filter((e) => e.appear <= layer && layer > 0),
  };
}
