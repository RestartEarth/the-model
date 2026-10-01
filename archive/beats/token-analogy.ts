/**
 * ARCHIVE — token analogy
 *
 * Tokens as packets, taught layer by layer. Reduced to one sentence (§7).
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
 * 7 beats: token-open, token-layers, token-wire, token-hop, token-talk, token-econ, token-agents
 */

  beat("token-open", 2, A2, TOK_OPEN, TOK_LAYERS, 12000, packetWorld(1, "token")),

  beat("token-layers", 2, A2, TOK_LAYERS, TOK_WIRE, 12000, packetWorld(4, "token")),

  beat("token-wire", 2, A2, TOK_WIRE, TOK_HOP, 10000, packetWorld(5, "token")),

  beat("token-hop", 2, A2, TOK_HOP, TOK_TALK, 11000, packetWorld(3, "token")),

  beat("token-talk", 2, A2, TOK_TALK, SIG_TOKEN_ECON, 11000, packetWorld(8, "token")),

  beat("token-econ", 2, A2, SIG_TOKEN_ECON, SIG_INFER_GW, 12000, packetWorld(14, "token")),

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
