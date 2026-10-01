/**
 * ARCHIVE — loop stations
 *
 * The two loop stations that merged: Model into Understand, Reason into Decide (§21).
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
 * 3 beats: v-model, v-reason, sense
 */

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

  beat("sense", 5, A5, SIG_SENSE, "Five commitments", 28000, world({
    shot: "loop",
    ...FULL,
    graphOpacity: 0.4,
    showSignature: true,
    verified: true,
    station: "verify",
  })),
