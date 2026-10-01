/**
 * Federated domain contracts — pattern from Metaism graphAnswer registry.
 * Matches → builds → falls through. Agents ask contracts, not a warehouse.
 * Local and deterministic. No Metaism APIs.
 */

export type DomainId = "network" | "cloud" | "security" | "app" | "identity";

export interface KnowledgeContract<Q = string, A = string> {
  domain: DomainId;
  matches: (query: Q) => boolean;
  build: (query: Q) => A | null;
}

export interface DomainOrb {
  domain: DomainId;
  label: string;
  /** Void placement — must not sit on topology. */
  x: number;
  y: number;
  /** Hairline lands on this Meridian node. */
  nodeId: string;
}

export const DOMAIN_ORBS: DomainOrb[] = [
  { domain: "network", label: "Network", x: 72, y: 430, nodeId: "sdwan" },
  { domain: "cloud", label: "Cloud", x: 980, y: 44, nodeId: "region" },
  { domain: "security", label: "Security", x: 600, y: 44, nodeId: "security" },
  { domain: "app", label: "App", x: 1490, y: 250, nodeId: "checkout" },
  { domain: "identity", label: "Identity", x: 72, y: 210, nodeId: "identity" },
];

export const contracts: KnowledgeContract[] = [
  {
    domain: "network",
    matches: (q) => /bgp|ecmp|rdma|path|sd-?wan|elephant|10:37|meridian/i.test(q),
    build: () => "East-west elephant flow hash-polarized on ECMP.",
  },
  {
    domain: "cloud",
    matches: (q) => /aws|region|k8s|kubernetes|gpu|10:37|meridian/i.test(q),
    build: () => "gpu-0 utilization is healthy. Checkout shares the cloud path.",
  },
  {
    domain: "security",
    matches: (q) => /inspect|policy|10:29|hop|10:37|meridian/i.test(q),
    build: () => "A security inspection hop was inserted at 10:29.",
  },
  {
    domain: "app",
    matches: (q) => /checkout|jct|meridian-pretrain|job|10:37|meridian/i.test(q),
    build: () => "meridian-pretrain-7 stalled at 10:37. Checkout is degraded.",
  },
  {
    domain: "identity",
    matches: (q) => /identity|policy|who|permit|restart|10:37|meridian/i.test(q),
    build: () => "Restarting gpu-0 is not a permitted remediation.",
  },
];

export const MORNING_QUERY = "What happened on Meridian at 10:37?";

export interface ContractAnswer {
  domain: DomainId;
  label: string;
  answer: string;
  x: number;
  y: number;
  nodeId: string;
}

/** Just-in-time: each matching domain answers from its own authority. */
export function askContracts(query: string): ContractAnswer[] {
  const out: ContractAnswer[] = [];
  for (const orb of DOMAIN_ORBS) {
    const contract = contracts.find((c) => c.domain === orb.domain);
    if (!contract || !contract.matches(query)) continue;
    const answer = contract.build(query);
    if (!answer) continue;
    out.push({
      domain: orb.domain,
      label: orb.label,
      answer,
      x: orb.x,
      y: orb.y,
      nodeId: orb.nodeId,
    });
  }
  return out;
}
