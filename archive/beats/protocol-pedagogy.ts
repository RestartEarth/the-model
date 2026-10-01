/**
 * ARCHIVE — protocol pedagogy
 *
 * MCP, A2A, the inference gateway and trace correlation, taught from the stage. Now visual edge labels only (§5).
 *
 * This file is not compiled and is not imported by anything. It sits outside
 * every tsconfig `include`, so it will not break a typecheck and will not be
 * bundled. It exists to be read and lifted from.
 *
 * The beats below are verbatim from the pre-recast script
 * (`apps/keynote/src/beats/script.ts`), including their original doc comments.
 * They reference the `WorldState` of that generation, which the current show
 * no longer has — see `archive/README.md` for what each group needs before it
 * can run again.
 *
 * 7 beats: inference-gw, mcp-a2a, api-ports, a2a-trust, both-traces, knowledge, talk-autonomy
 */

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

  beat("api-ports", 2, A2, "The fabric grew APIs — SDN, IaC, controllers, orchestration, intent.", SIG_PROGRAM, 32000, world({
    shot: "ports",
    ...FULL,
    apiPorts: true,
    emphasizeEdges: true,
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

  beat("knowledge", 4, A4, SIG_SPINE, "Federation", 50000, world({
    shot: "knowledge",
    ...FULL,
    spineHighlight: true,
    knowledgeEdges: true,
    factsSnap: true,
    showSignature: true,
    graphOpacity: 0.85,
  })),

  beat("talk-autonomy", 4, A4, SIG_AUTONOMY, SIG_NEED_MODEL, 36000, world({
    shot: "inscriptions",
    ...FULL,
    graphOpacity: 0.28,
    showSignature: true,
  })),
