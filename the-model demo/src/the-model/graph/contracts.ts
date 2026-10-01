/**
 * Federated domain contracts — pattern from Metaism's graphAnswer registry.
 * Matches → builds → falls through. Agents ask contracts, not a warehouse.
 * Local and deterministic. No Metaism APIs.
 *
 * Recast from the old Meridian incident onto the logistics enterprise. The
 * beat this drives (`aut-agents`) makes one point and does not explain the
 * mechanism: each domain answers from its own authority, just in time, about a
 * world only it can see directly. The presenter never says "MCP" — the edge
 * tags in graph/enterprise.ts carry that for anyone who wants it.
 *
 * The question is the one the whole second half has been circling: a single
 * commitment, and whether the system can still keep it.
 */

export type DomainId = "air" | "ground" | "hub" | "customer" | "network"

export interface KnowledgeContract<Q = string, A = string> {
  domain: DomainId
  matches: (query: Q) => boolean
  build: (query: Q) => A | null
}

export interface DomainOrb {
  domain: DomainId
  label: string
  /** Void placement — must not sit on topology. */
  x: number
  y: number
  /** Hairline lands on this enterprise node. */
  nodeId: string
}

/**
 * Placed in the margins around the enterprise bands (see the layout note in
 * graph/enterprise.ts): the air domain reaches up to the gateway, ground and
 * hub sit low, customer sits far right beside the recipient.
 */
export const DOMAIN_ORBS: DomainOrb[] = [
  { domain: "air", label: "Air ops", x: 300, y: 348, nodeId: "ent-gateway" },
  { domain: "hub", label: "Hub", x: 686, y: 736, nodeId: "ent-hub-sort" },
  {
    domain: "ground",
    label: "Ground",
    x: 1016,
    y: 702,
    nodeId: "ent-linehaul",
  },
  {
    domain: "customer",
    label: "Customer",
    x: 1440,
    y: 486,
    nodeId: "ent-recipient",
  },
  {
    domain: "network",
    label: "Network",
    x: 1380,
    y: 756,
    nodeId: "ent-fabric",
  },
]

export const contracts: KnowledgeContract[] = [
  {
    domain: "air",
    matches: (q) => /commit|flight|gateway|weather|eta/i.test(q),
    build: () => "Gateway closed on weather. Freighter re-tasked direct.",
  },
  {
    domain: "hub",
    matches: (q) => /commit|sort|capacity|hub/i.test(q),
    build: () => "Sort capacity at 94%. Priority freight holds its slot.",
  },
  {
    domain: "ground",
    matches: (q) => /commit|truck|linehaul|vehicle|delivery/i.test(q),
    build: () => "One linehaul offline. Second unit covers the lane.",
  },
  {
    domain: "customer",
    matches: (q) => /commit|customer|priority|promise/i.test(q),
    build: () => "Commitment is 10:30 tomorrow. Still achievable.",
  },
  {
    domain: "network",
    matches: (q) => /commit|network|path|scan|telemetry/i.test(q),
    build: () => "Hub scanner path degraded. Parcel events are 40s stale.",
  },
]

export const MORNING_QUERY = "Will 4408 9931 2250 make its commitment?"

export interface ContractAnswer {
  domain: DomainId
  label: string
  answer: string
  x: number
  y: number
  nodeId: string
}

/** Just-in-time: each matching domain answers from its own authority. */
export function askContracts(query: string): ContractAnswer[] {
  const out: ContractAnswer[] = []
  for (const orb of DOMAIN_ORBS) {
    const contract = contracts.find((c) => c.domain === orb.domain)
    if (!contract || !contract.matches(query)) continue
    const answer = contract.build(query)
    if (!answer) continue
    out.push({
      domain: orb.domain,
      label: orb.label,
      answer,
      x: orb.x,
      y: orb.y,
      nodeId: orb.nodeId,
    })
  }
  return out
}
