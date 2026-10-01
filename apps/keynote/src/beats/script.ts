import { AGENT_IDLE } from "../agent/actor";
import { graph } from "../design/tokens";
import { GPU_NODE_ID, nodeById } from "../graph/meridian";
import type { ActId, Beat, PacketLife, WorldState } from "../stage/types";
import {
  A2,
  A3,
  A4,
  A5,
  AAPP,
  APP_LIBRARY,
  APRE,
  APRE_GAGE,
  APRE_MIND,
  APRE_SEE,
  GAGE_ATTR,
  GAGE_QUOTE,
  INSCRIPTIONS,
  SIG_1037,
  SIG_AUTONOMY,
  SIG_CENTRIC,
  SIG_CLOSE,
  SIG_ONUG,
  LOTP_OPEN,
  LOTP_CIRCUIT,
  LOTP_HOP,
  LOTP_LAYERS,
  LOTP_WIRE,
  LOTP_REWRITE,
  LOTP_TTL,
  LOTP_TCP,
  LOTP_ROUTE,
  LOTP_MPLS,
  LOTP_VPN,
  LOTP_QOS,
  LOTP_SDWAN,
  LOTP_CLOSE,
  LOTP_BRIDGE,
  TOK_OPEN,
  TOK_LAYERS,
  TOK_WIRE,
  TOK_HOP,
  TOK_TALK,
  TOK_AGENTS,
  SIG_ENTITY,
  SIG_FACTS,
  SIG_A2A_TRUST,
  SIG_BOTH_TRACES,
  SIG_BYTES,
  SIG_FEDERATION,
  SIG_INFER_GW,
  SIG_TOKEN_ECON,
  SIG_LIMIT,
  SIG_MCP_A2A,
  SIG_NEED_MODEL,
  PRE_CHAKRAS,
  PRE_CIRCULATION,
  PRE_COSMOS,
  PRE_ECONOMY,
  PRE_LYMPH,
  PRE_FOODWEB,
  PRE_GAGE,
  PRE_INTERNET,
  PRE_LANGUAGE,
  PRE_WATER,
  PRE_SPACE,
  PRE_LOOP,
  PRE_MYCELIUM,
  PRE_NERVES,
  PRE_PEOPLE,
  PRE_PERIOD,
  PRE_PRESENCE,
  PRE_PULLBACK,
  PRE_SCAFFOLD,
  PRE_SENSES,
  PRE_STRUCTURE,
  PRE_VISCERA,
  SIG_OTC,
  SIG_OTC_CAUSE,
  SIG_LOOP,
  SIG_OBS,
  SIG_PERF,
  SIG_PROGRAM,
  SIG_SA_C2,
  SIG_SENSE,
  SIG_SHORTCUT,
  SIG_SPINE,
  SIG_UNDERSTAND,
  SIG_WATERMELON,
  SIG_WORKLOAD,
  SUBTITLE,
  TITLE,
  TRANSITION,
} from "../content/copy";

const gpu = nodeById(GPU_NODE_ID)!;
const FULL = { zoom: 1, focusX: 800, focusY: 450 };

function world(partial: Partial<WorldState>): WorldState {
  return {
    shot: "era",
    era: 9,
    zoom: FULL.zoom,
    focusX: FULL.focusX,
    focusY: FULL.focusY,
    graphOpacity: 1,
    showQuote: false,
    showTitle: false,
    showSubtitle: false,
    showInscriptions: false,
    jobBroken: false,
    emphasizeSan: false,
    emphasizeEdges: false,
    selectedId: null,
    blast: false,
    blastKind: "none",
    thickenTraining: false,
    inferencePath: false,
    lightning: false,
    edgeMetrics: false,
    inspectionHop: false,
    showSignature: false,
    apiPorts: false,
    graphDark: false,
    agentIntent: AGENT_IDLE,
    checkoutDown: false,
    floatingFacts: false,
    factsSnap: false,
    knowledgeEdges: false,
    spineHighlight: false,
    federation: false,
    federationHold: false,
    crossOutShortcut: false,
    station: "none",
    loopTour: false,
    commitments: false,
    verified: false,
    protocolEdges: "none",
    workflowPhase: "none",
    sessionBreak: false,
    payload: "none",
    densePackets: false,
    somaEra: 0,
    somaSpikes: false,
    somaSense: false,
    somaLoop: false,
    somaDissolve: false,
    somaCompanion: 0,
    somaEarth: "none",
    somaRhyme: false,
    somaInk: false,
    somaMind: false,
    somaGage: false,
    somaPullback: false,
    periodTech: 0,
    packetLife: 0,
    packetKind: "packet",
    ...partial,
  };
}

