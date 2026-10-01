/**
 * Bounded relation traversal — in-memory port of Metaism ConceptRelationService.findPath.
 *
 * Source: Metaism/backend/src/services/conceptRelationService.ts (2026-08-21).
 * Original is a recursive SQL CTE. This is the same contract without Postgres:
 *   - typed edges
 *   - depth ≤ 3 by default
 *   - visited-node cycle guard
 *   - bidirectional edges walk both ways
 *
 * Domain labels were doctrine-specific in Metaism. Here they are infrastructure
 * relations used for blast radius / "what depends on what."
 */

export const RELATION_TYPE_LABELS = {
  depends_on: "Depends on",
  part_of: "Part of",
  path_to: "A path to",
  related_to: "Related to",
} as const;

export type RelationType = keyof typeof RELATION_TYPE_LABELS;

export interface GraphEdge {
  source: string;
  target: string;
  relationType: RelationType;
  bidirectional?: boolean;
}

export interface PathHop {
  from: string;
  relationType: RelationType;
  to: string;
}

export const DEFAULT_MAX_DEPTH = 3;

function neighbors(edges: GraphEdge[], id: string): Array<{ id: string; relationType: RelationType }> {
  const out: Array<{ id: string; relationType: RelationType }> = [];
  for (const e of edges) {
    if (e.source === id) out.push({ id: e.target, relationType: e.relationType });
    else if (e.target === id && e.bidirectional !== false) {
      out.push({ id: e.source, relationType: e.relationType });
    }
  }
  return out;
}

/**
 * Shortest typed path between two nodes. Returns null when none exists inside maxDepth.
 */
export function findPath(
  edges: GraphEdge[],
  sourceId: string,
  targetId: string,
  maxDepth = DEFAULT_MAX_DEPTH
): PathHop[] | null {
  if (sourceId === targetId) return [];

  type Frame = { id: string; hops: PathHop[]; visited: Set<string> };
  const queue: Frame[] = [{ id: sourceId, hops: [], visited: new Set([sourceId]) }];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.hops.length >= maxDepth) continue;
    for (const n of neighbors(edges, cur.id)) {
      if (cur.visited.has(n.id)) continue;
      const hop: PathHop = { from: cur.id, relationType: n.relationType, to: n.id };
      const hops = [...cur.hops, hop];
      if (n.id === targetId) return hops;
      const visited = new Set(cur.visited);
      visited.add(n.id);
      queue.push({ id: n.id, hops, visited });
    }
  }
  return null;
}

/**
 * Nodes within depth of a source — the blast-radius subgraph.
 */
export function subgraphWithin(
  edges: GraphEdge[],
  sourceId: string,
  maxDepth = DEFAULT_MAX_DEPTH
): { nodeIds: Set<string>; edgeKeys: Set<string> } {
  const nodeIds = new Set<string>([sourceId]);
  const edgeKeys = new Set<string>();
  type Frame = { id: string; depth: number };
  const queue: Frame[] = [{ id: sourceId, depth: 0 }];
  const seen = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.depth >= maxDepth) continue;
    for (const n of neighbors(edges, cur.id)) {
      const key = [cur.id, n.id].sort().join("→");
      edgeKeys.add(key);
      nodeIds.add(n.id);
      if (seen.has(n.id)) continue;
      seen.add(n.id);
      queue.push({ id: n.id, depth: cur.depth + 1 });
    }
  }
  return { nodeIds, edgeKeys };
}
