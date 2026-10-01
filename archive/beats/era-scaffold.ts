/**
 * ARCHIVE — era scaffold
 *
 * The LAN-to-GPU build: each era of enterprise networking added in turn. Replaced by the logistics enterprise (§17).
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
 * 15 beats: lan, cloud, sdn, san, bus, everything-bytes, gpu-era, training, inference, ai-exposes, inscriptions, transition, new-entity, not-only-workload, sig-program
 */

  beat("lan", 1, A1, "From that scaffolding: a LAN.", "Internet", 22000, world({
    shot: "era",
    era: 2,
    zoom: 1.55,
    focusX: 520,
    focusY: 500,
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

  beat("sig-program", 2, A2, SIG_PROGRAM, "The GPU is healthy", 40000, world({
    shot: "ports",
    ...FULL,
    graphOpacity: 0.38,
    apiPorts: true,
    showSignature: true,
  })),