function packetWorld(life: PacketLife, kind: "packet" | "token" = "packet"): WorldState {
  return world({
    shot: "packet",
    packetLife: life,
    packetKind: kind,
    graphOpacity: 0,
    showSignature: true,
  });
}

function beat(
  id: string,
  act: Beat["act"],
  actLabel: string,
  line: string,
  nextHint: string,
  durationMs: number,
  w: WorldState
): Beat {
  return { id, act, actLabel, line, nextHint, durationMs, world: w };
}

const A0 = "Act 0 · 1984";
const A1 = "Act I · The scaffold";

/** Frame a region with air around it — pad is extra size on each axis (0.16 ≈ 16%). */
function frameBox(minX: number, minY: number, maxX: number, maxY: number, pad = 0.16) {
  const w = Math.max(160, (maxX - minX) * (1 + pad));
  const h = Math.max(160, (maxY - minY) * (1 + pad));
  return {
    zoom: Math.min(graph.width / w, graph.height / h),
    focusX: (minX + maxX) / 2,
    focusY: (minY + maxY) / 2,
  };
}

function frameCircle(cx: number, cy: number, r: number, pad = 0.16) {
  return frameBox(cx - r, cy - r, cx + r, cy + r, pad);
}

/** Galaxy discs extend ~160px past r=920; pad keeps labels in frame. */
const CAM_COSMOS = frameCircle(800, 450, 1080, 0.14);
/**
 * Earth L→R plus the sky return. Bbox includes the cloud asterism
 * (highest star ~y=280, CLOUDS label ~y=276); focusY stays high so the
 * band does not sink into audience type.
 * (Default frameBox center would drop the earth.)
 */
const CAM_WATER = { ...frameBox(28, 230, 1588, 912, 0.18), focusY: 728 };
const CAM_SOIL = frameBox(320, 618, 1164, 936, 0.18);
/** Life asterisms + fuel arriving at the whisper mouth. Pad so taller clusters do not clip. */
const CAM_FOOD = { ...frameBox(280, 170, 1340, 920, 0.2), focusY: 568 };
const CAM_FIGURE = frameBox(520, 70, 1092, 900, 0.14);
const CAM_TORSO = frameBox(540, 160, 1060, 620, 0.18);
const CAM_VISCERA = frameBox(660, 240, 940, 530, 0.22);
const CAM_ENDO = frameBox(600, 120, 1000, 540, 0.18);
/** Head-through-feet like presence; extra floor so the figure sits above audience type. */
const CAM_ENERGY = frameBox(520, 70, 1092, 1220, 0.2);
const CAM_NERVES = frameBox(540, 70, 1060, 850, 0.16);
const CAM_HEAD = frameBox(560, 20, 1040, 430, 0.18);
const CAM_LOOP = frameBox(520, 70, 1230, 900, 0.14);
const CAM_PEOPLE = frameBox(140, 70, 1460, 740, 0.16);
const CAM_TRADE = frameBox(140, 70, 1480, 760, 0.16);
/** Language, art, music, and invention glyphs together — culture web from the mind. */
const CAM_LANGUAGE = frameBox(490, -20, 1210, 370, 0.2);
const CAM_NET = frameBox(-20, -70, 1620, 780, 0.14);
const CAM_SPACE = frameCircle(800, 450, 1080, 0.14);
const CAM_WORLD = frameCircle(800, 450, 1100, 0.2);

const EARTH_WORLD = {
  somaCompanion: 3 as const,
  somaEarth: "mycelium" as const,
};

