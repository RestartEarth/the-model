import type { AgentIntent } from "../agent/actor";
import type { PayloadKind } from "../graph/payload";
import type { SomaCompanion, SomaEarth, SomaEra } from "../graph/soma";
import type { WorkflowPhase } from "../graph/workflow";
import type { Era } from "../graph/types";

export type ActId = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 0 off. 1+ is the Life of the Packet branch after ONUG. */
export type PacketLife = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export type Shot =
  | "soma"
  | "period"
  | "black"
  | "quote"
  | "gpu-close"
  | "pullback"
  | "title"
  | "era"
  | "bus"
  | "inscriptions"
  | "training"
  | "inference"
  | "agents"
  | "metrics"
  | "incident"
  | "ports"
  | "agent"
  | "dark"
  | "wrong-act"
  | "facts"
  | "spine"
  | "knowledge"
  | "loop"
  | "verify"
  | "close"
  | "packet";

export type BlastKind = "none" | "gpu" | "path" | "wrong" | "inspect";

export type LoopStation =
  | "none"
  | "observe"
  | "model"
  | "understand"
  | "reason"
  | "act"
  | "verify";

export interface WorldState {
  shot: Shot;
  era: Era;
  /** SVG viewBox zoom. 1 = full graph. Higher = tighter. */
  zoom: number;
  focusX: number;
  focusY: number;
  graphOpacity: number;
  showQuote: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  showInscriptions: boolean;
  jobBroken: boolean;
  emphasizeSan: boolean;
  emphasizeEdges: boolean;
  selectedId: string | null;
  blast: boolean;
  /** Act II+: how the red subgraph is chosen. Act 0–I leave this "none" and use `blast`. */
  blastKind: BlastKind;
  thickenTraining: boolean;
  inferencePath: boolean;
  lightning: boolean;
  edgeMetrics: boolean;
  inspectionHop: boolean;
  showSignature: boolean;
  apiPorts: boolean;
  graphDark: boolean;
  agentIntent: AgentIntent;
  checkoutDown: boolean;
  floatingFacts: boolean;
  factsSnap: boolean;
  knowledgeEdges: boolean;
  spineHighlight: boolean;
  federation: boolean;
  /** Keep all contract answers visible (skip the staggered ask). */
  federationHold: boolean;
  crossOutShortcut: boolean;
  station: LoopStation;
  /** Pulse travels the full Observe→Verify orbit once. */
  loopTour: boolean;
  commitments: boolean;
  verified: boolean;
  /** Labeled protocol edges on the fabric. Act 0–I leave this "none". */
  protocolEdges: "none" | "mcp" | "a2a" | "both";
  /** Order-to-Cash copilot chain. Act 0–I leave this "none". */
  workflowPhase: WorkflowPhase;
  /** MCP / token / A2A pulses die at the inspect hop. */
  sessionBreak: boolean;
  /** Payload on the same edges. Act 0 leaves this "none". */
  payload: PayloadKind;
  /** Packets on every visible edge, denser glyphs. Act I slogan only. */
  densePackets: boolean;
  /** Prelude disclosure layer of one living body (not phylogeny). Acts 0–V leave idle. */
  somaEra: SomaEra;
  somaSpikes: boolean;
  somaSense: boolean;
  somaLoop: boolean;
  somaDissolve: boolean;
  /** Max revealed world layer. 0 none · 1 cosmos · 2 water · 3 mycelium · 4 foodweb (appendix) · 5 language/art/music/invention · 6 people · 7 economy · 8 internet · 9 satellites + ships. Once shown, a layer stays. Food-web stars stay off the main prelude even when later companions are up. */
  somaCompanion: SomaCompanion;
  /** Soil cross-section. Stays open once the earth is revealed. */
  somaEarth: SomaEarth;
  /** Full-world pullback — every region readable, camera wide, human still center. */
  somaPullback: boolean;
  /** Gold nerves re-light to rhyme with the graph he just watched. */
  somaRhyme: boolean;
  /** Sparse ink-like press tokens — not later LLM pulses. */
  somaInk: boolean;
  /** Camera behind the eyes — we are inside this mind. */
  somaMind: boolean;
  /** Archival Gage still. Off until the quote has landed; then fade in. */
  somaGage: boolean;
  /** 0 none · 1 Sun workstations + Ethernet · 2 + earliest internet. */
  periodTech: 0 | 1 | 2;
  /** Life of the Packet primer. 0 = off. */
  packetLife: PacketLife;
  /** Classic IP parcel, or the token rhyme of the same diagram. */
  packetKind: "packet" | "token";
}

export interface Beat {
  id: string;
  act: ActId;
  actLabel: string;
  /** Audience sentence. Empty = silence. */
  line: string;
  /** Presenter: what comes next. */
  nextHint: string;
  durationMs: number;
  world: WorldState;
}

export type StageMode = "cinema" | "conductor";
