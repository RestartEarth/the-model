/**
 * ARCHIVE — transaction fanout  ·  PARTIAL RECONSTRUCTION, NOT VERBATIM
 *
 * One prompt opening into a runtime dependency graph: inference deciding what
 * it needs, fanning out to retrieval and tools, one branch timing out, the
 * answer forming from whatever returned, and the reasoning spawning the next
 * transaction. It closed on "THE NETWORK IS PART OF THE INFERENCE."
 *
 * This group is the one real casualty of the recast. Unlike every other file
 * in `archive/beats/`, it does NOT exist verbatim anywhere:
 *
 *   - It was written for the intermediate 86-beat script that lived at
 *     `the-model demo/the-model/beats/script.ts`.
 *   - That file was overwritten by the recast before the repository had any
 *     commits, so there is no git object to recover it from.
 *   - The previous generation still on disk (`apps/keynote/`) predates it and
 *     has the `token-*` beats instead — see `token-analogy.ts`.
 *
 * What is below was reconstructed from a compact flag dump taken while
 * auditing the old script, so the ids, act, durations and world flags are
 * accurate, but the doc comments, `line`/`nextHint` wiring and anything past
 * the dump's 150-character cutoff are gone. Truncations are marked rather
 * than guessed. The dataset these drove (`graph/txn.ts` — the transaction
 * topology, `txnStage`, `txnResolved`, `txnTimeoutId`) is also gone; it would
 * have to be rebuilt, most plausibly on the pattern of
 * `graph/enterprise.ts`, which replaced it.
 *
 * Copy constants, recovered from the same audit:
 *
 *   TXN_OPEN    = "One prompt is not one transaction."
 *   TXN_INFER   = "Inference decides what it needs next."
 *   TXN_FANOUT  = "Reasoning creates a dependency graph at runtime."
 *   TXN_RAG     = (multi-line, not captured)
 *   TXN_FANIN   = "The answer depends on what returns."
 *   TXN_TIMEOUT = "Missing context can become false understanding."
 *   TXN_RECURSE = "Reasoning can create the next transaction."
 *   TXN_CLOSE   = "THE NETWORK IS PART OF THE INFERENCE."
 *
 * 8 beats: txn-open, txn-infer, txn-fanout, txn-rag, txn-fanin, txn-timeout,
 * txn-recurse, txn-close
 */

// prettier-ignore
export const ARCHIVED_TXN_BEATS = [
  { id: "txn-open", act: 2, durationMs: 12000, line: "TXN_OPEN",
    world: { shot: "agents", zoom: 3.0, focusX: 160, focusY: 760, txnStage: 1, showSignature: true } },

  { id: "txn-infer", act: 2, durationMs: 16000, line: "TXN_INFER",
    world: { shot: "agents", zoom: 1.9, focusX: 245, focusY: 760, txnStage: 2, selectedId: "txn-model" } },

  { id: "txn-fanout", act: 2, durationMs: 22000, line: "TXN_FANOUT",
    world: { shot: "agents", zoom: 1.15, focusX: 530, focusY: 725, txnStage: 3, showSignature: true } },

  { id: "txn-rag", act: 2, durationMs: 26000, line: "TXN_RAG",
    world: { shot: "agents", zoom: 1.9, focusX: 880, focusY: 845, txnStage: 4, selectedId: "txn-rag" } },

  { id: "txn-fanin", act: 2, durationMs: 24000, line: "TXN_FANIN",
    world: { shot: "agents", zoom: 1.2, focusX: 500, focusY: 760, txnStage: 4, txnResolved: 4,
             txnModel2: true, txnTimeoutId: "txn-onprem-b", txnTimedOut: false /* … truncated … */ } },

  { id: "txn-timeout", act: 2, durationMs: 16000, line: "TXN_TIMEOUT",
    world: { shot: "agents", zoom: 1.7, focusX: 950, focusY: 850, txnStage: 4, txnResolved: 4,
             txnTimeoutId: "txn-onprem-b", txnTimedOut: true, selectedId: "txn-onprem-b" /* … truncated … */ } },

  { id: "txn-recurse", act: 2, durationMs: 26000, line: "TXN_RECURSE",
    world: { shot: "agents", zoom: 1.15, focusX: 750, focusY: 650, txnStage: 5, txnResolved: 4,
             txnTimeoutId: "txn-onprem-b", txnTimedOut: true, showSignature: true /* … truncated … */ } },

  { id: "txn-close", act: 2, durationMs: 26000, line: "TXN_CLOSE",
    world: { shot: "agents", zoom: 1, focusX: 800, focusY: 450, txnStage: 5, txnResolved: 5, showSignature: true } },
]

/**
 * Other beats from the same lost script, recovered only as flag dumps. These
 * were AI-era beats on the Meridian fabric; the recast replaced all of them.
 */
// prettier-ignore
export const ARCHIVED_AI_ERA_BEATS = [
  { id: "agents-new-apps", durationMs: 11000,
    world: { shot: "agents", zoom: 1.1, focusX: 800, focusY: 400, protocolEdges: "none", payload: "tokens", showSignature: true } },

  { id: "agents-intelligence", durationMs: 11000,
    world: { shot: "agents", zoom: 1.1, focusX: 800, focusY: 400, protocolEdges: "none", payload: "tokens", showSignature: true } },

  { id: "ai-is-network", durationMs: 12000,
    world: { shot: "era", era: 9, zoom: 1, focusX: 800, focusY: 450, emphasizeEdges: true, payload: "tokens", showSignature: true, selectedId: "gpu-0" } },

  { id: "context-setup", durationMs: 26000,
    world: { shot: "era", era: 9, zoom: 1, focusX: 800, focusY: 450, emphasizeEdges: true, payload: "tokens", selectedId: "gpu-0" } },

  { id: "two-symptoms", durationMs: 22000,
    world: { shot: "pullback", era: 9, zoom: 1, focusX: 800, focusY: 450, graphOpacity: 1,
             jobBroken: true, checkoutDown: true, blast: true, selectedId: "gpu-0" } },

  { id: "token-attention", line: "Meaning depends on context.",
    world: { shot: "packet", packetLife: 15, packetKind: "token" } },
]