export const BEATS: Beat[] = [
  beat("soma-cosmos", -1, APRE_SEE, PRE_COSMOS, PRE_WATER, 12000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaCompanion: 1,
    somaRhyme: true,
    ...CAM_COSMOS,
    showSignature: true,
  })),

  beat("soma-water", -1, APRE_SEE, PRE_WATER, PRE_MYCELIUM, 14000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaCompanion: 2,
    somaRhyme: true,
    ...CAM_WATER,
    showSignature: true,
  })),

  beat("soma-mycelium", -1, APRE_SEE, PRE_MYCELIUM, PRE_PRESENCE, 12000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaCompanion: 3,
    somaEarth: "mycelium",
    somaRhyme: true,
    ...CAM_SOIL,
    showSignature: true,
  })),

  beat("soma-presence", -1, APRE, PRE_PRESENCE, PRE_CHAKRAS, 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 1,
    ...EARTH_WORLD,
    ...CAM_FIGURE,
  })),

  beat("soma-chakras", -1, APRE, PRE_CHAKRAS, PRE_STRUCTURE, 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 2,
    ...EARTH_WORLD,
    ...CAM_ENERGY,
  })),

  beat("soma-structure", -1, APRE, PRE_STRUCTURE, PRE_CIRCULATION, 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 3,
    ...EARTH_WORLD,
    ...CAM_FIGURE,
  })),

  beat("soma-circulation", -1, APRE, PRE_CIRCULATION, PRE_VISCERA, 11000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 4,
    ...EARTH_WORLD,
    ...CAM_TORSO,
  })),

  beat("soma-viscera", -1, APRE, PRE_VISCERA, PRE_LYMPH, 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 5,
    ...EARTH_WORLD,
    ...CAM_VISCERA,
  })),

  beat("soma-lymph", -1, APRE, PRE_LYMPH, PRE_NERVES, 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 6,
    ...EARTH_WORLD,
    ...CAM_ENDO,
  })),

  beat("soma-nerves", -1, APRE, PRE_NERVES, PRE_SENSES, 11000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 7,
    somaSpikes: true,
    ...EARTH_WORLD,
    ...CAM_NERVES,
  })),

  beat("soma-senses", -1, APRE, PRE_SENSES, PRE_LOOP, 12000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 8,
    somaSpikes: true,
    somaSense: true,
    ...EARTH_WORLD,
    ...CAM_HEAD,
    showSignature: true,
  })),

  beat("soma-loop", -1, APRE, PRE_LOOP, PRE_LANGUAGE, 14000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaLoop: true,
    ...EARTH_WORLD,
    ...CAM_LOOP,
    showSignature: true,
  })),

  beat("soma-language", -1, APRE_MIND, PRE_LANGUAGE, PRE_PEOPLE, 24000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 5,
    somaEarth: "mycelium",
    somaMind: true,
    ...CAM_LANGUAGE,
    showSignature: true,
  })),

  beat("soma-people", -1, APRE_SEE, PRE_PEOPLE, PRE_ECONOMY, 14000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 6,
    somaEarth: "mycelium",
    somaRhyme: true,
    ...CAM_PEOPLE,
    showSignature: true,
  })),

  beat("soma-economy", -1, APRE_SEE, PRE_ECONOMY, PRE_INTERNET, 14000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 7,
    somaEarth: "mycelium",
    somaRhyme: true,
    ...CAM_TRADE,
    showSignature: true,
  })),

  beat("soma-internet", -1, APRE_MIND, PRE_INTERNET, PRE_SPACE, 14000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 8,
    somaEarth: "mycelium",
    somaMind: true,
    ...CAM_NET,
    showSignature: true,
  })),

  beat("soma-space", -1, APRE_SEE, PRE_SPACE, PRE_PULLBACK, 14000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 9,
    somaEarth: "mycelium",
    somaRhyme: true,
    ...CAM_SPACE,
    showSignature: true,
  })),

  beat("soma-pullback", -1, APRE_SEE, PRE_PULLBACK, PRE_GAGE, 12000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 9,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 9,
    somaEarth: "mycelium",
    somaRhyme: true,
    somaPullback: true,
    ...CAM_WORLD,
    showSignature: true,
  })),

  beat("soma-gage", -1, APRE_MIND, PRE_GAGE, GAGE_ATTR, 16000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 10,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 9,
    somaEarth: "mycelium",
    somaMind: true,
    somaPullback: true,
    showQuote: true,
    zoom: 0.7,
    focusX: 800,
    focusY: 450,
  })),

  beat("gage-fade", -1, APRE_GAGE, GAGE_QUOTE, PRE_PERIOD, 12000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaEra: 10,
    somaSpikes: true,
    somaSense: true,
    somaCompanion: 9,
    somaEarth: "mycelium",
    somaMind: true,
    somaDissolve: true,
    somaGage: true,
    somaPullback: true,
    showQuote: true,
    zoom: 0.7,
    focusX: 800,
    focusY: 450,
  })),

  beat("period-sun", 0, A0, GAGE_QUOTE, LOTP_OPEN, 16000, world({
    shot: "period",
    era: 0,
    graphOpacity: 0,
    somaGage: true,
    periodTech: 1,
    showQuote: true,
    zoom: 1.15,
    focusX: 380,
    focusY: 520,
  })),

  // ——— How a packet lives (before connected-network examples) ———
  beat("lotp-open", 0, A0, LOTP_OPEN, LOTP_CIRCUIT, 12000, packetWorld(1)),
  beat("lotp-circuit", 0, A0, LOTP_CIRCUIT, LOTP_HOP, 11000, packetWorld(2)),
  beat("lotp-hop", 0, A0, LOTP_HOP, LOTP_LAYERS, 11000, packetWorld(3)),
  beat("lotp-layers", 0, A0, LOTP_LAYERS, LOTP_WIRE, 12000, packetWorld(4)),
  beat("lotp-wire", 0, A0, LOTP_WIRE, LOTP_REWRITE, 10000, packetWorld(5)),
  beat("lotp-rewrite", 0, A0, LOTP_REWRITE, LOTP_TTL, 11000, packetWorld(6)),
  beat("lotp-ttl", 0, A0, LOTP_TTL, LOTP_TCP, 10000, packetWorld(7)),
  beat("lotp-tcp", 0, A0, LOTP_TCP, LOTP_ROUTE, 11000, packetWorld(8)),
  beat("lotp-route", 0, A0, LOTP_ROUTE, LOTP_CLOSE, 11000, packetWorld(9)),
  beat("lotp-close", 0, A0, LOTP_CLOSE, LOTP_BRIDGE, 12000, packetWorld(14)),
  beat("lotp-bridge", 0, A0, LOTP_BRIDGE, PRE_SCAFFOLD, 10000, packetWorld(14)),

  beat("period-net", 0, A0, PRE_SCAFFOLD, "LAN", 14000, world({
    shot: "period",
    era: 0,
    graphOpacity: 0,
    somaGage: true,
    periodTech: 2,
    zoom: 0.95,
    focusX: 280,
    focusY: 420,
  })),

  beat("lan", 1, A1, "From that scaffolding: a LAN.", "Internet", 22000, world({
    shot: "era",
    era: 2,
    zoom: 1.55,
    focusX: 520,
    focusY: 500,
    payload: "packets",
  })),

  beat("internet", 1, A1, "Then we connected previously independent systems.", "Cloud", 24000, world({
    shot: "era",
    era: 3,
    zoom: 1.2,
    focusX: 520,
    focusY: 400,
    payload: "packets",
  })),

  beat("cloud", 1, A1, "SaaS and cloud separated applications from place.", "SDN", 22000, world({
    shot: "era",
    era: 4,
    ...FULL,
    zoom: 1.08,
  })),

  beat("sdn", 1, A1, "SDN, virtualization and overlays made the fabric programmable.", LOTP_MPLS, 24000, world({
    shot: "era",
    era: 5,
    ...FULL,
    emphasizeEdges: true,
    payload: "packets",
  })),

  beat("lotp-mpls", 1, A1, LOTP_MPLS, LOTP_VPN, 12000, packetWorld(10)),
  beat("lotp-vpn", 1, A1, LOTP_VPN, LOTP_QOS, 11000, packetWorld(11)),
  beat("lotp-qos", 1, A1, LOTP_QOS, LOTP_SDWAN, 11000, packetWorld(12)),
  beat("lotp-sdwan", 1, A1, LOTP_SDWAN, "SAN", 12000, packetWorld(13)),

  beat("san", 1, A1, "There is a reason we call it a Storage Area Network.", "System bus", 26000, world({
    shot: "era",
    era: 6,
    zoom: 1.35,
    focusX: 930,
    focusY: 640,
    emphasizeSan: true,
    selectedId: "san",
  })),

  beat("bus", 1, A1, "The network is becoming the programmable system bus of the distributed enterprise.", SIG_BYTES, 24000, world({
    shot: "bus",
    era: 8,
    ...FULL,
    emphasizeEdges: true,
    payload: "packets",
  })),

  beat("everything-bytes", 1, A1, SIG_BYTES, TOK_OPEN, 18000, world({
    shot: "bus",
    era: 8,
    ...FULL,
    emphasizeEdges: true,
    payload: "packets",
    densePackets: true,
    showSignature: true,
  })),

  // ——— Act II · New packets, then what AI looks like ———

  beat("token-open", 2, A2, TOK_OPEN, TOK_LAYERS, 12000, packetWorld(1, "token")),
  beat("token-layers", 2, A2, TOK_LAYERS, TOK_WIRE, 12000, packetWorld(4, "token")),
  beat("token-wire", 2, A2, TOK_WIRE, TOK_HOP, 10000, packetWorld(5, "token")),
  beat("token-hop", 2, A2, TOK_HOP, TOK_TALK, 11000, packetWorld(3, "token")),
  beat("token-talk", 2, A2, TOK_TALK, SIG_TOKEN_ECON, 11000, packetWorld(8, "token")),
  beat("token-econ", 2, A2, SIG_TOKEN_ECON, SIG_INFER_GW, 12000, packetWorld(14, "token")),

  beat("inference-gw", 2, A2, SIG_INFER_GW, SIG_MCP_A2A, 28000, world({
    shot: "inference",
    zoom: 1.15,
    focusX: 1045,
    focusY: 330,
    inferencePath: true,
    workflowPhase: "tokens",
    payload: "tokens",
    selectedId: "lb",
  })),

  beat("mcp-a2a", 2, A2, SIG_MCP_A2A, TOK_AGENTS, 32000, world({
    shot: "agents",
    zoom: 1.08,
    focusX: 1100,
    focusY: 280,
    inferencePath: true,
    protocolEdges: "both",
    workflowPhase: "fanout",
    payload: "knowledge",
    showSignature: true,
    selectedId: "mcp-gw",
  })),

  beat("token-agents", 2, A2, TOK_AGENTS, SIG_PERF, 28000, world({
    shot: "agents",
    zoom: 1.12,
    focusX: 800,
    focusY: 400,
    inferencePath: true,
    workflowPhase: "fanout",
    protocolEdges: "both",
    payload: "tokens",
    showSignature: true,
  })),

  beat("sig-perf", 2, A2, SIG_PERF, "Metrics on the edges", 26000, world({
    shot: "metrics",
    ...FULL,
    graphOpacity: 0.42,
    showSignature: true,
    thickenTraining: true,
    payload: "tokens",
  })),

  beat("metrics", 2, A2, "JCT, TTFT — pkt/s and tok/s on the same edges.", "GPU clusters", 28000, world({
    shot: "metrics",
    ...FULL,
    edgeMetrics: true,
    thickenTraining: true,
    payload: "tokens",
  })),

  beat("gpu-era", 2, A2, "And now GPU clusters depend on the fabric connecting them.", "Training", 22000, world({
    shot: "era",
    era: 9,
    ...FULL,
    emphasizeEdges: true,
    payload: "packets",
    selectedId: GPU_NODE_ID,
  })),

  beat("training", 2, A2, "Training fabrics create the foundation for AI training — RDMA, RoCE, JCT. They are not the whole enterprise.", "Inference", 28000, world({
    shot: "training",
    zoom: 2.15,
    focusX: 1285,
    focusY: 640,
    thickenTraining: true,
    payload: "flows",
    selectedId: GPU_NODE_ID,
  })),

  beat("inference", 2, A2, "Inference is a path — model, vectors, RAG, APIs, storage, clouds, edge.", "AI exposes this", 28000, world({
    shot: "inference",
    zoom: 1.08,
    focusX: 980,
    focusY: 420,
    inferencePath: true,
    payload: "rpc",
    selectedId: "model",
  })),

  beat("ai-exposes", 2, A2, "AI exposes the consequences of a distributed computer.", INSCRIPTIONS[0], 24000, world({
    shot: "era",
    ...FULL,
    emphasizeEdges: true,
    payload: "packets",
  })),

  beat("inscriptions", 2, A2, INSCRIPTIONS[0], TRANSITION, 24000, world({
    shot: "inscriptions",
    era: 9,
    ...FULL,
    graphOpacity: 0.22,
    showInscriptions: true,
  })),

  beat("transition", 2, A2, TRANSITION, SIG_ENTITY, 18000, world({
    shot: "inscriptions",
    era: 9,
    ...FULL,
    graphOpacity: 0.2,
    showSignature: true,
  })),

  beat("new-entity", 2, A2, SIG_ENTITY, SIG_WORKLOAD, 26000, world({
    shot: "agents",
    ...FULL,
    graphOpacity: 0.55,
    lightning: true,
    showSignature: true,
    protocolEdges: "both",
    payload: "tokens",
  })),

  beat("not-only-workload", 2, A2, SIG_WORKLOAD, "API ports", 26000, world({
    shot: "inscriptions",
    ...FULL,
    graphOpacity: 0.3,
    showSignature: true,
  })),

  beat("api-ports", 2, A2, "The fabric grew APIs — SDN, IaC, controllers, orchestration, intent.", SIG_PROGRAM, 32000, world({
    shot: "ports",
    ...FULL,
    apiPorts: true,
    emphasizeEdges: true,
  })),

  beat("sig-program", 2, A2, SIG_PROGRAM, "The GPU is healthy", 40000, world({
    shot: "ports",
    ...FULL,
    graphOpacity: 0.38,
    apiPorts: true,
    showSignature: true,
  })),

  // ——— Act III · A morning on Meridian ———

  beat("gpu-healthy", 3, A3, "The GPU is healthy.", SIG_WATERMELON, 12000, world({
    shot: "gpu-close",
    era: 9,
    zoom: 4.6,
    focusX: gpu.x,
    focusY: gpu.y,
    graphOpacity: 1,
    selectedId: GPU_NODE_ID,
  })),

  beat("watermelon", 3, A3, SIG_WATERMELON, "Job Completion Time", 14000, world({
    shot: "gpu-close",
    era: 9,
    zoom: 4.6,
    focusX: gpu.x,
    focusY: gpu.y,
    graphOpacity: 1,
    selectedId: GPU_NODE_ID,
  })),

  beat("jct", 3, A3, "Job Completion Time just broke.", "Pull back", 14000, world({
    shot: "gpu-close",
    era: 9,
    zoom: 3.4,
    focusX: gpu.x,
    focusY: gpu.y - 20,
    graphOpacity: 1,
    jobBroken: true,
    selectedId: GPU_NODE_ID,
    blast: true,
  })),

  beat("pullback", 3, A3, "The GPU is not the computer. The fabric is.", "Dallas asks", 16000, world({
    shot: "pullback",
    era: 9,
    ...FULL,
    graphOpacity: 1,
    jobBroken: true,
    blast: true,
    selectedId: GPU_NODE_ID,
  })),

  beat("agents-runtime", 3, A3, "Dallas asks the Order-to-Cash copilot why checkout is slow.", SIG_OTC, 28000, world({
    shot: "agents",
    zoom: 1.2,
    focusX: 420,
    focusY: 500,
    inferencePath: true,
    workflowPhase: "ask",
    protocolEdges: "both",
    payload: "tokens",
    selectedId: "users",
  })),

  beat("replay-1037", 3, A3, SIG_OTC, "That copilot is the operator", 34000, world({
    shot: "incident",
    zoom: 1.12,
    focusX: 1000,
    focusY: 420,
    jobBroken: true,
    blastKind: "path",
    inspectionHop: true,
    edgeMetrics: true,
    protocolEdges: "both",
    workflowPhase: "broken",
    sessionBreak: true,
    payload: "tokens",
    selectedId: "inspect",
  })),

  beat("agent-arrives", 3, A3, "That copilot is an operator on the network — and it is ungrounded.", "It knows the literature", 28000, world({
    shot: "agent",
    zoom: 1.15,
    focusX: 900,
    focusY: 400,
    apiPorts: true,
    agentIntent: "arrive",
  })),

  beat("textbook", 3, A3, "It knows the literature. BGP. Kubernetes. VPC. Not the path.", "Meridian at 10:37", 34000, world({
    shot: "agent",
    zoom: 1.12,
    focusX: 980,
    focusY: 400,
    apiPorts: true,
    agentIntent: "recite",
    selectedId: "k8s",
  })),

  beat("ask-1037", 3, A3, "What happened on Meridian at 10:37?", SIG_1037, 30000, world({
    shot: "dark",
    ...FULL,
    graphDark: true,
    graphOpacity: 0.22,
    agentIntent: "ask",
    inspectionHop: true,
    workflowPhase: "broken",
    sessionBreak: true,
  })),

  beat("knows-nothing", 3, A3, SIG_1037, "It acts anyway", 38000, world({
    shot: "dark",
    ...FULL,
    graphDark: true,
    graphOpacity: 0.16,
    showSignature: true,
    agentIntent: "ask",
  })),

  beat("acts-anyway", 3, A3, SIG_OTC_CAUSE, SIG_LIMIT, 38000, world({
    shot: "wrong-act",
    zoom: 1.2,
    focusX: 1200,
    focusY: 480,
    agentIntent: "act",
    blastKind: "wrong",
    checkoutDown: true,
    inspectionHop: true,
    jobBroken: true,
    workflowPhase: "broken",
    sessionBreak: true,
    protocolEdges: "mcp",
    showSignature: true,
    selectedId: GPU_NODE_ID,
  })),

  beat("limiting", 3, A3, SIG_LIMIT, SIG_OBS, 32000, world({
    shot: "wrong-act",
    ...FULL,
    graphOpacity: 0.4,
    showSignature: true,
    blastKind: "wrong",
    checkoutDown: true,
    inspectionHop: true,
    jobBroken: true,
    agentIntent: "act",
  })),

  beat("obs-evolves", 3, A3, SIG_OBS, "Floating facts", 28000, world({
    shot: "inscriptions",
    ...FULL,
    graphOpacity: 0.28,
    showSignature: true,
    checkoutDown: true,
    blastKind: "wrong",
  })),

  // ——— Act IV ———

  beat("facts-float", 4, A4, SIG_FACTS, "The spine", 36000, world({
    shot: "facts",
    ...FULL,
    floatingFacts: true,
    showSignature: true,
    graphOpacity: 0.72,
  })),

  beat("spine-snap", 4, A4, "User, to device, to path, to application, to data.", SIG_SPINE, 50000, world({
    shot: "spine",
    zoom: 1.06,
    focusX: 780,
    focusY: 430,
    floatingFacts: true,
    factsSnap: true,
    spineHighlight: true,
  })),

  beat("knowledge", 4, A4, SIG_SPINE, "Federation", 50000, world({
    shot: "knowledge",
    ...FULL,
    spineHighlight: true,
    knowledgeEdges: true,
    factsSnap: true,
    showSignature: true,
    graphOpacity: 0.85,
  })),

  beat("federation", 4, A4, SIG_FEDERATION, SIG_A2A_TRUST, 42000, world({
    shot: "knowledge",
    ...FULL,
    federation: true,
    knowledgeEdges: true,
    protocolEdges: "mcp",
    showSignature: true,
    graphOpacity: 0.7,
  })),

  beat("a2a-trust", 4, A4, SIG_A2A_TRUST, SIG_CENTRIC, 36000, world({
    shot: "knowledge",
    zoom: 1.08,
    focusX: 1000,
    focusY: 220,
    federation: true,
    federationHold: true,
    protocolEdges: "both",
    showSignature: true,
    selectedId: "agent-peer",
  })),

  beat("not-only", 4, A4, SIG_CENTRIC, SIG_BOTH_TRACES, 36000, world({
    shot: "knowledge",
    ...FULL,
    federation: true,
    federationHold: true,
    spineHighlight: true,
    showSignature: true,
    graphOpacity: 0.45,
  })),

  beat("both-traces", 4, A4, SIG_BOTH_TRACES, SIG_AUTONOMY, 36000, world({
    shot: "knowledge",
    ...FULL,
    federation: true,
    federationHold: true,
    protocolEdges: "both",
    spineHighlight: true,
    showSignature: true,
    graphOpacity: 0.4,
  })),

  beat("talk-autonomy", 4, A4, SIG_AUTONOMY, SIG_NEED_MODEL, 36000, world({
    shot: "inscriptions",
    ...FULL,
    graphOpacity: 0.28,
    showSignature: true,
  })),

  // ——— Act V ———

  beat("need-a-model", 5, A5, SIG_NEED_MODEL, SIG_SHORTCUT, 24000, world({
    shot: "inscriptions",
    ...FULL,
    graphOpacity: 0.28,
    showSignature: true,
  })),

  beat("shortcut", 5, A5, SIG_SHORTCUT, SIG_SA_C2, 24000, world({
    shot: "loop",
    ...FULL,
    graphOpacity: 0.22,
    crossOutShortcut: true,
    showSignature: true,
  })),

  beat("sa-then-c2", 5, A5, SIG_SA_C2, SIG_LOOP, 24000, world({
    shot: "loop",
    ...FULL,
    graphOpacity: 0.22,
    crossOutShortcut: true,
    showSignature: true,
  })),

  beat("six-stations", 5, A5, SIG_LOOP, "Observe 10:37", 32000, world({
    shot: "loop",
    ...FULL,
    graphOpacity: 0.55,
    station: "observe",
    loopTour: true,
    showSignature: true,
  })),

  beat("v-observe", 5, A5, "Observe. The copilot’s tool calls never returned.", "Model", 32000, world({
    shot: "incident",
    zoom: 1.12,
    focusX: 1100,
    focusY: 500,
    station: "observe",
    edgeMetrics: true,
    jobBroken: true,
    inspectionHop: true,
    blastKind: "path",
    protocolEdges: "both",
    workflowPhase: "broken",
    sessionBreak: true,
    payload: "tokens",
    selectedId: GPU_NODE_ID,
  })),

  beat("v-model", 5, A5, "Model. Place the evidence on the spine.", "Understand", 30000, world({
    shot: "spine",
    ...FULL,
    station: "model",
    spineHighlight: true,
    knowledgeEdges: true,
    inspectionHop: true,
    jobBroken: true,
    edgeMetrics: true,
  })),

  beat("v-understand", 5, A5, "Understand. The degraded hop killed the network path. The GPU is innocent.", "Reason", 34000, world({
    shot: "incident",
    zoom: 1.2,
    focusX: 1180,
    focusY: 520,
    station: "understand",
    inspectionHop: true,
    blastKind: "path",
    jobBroken: true,
    edgeMetrics: true,
    selectedId: "inspect",
  })),

  beat("v-reason", 5, A5, "Reason. Blast radius of the hop — not the GPU.", "Act", 32000, world({
    shot: "agent",
    zoom: 1.15,
    focusX: 1120,
    focusY: 500,
    station: "reason",
    agentIntent: "grounded",
    blastKind: "inspect",
    inspectionHop: true,
    selectedId: "inspect",
  })),

  beat("v-act", 5, A5, "Act. Remove the hop. Leave the GPU.", "Verify", 28000, world({
    shot: "verify",
    zoom: 1.18,
    focusX: 1170,
    focusY: 520,
    station: "act",
    agentIntent: "grounded",
    blastKind: "inspect",
    inspectionHop: true,
    selectedId: "inspect",
  })),

  beat("v-verify", 5, A5, "Verify. Tokens, MCP, and A2A complete. Checkout and the copilot recovered.", SIG_SENSE, 32000, world({
    shot: "verify",
    ...FULL,
    station: "verify",
    verified: true,
    protocolEdges: "both",
    workflowPhase: "restored",
    sessionBreak: false,
    payload: "tokens",
    agentIntent: "grounded",
    selectedId: GPU_NODE_ID,
  })),

  beat("sense", 5, A5, SIG_SENSE, "Five commitments", 28000, world({
    shot: "loop",
    ...FULL,
    graphOpacity: 0.4,
    showSignature: true,
    verified: true,
    station: "verify",
  })),

  beat("commitments", 5, A5, "If you want autonomous IT, start building its understanding now.", GAGE_QUOTE, 28000, world({
    shot: "knowledge",
    ...FULL,
    commitments: true,
    verified: true,
    spineHighlight: true,
  })),

  beat("gage-return", 5, A5, GAGE_QUOTE, SIG_UNDERSTAND, 40000, world({
    shot: "quote",
    ...FULL,
    graphOpacity: 0.42,
    showQuote: true,
    verified: true,
  })),

  beat("understand-itself", 5, A5, SIG_UNDERSTAND, SIG_CLOSE, 40000, world({
    shot: "close",
    ...FULL,
    graphOpacity: 0.24,
    showSignature: true,
    verified: true,
  })),

  beat("final", 5, A5, SIG_CLOSE, SIG_ONUG, 40000, world({
    shot: "close",
    ...FULL,
    graphOpacity: 0.2,
    showSignature: true,
    verified: true,
  })),

  beat("final-onug", 5, A5, SIG_ONUG, AAPP, 35000, world({
    shot: "close",
    ...FULL,
    graphOpacity: 0.2,
    showSignature: true,
    verified: true,
  })),

  beat("appendix-library", 6, AAPP, APP_LIBRARY, PRE_FOODWEB, 14000, world({
    shot: "close",
    ...FULL,
    graphOpacity: 0.16,
  })),

  beat("soma-foodweb", 6, AAPP, PRE_FOODWEB, "Hold", 12000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaCompanion: 4,
    somaEarth: "food",
    somaRhyme: true,
    ...CAM_FOOD,
    showSignature: true,
  })),

  beat("appendix-hold", 6, AAPP, "", "Hold", 10000, world({
    shot: "soma",
    era: 0,
    graphOpacity: 0,
    somaCompanion: 4,
    somaEarth: "food",
    ...CAM_FOOD,
  })),
];

