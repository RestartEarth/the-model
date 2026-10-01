/**
 * ARCHIVE — meridian incident
 *
 * The fictional outage: a GPU blamed, a path stalled, checkout degraded, and the replay that explained it. Cut whole (§4).
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
 * 19 beats: gpu-healthy, watermelon, jct, pullback, agents-runtime, replay-1037, agent-arrives, textbook, ask-1037, knows-nothing, acts-anyway, limiting, facts-float, spine-snap, shortcut, sa-then-c2, metrics, sig-perf, commitments
 */

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

  beat("metrics", 2, A2, "JCT, TTFT — pkt/s and tok/s on the same edges.", "GPU clusters", 28000, world({
    shot: "metrics",
    ...FULL,
    edgeMetrics: true,
    thickenTraining: true,
    payload: "tokens",
  })),

  beat("sig-perf", 2, A2, SIG_PERF, "Metrics on the edges", 26000, world({
    shot: "metrics",
    ...FULL,
    graphOpacity: 0.42,
    showSignature: true,
    thickenTraining: true,
    payload: "tokens",
  })),

  beat("commitments", 5, A5, "If you want autonomous IT, start building its understanding now.", GAGE_QUOTE, 28000, world({
    shot: "knowledge",
    ...FULL,
    commitments: true,
    verified: true,
    spineHighlight: true,
  })),
