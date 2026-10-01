/**
 * Deterministic incident reasoning — grounding + bounded traverse.
 * No live model. The blind agent and the grounded agent use the same primitives.
 */

import { computeAnswerGrounding } from "./grounding";
import { MERIDIAN_MORNING, TEXTBOOK_SOURCE } from "../content/copy";
import {
  CHECKOUT_NODE_ID,
  GPU_NODE_ID,
  INSPECT_NODE_ID,
  meridian,
} from "../graph/meridian";
import type { GraphEdge } from "../graph/traverse";
import { subgraphWithin } from "../graph/traverse";

export function textbookGrounding() {
  return computeAnswerGrounding(
    "BGP is a path-vector routing protocol used between autonomous systems. Kubernetes schedules containers. AWS provides a regional cloud fabric.",
    [{ text: TEXTBOOK_SOURCE }]
  );
}

export function morningBlindGrounding() {
  return computeAnswerGrounding(
    "Training job meridian-pretrain-7 stalled at 10:37 because an east-west elephant flow hash-polarized on ECMP after a security inspection hop was inserted at 10:29.",
    [{ text: TEXTBOOK_SOURCE }]
  );
}

export function morningGrounded() {
  return computeAnswerGrounding(
    "Training job meridian-pretrain-7 stalled at 10:37 because an east-west elephant flow hash-polarized on ECMP after a security inspection hop was inserted at 10:29. Checkout shares the cloud path. Restarting the GPU is the wrong blast radius.",
    [{ text: MERIDIAN_MORNING }]
  );
}

/** Wrong action: restart the GPU. Depth 3 reaches checkout. */
export function wrongBlast() {
  return subgraphWithin(meridian.edges, GPU_NODE_ID, 3);
}

/** Right action: remove or bypass the inspect hop. */
export function inspectBlast() {
  const extra: GraphEdge[] = [
    ...meridian.edges,
    { source: "k8s", target: INSPECT_NODE_ID, relationType: "path_to" },
    { source: INSPECT_NODE_ID, target: "rdma", relationType: "path_to" },
  ];
  return subgraphWithin(extra, INSPECT_NODE_ID, 1);
}

export function wrongBlastHitsCheckout(): boolean {
  return wrongBlast().nodeIds.has(CHECKOUT_NODE_ID);
}