const ACTS: ActId[] = [-1, 0, 1, 2, 3, 4, 5, 6];

export const ACT_START: Record<ActId, number> = {
  [-1]: 0,
  0: BEATS.findIndex((b) => b.id === "period-sun"),
  1: BEATS.findIndex((b) => b.id === "lan"),
  2: BEATS.findIndex((b) => b.id === "token-open"),
  3: BEATS.findIndex((b) => b.id === "gpu-healthy"),
  4: BEATS.findIndex((b) => b.id === "facts-float"),
  5: BEATS.findIndex((b) => b.id === "need-a-model"),
  6: BEATS.findIndex((b) => b.id === "appendix-library"),
};

export const PRELUDE_MS = BEATS.filter((b) => b.act === -1).reduce((sum, b) => sum + b.durationMs, 0);
export const COLD_MS = BEATS.filter((b) => b.act === 0).reduce((sum, b) => sum + b.durationMs, 0);
export const SCAFFOLD_MS = BEATS.filter((b) => b.act === 1).reduce((sum, b) => sum + b.durationMs, 0);

export const CINEMA_TOTAL_MS = BEATS.filter((b) => b.act !== 6).reduce((sum, b) => sum + b.durationMs, 0);

export { ACTS, GAGE_ATTR, GAGE_QUOTE, INSCRIPTIONS, SUBTITLE, TITLE };
