/**
 * Prelude anatomy — one living body, disclosed layer by layer.
 * `era` on a node/edge is a disclosure layer, not phylogeny.
 * The organism is whole from the first silhouette; we only turn the lights on.
 * The figure stays fully absent until presence (era ≥ 1) — the cosmos/earth
 * beats before it are other networks, not a body preview. Presence densifies
 * the same body from there — it does not draw a second one.
 * Standing asterism (~8-head): head : torso : legs ≈ 1 : 3 : 4, shoulders
 * wider than hips, arms to mid-thigh. The brain is a two-hemisphere
 * constellation in the cranial vault — cortex hub in the mass — and gold
 * filaments leave through the brainstem, down a cervical cord, then branch
 * into the shoulders. Same thesis: the computer lives in the edges.
 *
 * The whole figure (nodes, edges, silhouette) is drawn at `BODY_SCALE` around
 * `BODY_ANCHOR` — smaller than its raw ~1:1 layout so it reads as a body
 * within the wider composed world (cosmos/earth/society) instead of a
 * screen-filling giant. The anchor sits at the original foot line (y 800,
 * just above `EARTH_HORIZON_Y` 828) rather than the world center, so the
 * feet stay planted on the ground as the figure shrinks — the head comes
 * down toward the feet, not the other way around. Detail beats (presence
 * through the autonomy loop) compensate with a tighter camera frame — see
 * the CAM_* boxes in beats/script.ts, scaled by the same factor — so no
 * anatomical detail is lost there; wide "pullback" shots simply show a
 * smaller body, which is the point. A handful of other tables key off
 * exact body landmarks (mouth, gut, feet, palms, crown) with their own
 * hardcoded copies of the pre-scale coordinates — `EARTH_MOUTH`,
 * `EARTH_GUT`, the `needsBody` entries in `WORLD_BRIDGES`, and `xj-mouth`
 * in `WORLD_JUNCTIONS` — those are scaled by hand to match.
 */

/** Cranial-vault center — culture and return packets attach here. */
export const BRAIN_CENTER = { x: 800, y: 440.3 }

/** World center — human stance; cosmos is a perfect circle around this point. */
export const WORLD_CENTER = { x: 800, y: 450 }

/** Outer cosmic ring. Large enough to enclose body, earth, society, markets, media, internet. */
export const COSMOS_CENTER = WORLD_CENTER
export const COSMOS_RADIUS = 920
export const COSMOS_STAR_COUNT = 24
export const COSMOS_GALAXY_COUNT = 6

export function cosmosPoint(
  index: number,
  count = COSMOS_STAR_COUNT,
  radius = COSMOS_RADIUS
) {
  const a = -Math.PI / 2 + (index / count) * Math.PI * 2
  return {
    x: COSMOS_CENTER.x + Math.cos(a) * radius,
    y: COSMOS_CENTER.y + Math.sin(a) * radius,
  }
}

function cosmosMid(i: number, j: number, inset = 0.96) {
  const a0 = -Math.PI / 2 + (i / COSMOS_STAR_COUNT) * Math.PI * 2
  const a1 = -Math.PI / 2 + (j / COSMOS_STAR_COUNT) * Math.PI * 2
  let a = (a0 + a1) / 2
  if (Math.abs(a1 - a0) > Math.PI) a += Math.PI
  return {
    x: COSMOS_CENTER.x + Math.cos(a) * COSMOS_RADIUS * inset,
    y: COSMOS_CENTER.y + Math.sin(a) * COSMOS_RADIUS * inset,
  }
}

export type SomaEra = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type SomaKind =
  | "bone"
  | "muscle"
  | "organ"
  | "gland"
  | "lymph"
  | "energy"
  | "brain"
  | "sense"
  | "motor"
export type SomaEdgeKind =
  | "bone"
  | "muscle"
  | "blood"
  | "vein"
  | "hormone"
  | "lymph"
  | "energy"
  | "nerve"
  | "sense"
  | "motor"

export interface SomaNode {
  id: string
  label: string
  x: number
  y: number
  rx: number
  ry: number
  kind: SomaKind
  /** Disclosure layer that first reveals this node. */
  era: SomaEra
}

export interface SomaEdge {
  source: string
  target: string
  kind: SomaEdgeKind
  era: SomaEra
  /** Quadratic control point. */
  cx: number
  cy: number
}

/** Palms stay put — social / trade filaments attach here. */
const PALM_L = { x: 572, y: 558 }
const PALM_R = { x: 1028, y: 558 }

/**
 * Five-finger bone asterism. Four digits parent from the palm; the thumb
 * parents from the wrist and aims at the midline (thumbs toward the body).
 * Offsets are (outward, down) from the palm so left/right stay sided.
 * Knuckle + tip so the fan reads at stage distance — not a three-star scribble.
 */
const HAND_FINGERS = [
  { id: "thumb", parent: "wrist" as const, knuckle: [-16, 14], tip: [-38, 28] },
  { id: "index", parent: "palm" as const, knuckle: [3, 24], tip: [6, 62] },
  { id: "middle", parent: "palm" as const, knuckle: [11, 26], tip: [16, 70] },
  { id: "ring", parent: "palm" as const, knuckle: [18, 22], tip: [26, 58] },
  { id: "pinky", parent: "palm" as const, knuckle: [24, 14], tip: [32, 42] },
] as const

export function isSomaHandFinger(id: string) {
  return /^hand-[lr]-(thumb|index|middle|ring|pinky)(-tip)?$/.test(id)
}

/** Landmark stars of the faint figure — on from beat 0, densify at presence. */
export const WHISPER_STAR_IDS = [
  "crown",
  "temple-l",
  "temple-r",
  "skull",
  "jaw-l",
  "jaw-r",
  "jaw",
  "neck-l",
  "neck-r",
  "neck",
  "shoulder-l",
  "shoulder-r",
  "thorax",
  "rib-l",
  "rib-r",
  "spine-mid",
  "elbow-l",
  "elbow-r",
  "pelvis",
  "hip-l",
  "hip-r",
  "wrist-l",
  "wrist-r",
  "knee-l",
  "knee-r",
  "ankle-l",
  "ankle-r",
  "hand-l",
  "hand-r",
  "foot-l",
  "foot-r",
] as const

export function isWhisperStar(id: string) {
  return (WHISPER_STAR_IDS as readonly string[]).includes(id)
}

function handFingerGraph(): { nodes: SomaNode[]; edges: SomaEdge[] } {
  const nodes: SomaNode[] = []
  const edges: SomaEdge[] = []
  for (const side of ["l", "r"] as const) {
    const out = side === "l" ? -1 : 1
    const palm = side === "l" ? PALM_L : PALM_R
    const wristId = `wrist-${side}`
    const palmId = `hand-${side}`
    for (const f of HAND_FINGERS) {
      const knuckleId = `hand-${side}-${f.id}`
      const tipId = `hand-${side}-${f.id}-tip`
      const kx = palm.x + out * f.knuckle[0]
      const ky = palm.y + f.knuckle[1]
      const tx = palm.x + out * f.tip[0]
      const ty = palm.y + f.tip[1]
      nodes.push(
        {
          id: knuckleId,
          label: "",
          x: kx,
          y: ky,
          rx: 1.8,
          ry: 1.8,
          kind: "bone",
          era: 3,
        },
        {
          id: tipId,
          label: "",
          x: tx,
          y: ty,
          rx: 2.0,
          ry: 2.0,
          kind: "bone",
          era: 3,
        }
      )
      const parentId = f.parent === "wrist" ? wristId : palmId
      const parent = f.parent === "wrist" ? somaWrist(side) : palm
      edges.push(
        {
          source: parentId,
          target: knuckleId,
          kind: "bone",
          era: 3,
          cx: (parent.x + kx) / 2 + out * (f.parent === "wrist" ? 6 : 3),
          cy: (parent.y + ky) / 2 + (f.parent === "wrist" ? 4 : 2),
        },
        {
          source: knuckleId,
          target: tipId,
          kind: "bone",
          era: 3,
          cx: (kx + tx) / 2 + out * 4,
          cy: (ky + ty) / 2 + 2,
        }
      )
    }
  }
  return { nodes, edges }
}

function somaWrist(side: "l" | "r") {
  return side === "l" ? { x: 586, y: 528 } : { x: 1014, y: 528 }
}

const HAND_FINGER_GRAPH = handFingerGraph()

/** Shrinks body-only tables toward the foot line — see the file-header note. */
export const BODY_SCALE = 0.55
export const BODY_ANCHOR = { x: WORLD_CENTER.x, y: 800 }
function bx(x: number) {
  return BODY_ANCHOR.x + (x - BODY_ANCHOR.x) * BODY_SCALE
}
function by(y: number) {
  return BODY_ANCHOR.y + (y - BODY_ANCHOR.y) * BODY_SCALE
}

const SOMA_NODES_RAW: SomaNode[] = [
  {
    id: "crown",
    label: "",
    x: 800,
    y: 108,
    rx: 2.6,
    ry: 2.6,
    kind: "bone",
    era: 1,
  },
  {
    id: "temple-l",
    label: "",
    x: 748,
    y: 144,
    rx: 2.1,
    ry: 2.1,
    kind: "bone",
    era: 1,
  },
  {
    id: "temple-r",
    label: "",
    x: 852,
    y: 144,
    rx: 2.1,
    ry: 2.1,
    kind: "bone",
    era: 1,
  },
  {
    id: "skull",
    label: "skull",
    x: 800,
    y: 158,
    rx: 2.8,
    ry: 2.6,
    kind: "bone",
    era: 1,
  },
  {
    id: "jaw-l",
    label: "",
    x: 768,
    y: 198,
    rx: 1.9,
    ry: 1.8,
    kind: "bone",
    era: 1,
  },
  {
    id: "jaw-r",
    label: "",
    x: 832,
    y: 198,
    rx: 1.9,
    ry: 1.8,
    kind: "bone",
    era: 1,
  },
  {
    id: "jaw",
    label: "",
    x: 800,
    y: 210,
    rx: 2.0,
    ry: 2.0,
    kind: "bone",
    era: 1,
  },
  {
    id: "neck-l",
    label: "",
    x: 782,
    y: 226,
    rx: 2.0,
    ry: 1.9,
    kind: "bone",
    era: 1,
  },
  {
    id: "neck-r",
    label: "",
    x: 818,
    y: 226,
    rx: 2.0,
    ry: 1.9,
    kind: "bone",
    era: 1,
  },
  {
    id: "neck",
    label: "spine",
    x: 800,
    y: 228,
    rx: 2.4,
    ry: 2.6,
    kind: "bone",
    era: 1,
  },
  {
    id: "shoulder-l",
    label: "",
    x: 650,
    y: 234,
    rx: 2.6,
    ry: 2.4,
    kind: "bone",
    era: 1,
  },
  {
    id: "shoulder-r",
    label: "",
    x: 950,
    y: 234,
    rx: 2.6,
    ry: 2.4,
    kind: "bone",
    era: 1,
  },
  {
    id: "thorax",
    label: "rib",
    x: 800,
    y: 312,
    rx: 3.0,
    ry: 2.6,
    kind: "bone",
    era: 1,
  },
  {
    id: "rib-l",
    label: "",
    x: 722,
    y: 308,
    rx: 2.0,
    ry: 1.8,
    kind: "bone",
    era: 1,
  },
  {
    id: "rib-r",
    label: "",
    x: 878,
    y: 308,
    rx: 2.0,
    ry: 1.8,
    kind: "bone",
    era: 1,
  },
  {
    id: "rib-l2",
    label: "",
    x: 734,
    y: 348,
    rx: 1.7,
    ry: 1.6,
    kind: "bone",
    era: 1,
  },
  {
    id: "rib-r2",
    label: "",
    x: 866,
    y: 348,
    rx: 1.7,
    ry: 1.6,
    kind: "bone",
    era: 1,
  },
  {
    id: "rib-l0",
    label: "",
    x: 740,
    y: 278,
    rx: 1.6,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "rib-r0",
    label: "",
    x: 860,
    y: 278,
    rx: 1.6,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "rib-l3",
    label: "",
    x: 748,
    y: 378,
    rx: 1.55,
    ry: 1.45,
    kind: "bone",
    era: 3,
  },
  {
    id: "rib-r3",
    label: "",
    x: 852,
    y: 378,
    rx: 1.55,
    ry: 1.45,
    kind: "bone",
    era: 3,
  },
  {
    id: "clavicle-l",
    label: "",
    x: 720,
    y: 226,
    rx: 1.7,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "clavicle-r",
    label: "",
    x: 880,
    y: 226,
    rx: 1.7,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "sternum",
    label: "",
    x: 800,
    y: 280,
    rx: 1.9,
    ry: 1.7,
    kind: "bone",
    era: 3,
  },
  {
    id: "scapula-l",
    label: "",
    x: 668,
    y: 268,
    rx: 1.7,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "scapula-r",
    label: "",
    x: 932,
    y: 268,
    rx: 1.7,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "humerus-l",
    label: "",
    x: 628,
    y: 316,
    rx: 1.7,
    ry: 1.6,
    kind: "bone",
    era: 3,
  },
  {
    id: "humerus-r",
    label: "",
    x: 972,
    y: 316,
    rx: 1.7,
    ry: 1.6,
    kind: "bone",
    era: 3,
  },
  {
    id: "radius-l",
    label: "",
    x: 596,
    y: 462,
    rx: 1.55,
    ry: 1.45,
    kind: "bone",
    era: 3,
  },
  {
    id: "radius-r",
    label: "",
    x: 1004,
    y: 462,
    rx: 1.55,
    ry: 1.45,
    kind: "bone",
    era: 3,
  },
  {
    id: "sacrum",
    label: "",
    x: 800,
    y: 452,
    rx: 2.0,
    ry: 1.7,
    kind: "bone",
    era: 3,
  },
  {
    id: "iliac-l",
    label: "",
    x: 758,
    y: 458,
    rx: 1.8,
    ry: 1.6,
    kind: "bone",
    era: 3,
  },
  {
    id: "iliac-r",
    label: "",
    x: 842,
    y: 458,
    rx: 1.8,
    ry: 1.6,
    kind: "bone",
    era: 3,
  },
  {
    id: "femur-l",
    label: "",
    x: 730,
    y: 568,
    rx: 1.8,
    ry: 1.6,
    kind: "bone",
    era: 3,
  },
  {
    id: "femur-r",
    label: "",
    x: 870,
    y: 568,
    rx: 1.8,
    ry: 1.6,
    kind: "bone",
    era: 3,
  },
  {
    id: "tibia-l",
    label: "",
    x: 724,
    y: 694,
    rx: 1.6,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "tibia-r",
    label: "",
    x: 876,
    y: 694,
    rx: 1.6,
    ry: 1.5,
    kind: "bone",
    era: 3,
  },
  {
    id: "spine-mid",
    label: "",
    x: 800,
    y: 392,
    rx: 2.2,
    ry: 2.2,
    kind: "bone",
    era: 1,
  },
  {
    id: "elbow-l",
    label: "",
    x: 608,
    y: 396,
    rx: 2.2,
    ry: 2.2,
    kind: "bone",
    era: 1,
  },
  {
    id: "elbow-r",
    label: "",
    x: 992,
    y: 396,
    rx: 2.2,
    ry: 2.2,
    kind: "bone",
    era: 1,
  },
  {
    id: "pelvis",
    label: "pelvis",
    x: 800,
    y: 476,
    rx: 3.0,
    ry: 2.4,
    kind: "bone",
    era: 1,
  },
  {
    id: "hip-l",
    label: "",
    x: 736,
    y: 498,
    rx: 2.4,
    ry: 2.2,
    kind: "bone",
    era: 1,
  },
  {
    id: "hip-r",
    label: "",
    x: 864,
    y: 498,
    rx: 2.4,
    ry: 2.2,
    kind: "bone",
    era: 1,
  },
  {
    id: "wrist-l",
    label: "",
    x: 586,
    y: 528,
    rx: 2.0,
    ry: 2.0,
    kind: "bone",
    era: 1,
  },
  {
    id: "wrist-r",
    label: "",
    x: 1014,
    y: 528,
    rx: 2.0,
    ry: 2.0,
    kind: "bone",
    era: 1,
  },
  {
    id: "knee-l",
    label: "",
    x: 726,
    y: 638,
    rx: 2.4,
    ry: 2.2,
    kind: "bone",
    era: 1,
  },
  {
    id: "knee-r",
    label: "",
    x: 874,
    y: 638,
    rx: 2.4,
    ry: 2.2,
    kind: "bone",
    era: 1,
  },
  {
    id: "ankle-l",
    label: "",
    x: 722,
    y: 752,
    rx: 2.0,
    ry: 1.8,
    kind: "bone",
    era: 1,
  },
  {
    id: "ankle-r",
    label: "",
    x: 878,
    y: 752,
    rx: 2.0,
    ry: 1.8,
    kind: "bone",
    era: 1,
  },

  {
    id: "hand-l",
    label: "hand",
    x: PALM_L.x,
    y: PALM_L.y,
    rx: 2.4,
    ry: 2.2,
    kind: "motor",
    era: 1,
  },
  {
    id: "hand-r",
    label: "hand",
    x: PALM_R.x,
    y: PALM_R.y,
    rx: 2.4,
    ry: 2.2,
    kind: "motor",
    era: 1,
  },
  ...HAND_FINGER_GRAPH.nodes,
  {
    id: "foot-l",
    label: "stand",
    x: 718,
    y: 800,
    rx: 2.4,
    ry: 2.2,
    kind: "motor",
    era: 1,
  },
  {
    id: "foot-l-a",
    label: "",
    x: 700,
    y: 808,
    rx: 1.6,
    ry: 1.5,
    kind: "motor",
    era: 1,
  },
  {
    id: "foot-l-b",
    label: "",
    x: 730,
    y: 814,
    rx: 1.5,
    ry: 1.5,
    kind: "motor",
    era: 1,
  },
  {
    id: "foot-r",
    label: "stand",
    x: 882,
    y: 800,
    rx: 2.4,
    ry: 2.2,
    kind: "motor",
    era: 1,
  },
  {
    id: "foot-r-a",
    label: "",
    x: 900,
    y: 808,
    rx: 1.6,
    ry: 1.5,
    kind: "motor",
    era: 1,
  },
  {
    id: "foot-r-b",
    label: "",
    x: 870,
    y: 814,
    rx: 1.5,
    ry: 1.5,
    kind: "motor",
    era: 1,
  },

  {
    id: "m-deltoid-l",
    label: "",
    x: 638,
    y: 250,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-deltoid-r",
    label: "",
    x: 962,
    y: 250,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-bicep-l",
    label: "",
    x: 598,
    y: 340,
    rx: 1.45,
    ry: 1.35,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-bicep-r",
    label: "",
    x: 1002,
    y: 340,
    rx: 1.45,
    ry: 1.35,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-forearm-l",
    label: "",
    x: 574,
    y: 470,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-forearm-r",
    label: "",
    x: 1026,
    y: 470,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-pec-l",
    label: "",
    x: 748,
    y: 300,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-pec-r",
    label: "",
    x: 852,
    y: 300,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-oblique-l",
    label: "",
    x: 748,
    y: 400,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-oblique-r",
    label: "",
    x: 852,
    y: 400,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-glute-l",
    label: "",
    x: 748,
    y: 500,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-glute-r",
    label: "",
    x: 852,
    y: 500,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-quad-l",
    label: "",
    x: 708,
    y: 568,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-quad-r",
    label: "",
    x: 892,
    y: 568,
    rx: 1.5,
    ry: 1.4,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-ham-l",
    label: "",
    x: 748,
    y: 580,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-ham-r",
    label: "",
    x: 852,
    y: 580,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-calf-l",
    label: "",
    x: 704,
    y: 700,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },
  {
    id: "m-calf-r",
    label: "",
    x: 896,
    y: 700,
    rx: 1.4,
    ry: 1.3,
    kind: "muscle",
    era: 3,
  },

  {
    id: "heart",
    label: "heart",
    x: 772,
    y: 318,
    rx: 3.2,
    ry: 2.8,
    kind: "organ",
    era: 4,
  },
  {
    id: "heart-a",
    label: "",
    x: 756,
    y: 304,
    rx: 1.8,
    ry: 1.8,
    kind: "organ",
    era: 4,
  },
  {
    id: "heart-b",
    label: "",
    x: 786,
    y: 308,
    rx: 1.8,
    ry: 1.8,
    kind: "organ",
    era: 4,
  },
  {
    id: "aortic-arch",
    label: "",
    x: 790,
    y: 290,
    rx: 1.7,
    ry: 1.6,
    kind: "organ",
    era: 4,
  },
  {
    id: "aorta",
    label: "",
    x: 800,
    y: 340,
    rx: 1.8,
    ry: 1.6,
    kind: "organ",
    era: 4,
  },
  {
    id: "cava",
    label: "",
    x: 808,
    y: 360,
    rx: 1.6,
    ry: 1.5,
    kind: "organ",
    era: 4,
  },
  {
    id: "carotid-l",
    label: "",
    x: 782,
    y: 230,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "carotid-r",
    label: "",
    x: 818,
    y: 230,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "jugular-l",
    label: "",
    x: 790,
    y: 210,
    rx: 1.4,
    ry: 1.3,
    kind: "organ",
    era: 4,
  },
  {
    id: "jugular-r",
    label: "",
    x: 810,
    y: 210,
    rx: 1.4,
    ry: 1.3,
    kind: "organ",
    era: 4,
  },
  {
    id: "subclavian-l",
    label: "",
    x: 700,
    y: 250,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "subclavian-r",
    label: "",
    x: 900,
    y: 250,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "brachial-l",
    label: "",
    x: 620,
    y: 380,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "brachial-r",
    label: "",
    x: 980,
    y: 380,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "radial-l",
    label: "",
    x: 590,
    y: 500,
    rx: 1.4,
    ry: 1.3,
    kind: "organ",
    era: 4,
  },
  {
    id: "radial-r",
    label: "",
    x: 1010,
    y: 500,
    rx: 1.4,
    ry: 1.3,
    kind: "organ",
    era: 4,
  },
  {
    id: "iliac-a-l",
    label: "",
    x: 770,
    y: 500,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "iliac-a-r",
    label: "",
    x: 830,
    y: 500,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "femoral-l",
    label: "",
    x: 732,
    y: 580,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "femoral-r",
    label: "",
    x: 868,
    y: 580,
    rx: 1.5,
    ry: 1.4,
    kind: "organ",
    era: 4,
  },
  {
    id: "popliteal-l",
    label: "",
    x: 728,
    y: 640,
    rx: 1.4,
    ry: 1.3,
    kind: "organ",
    era: 4,
  },
  {
    id: "popliteal-r",
    label: "",
    x: 872,
    y: 640,
    rx: 1.4,
    ry: 1.3,
    kind: "organ",
    era: 4,
  },

  {
    id: "lung-l",
    label: "lung",
    x: 728,
    y: 298,
    rx: 2.8,
    ry: 2.4,
    kind: "organ",
    era: 5,
  },
  {
    id: "lung-l-a",
    label: "",
    x: 712,
    y: 284,
    rx: 1.6,
    ry: 1.6,
    kind: "organ",
    era: 5,
  },
  {
    id: "lung-l-b",
    label: "",
    x: 720,
    y: 318,
    rx: 1.5,
    ry: 1.5,
    kind: "organ",
    era: 5,
  },
  {
    id: "lung-r",
    label: "lung",
    x: 872,
    y: 298,
    rx: 2.8,
    ry: 2.4,
    kind: "organ",
    era: 5,
  },
  {
    id: "lung-r-a",
    label: "",
    x: 888,
    y: 284,
    rx: 1.6,
    ry: 1.6,
    kind: "organ",
    era: 5,
  },
  {
    id: "lung-r-b",
    label: "",
    x: 880,
    y: 318,
    rx: 1.5,
    ry: 1.5,
    kind: "organ",
    era: 5,
  },
  {
    id: "liver",
    label: "liver",
    x: 736,
    y: 398,
    rx: 2.6,
    ry: 2.2,
    kind: "organ",
    era: 5,
  },
  {
    id: "gut",
    label: "gut",
    x: 808,
    y: 448,
    rx: 2.8,
    ry: 2.4,
    kind: "organ",
    era: 5,
  },
  {
    id: "gut-a",
    label: "",
    x: 788,
    y: 434,
    rx: 1.5,
    ry: 1.5,
    kind: "organ",
    era: 5,
  },
  {
    id: "gut-b",
    label: "",
    x: 826,
    y: 460,
    rx: 1.5,
    ry: 1.5,
    kind: "organ",
    era: 5,
  },
  {
    id: "kidney-l",
    label: "kidney",
    x: 754,
    y: 428,
    rx: 2.0,
    ry: 1.8,
    kind: "organ",
    era: 5,
  },
  {
    id: "kidney-r",
    label: "kidney",
    x: 846,
    y: 428,
    rx: 2.0,
    ry: 1.8,
    kind: "organ",
    era: 5,
  },

  {
    id: "pituitary",
    label: "pituitary",
    x: 800,
    y: 184,
    rx: 2.0,
    ry: 1.8,
    kind: "gland",
    era: 4,
  },
  {
    id: "thyroid",
    label: "thyroid",
    x: 800,
    y: 228,
    rx: 2.2,
    ry: 1.8,
    kind: "gland",
    era: 4,
  },
  {
    id: "adrenal-l",
    label: "adrenal",
    x: 744,
    y: 412,
    rx: 1.8,
    ry: 1.6,
    kind: "gland",
    era: 4,
  },
  {
    id: "adrenal-r",
    label: "adrenal",
    x: 856,
    y: 412,
    rx: 1.8,
    ry: 1.6,
    kind: "gland",
    era: 4,
  },
  {
    id: "pancreas",
    label: "pancreas",
    x: 800,
    y: 418,
    rx: 2.2,
    ry: 1.8,
    kind: "gland",
    era: 4,
  },

  {
    id: "lymph-cerv-l",
    label: "",
    x: 768,
    y: 226,
    rx: 1.7,
    ry: 1.6,
    kind: "lymph",
    era: 6,
  },
  {
    id: "lymph-cerv-r",
    label: "",
    x: 832,
    y: 226,
    rx: 1.7,
    ry: 1.6,
    kind: "lymph",
    era: 6,
  },
  {
    id: "lymph-ax-l",
    label: "",
    x: 636,
    y: 256,
    rx: 1.85,
    ry: 1.7,
    kind: "lymph",
    era: 6,
  },
  {
    id: "lymph-ax-r",
    label: "",
    x: 964,
    y: 256,
    rx: 1.85,
    ry: 1.7,
    kind: "lymph",
    era: 6,
  },
  {
    id: "lymph-ing-l",
    label: "",
    x: 748,
    y: 512,
    rx: 1.85,
    ry: 1.7,
    kind: "lymph",
    era: 6,
  },
  {
    id: "lymph-ing-r",
    label: "",
    x: 852,
    y: 512,
    rx: 1.85,
    ry: 1.7,
    kind: "lymph",
    era: 6,
  },
  {
    id: "lymph-duct",
    label: "",
    x: 788,
    y: 350,
    rx: 1.6,
    ry: 1.5,
    kind: "lymph",
    era: 6,
  },
  {
    id: "lymph-cisterna",
    label: "",
    x: 800,
    y: 440,
    rx: 1.8,
    ry: 1.6,
    kind: "lymph",
    era: 6,
  },

  /** Midline energy centers — on the existing figure, not a second body. */
  {
    id: "chakra-root",
    label: "",
    x: 800,
    y: 476,
    rx: 2.8,
    ry: 2.6,
    kind: "energy",
    era: 2,
  },
  {
    id: "chakra-sacral",
    label: "",
    x: 800,
    y: 452,
    rx: 2.6,
    ry: 2.4,
    kind: "energy",
    era: 2,
  },
  {
    id: "chakra-solar",
    label: "",
    x: 800,
    y: 392,
    rx: 2.7,
    ry: 2.5,
    kind: "energy",
    era: 2,
  },
  {
    id: "chakra-heart",
    label: "",
    x: 800,
    y: 312,
    rx: 2.9,
    ry: 2.6,
    kind: "energy",
    era: 2,
  },
  {
    id: "chakra-throat",
    label: "",
    x: 800,
    y: 228,
    rx: 2.6,
    ry: 2.4,
    kind: "energy",
    era: 2,
  },
  {
    id: "chakra-brow",
    label: "",
    x: 800,
    y: 146,
    rx: 2.6,
    ry: 2.4,
    kind: "energy",
    era: 2,
  },
  {
    id: "chakra-crown",
    label: "",
    x: 800,
    y: 108,
    rx: 3.0,
    ry: 2.8,
    kind: "energy",
    era: 2,
  },

  {
    id: "brain",
    label: "brain",
    x: 800,
    y: 146,
    rx: 4.4,
    ry: 3.8,
    kind: "brain",
    era: 7,
  },
  {
    id: "cortex-l",
    label: "",
    x: 768,
    y: 126,
    rx: 2.4,
    ry: 2.2,
    kind: "brain",
    era: 7,
  },
  {
    id: "cortex-r",
    label: "",
    x: 832,
    y: 126,
    rx: 2.4,
    ry: 2.2,
    kind: "brain",
    era: 7,
  },
  {
    id: "cortex-l2",
    label: "",
    x: 746,
    y: 148,
    rx: 2.1,
    ry: 2.0,
    kind: "brain",
    era: 7,
  },
  {
    id: "cortex-r2",
    label: "",
    x: 854,
    y: 148,
    rx: 2.1,
    ry: 2.0,
    kind: "brain",
    era: 7,
  },
  {
    id: "cortex-l3",
    label: "",
    x: 760,
    y: 168,
    rx: 2.0,
    ry: 1.9,
    kind: "brain",
    era: 7,
  },
  {
    id: "cortex-r3",
    label: "",
    x: 840,
    y: 168,
    rx: 2.0,
    ry: 1.9,
    kind: "brain",
    era: 7,
  },
  {
    id: "stem",
    label: "cord",
    x: 800,
    y: 176,
    rx: 2.4,
    ry: 2.6,
    kind: "brain",
    era: 7,
  },
  {
    id: "cerv-1",
    label: "",
    x: 800,
    y: 194,
    rx: 1.8,
    ry: 1.7,
    kind: "brain",
    era: 7,
  },
  {
    id: "cerv-2",
    label: "",
    x: 800,
    y: 212,
    rx: 1.8,
    ry: 1.7,
    kind: "brain",
    era: 7,
  },
  {
    id: "cerv-3",
    label: "",
    x: 800,
    y: 228,
    rx: 1.9,
    ry: 1.8,
    kind: "brain",
    era: 7,
  },
  {
    id: "cerv-4",
    label: "",
    x: 800,
    y: 246,
    rx: 1.8,
    ry: 1.7,
    kind: "brain",
    era: 7,
  },
  {
    id: "plexus-root-l",
    label: "",
    x: 786,
    y: 248,
    rx: 1.6,
    ry: 1.5,
    kind: "brain",
    era: 7,
  },
  {
    id: "plexus-root-r",
    label: "",
    x: 814,
    y: 248,
    rx: 1.6,
    ry: 1.5,
    kind: "brain",
    era: 7,
  },
  {
    id: "plexus-br-l",
    label: "",
    x: 708,
    y: 246,
    rx: 1.7,
    ry: 1.6,
    kind: "brain",
    era: 7,
  },
  {
    id: "plexus-br-r",
    label: "",
    x: 892,
    y: 246,
    rx: 1.7,
    ry: 1.6,
    kind: "brain",
    era: 7,
  },
  {
    id: "plexus-lumbar",
    label: "",
    x: 800,
    y: 430,
    rx: 1.8,
    ry: 1.6,
    kind: "brain",
    era: 7,
  },
  {
    id: "n-elbow-l",
    label: "",
    x: 600,
    y: 400,
    rx: 1.5,
    ry: 1.4,
    kind: "brain",
    era: 7,
  },
  {
    id: "n-elbow-r",
    label: "",
    x: 1000,
    y: 400,
    rx: 1.5,
    ry: 1.4,
    kind: "brain",
    era: 7,
  },
  {
    id: "n-knee-l",
    label: "",
    x: 718,
    y: 642,
    rx: 1.5,
    ry: 1.4,
    kind: "brain",
    era: 7,
  },
  {
    id: "n-knee-r",
    label: "",
    x: 882,
    y: 642,
    rx: 1.5,
    ry: 1.4,
    kind: "brain",
    era: 7,
  },

  {
    id: "eye",
    label: "vision",
    x: 778,
    y: 160,
    rx: 2.2,
    ry: 1.8,
    kind: "sense",
    era: 8,
  },
  {
    id: "eye-r",
    label: "",
    x: 822,
    y: 160,
    rx: 2.2,
    ry: 1.8,
    kind: "sense",
    era: 8,
  },
  {
    id: "ear-l",
    label: "hearing",
    x: 736,
    y: 162,
    rx: 1.8,
    ry: 2.0,
    kind: "sense",
    era: 8,
  },
  {
    id: "ear-r",
    label: "",
    x: 864,
    y: 162,
    rx: 1.8,
    ry: 2.0,
    kind: "sense",
    era: 8,
  },
  {
    id: "nose",
    label: "smell",
    x: 800,
    y: 180,
    rx: 2.0,
    ry: 1.8,
    kind: "sense",
    era: 8,
  },
  {
    id: "mouth",
    label: "taste",
    x: 800,
    y: 208,
    rx: 2.1,
    ry: 1.8,
    kind: "sense",
    era: 8,
  },
  {
    id: "skin",
    label: "touch",
    x: 628,
    y: 268,
    rx: 2.0,
    ry: 1.8,
    kind: "sense",
    era: 8,
  },
  {
    id: "skin-r",
    label: "",
    x: 972,
    y: 268,
    rx: 2.0,
    ry: 1.8,
    kind: "sense",
    era: 8,
  },
  {
    id: "inner",
    label: "",
    x: 786,
    y: 368,
    rx: 2.2,
    ry: 2.0,
    kind: "sense",
    era: 8,
  },

  {
    id: "fold-l",
    label: "",
    x: 764,
    y: 170,
    rx: 1.8,
    ry: 1.8,
    kind: "brain",
    era: 8,
  },
  {
    id: "fold-r",
    label: "",
    x: 836,
    y: 170,
    rx: 1.8,
    ry: 1.8,
    kind: "brain",
    era: 8,
  },
  {
    id: "pole-l",
    label: "",
    x: 736,
    y: 132,
    rx: 1.7,
    ry: 1.7,
    kind: "brain",
    era: 8,
  },
  {
    id: "pole-r",
    label: "",
    x: 864,
    y: 132,
    rx: 1.7,
    ry: 1.7,
    kind: "brain",
    era: 8,
  },
  {
    id: "gyrus-l",
    label: "",
    x: 776,
    y: 152,
    rx: 1.8,
    ry: 1.8,
    kind: "brain",
    era: 8,
  },
  {
    id: "gyrus-r",
    label: "",
    x: 824,
    y: 152,
    rx: 1.8,
    ry: 1.8,
    kind: "brain",
    era: 8,
  },
]

export const SOMA_NODES: SomaNode[] = SOMA_NODES_RAW.map((n) => ({
  ...n,
  x: bx(n.x),
  y: by(n.y),
}))

const SOMA_EDGES_RAW: SomaEdge[] = [
  {
    source: "crown",
    target: "temple-l",
    kind: "bone",
    era: 3,
    cx: 768,
    cy: 114,
  },
  {
    source: "crown",
    target: "temple-r",
    kind: "bone",
    era: 3,
    cx: 832,
    cy: 114,
  },
  { source: "crown", target: "skull", kind: "bone", era: 3, cx: 800, cy: 132 },
  {
    source: "temple-l",
    target: "skull",
    kind: "bone",
    era: 3,
    cx: 764,
    cy: 154,
  },
  {
    source: "temple-r",
    target: "skull",
    kind: "bone",
    era: 3,
    cx: 836,
    cy: 154,
  },
  {
    source: "temple-l",
    target: "jaw-l",
    kind: "bone",
    era: 3,
    cx: 752,
    cy: 174,
  },
  {
    source: "temple-r",
    target: "jaw-r",
    kind: "bone",
    era: 3,
    cx: 848,
    cy: 174,
  },
  { source: "skull", target: "jaw-l", kind: "bone", era: 3, cx: 780, cy: 180 },
  { source: "skull", target: "jaw-r", kind: "bone", era: 3, cx: 820, cy: 180 },
  { source: "jaw-l", target: "jaw", kind: "bone", era: 3, cx: 780, cy: 206 },
  { source: "jaw-r", target: "jaw", kind: "bone", era: 3, cx: 820, cy: 206 },
  { source: "jaw", target: "neck", kind: "bone", era: 3, cx: 800, cy: 218 },
  { source: "jaw-l", target: "neck-l", kind: "bone", era: 3, cx: 772, cy: 214 },
  { source: "jaw-r", target: "neck-r", kind: "bone", era: 3, cx: 828, cy: 214 },
  { source: "neck-l", target: "neck", kind: "bone", era: 3, cx: 790, cy: 226 },
  { source: "neck-r", target: "neck", kind: "bone", era: 3, cx: 810, cy: 226 },
  { source: "neck", target: "thorax", kind: "bone", era: 3, cx: 800, cy: 268 },
  {
    source: "thorax",
    target: "spine-mid",
    kind: "bone",
    era: 3,
    cx: 800,
    cy: 352,
  },
  {
    source: "spine-mid",
    target: "pelvis",
    kind: "bone",
    era: 3,
    cx: 800,
    cy: 434,
  },
  { source: "thorax", target: "rib-l", kind: "bone", era: 3, cx: 758, cy: 306 },
  { source: "thorax", target: "rib-r", kind: "bone", era: 3, cx: 842, cy: 306 },
  { source: "rib-l", target: "rib-l2", kind: "bone", era: 3, cx: 720, cy: 330 },
  { source: "rib-r", target: "rib-r2", kind: "bone", era: 3, cx: 880, cy: 330 },
  {
    source: "rib-l2",
    target: "spine-mid",
    kind: "bone",
    era: 3,
    cx: 760,
    cy: 376,
  },
  {
    source: "rib-r2",
    target: "spine-mid",
    kind: "bone",
    era: 3,
    cx: 840,
    cy: 376,
  },
  {
    source: "thorax",
    target: "shoulder-l",
    kind: "bone",
    era: 3,
    cx: 720,
    cy: 260,
  },
  {
    source: "thorax",
    target: "shoulder-r",
    kind: "bone",
    era: 3,
    cx: 880,
    cy: 260,
  },
  {
    source: "neck-l",
    target: "shoulder-l",
    kind: "bone",
    era: 3,
    cx: 716,
    cy: 228,
  },
  {
    source: "neck-r",
    target: "shoulder-r",
    kind: "bone",
    era: 3,
    cx: 884,
    cy: 228,
  },
  {
    source: "shoulder-l",
    target: "elbow-l",
    kind: "bone",
    era: 3,
    cx: 620,
    cy: 308,
  },
  {
    source: "shoulder-r",
    target: "elbow-r",
    kind: "bone",
    era: 3,
    cx: 980,
    cy: 308,
  },
  {
    source: "elbow-l",
    target: "wrist-l",
    kind: "bone",
    era: 3,
    cx: 592,
    cy: 462,
  },
  {
    source: "elbow-r",
    target: "wrist-r",
    kind: "bone",
    era: 3,
    cx: 1008,
    cy: 462,
  },
  {
    source: "wrist-l",
    target: "hand-l",
    kind: "bone",
    era: 3,
    cx: 576,
    cy: 542,
  },
  {
    source: "wrist-r",
    target: "hand-r",
    kind: "bone",
    era: 3,
    cx: 1024,
    cy: 542,
  },
  ...HAND_FINGER_GRAPH.edges,
  { source: "pelvis", target: "hip-l", kind: "bone", era: 3, cx: 764, cy: 488 },
  { source: "pelvis", target: "hip-r", kind: "bone", era: 3, cx: 836, cy: 488 },
  { source: "hip-l", target: "knee-l", kind: "bone", era: 3, cx: 728, cy: 566 },
  { source: "hip-r", target: "knee-r", kind: "bone", era: 3, cx: 872, cy: 566 },
  {
    source: "knee-l",
    target: "ankle-l",
    kind: "bone",
    era: 3,
    cx: 722,
    cy: 694,
  },
  {
    source: "knee-r",
    target: "ankle-r",
    kind: "bone",
    era: 3,
    cx: 878,
    cy: 694,
  },
  {
    source: "ankle-l",
    target: "foot-l",
    kind: "bone",
    era: 3,
    cx: 718,
    cy: 776,
  },
  {
    source: "ankle-r",
    target: "foot-r",
    kind: "bone",
    era: 3,
    cx: 882,
    cy: 776,
  },
  {
    source: "foot-l",
    target: "foot-l-a",
    kind: "bone",
    era: 3,
    cx: 708,
    cy: 804,
  },
  {
    source: "foot-l",
    target: "foot-l-b",
    kind: "bone",
    era: 3,
    cx: 726,
    cy: 808,
  },
  {
    source: "foot-r",
    target: "foot-r-a",
    kind: "bone",
    era: 3,
    cx: 892,
    cy: 804,
  },
  {
    source: "foot-r",
    target: "foot-r-b",
    kind: "bone",
    era: 3,
    cx: 874,
    cy: 808,
  },
  {
    source: "neck-l",
    target: "clavicle-l",
    kind: "bone",
    era: 3,
    cx: 750,
    cy: 224,
  },
  {
    source: "neck-r",
    target: "clavicle-r",
    kind: "bone",
    era: 3,
    cx: 850,
    cy: 224,
  },
  {
    source: "clavicle-l",
    target: "shoulder-l",
    kind: "bone",
    era: 3,
    cx: 684,
    cy: 230,
  },
  {
    source: "clavicle-r",
    target: "shoulder-r",
    kind: "bone",
    era: 3,
    cx: 916,
    cy: 230,
  },
  {
    source: "thorax",
    target: "sternum",
    kind: "bone",
    era: 3,
    cx: 800,
    cy: 296,
  },
  { source: "sternum", target: "neck", kind: "bone", era: 3, cx: 800, cy: 254 },
  {
    source: "sternum",
    target: "rib-l0",
    kind: "bone",
    era: 3,
    cx: 768,
    cy: 278,
  },
  {
    source: "sternum",
    target: "rib-r0",
    kind: "bone",
    era: 3,
    cx: 832,
    cy: 278,
  },
  { source: "rib-l0", target: "rib-l", kind: "bone", era: 3, cx: 728, cy: 292 },
  { source: "rib-r0", target: "rib-r", kind: "bone", era: 3, cx: 872, cy: 292 },
  {
    source: "rib-l2",
    target: "rib-l3",
    kind: "bone",
    era: 3,
    cx: 738,
    cy: 364,
  },
  {
    source: "rib-r2",
    target: "rib-r3",
    kind: "bone",
    era: 3,
    cx: 862,
    cy: 364,
  },
  {
    source: "rib-l3",
    target: "spine-mid",
    kind: "bone",
    era: 3,
    cx: 770,
    cy: 386,
  },
  {
    source: "rib-r3",
    target: "spine-mid",
    kind: "bone",
    era: 3,
    cx: 830,
    cy: 386,
  },
  {
    source: "shoulder-l",
    target: "scapula-l",
    kind: "bone",
    era: 3,
    cx: 656,
    cy: 252,
  },
  {
    source: "shoulder-r",
    target: "scapula-r",
    kind: "bone",
    era: 3,
    cx: 944,
    cy: 252,
  },
  {
    source: "scapula-l",
    target: "rib-l0",
    kind: "bone",
    era: 3,
    cx: 700,
    cy: 274,
  },
  {
    source: "scapula-r",
    target: "rib-r0",
    kind: "bone",
    era: 3,
    cx: 900,
    cy: 274,
  },
  {
    source: "shoulder-l",
    target: "humerus-l",
    kind: "bone",
    era: 3,
    cx: 636,
    cy: 274,
  },
  {
    source: "shoulder-r",
    target: "humerus-r",
    kind: "bone",
    era: 3,
    cx: 964,
    cy: 274,
  },
  {
    source: "humerus-l",
    target: "elbow-l",
    kind: "bone",
    era: 3,
    cx: 616,
    cy: 356,
  },
  {
    source: "humerus-r",
    target: "elbow-r",
    kind: "bone",
    era: 3,
    cx: 984,
    cy: 356,
  },
  {
    source: "elbow-l",
    target: "radius-l",
    kind: "bone",
    era: 3,
    cx: 600,
    cy: 430,
  },
  {
    source: "elbow-r",
    target: "radius-r",
    kind: "bone",
    era: 3,
    cx: 1000,
    cy: 430,
  },
  {
    source: "radius-l",
    target: "wrist-l",
    kind: "bone",
    era: 3,
    cx: 590,
    cy: 496,
  },
  {
    source: "radius-r",
    target: "wrist-r",
    kind: "bone",
    era: 3,
    cx: 1010,
    cy: 496,
  },
  {
    source: "spine-mid",
    target: "sacrum",
    kind: "bone",
    era: 3,
    cx: 800,
    cy: 422,
  },
  {
    source: "sacrum",
    target: "pelvis",
    kind: "bone",
    era: 3,
    cx: 800,
    cy: 464,
  },
  {
    source: "pelvis",
    target: "iliac-l",
    kind: "bone",
    era: 3,
    cx: 776,
    cy: 466,
  },
  {
    source: "pelvis",
    target: "iliac-r",
    kind: "bone",
    era: 3,
    cx: 824,
    cy: 466,
  },
  {
    source: "iliac-l",
    target: "hip-l",
    kind: "bone",
    era: 3,
    cx: 746,
    cy: 478,
  },
  {
    source: "iliac-r",
    target: "hip-r",
    kind: "bone",
    era: 3,
    cx: 854,
    cy: 478,
  },
  {
    source: "hip-l",
    target: "femur-l",
    kind: "bone",
    era: 3,
    cx: 732,
    cy: 532,
  },
  {
    source: "hip-r",
    target: "femur-r",
    kind: "bone",
    era: 3,
    cx: 868,
    cy: 532,
  },
  {
    source: "femur-l",
    target: "knee-l",
    kind: "bone",
    era: 3,
    cx: 728,
    cy: 604,
  },
  {
    source: "femur-r",
    target: "knee-r",
    kind: "bone",
    era: 3,
    cx: 872,
    cy: 604,
  },
  {
    source: "knee-l",
    target: "tibia-l",
    kind: "bone",
    era: 3,
    cx: 724,
    cy: 666,
  },
  {
    source: "knee-r",
    target: "tibia-r",
    kind: "bone",
    era: 3,
    cx: 876,
    cy: 666,
  },
  {
    source: "tibia-l",
    target: "ankle-l",
    kind: "bone",
    era: 3,
    cx: 722,
    cy: 724,
  },
  {
    source: "tibia-r",
    target: "ankle-r",
    kind: "bone",
    era: 3,
    cx: 878,
    cy: 724,
  },

  {
    source: "shoulder-l",
    target: "m-deltoid-l",
    kind: "muscle",
    era: 3,
    cx: 642,
    cy: 242,
  },
  {
    source: "shoulder-r",
    target: "m-deltoid-r",
    kind: "muscle",
    era: 3,
    cx: 958,
    cy: 242,
  },
  {
    source: "m-deltoid-l",
    target: "m-bicep-l",
    kind: "muscle",
    era: 3,
    cx: 612,
    cy: 292,
  },
  {
    source: "m-deltoid-r",
    target: "m-bicep-r",
    kind: "muscle",
    era: 3,
    cx: 988,
    cy: 292,
  },
  {
    source: "m-bicep-l",
    target: "elbow-l",
    kind: "muscle",
    era: 3,
    cx: 600,
    cy: 370,
  },
  {
    source: "m-bicep-r",
    target: "elbow-r",
    kind: "muscle",
    era: 3,
    cx: 1000,
    cy: 370,
  },
  {
    source: "elbow-l",
    target: "m-forearm-l",
    kind: "muscle",
    era: 3,
    cx: 586,
    cy: 434,
  },
  {
    source: "elbow-r",
    target: "m-forearm-r",
    kind: "muscle",
    era: 3,
    cx: 1014,
    cy: 434,
  },
  {
    source: "m-forearm-l",
    target: "hand-l",
    kind: "muscle",
    era: 3,
    cx: 572,
    cy: 516,
  },
  {
    source: "m-forearm-r",
    target: "hand-r",
    kind: "muscle",
    era: 3,
    cx: 1028,
    cy: 516,
  },
  {
    source: "sternum",
    target: "m-pec-l",
    kind: "muscle",
    era: 3,
    cx: 770,
    cy: 292,
  },
  {
    source: "sternum",
    target: "m-pec-r",
    kind: "muscle",
    era: 3,
    cx: 830,
    cy: 292,
  },
  {
    source: "m-pec-l",
    target: "shoulder-l",
    kind: "muscle",
    era: 3,
    cx: 696,
    cy: 268,
  },
  {
    source: "m-pec-r",
    target: "shoulder-r",
    kind: "muscle",
    era: 3,
    cx: 904,
    cy: 268,
  },
  {
    source: "m-pec-l",
    target: "m-oblique-l",
    kind: "muscle",
    era: 3,
    cx: 742,
    cy: 350,
  },
  {
    source: "m-pec-r",
    target: "m-oblique-r",
    kind: "muscle",
    era: 3,
    cx: 858,
    cy: 350,
  },
  {
    source: "m-oblique-l",
    target: "iliac-l",
    kind: "muscle",
    era: 3,
    cx: 752,
    cy: 430,
  },
  {
    source: "m-oblique-r",
    target: "iliac-r",
    kind: "muscle",
    era: 3,
    cx: 848,
    cy: 430,
  },
  {
    source: "iliac-l",
    target: "m-glute-l",
    kind: "muscle",
    era: 3,
    cx: 752,
    cy: 480,
  },
  {
    source: "iliac-r",
    target: "m-glute-r",
    kind: "muscle",
    era: 3,
    cx: 848,
    cy: 480,
  },
  {
    source: "m-glute-l",
    target: "m-ham-l",
    kind: "muscle",
    era: 3,
    cx: 750,
    cy: 540,
  },
  {
    source: "m-glute-r",
    target: "m-ham-r",
    kind: "muscle",
    era: 3,
    cx: 850,
    cy: 540,
  },
  {
    source: "hip-l",
    target: "m-quad-l",
    kind: "muscle",
    era: 3,
    cx: 718,
    cy: 532,
  },
  {
    source: "hip-r",
    target: "m-quad-r",
    kind: "muscle",
    era: 3,
    cx: 882,
    cy: 532,
  },
  {
    source: "m-quad-l",
    target: "knee-l",
    kind: "muscle",
    era: 3,
    cx: 714,
    cy: 606,
  },
  {
    source: "m-quad-r",
    target: "knee-r",
    kind: "muscle",
    era: 3,
    cx: 886,
    cy: 606,
  },
  {
    source: "m-ham-l",
    target: "knee-l",
    kind: "muscle",
    era: 3,
    cx: 738,
    cy: 612,
  },
  {
    source: "m-ham-r",
    target: "knee-r",
    kind: "muscle",
    era: 3,
    cx: 862,
    cy: 612,
  },
  {
    source: "knee-l",
    target: "m-calf-l",
    kind: "muscle",
    era: 3,
    cx: 712,
    cy: 670,
  },
  {
    source: "knee-r",
    target: "m-calf-r",
    kind: "muscle",
    era: 3,
    cx: 888,
    cy: 670,
  },
  {
    source: "m-calf-l",
    target: "ankle-l",
    kind: "muscle",
    era: 3,
    cx: 710,
    cy: 728,
  },
  {
    source: "m-calf-r",
    target: "ankle-r",
    kind: "muscle",
    era: 3,
    cx: 890,
    cy: 728,
  },

  {
    source: "heart",
    target: "heart-a",
    kind: "blood",
    era: 4,
    cx: 762,
    cy: 312,
  },
  {
    source: "heart",
    target: "heart-b",
    kind: "blood",
    era: 4,
    cx: 780,
    cy: 312,
  },
  {
    source: "heart",
    target: "aortic-arch",
    kind: "blood",
    era: 4,
    cx: 780,
    cy: 302,
  },
  {
    source: "aortic-arch",
    target: "aorta",
    kind: "blood",
    era: 4,
    cx: 798,
    cy: 316,
  },
  {
    source: "heart",
    target: "lung-l",
    kind: "blood",
    era: 5,
    cx: 744,
    cy: 312,
  },
  {
    source: "heart",
    target: "lung-r",
    kind: "blood",
    era: 5,
    cx: 828,
    cy: 312,
  },
  {
    source: "aortic-arch",
    target: "carotid-l",
    kind: "blood",
    era: 4,
    cx: 784,
    cy: 258,
  },
  {
    source: "aortic-arch",
    target: "carotid-r",
    kind: "blood",
    era: 4,
    cx: 808,
    cy: 258,
  },
  {
    source: "carotid-l",
    target: "skull",
    kind: "blood",
    era: 4,
    cx: 786,
    cy: 192,
  },
  {
    source: "carotid-r",
    target: "skull",
    kind: "blood",
    era: 4,
    cx: 814,
    cy: 192,
  },
  {
    source: "aortic-arch",
    target: "subclavian-l",
    kind: "blood",
    era: 4,
    cx: 740,
    cy: 268,
  },
  {
    source: "aortic-arch",
    target: "subclavian-r",
    kind: "blood",
    era: 4,
    cx: 850,
    cy: 268,
  },
  {
    source: "subclavian-l",
    target: "brachial-l",
    kind: "blood",
    era: 4,
    cx: 650,
    cy: 310,
  },
  {
    source: "subclavian-r",
    target: "brachial-r",
    kind: "blood",
    era: 4,
    cx: 950,
    cy: 310,
  },
  {
    source: "brachial-l",
    target: "radial-l",
    kind: "blood",
    era: 4,
    cx: 602,
    cy: 440,
  },
  {
    source: "brachial-r",
    target: "radial-r",
    kind: "blood",
    era: 4,
    cx: 998,
    cy: 440,
  },
  {
    source: "radial-l",
    target: "hand-l",
    kind: "blood",
    era: 4,
    cx: 578,
    cy: 532,
  },
  {
    source: "radial-r",
    target: "hand-r",
    kind: "blood",
    era: 4,
    cx: 1022,
    cy: 532,
  },
  {
    source: "aorta",
    target: "iliac-a-l",
    kind: "blood",
    era: 4,
    cx: 780,
    cy: 430,
  },
  {
    source: "aorta",
    target: "iliac-a-r",
    kind: "blood",
    era: 4,
    cx: 820,
    cy: 430,
  },
  {
    source: "iliac-a-l",
    target: "femoral-l",
    kind: "blood",
    era: 4,
    cx: 748,
    cy: 540,
  },
  {
    source: "iliac-a-r",
    target: "femoral-r",
    kind: "blood",
    era: 4,
    cx: 852,
    cy: 540,
  },
  {
    source: "femoral-l",
    target: "popliteal-l",
    kind: "blood",
    era: 4,
    cx: 728,
    cy: 612,
  },
  {
    source: "femoral-r",
    target: "popliteal-r",
    kind: "blood",
    era: 4,
    cx: 872,
    cy: 612,
  },
  {
    source: "popliteal-l",
    target: "foot-l",
    kind: "blood",
    era: 4,
    cx: 722,
    cy: 720,
  },
  {
    source: "popliteal-r",
    target: "foot-r",
    kind: "blood",
    era: 4,
    cx: 878,
    cy: 720,
  },
  {
    source: "hand-l",
    target: "radial-l",
    kind: "vein",
    era: 4,
    cx: 568,
    cy: 528,
  },
  {
    source: "radial-l",
    target: "brachial-l",
    kind: "vein",
    era: 4,
    cx: 612,
    cy: 438,
  },
  // Was a single brachial-l → cava hop that cut straight across the armpit
  // gap between arm and ribcage. Routed through the shoulder joint instead —
  // the same subclavian-l waypoint the artery uses on the way out.
  {
    source: "brachial-l",
    target: "subclavian-l",
    kind: "vein",
    era: 4,
    cx: 660,
    cy: 270,
  },
  {
    source: "subclavian-l",
    target: "cava",
    kind: "vein",
    era: 4,
    cx: 760,
    cy: 300,
  },
  {
    source: "hand-r",
    target: "radial-r",
    kind: "vein",
    era: 4,
    cx: 1032,
    cy: 528,
  },
  {
    source: "radial-r",
    target: "brachial-r",
    kind: "vein",
    era: 4,
    cx: 988,
    cy: 438,
  },
  {
    source: "brachial-r",
    target: "subclavian-r",
    kind: "vein",
    era: 4,
    cx: 940,
    cy: 270,
  },
  {
    source: "subclavian-r",
    target: "cava",
    kind: "vein",
    era: 4,
    cx: 840,
    cy: 300,
  },
  {
    source: "foot-l",
    target: "femoral-l",
    kind: "vein",
    era: 4,
    cx: 710,
    cy: 690,
  },
  {
    source: "femoral-l",
    target: "iliac-a-l",
    kind: "vein",
    era: 4,
    cx: 748,
    cy: 548,
  },
  {
    source: "iliac-a-l",
    target: "cava",
    kind: "vein",
    era: 4,
    cx: 786,
    cy: 430,
  },
  {
    source: "foot-r",
    target: "femoral-r",
    kind: "vein",
    era: 4,
    cx: 890,
    cy: 690,
  },
  {
    source: "femoral-r",
    target: "iliac-a-r",
    kind: "vein",
    era: 4,
    cx: 852,
    cy: 548,
  },
  {
    source: "iliac-a-r",
    target: "cava",
    kind: "vein",
    era: 4,
    cx: 822,
    cy: 430,
  },
  {
    source: "skull",
    target: "jugular-l",
    kind: "vein",
    era: 4,
    cx: 790,
    cy: 182,
  },
  {
    source: "skull",
    target: "jugular-r",
    kind: "vein",
    era: 4,
    cx: 810,
    cy: 182,
  },
  {
    source: "jugular-l",
    target: "cava",
    kind: "vein",
    era: 4,
    cx: 798,
    cy: 286,
  },
  {
    source: "jugular-r",
    target: "cava",
    kind: "vein",
    era: 4,
    cx: 812,
    cy: 286,
  },
  { source: "cava", target: "heart", kind: "vein", era: 4, cx: 792, cy: 340 },
  { source: "lung-l", target: "heart", kind: "vein", era: 5, cx: 748, cy: 318 },
  { source: "lung-r", target: "heart", kind: "vein", era: 5, cx: 824, cy: 318 },

  {
    source: "lung-l",
    target: "lung-l-a",
    kind: "blood",
    era: 5,
    cx: 718,
    cy: 290,
  },
  {
    source: "lung-l",
    target: "lung-l-b",
    kind: "blood",
    era: 5,
    cx: 722,
    cy: 310,
  },
  {
    source: "lung-r",
    target: "lung-r-a",
    kind: "blood",
    era: 5,
    cx: 882,
    cy: 290,
  },
  {
    source: "lung-r",
    target: "lung-r-b",
    kind: "blood",
    era: 5,
    cx: 878,
    cy: 310,
  },
  { source: "heart", target: "liver", kind: "blood", era: 5, cx: 752, cy: 360 },
  { source: "heart", target: "gut", kind: "blood", era: 5, cx: 794, cy: 390 },
  { source: "gut", target: "gut-a", kind: "blood", era: 5, cx: 796, cy: 440 },
  { source: "gut", target: "gut-b", kind: "blood", era: 5, cx: 820, cy: 456 },
  {
    source: "heart",
    target: "kidney-l",
    kind: "blood",
    era: 5,
    cx: 760,
    cy: 380,
  },
  {
    source: "heart",
    target: "kidney-r",
    kind: "blood",
    era: 5,
    cx: 820,
    cy: 380,
  },

  {
    source: "pituitary",
    target: "thyroid",
    kind: "hormone",
    era: 4,
    cx: 808,
    cy: 206,
  },
  {
    source: "pituitary",
    target: "adrenal-l",
    kind: "hormone",
    era: 4,
    cx: 740,
    cy: 280,
  },
  {
    source: "pituitary",
    target: "adrenal-r",
    kind: "hormone",
    era: 4,
    cx: 860,
    cy: 280,
  },
  {
    source: "pituitary",
    target: "pancreas",
    kind: "hormone",
    era: 4,
    cx: 818,
    cy: 300,
  },
  {
    source: "thyroid",
    target: "heart",
    kind: "hormone",
    era: 4,
    cx: 786,
    cy: 270,
  },

  {
    source: "lymph-cerv-l",
    target: "lymph-cerv-r",
    kind: "lymph",
    era: 6,
    cx: 800,
    cy: 218,
  },
  {
    source: "lymph-cerv-l",
    target: "lymph-duct",
    kind: "lymph",
    era: 6,
    cx: 774,
    cy: 288,
  },
  {
    source: "lymph-cerv-r",
    target: "lymph-duct",
    kind: "lymph",
    era: 6,
    cx: 816,
    cy: 288,
  },
  {
    source: "lymph-ax-l",
    target: "lymph-cerv-l",
    kind: "lymph",
    era: 6,
    cx: 690,
    cy: 236,
  },
  {
    source: "lymph-ax-r",
    target: "lymph-cerv-r",
    kind: "lymph",
    era: 6,
    cx: 910,
    cy: 236,
  },
  {
    source: "lymph-ax-l",
    target: "lymph-duct",
    kind: "lymph",
    era: 6,
    cx: 700,
    cy: 310,
  },
  {
    source: "lymph-ax-r",
    target: "lymph-duct",
    kind: "lymph",
    era: 6,
    cx: 900,
    cy: 310,
  },
  {
    source: "lymph-duct",
    target: "lymph-cisterna",
    kind: "lymph",
    era: 6,
    cx: 792,
    cy: 396,
  },
  {
    source: "lymph-cisterna",
    target: "lymph-ing-l",
    kind: "lymph",
    era: 6,
    cx: 768,
    cy: 478,
  },
  {
    source: "lymph-cisterna",
    target: "lymph-ing-r",
    kind: "lymph",
    era: 6,
    cx: 832,
    cy: 478,
  },
  {
    source: "lymph-ing-l",
    target: "lymph-ing-r",
    kind: "lymph",
    era: 6,
    cx: 800,
    cy: 524,
  },

  {
    source: "chakra-root",
    target: "chakra-sacral",
    kind: "energy",
    era: 2,
    cx: 800,
    cy: 464,
  },
  {
    source: "chakra-sacral",
    target: "chakra-solar",
    kind: "energy",
    era: 2,
    cx: 800,
    cy: 422,
  },
  {
    source: "chakra-solar",
    target: "chakra-heart",
    kind: "energy",
    era: 2,
    cx: 800,
    cy: 352,
  },
  {
    source: "chakra-heart",
    target: "chakra-throat",
    kind: "energy",
    era: 2,
    cx: 800,
    cy: 266,
  },
  {
    source: "chakra-throat",
    target: "chakra-brow",
    kind: "energy",
    era: 2,
    cx: 800,
    cy: 186,
  },
  {
    source: "chakra-brow",
    target: "chakra-crown",
    kind: "energy",
    era: 2,
    cx: 800,
    cy: 126,
  },
  // Grounding: the root chakra's energy continues down both legs into the
  // feet — the same energy column that climbs to the crown also reaches
  // the earth. `undirectedHops("chakra-root", ...)` treats these as one
  // hop from root either way, so the climb animation still reads as one
  // continuous flow, not a separate branch.
  {
    source: "chakra-root",
    target: "foot-l",
    kind: "energy",
    era: 2,
    cx: 750,
    cy: 650,
  },
  {
    source: "chakra-root",
    target: "foot-r",
    kind: "energy",
    era: 2,
    cx: 850,
    cy: 650,
  },

  { source: "brain", target: "stem", kind: "nerve", era: 7, cx: 800, cy: 162 },
  {
    source: "cortex-l",
    target: "brain",
    kind: "nerve",
    era: 7,
    cx: 782,
    cy: 134,
  },
  {
    source: "cortex-r",
    target: "brain",
    kind: "nerve",
    era: 7,
    cx: 818,
    cy: 134,
  },
  {
    source: "cortex-l2",
    target: "brain",
    kind: "nerve",
    era: 7,
    cx: 768,
    cy: 148,
  },
  {
    source: "cortex-r2",
    target: "brain",
    kind: "nerve",
    era: 7,
    cx: 832,
    cy: 148,
  },
  {
    source: "cortex-l3",
    target: "brain",
    kind: "nerve",
    era: 7,
    cx: 778,
    cy: 160,
  },
  {
    source: "cortex-r3",
    target: "brain",
    kind: "nerve",
    era: 7,
    cx: 822,
    cy: 160,
  },
  {
    source: "cortex-l",
    target: "cortex-l2",
    kind: "nerve",
    era: 7,
    cx: 752,
    cy: 136,
  },
  {
    source: "cortex-r",
    target: "cortex-r2",
    kind: "nerve",
    era: 7,
    cx: 848,
    cy: 136,
  },
  {
    source: "cortex-l2",
    target: "cortex-l3",
    kind: "nerve",
    era: 7,
    cx: 748,
    cy: 160,
  },
  {
    source: "cortex-r2",
    target: "cortex-r3",
    kind: "nerve",
    era: 7,
    cx: 852,
    cy: 160,
  },
  {
    source: "cortex-l",
    target: "cortex-r",
    kind: "nerve",
    era: 7,
    cx: 800,
    cy: 120,
  },
  {
    source: "cortex-l3",
    target: "cortex-r3",
    kind: "nerve",
    era: 7,
    cx: 800,
    cy: 172,
  },
  { source: "stem", target: "cerv-1", kind: "nerve", era: 7, cx: 800, cy: 186 },
  {
    source: "cerv-1",
    target: "cerv-2",
    kind: "nerve",
    era: 7,
    cx: 800,
    cy: 203,
  },
  {
    source: "cerv-2",
    target: "cerv-3",
    kind: "nerve",
    era: 7,
    cx: 800,
    cy: 220,
  },
  {
    source: "cerv-3",
    target: "cerv-4",
    kind: "nerve",
    era: 7,
    cx: 800,
    cy: 238,
  },
  {
    source: "cerv-4",
    target: "heart",
    kind: "nerve",
    era: 7,
    cx: 792,
    cy: 282,
  },
  { source: "cerv-4", target: "gut", kind: "nerve", era: 7, cx: 808, cy: 340 },
  {
    source: "cerv-4",
    target: "plexus-lumbar",
    kind: "nerve",
    era: 7,
    cx: 800,
    cy: 338,
  },
  {
    source: "cerv-3",
    target: "plexus-root-l",
    kind: "nerve",
    era: 7,
    cx: 790,
    cy: 238,
  },
  {
    source: "cerv-3",
    target: "plexus-root-r",
    kind: "nerve",
    era: 7,
    cx: 810,
    cy: 238,
  },
  {
    source: "cerv-4",
    target: "plexus-root-l",
    kind: "nerve",
    era: 7,
    cx: 790,
    cy: 248,
  },
  {
    source: "cerv-4",
    target: "plexus-root-r",
    kind: "nerve",
    era: 7,
    cx: 810,
    cy: 248,
  },
  {
    source: "plexus-root-l",
    target: "plexus-br-l",
    kind: "nerve",
    era: 7,
    cx: 748,
    cy: 244,
  },
  {
    source: "plexus-root-r",
    target: "plexus-br-r",
    kind: "nerve",
    era: 7,
    cx: 852,
    cy: 244,
  },
  {
    source: "plexus-br-l",
    target: "n-elbow-l",
    kind: "nerve",
    era: 7,
    cx: 640,
    cy: 318,
  },
  {
    source: "plexus-br-r",
    target: "n-elbow-r",
    kind: "nerve",
    era: 7,
    cx: 960,
    cy: 318,
  },
  {
    source: "n-elbow-l",
    target: "hand-l",
    kind: "nerve",
    era: 7,
    cx: 582,
    cy: 480,
  },
  {
    source: "n-elbow-r",
    target: "hand-r",
    kind: "nerve",
    era: 7,
    cx: 1018,
    cy: 480,
  },
  {
    source: "n-elbow-l",
    target: "hand-l-thumb-tip",
    kind: "nerve",
    era: 7,
    cx: 548,
    cy: 500,
  },
  {
    source: "n-elbow-r",
    target: "hand-r-thumb-tip",
    kind: "nerve",
    era: 7,
    cx: 1052,
    cy: 500,
  },
  {
    source: "hand-l",
    target: "hand-l-index-tip",
    kind: "nerve",
    era: 7,
    cx: 568,
    cy: 600,
  },
  {
    source: "hand-r",
    target: "hand-r-index-tip",
    kind: "nerve",
    era: 7,
    cx: 1032,
    cy: 600,
  },
  {
    source: "hand-l",
    target: "hand-l-middle-tip",
    kind: "nerve",
    era: 7,
    cx: 580,
    cy: 610,
  },
  {
    source: "hand-r",
    target: "hand-r-middle-tip",
    kind: "nerve",
    era: 7,
    cx: 1020,
    cy: 610,
  },
  {
    source: "plexus-lumbar",
    target: "n-knee-l",
    kind: "nerve",
    era: 7,
    cx: 750,
    cy: 540,
  },
  {
    source: "plexus-lumbar",
    target: "n-knee-r",
    kind: "nerve",
    era: 7,
    cx: 850,
    cy: 540,
  },
  {
    source: "n-knee-l",
    target: "foot-l",
    kind: "nerve",
    era: 7,
    cx: 716,
    cy: 720,
  },
  {
    source: "n-knee-r",
    target: "foot-r",
    kind: "nerve",
    era: 7,
    cx: 884,
    cy: 720,
  },
  {
    source: "plexus-br-l",
    target: "skin",
    kind: "nerve",
    era: 7,
    cx: 668,
    cy: 256,
  },
  {
    source: "plexus-br-r",
    target: "skin-r",
    kind: "nerve",
    era: 7,
    cx: 932,
    cy: 256,
  },

  {
    source: "fold-l",
    target: "brain",
    kind: "nerve",
    era: 8,
    cx: 778,
    cy: 160,
  },
  {
    source: "fold-r",
    target: "brain",
    kind: "nerve",
    era: 8,
    cx: 822,
    cy: 160,
  },
  {
    source: "fold-l",
    target: "cortex-l3",
    kind: "nerve",
    era: 8,
    cx: 760,
    cy: 170,
  },
  {
    source: "fold-r",
    target: "cortex-r3",
    kind: "nerve",
    era: 8,
    cx: 840,
    cy: 170,
  },
  {
    source: "pole-l",
    target: "cortex-l",
    kind: "nerve",
    era: 8,
    cx: 750,
    cy: 126,
  },
  {
    source: "pole-r",
    target: "cortex-r",
    kind: "nerve",
    era: 8,
    cx: 850,
    cy: 126,
  },
  {
    source: "pole-l",
    target: "cortex-l2",
    kind: "nerve",
    era: 8,
    cx: 738,
    cy: 142,
  },
  {
    source: "pole-r",
    target: "cortex-r2",
    kind: "nerve",
    era: 8,
    cx: 862,
    cy: 142,
  },
  {
    source: "gyrus-l",
    target: "brain",
    kind: "nerve",
    era: 8,
    cx: 786,
    cy: 148,
  },
  {
    source: "gyrus-r",
    target: "brain",
    kind: "nerve",
    era: 8,
    cx: 814,
    cy: 148,
  },
  {
    source: "gyrus-l",
    target: "gyrus-r",
    kind: "nerve",
    era: 8,
    cx: 800,
    cy: 150,
  },
  {
    source: "gyrus-l",
    target: "cortex-l",
    kind: "nerve",
    era: 8,
    cx: 770,
    cy: 140,
  },
  {
    source: "gyrus-r",
    target: "cortex-r",
    kind: "nerve",
    era: 8,
    cx: 830,
    cy: 140,
  },
  { source: "eye", target: "brain", kind: "sense", era: 8, cx: 786, cy: 152 },
  { source: "eye-r", target: "brain", kind: "sense", era: 8, cx: 814, cy: 152 },
  { source: "ear-l", target: "brain", kind: "sense", era: 8, cx: 768, cy: 154 },
  { source: "ear-r", target: "brain", kind: "sense", era: 8, cx: 832, cy: 154 },
  { source: "nose", target: "brain", kind: "sense", era: 8, cx: 800, cy: 164 },
  { source: "mouth", target: "brain", kind: "sense", era: 8, cx: 800, cy: 176 },
  { source: "skin", target: "brain", kind: "sense", era: 8, cx: 700, cy: 200 },
  {
    source: "skin-r",
    target: "brain",
    kind: "sense",
    era: 8,
    cx: 900,
    cy: 200,
  },
  {
    source: "hand-l",
    target: "brain",
    kind: "sense",
    era: 8,
    cx: 640,
    cy: 230,
  },
  {
    source: "hand-r",
    target: "brain",
    kind: "sense",
    era: 8,
    cx: 960,
    cy: 230,
  },
  {
    source: "inner",
    target: "cerv-4",
    kind: "sense",
    era: 8,
    cx: 792,
    cy: 308,
  },
  { source: "jaw", target: "mouth", kind: "sense", era: 8, cx: 800, cy: 209 },

  {
    source: "brain",
    target: "hand-r",
    kind: "motor",
    era: 9,
    cx: 980,
    cy: 220,
  },
  {
    source: "brain",
    target: "foot-l",
    kind: "motor",
    era: 9,
    cx: 680,
    cy: 460,
  },
]

export const SOMA_EDGES: SomaEdge[] = SOMA_EDGES_RAW.map((e) => ({
  ...e,
  cx: bx(e.cx),
  cy: by(e.cy),
}))

/**
 * Shared soma clock. Resting stage pulse — not a monitor.
 * 66 BPM ≈ one beat per 0.91s (inside 60–72 / 0.85–1.0s).
 */
export const HEART_BPM = 66
export const HEART_PERIOD = 60 / HEART_BPM

export const BODY_BEAT = {
  /** Systolic ejection as a fraction of the beat; the rest is diastole (pause). */
  arterialSystole: 0.36,
  /** Wave delay per hop out from the heart, in beat-fractions. */
  arterialHop: 0.045,
  /** Gap between packets in one arterial jet. */
  arterialGap: 0.04,
  /** Venous return starts this fraction of a beat after systole. */
  venousLag: 0.26,
  /** Slower venous travel window. */
  venousTravel: 0.5,
  /** Return-wave delay per hop in from the periphery. */
  venousHop: 0.04,
  /** Nerve / sense / motor trips per beat (continuous, tempo-locked). Electric, not frantic. */
  nervePerBeat: 1.4,
  /** Hormone pulse every N beats. */
  hormoneBeats: 5,
  /** Lymph pulse every N beats. */
  lymphBeats: 4,
  /** Midline energy current — one climb every N beats. */
  energyBeats: 5,
  /** Segments on the root→crown climb (used to stagger hops). */
  energyHops: 6,
  /** Sense-loop period in heartbeats. */
  loopBeats: 6,
} as const

/** Midline order, root through crown. */
export const CHAKRA_IDS = [
  "chakra-root",
  "chakra-sacral",
  "chakra-solar",
  "chakra-heart",
  "chakra-throat",
  "chakra-brow",
  "chakra-crown",
] as const

/** Traditional midline inks — saturated enough for a navy projector field. */
export const CHAKRA_INK: Record<string, string> = {
  "chakra-root": "#E23B3B",
  "chakra-sacral": "#F07828",
  "chakra-solar": "#F0C02E",
  "chakra-heart": "#3ECF8E",
  "chakra-throat": "#3BA3FF",
  "chakra-brow": "#6B5CE7",
  "chakra-crown": "#E8D6FF",
}

function undirectedHops(root: string, kinds: ReadonlySet<SomaEdgeKind>) {
  const adj = new Map<string, string[]>()
  const add = (a: string, b: string) => {
    const list = adj.get(a) ?? []
    list.push(b)
    adj.set(a, list)
  }
  for (const e of SOMA_EDGES) {
    if (!kinds.has(e.kind)) continue
    add(e.source, e.target)
    add(e.target, e.source)
  }
  const hop = new Map<string, number>()
  hop.set(root, 0)
  const q = [root]
  for (let i = 0; i < q.length; i++) {
    const id = q[i]
    if (!id) continue
    const d = hop.get(id) ?? 0
    for (const n of adj.get(id) ?? []) {
      if (hop.has(n)) continue
      hop.set(n, d + 1)
      q.push(n)
    }
  }
  return hop
}

const ARTERIAL_HOP = undirectedHops("heart", new Set<SomaEdgeKind>(["blood"]))
const VENOUS_HOP = undirectedHops("heart", new Set<SomaEdgeKind>(["vein"]))
const VENOUS_MAX_HOP = [...VENOUS_HOP.values()].reduce(
  (m, v) => Math.max(m, v),
  0
)
const ENERGY_HOP = undirectedHops(
  "chakra-root",
  new Set<SomaEdgeKind>(["energy"])
)

/** Hop distance from the heart along arterial edges (source is proximal). */
export function arterialHop(edge: SomaEdge): number {
  return ARTERIAL_HOP.get(edge.source) ?? ARTERIAL_HOP.get(edge.target) ?? 0
}

/**
 * Hop delay for venous return: periphery first (0), then inward.
 * `source` on vein edges is the distal node.
 */
export function venousReturnHop(edge: SomaEdge): number {
  const src = VENOUS_HOP.get(edge.source) ?? 0
  return Math.max(0, VENOUS_MAX_HOP - src)
}

/** Hop distance from the root center up the midline. */
export function energyClimbHop(edge: SomaEdge): number {
  return ENERGY_HOP.get(edge.source) ?? ENERGY_HOP.get(edge.target) ?? 0
}

/** Systolic envelope: peak at phase 0, gone by ~22% of the beat. */
export function heartEnvelope(phase: number) {
  const u = ((phase % 1) + 1) % 1
  if (u > 0.22) return 0
  const t = u / 0.22
  return (1 - t) * (1 - t)
}

function windowProgress(local: number, window: number): number | null {
  if (local < 0 || local > window) return null
  return local / window
}

/**
 * Packet positions along an edge, gated to the shared heart clock.
 * Returns 0–1 progress values; empty means diastole / between pulses.
 */
export function bodyPacketTs(
  kind: SomaEdgeKind,
  hop: number,
  n: number,
  elapsed: number
): number[] {
  if (n <= 0) return []
  const phase = (((elapsed / HEART_PERIOD) % 1) + 1) % 1
  const ts: number[] = []

  if (kind === "blood") {
    for (let i = 0; i < n; i++) {
      const t = windowProgress(
        phase - hop * BODY_BEAT.arterialHop - i * BODY_BEAT.arterialGap,
        BODY_BEAT.arterialSystole
      )
      if (t !== null) ts.push(t)
    }
    return ts
  }

  if (kind === "vein") {
    const lagged = (phase - BODY_BEAT.venousLag + 1) % 1
    for (let i = 0; i < n; i++) {
      const t = windowProgress(
        lagged - hop * BODY_BEAT.venousHop - i * BODY_BEAT.arterialGap,
        BODY_BEAT.venousTravel
      )
      if (t !== null) ts.push(t)
    }
    return ts
  }

  if (kind === "hormone") {
    const cycle = HEART_PERIOD * BODY_BEAT.hormoneBeats
    const u = (((elapsed / cycle) % 1) + 1) % 1
    const window = 1 / BODY_BEAT.hormoneBeats
    if (u < window) ts.push(u / window)
    return ts
  }

  if (kind === "lymph") {
    const cycle = HEART_PERIOD * BODY_BEAT.lymphBeats
    const u = (((elapsed / cycle) % 1) + 1) % 1
    const window = 1 / BODY_BEAT.lymphBeats
    if (u < window) ts.push(u / window)
    return ts
  }

  if (kind === "energy") {
    const cycle = HEART_PERIOD * BODY_BEAT.energyBeats
    const u = (((elapsed / cycle) % 1) + 1) % 1
    const window = 1 / BODY_BEAT.energyHops
    const packets = Math.max(1, n)
    for (let i = 0; i < packets; i++) {
      const local = ((u + i / packets) % 1) - hop * window
      if (local >= 0 && local <= window) ts.push(local / window)
    }
    return ts
  }

  const rate = BODY_BEAT.nervePerBeat
  for (let i = 0; i < n; i++) ts.push((phase * rate + i / n) % 1)
  return ts
}

/**
 * Autonomy loop hugs the right arm — fades when people/tech take the wings.
 * One closed ellipse (raw cx 1096, cy 448, rx 56, ry 200 — scaled by
 * `bx`/`by`/`BODY_SCALE` like the rest of the figure, so it stays hugging
 * the shrunk arm instead of floating at its old full size). Clockwise from
 * the bottom: Sense → Integrate → Act → Sense, then an unmarked right
 * return. Station dots sit on the path; labels sit in the interior empty
 * space. Right side is dots only — no Act/Integrate repeat.
 */
const SOMA_LOOP_CX = bx(1096)
const SOMA_LOOP_CY = by(448)
const SOMA_LOOP_RX = 56 * BODY_SCALE
const SOMA_LOOP_RY = 200 * BODY_SCALE

/** θ in degrees, 0 = right; clockwise in SVG (y-down) so stations lie on the ellipse. */
function somaLoopPoint(deg: number) {
  const r = (deg * Math.PI) / 180
  return {
    x: Math.round(SOMA_LOOP_CX + SOMA_LOOP_RX * Math.cos(r)),
    y: Math.round(SOMA_LOOP_CY + SOMA_LOOP_RY * Math.sin(r)),
  }
}

const LOOP_SENSE_TOP = somaLoopPoint(270)
const LOOP_INTEGRATE = somaLoopPoint(158)
const LOOP_ACT = somaLoopPoint(208)
const LOOP_SENSE_BOTTOM = somaLoopPoint(90)

export const SOMA_LOOP = [
  {
    id: "sense",
    label: "Sense",
    ...LOOP_SENSE_TOP,
    labelX: SOMA_LOOP_CX,
    labelY: LOOP_SENSE_TOP.y + 28,
    textAnchor: "middle" as const,
  },
  {
    id: "integrate",
    label: "Integrate",
    ...LOOP_INTEGRATE,
    labelX: LOOP_INTEGRATE.x + 16,
    labelY: LOOP_INTEGRATE.y + 4,
    textAnchor: "start" as const,
  },
  {
    id: "act",
    label: "Act",
    ...LOOP_ACT,
    labelX: LOOP_ACT.x + 16,
    labelY: LOOP_ACT.y + 4,
    textAnchor: "start" as const,
  },
  {
    id: "sense-again",
    label: "Sense",
    ...LOOP_SENSE_BOTTOM,
    labelX: SOMA_LOOP_CX,
    labelY: LOOP_SENSE_BOTTOM.y - 22,
    textAnchor: "middle" as const,
  },
] as const

/** Two semicircle arcs that meet, then Z — one continuous closed ellipse. */
export const SOMA_LOOP_PATH = `M${SOMA_LOOP_CX} ${SOMA_LOOP_CY + SOMA_LOOP_RY} A${SOMA_LOOP_RX} ${SOMA_LOOP_RY} 0 0 1 ${SOMA_LOOP_CX} ${SOMA_LOOP_CY - SOMA_LOOP_RY} A${SOMA_LOOP_RX} ${SOMA_LOOP_RY} 0 0 1 ${SOMA_LOOP_CX} ${SOMA_LOOP_CY + SOMA_LOOP_RY} Z`

/** Whisper outline while the asterism assembles — not a medical fill. */
export const BODY_PATH =
  "M800 104 C838 104 868 116 876 140 C884 164 874 186 856 198 C844 208 830 214 822 220 C824 228 826 234 828 238 C860 232 910 230 950 234 C1010 248 1050 360 1052 520 C1054 556 1030 580 1008 568 L990 546 C996 430 978 320 936 262 L868 264 L862 400 C864 490 872 580 880 660 C886 730 894 772 876 804 C866 828 844 830 822 818 L812 790 C816 728 814 658 810 578 C808 518 806 490 804 476 L796 476 C794 490 792 518 790 578 C786 658 784 728 788 790 L778 818 C756 830 734 828 724 804 C706 772 714 730 720 660 C728 580 736 490 738 400 L732 264 L664 262 C622 320 604 430 610 546 L592 568 C570 580 546 556 548 520 C550 360 590 248 650 234 C690 230 740 232 772 238 C774 234 776 228 778 220 C770 214 756 208 744 198 C726 186 716 164 724 140 C732 116 762 104 800 104 Z"

/**
 * Two-hemisphere vault — same filament language as the body outline.
 * Drawn only when nerves disclose; not a medical organ plate.
 */
export const BRAIN_PATH =
  "M800 114 C776 110 754 118 746 136 C738 154 746 170 764 176 C780 182 794 176 800 168 M800 114 C824 110 846 118 854 136 C862 154 854 170 836 176 C820 182 806 176 800 168 M800 116 L800 168"

/**
 * Earth as one left-to-right band just under the feet — above the audience
 * sentence, inside the perfect cosmic circle. Mountains left, blue river
 * constellation through soil under the figure, ocean right. Vapor returns
 * through the sky band above the ridges (the cycle repeats); the ground
 * story reads L→R. Sky geometry stays inside the water-beat frame.
 */
export const EARTH_HORIZON_Y = 828
export const EARTH_BAND_LEFT = 400
export const EARTH_BAND_RIGHT = 1160
/** Drop the gold mycelium mesh below the horizon / river so it reads as soil. */
export const MYCELIUM_WEB_DY = 32

/**
 * Outermost horizon anchors for the wide water-cycle establishing shot only —
 * mountains/ocean now run edge-to-edge, and the ground line between them
 * dips toward these points at each end (curvature of the earth) rather than
 * staying flat like the close-up soil beats' horizon.
 */
export const EARTH_FAR_LEFT_X = -220
export const EARTH_FAR_LEFT_Y = 868
export const EARTH_FAR_RIGHT_X = 1800
export const EARTH_FAR_RIGHT_Y = 868

export type EarthMountain = {
  id: string
  x: number
  y: number
  r: number
  /** Ridge-crest star — brighter, sits on the silhouette. */
  crest?: boolean
}

/** Denser stone constellation: taller left mass, overlapping ridges, crest highlights. */
export const EARTH_MOUNTAINS: readonly EarthMountain[] = [
  { id: "peak", x: 188, y: 668, r: 3.15, crest: true },
  { id: "horn", x: 156, y: 692, r: 2.35, crest: true },
  { id: "peak-e", x: 246, y: 696, r: 2.5, crest: true },
  { id: "peak-w", x: 118, y: 718, r: 2.2, crest: true },
  { id: "crest-e", x: 292, y: 724, r: 2.05, crest: true },
  { id: "ridge-w", x: 98, y: 754, r: 1.95 },
  { id: "ridge-c", x: 188, y: 722, r: 1.85 },
  { id: "ridge-e", x: 268, y: 748, r: 1.9 },
  { id: "mid-w", x: 142, y: 738, r: 1.65 },
  { id: "mid-e", x: 228, y: 734, r: 1.7 },
  { id: "col", x: 214, y: 758, r: 1.55 },
  { id: "spur", x: 338, y: 768, r: 1.55 },
  { id: "shoulder", x: 68, y: 786, r: 1.6 },
  { id: "saddle", x: 198, y: 786, r: 1.7 },
  { id: "foot-w", x: 112, y: 804, r: 1.45 },
  { id: "foot-c", x: 188, y: 808, r: 1.5 },
  { id: "foot-e", x: 312, y: 798, r: 1.45 },
  { id: "base-w", x: 62, y: 822, r: 1.45 },
  { id: "base-c", x: 200, y: 818, r: 1.5 },
  { id: "base-e", x: 372, y: 822, r: 1.45 },
  /** Second, farther range — its own water cycle, out toward the left edge. */
  { id: "far-peak", x: -20, y: 726, r: 2.5, crest: true },
  { id: "far-ridge", x: -70, y: 758, r: 1.85 },
  { id: "far-shoulder", x: -120, y: 796, r: 1.65 },
  { id: "far-foot", x: -160, y: 828, r: 1.5 },
  { id: "far-base", x: -200, y: 858, r: 1.5 },
]

export const EARTH_MOUNTAIN_LINKS: ReadonlyArray<readonly [string, string]> = [
  ["peak", "horn"],
  ["peak", "peak-e"],
  ["peak", "ridge-c"],
  ["horn", "peak-w"],
  ["horn", "mid-w"],
  ["horn", "ridge-c"],
  ["peak-e", "crest-e"],
  ["peak-e", "mid-e"],
  ["peak-e", "ridge-c"],
  ["peak-w", "ridge-w"],
  ["peak-w", "mid-w"],
  ["crest-e", "ridge-e"],
  ["crest-e", "spur"],
  ["ridge-w", "shoulder"],
  ["ridge-w", "mid-w"],
  ["ridge-w", "foot-w"],
  ["ridge-c", "mid-w"],
  ["ridge-c", "mid-e"],
  ["ridge-c", "saddle"],
  ["ridge-e", "col"],
  ["ridge-e", "foot-e"],
  ["ridge-e", "spur"],
  ["mid-w", "saddle"],
  ["mid-e", "col"],
  ["mid-e", "saddle"],
  ["col", "saddle"],
  ["shoulder", "base-w"],
  ["shoulder", "foot-w"],
  ["saddle", "foot-c"],
  ["saddle", "foot-w"],
  ["saddle", "foot-e"],
  ["foot-w", "base-w"],
  ["foot-w", "base-c"],
  ["foot-c", "base-c"],
  ["foot-e", "base-e"],
  ["foot-e", "base-c"],
  ["spur", "base-e"],
  ["spur", "foot-e"],
  ["far-peak", "far-ridge"],
  ["far-ridge", "far-shoulder"],
  ["far-shoulder", "far-foot"],
  ["far-foot", "far-base"],
  ["far-peak", "shoulder"],
  ["far-ridge", "shoulder"],
]

/** Blue river constellation: mountains → soil under the feet → ocean mouth. */
export const EARTH_RIVERS: ReadonlyArray<{
  id: string
  pts: ReadonlyArray<{ x: number; y: number }>
}> = [
  {
    id: "main",
    pts: [
      { x: 188, y: 668 },
      { x: 210, y: 722 },
      { x: 248, y: 772 },
      { x: 318, y: 808 },
      { x: 400, y: 828 },
      { x: 488, y: 840 },
      { x: 580, y: 832 },
      { x: 668, y: 844 },
      { x: 748, y: 836 },
      { x: 800, y: 842 },
      { x: 852, y: 836 },
      { x: 932, y: 844 },
      { x: 1020, y: 832 },
      { x: 1092, y: 838 },
      { x: 1160, y: 830 },
      { x: 1228, y: 834 },
      { x: 1260, y: 824 },
      { x: 1308, y: 826 },
    ],
  },
  {
    id: "west",
    pts: [
      { x: 118, y: 718 },
      { x: 148, y: 768 },
      { x: 200, y: 808 },
      { x: 318, y: 828 },
      { x: 400, y: 828 },
    ],
  },
  {
    id: "far",
    pts: [
      { x: -20, y: 726 },
      { x: -60, y: 780 },
      { x: -120, y: 818 },
      { x: -200, y: 858 },
    ],
  },
  {
    id: "far-braid",
    pts: [
      { x: -200, y: 858 },
      { x: -130, y: 834 },
      { x: -60, y: 780 },
    ],
  },
  {
    id: "braid-a",
    pts: [
      { x: 488, y: 840 },
      { x: 560, y: 850 },
      { x: 668, y: 844 },
    ],
  },
  {
    id: "braid-b",
    pts: [
      { x: 800, y: 842 },
      { x: 880, y: 850 },
      { x: 932, y: 844 },
    ],
  },
]

/**
 * Shared soil stars — several sit on exact river / mycelium coordinates
 * so water, hyphae, and roots meet at the same points.
 */
export const EARTH_SOIL = [
  /** Left of the mountains — same on-river / off-river mix as the main valley floor. */
  { x: -200, y: 858, r: 1.5 },
  { x: -160, y: 848, r: 1.35 },
  { x: -120, y: 818, r: 1.55 },
  { x: -60, y: 780, r: 1.4 },
  { x: -20, y: 726, r: 1.45 },
  { x: 60, y: 750, r: 1.3 },
  { x: 118, y: 718, r: 1.5 },
  { x: 148, y: 768, r: 1.35 },
  { x: 200, y: 808, r: 1.5 },
  { x: 260, y: 818, r: 1.35 },
  { x: 318, y: 828, r: 1.55 },
  { x: 360, y: 830, r: 1.4 },
  { x: 400, y: 828, r: 1.55 },
  { x: 430, y: 838, r: 1.4 },
  { x: 488, y: 840, r: 1.7 },
  { x: 590, y: 836, r: 1.35 },
  { x: 668, y: 844, r: 1.65 },
  { x: 748, y: 836, r: 1.65 },
  { x: 800, y: 842, r: 1.8 },
  { x: 800, y: 854, r: 1.5 },
  { x: 852, y: 836, r: 1.65 },
  { x: 932, y: 844, r: 1.65 },
  { x: 1020, y: 832, r: 1.6 },
  { x: 1070, y: 848, r: 1.4 },
] as const

/** River × soil × root meeting points. `plantX` names the root that shares the star. */
export const WATER_SOIL_JUNCTIONS = [
  { id: "ws-400", x: 400, y: 828, plantX: 400 },
  { id: "ws-488", x: 488, y: 840, plantX: 488 },
  { id: "ws-668", x: 668, y: 844, plantX: 668 },
  { id: "ws-748", x: 748, y: 836, plantX: 748 },
  { id: "ws-800", x: 800, y: 842, plantX: 800 },
  { id: "ws-852", x: 852, y: 836, plantX: 852 },
  { id: "ws-932", x: 932, y: 844, plantX: 932 },
  { id: "ws-1040", x: 1020, y: 832, plantX: 1040 },
] as const

export type EarthOceanStar = {
  id: string
  x: number
  y: number
  r: number
  band: "surface" | "deep"
}

/**
 * Broader sea: bright surface band + deeper band; river mouth spills in at
 * left. Shifted +120 off the old river mouth so the main landscape has more
 * room before the coast, then run out to `EARTH_FAR_RIGHT_X` at the edge.
 */
export const EARTH_OCEAN: readonly EarthOceanStar[] = [
  { id: "mouth", x: 1228, y: 834, r: 2.05, band: "surface" },
  { id: "surf0", x: 1260, y: 824, r: 1.95, band: "surface" },
  { id: "surf1", x: 1308, y: 826, r: 2.05, band: "surface" },
  { id: "surf2", x: 1352, y: 812, r: 1.85, band: "surface" },
  { id: "surf3", x: 1400, y: 818, r: 2.1, band: "surface" },
  { id: "surf4", x: 1444, y: 810, r: 1.9, band: "surface" },
  { id: "surf5", x: 1488, y: 824, r: 2.35, band: "surface" },
  { id: "surf6", x: 1532, y: 814, r: 2.0, band: "surface" },
  { id: "surf7", x: 1576, y: 820, r: 2.15, band: "surface" },
  { id: "surf8", x: 1620, y: 812, r: 1.85, band: "surface" },
  { id: "surf9", x: 1664, y: 826, r: 1.95, band: "surface" },
  { id: "surfA", x: 1330, y: 830, r: 1.55, band: "surface" },
  { id: "surfB", x: 1510, y: 832, r: 1.6, band: "surface" },
  { id: "deep0", x: 1256, y: 856, r: 1.7, band: "deep" },
  { id: "deep1", x: 1304, y: 868, r: 1.85, band: "deep" },
  { id: "deep2", x: 1356, y: 852, r: 1.7, band: "deep" },
  { id: "deep3", x: 1408, y: 872, r: 1.95, band: "deep" },
  { id: "deep4", x: 1456, y: 858, r: 1.75, band: "deep" },
  { id: "deep5", x: 1504, y: 874, r: 2.05, band: "deep" },
  { id: "deep6", x: 1552, y: 860, r: 1.8, band: "deep" },
  { id: "deep7", x: 1600, y: 876, r: 1.9, band: "deep" },
  { id: "deep8", x: 1630, y: 858, r: 1.85, band: "deep" },
  { id: "deep9", x: 1672, y: 870, r: 1.7, band: "deep" },
  { id: "deepA", x: 1280, y: 848, r: 1.5, band: "deep" },
  { id: "deepB", x: 1584, y: 848, r: 1.55, band: "deep" },
  /** Run the sea the rest of the way to the far edge, sloping down to meet it. */
  { id: "surfE0", x: 1710, y: 838, r: 1.9, band: "surface" },
  { id: "surfE1", x: 1756, y: 850, r: 1.85, band: "surface" },
  { id: "surfE2", x: 1800, y: 862, r: 1.75, band: "surface" },
  { id: "deepE0", x: 1718, y: 866, r: 1.7, band: "deep" },
  { id: "deepE1", x: 1760, y: 876, r: 1.75, band: "deep" },
  { id: "deepE2", x: 1800, y: 884, r: 1.65, band: "deep" },
]

export const EARTH_OCEAN_LINKS: ReadonlyArray<readonly [string, string]> = [
  ["mouth", "surf0"],
  ["surf0", "surf1"],
  ["surf1", "surf2"],
  ["surf2", "surf3"],
  ["surf3", "surf4"],
  ["surf4", "surf5"],
  ["surf5", "surf6"],
  ["surf6", "surf7"],
  ["surf7", "surf8"],
  ["surf8", "surf9"],
  ["surf1", "surfA"],
  ["surfA", "surf3"],
  ["surf5", "surfB"],
  ["surfB", "surf7"],
  ["deep0", "deep1"],
  ["deep1", "deep2"],
  ["deep2", "deep3"],
  ["deep3", "deep4"],
  ["deep4", "deep5"],
  ["deep5", "deep6"],
  ["deep6", "deep7"],
  ["deep7", "deep8"],
  ["deep8", "deep9"],
  ["deep0", "deepA"],
  ["deepA", "deep2"],
  ["deep6", "deepB"],
  ["deepB", "deep8"],
  ["mouth", "deep0"],
  ["surf1", "deep1"],
  ["surf3", "deep3"],
  ["surf5", "deep5"],
  ["surf7", "deep7"],
  ["surf8", "deep8"],
  ["surfA", "deepA"],
  ["surfB", "deepB"],
  ["surf9", "surfE0"],
  ["surfE0", "surfE1"],
  ["surfE1", "surfE2"],
  ["deep9", "deepE0"],
  ["deepE0", "deepE1"],
  ["deepE1", "deepE2"],
  ["surfE1", "deepE1"],
]

/**
 * Terrestrial sky band above the ridges — closed loop inside the water-beat
 * frame (not the cosmos inner rim). Arc threads the cloud asterism:
 * vapor arrival right → transport → rain from the west puff.
 */
export const EARTH_ATMOSPHERE = [
  { x: -80, y: 380, r: 1.4 },
  { x: 228, y: 368, r: 1.45 },
  { x: 428, y: 322, r: 1.7 },
  { x: 736, y: 296, r: 1.9 },
  { x: 1224, y: 336, r: 1.7 },
  { x: 1416, y: 382, r: 1.45 },
] as const

export type EarthCloudStar = {
  id: string
  x: number
  y: number
  r: number
  puff: "west" | "apex" | "east"
}

/**
 * Cloud asterism in the sky band — constellation puffs, not another river.
 * West is the primary node (rain falls from here). Apex and east transport.
 */
export const EARTH_CLOUDS: readonly EarthCloudStar[] = [
  { id: "cw-core", x: 428, y: 322, r: 2.35, puff: "west" },
  { id: "cw-nw", x: 398, y: 304, r: 1.55, puff: "west" },
  { id: "cw-ne", x: 458, y: 306, r: 1.6, puff: "west" },
  { id: "cw-sw", x: 404, y: 342, r: 1.4, puff: "west" },
  { id: "cw-se", x: 454, y: 340, r: 1.45, puff: "west" },
  { id: "cw-w", x: 376, y: 326, r: 1.3, puff: "west" },
  { id: "ca-core", x: 736, y: 296, r: 2.15, puff: "apex" },
  { id: "ca-nw", x: 710, y: 280, r: 1.4, puff: "apex" },
  { id: "ca-ne", x: 760, y: 282, r: 1.45, puff: "apex" },
  { id: "ca-s", x: 732, y: 314, r: 1.35, puff: "apex" },
  { id: "ce-core", x: 1224, y: 336, r: 2.2, puff: "east" },
  { id: "ce-nw", x: 1192, y: 318, r: 1.45, puff: "east" },
  { id: "ce-ne", x: 1256, y: 320, r: 1.5, puff: "east" },
  { id: "ce-s", x: 1232, y: 356, r: 1.4, puff: "east" },
  { id: "ce-e", x: 1280, y: 344, r: 1.3, puff: "east" },
  /** Feeds the second, farther peak's own rain — its own closed water cycle. */
  { id: "cf-core", x: -80, y: 300, r: 2.2, puff: "west" },
  { id: "cf-nw", x: -108, y: 284, r: 1.4, puff: "west" },
  { id: "cf-ne", x: -52, y: 284, r: 1.45, puff: "west" },
  { id: "cf-s", x: -80, y: 320, r: 1.35, puff: "west" },
]

export const EARTH_CLOUD_LINKS: ReadonlyArray<readonly [string, string]> = [
  ["cw-core", "cw-nw"],
  ["cw-core", "cw-ne"],
  ["cw-core", "cw-sw"],
  ["cw-core", "cw-se"],
  ["cw-nw", "cw-w"],
  ["cw-sw", "cw-w"],
  ["cw-nw", "cw-ne"],
  ["ca-core", "ca-nw"],
  ["ca-core", "ca-ne"],
  ["ca-core", "ca-s"],
  ["ca-nw", "ca-ne"],
  ["ce-core", "ce-nw"],
  ["ce-core", "ce-ne"],
  ["ce-core", "ce-s"],
  ["ce-ne", "ce-e"],
  ["ce-s", "ce-e"],
  ["cf-core", "cf-nw"],
  ["cf-core", "cf-ne"],
  ["cf-core", "cf-s"],
]

/** Ocean evaporate → east puff → apex → west puff (through the clouds). */
export const EARTH_VAPOR: ReadonlyArray<{ x: number; y: number }> = [
  { x: 1510, y: 858 },
  { x: 1532, y: 700 },
  { x: 1494, y: 520 },
  { x: 1416, y: 382 },
  { x: 1224, y: 336 },
  { x: 736, y: 296 },
  { x: 428, y: 322 },
]

/** Land evaporate (soil under the feet, left of the figure) → west cloud. */
export const EARTH_LAND_VAPOR: ReadonlyArray<{ x: number; y: number }> = [
  { x: 488, y: 840 },
  { x: 452, y: 680 },
  { x: 418, y: 500 },
  { x: 428, y: 322 },
]

/** Rain leaves the primary west puff and falls on the mountain peak. */
export const EARTH_RAIN: ReadonlyArray<{ x: number; y: number }> = [
  { x: 428, y: 322 },
  { x: 320, y: 430 },
  { x: 228, y: 520 },
  { x: 188, y: 668 },
]

/**
 * Second, self-contained cycle out at the far-left edge: `cf-core` rains onto
 * `far-peak`, the "far" river carries it down to `far-base`, and
 * `FAR_LAND_VAPOR` evaporates it back up to `cf-core` — closing the loop
 * without needing its own sea.
 */
export const FAR_RAIN: ReadonlyArray<{ x: number; y: number }> = [
  { x: -80, y: 300 },
  { x: -60, y: 420 },
  { x: -40, y: 560 },
  { x: -20, y: 726 },
]

export const FAR_LAND_VAPOR: ReadonlyArray<{ x: number; y: number }> = [
  { x: -200, y: 858 },
  { x: -160, y: 680 },
  { x: -110, y: 480 },
  { x: -80, y: 300 },
]

export type TransitKind = "plane" | "train" | "truck"

export interface TransitRoute {
  id: string
  kind: TransitKind
  appear: 5 | 6 | 7
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
}

/**
 * Planes ride high arcs (still inside the cosmos). Trains are long horizontals
 * through society/markets. Trucks are short ground hauls: harvest → market
 * and market ↔ people.
 */
export const TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: "air-we",
    kind: "plane",
    appear: 6,
    x1: 200,
    y1: 210,
    cx: 800,
    cy: -20,
    x2: 1380,
    y2: 210,
  },
  {
    id: "air-ew",
    kind: "plane",
    appear: 6,
    x1: 1420,
    y1: 380,
    cx: 800,
    cy: 40,
    x2: 180,
    y2: 380,
  },
  {
    id: "rail-n",
    kind: "train",
    appear: 7,
    x1: 250,
    y1: 250,
    cx: 800,
    cy: 210,
    x2: 1320,
    y2: 250,
  },
  {
    id: "rail-s",
    kind: "train",
    appear: 7,
    x1: 300,
    y1: 560,
    cx: 800,
    cy: 600,
    x2: 1280,
    y2: 560,
  },
  {
    id: "truck-food-l",
    kind: "truck",
    appear: 7,
    x1: 420,
    y1: 730,
    cx: 340,
    cy: 640,
    x2: 300,
    y2: 560,
  },
  {
    id: "truck-food-r",
    kind: "truck",
    appear: 7,
    x1: 1060,
    y1: 720,
    cx: 1180,
    cy: 640,
    x2: 1280,
    y2: 560,
  },
  {
    id: "truck-food-m",
    kind: "truck",
    appear: 7,
    x1: 800,
    y1: 705,
    cx: 800,
    cy: 668,
    x2: 800,
    y2: 630,
  },
  {
    id: "truck-soc-l",
    kind: "truck",
    appear: 7,
    x1: 280,
    y1: 400,
    cx: 310,
    cy: 400,
    x2: 340,
    y2: 400,
  },
  {
    id: "truck-soc-r",
    kind: "truck",
    appear: 7,
    x1: 1340,
    y1: 430,
    cx: 1360,
    cy: 405,
    x2: 1380,
    y2: 380,
  },
]

/**
 * Low orbit around the earth-band / human world — inside the cosmic circle.
 * Satellites ride this ring; ships leave it for a galaxy on the outer web.
 */
export const SATELLITE_ORBIT_R = 540
export const SATELLITE_COUNT = 8
/** Clockwise ring, ~4 min / revolution. SVG +deg is clockwise on screen. */
export const COSMOS_SPIN_DEG = 1.5
/** Satellite orbit, ~60 s / revolution. */
export const SATELLITE_SPIN_DEG = 6

export function spinPoint(x: number, y: number, deg: number) {
  const r = (deg * Math.PI) / 180
  const dx = x - COSMOS_CENTER.x
  const dy = y - COSMOS_CENTER.y
  return {
    x: COSMOS_CENTER.x + dx * Math.cos(r) - dy * Math.sin(r),
    y: COSMOS_CENTER.y + dx * Math.sin(r) + dy * Math.cos(r),
  }
}

export function satellitePoint(index: number, deg = 0) {
  const a =
    -Math.PI / 2 +
    (index / SATELLITE_COUNT) * Math.PI * 2 +
    (deg * Math.PI) / 180
  return {
    x: WORLD_CENTER.x + Math.cos(a) * SATELLITE_ORBIT_R,
    y: WORLD_CENTER.y + Math.sin(a) * SATELLITE_ORBIT_R,
  }
}

/** A slightly higher ring than the comm satellites — telescopes, not relays. */
export const HUBBLE_ORBIT_R = SATELLITE_ORBIT_R + 46
export const HUBBLE_COUNT = 2

export function hubblePoint(index: number, deg = 0) {
  const a =
    -Math.PI / 2 +
    (0.5 / SATELLITE_COUNT) * Math.PI * 2 +
    (index / HUBBLE_COUNT) * Math.PI * 2 +
    (deg * Math.PI) / 180
  return {
    x: WORLD_CENTER.x + Math.cos(a) * HUBBLE_ORBIT_R,
    y: WORLD_CENTER.y + Math.sin(a) * HUBBLE_ORBIT_R,
  }
}

/**
 * Sun + moon ring — Earth's immediate space, an inner cycle nested inside the
 * outer cosmic web. Clears the whisper-figure's widest point (feet, ~r 380
 * from `WORLD_CENTER`) with room to spare, and sits just inside the cosmic
 * web ring (920) rather than close to the body.
 */
export const SUN_MOON_ORBIT_R = 800
/** Slow — a subtle drift across the cosmos+water beats, not a spinning wheel. */
export const SUN_MOON_SPIN_DEG = 6

export function sunMoonPoint(which: "sun" | "moon", deg: number) {
  const a =
    -Math.PI / 2 + (which === "moon" ? Math.PI : 0) + (deg * Math.PI) / 180
  return {
    x: WORLD_CENTER.x + Math.cos(a) * SUN_MOON_ORBIT_R,
    y: WORLD_CENTER.y + Math.sin(a) * SUN_MOON_ORBIT_R,
  }
}

export const SPACE_LAUNCH = { x: 860, y: 168 }

export type SomaGalaxyKind =
  | "spiral"
  | "elliptical"
  | "halo"
  | "solar"
  | "cluster"

export interface SomaGalaxy {
  id: string
  cx: number
  cy: number
  rx: number
  ry: number
  kind: SomaGalaxyKind
  arms: number
  n: number
  /** Radians per second. Sign is spin direction. */
  spin: number
  /** Static tilt in degrees so even a still frame is not axis-aligned. */
  tilt: number
  seed: number
}

export interface GalaxyStar {
  x: number
  y: number
  r: number
}

/** 30° offset keeps discs off 6 o'clock — above the audience sentence. */
const GALAXY_PHASE = Math.PI / 6

function galaxyOnRing(index: number, count: number) {
  const a = -Math.PI / 2 + GALAXY_PHASE + (index / count) * Math.PI * 2
  return {
    x: COSMOS_CENTER.x + Math.cos(a) * COSMOS_RADIUS,
    y: COSMOS_CENTER.y + Math.sin(a) * COSMOS_RADIUS,
  }
}

function galaxyRand(seed: number, i: number) {
  const x = Math.sin((seed + 1) * 12.9898 + i * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Six distinct discs on the perfect cosmic circle.
 * Radii are ~2.1–2.4× the old 40–74px spirals / 40px ellipticals,
 * solar system kept smaller as a distinct motif.
 */
const GALAXY_SPEC: ReadonlyArray<Omit<SomaGalaxy, "cx" | "cy">> = [
  {
    id: "g-spiral-a",
    rx: 152,
    ry: 64,
    kind: "spiral",
    arms: 3,
    n: 36,
    spin: 0.072,
    tilt: 16,
    seed: 11,
  },
  {
    id: "g-halo",
    rx: 128,
    ry: 118,
    kind: "halo",
    arms: 0,
    n: 16,
    spin: -0.048,
    tilt: -8,
    seed: 24,
  },
  {
    id: "g-elliptical",
    rx: 98,
    ry: 48,
    kind: "elliptical",
    arms: 0,
    n: 32,
    spin: -0.028,
    tilt: -18,
    seed: 50,
  },
  {
    id: "g-solar",
    rx: 76,
    ry: 34,
    kind: "solar",
    arms: 0,
    n: 5,
    spin: 0.09,
    tilt: 6,
    seed: 37,
  },
  {
    id: "g-spiral-b",
    rx: 140,
    ry: 58,
    kind: "spiral",
    arms: 2,
    n: 30,
    spin: -0.095,
    tilt: 22,
    seed: 63,
  },
  {
    id: "g-cluster",
    rx: 88,
    ry: 82,
    kind: "cluster",
    arms: 0,
    n: 28,
    spin: 0.055,
    tilt: 4,
    seed: 76,
  },
]

/** Galaxies sit on the perfect cosmic circle — not a scattered rim. */
export const SOMA_GALAXIES: SomaGalaxy[] = GALAXY_SPEC.map((g, i) => {
  const p = galaxyOnRing(i, GALAXY_SPEC.length)
  return { ...g, cx: p.x, cy: p.y }
})

export function solarGalaxy() {
  return SOMA_GALAXIES.find((g) => g.kind === "solar") ?? SOMA_GALAXIES[3]!
}

export function haloGalaxy() {
  return SOMA_GALAXIES.find((g) => g.kind === "halo") ?? SOMA_GALAXIES[1]!
}

export const SOLAR_ORBITS = [0.36, 0.55, 0.74, 0.94] as const

export function galaxyArmPaths(g: SomaGalaxy): string[] {
  if (g.kind !== "spiral" || g.arms < 1) return []
  return Array.from({ length: g.arms }, (_, arm) => {
    const t0 = (arm * Math.PI * 2) / g.arms
    const steps = 7
    const parts: string[] = []
    for (let i = 0; i <= steps; i++) {
      const u = i / steps
      const t = t0 + u * 2.45
      const rad = 0.12 + 0.84 * u
      const x = Math.cos(t) * g.rx * rad
      const y = Math.sin(t) * g.ry * rad
      parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return parts.join(" ")
  })
}

export function galaxyStars(g: SomaGalaxy): GalaxyStar[] {
  const out: GalaxyStar[] = []
  if (g.kind === "spiral") {
    for (let i = 0; i < 8; i++) {
      const t = (i / 8) * Math.PI * 2 + 0.18
      const rad = 0.07 + galaxyRand(g.seed, i) * 0.11
      out.push({
        x: Math.cos(t) * g.rx * rad,
        y: Math.sin(t) * g.ry * rad,
        r: 1.55 + (i % 3) * 0.28,
      })
    }
    const perArm = Math.ceil(g.n / Math.max(1, g.arms))
    for (let i = 0; i < g.n; i++) {
      const arm = g.arms > 0 ? i % g.arms : 0
      const u = Math.floor(i / Math.max(1, g.arms)) / perArm
      const t = arm * ((Math.PI * 2) / Math.max(1, g.arms)) + u * 2.45
      const jitter = (galaxyRand(g.seed, i + 20) - 0.5) * 0.1
      const rad = 0.2 + 0.78 * u
      out.push({
        x: Math.cos(t) * g.rx * (rad + jitter),
        y: Math.sin(t) * g.ry * (rad + jitter * 0.55),
        r: 1.5 + (i % 4) * 0.3,
      })
    }
    return out
  }
  if (g.kind === "elliptical") {
    for (let i = 0; i < g.n; i++) {
      const t = galaxyRand(g.seed, i) * Math.PI * 2
      const rad = Math.pow(galaxyRand(g.seed, i + 50), 0.52) * 0.94
      out.push({
        x: Math.cos(t) * g.rx * rad,
        y: Math.sin(t) * g.ry * rad,
        r: 1.45 + (i % 3) * 0.32,
      })
    }
    return out
  }
  if (g.kind === "halo") {
    for (let i = 0; i < 7; i++) {
      const t = (i / 7) * Math.PI * 2
      const rad = 0.05 + galaxyRand(g.seed, i) * 0.09
      out.push({
        x: Math.cos(t) * g.rx * rad,
        y: Math.sin(t) * g.ry * rad,
        r: 1.85 + (i % 2) * 0.35,
      })
    }
    for (let i = 0; i < g.n; i++) {
      const t = galaxyRand(g.seed, i + 80) * Math.PI * 2
      const rad = 0.5 + galaxyRand(g.seed, i + 90) * 0.48
      out.push({
        x: Math.cos(t) * g.rx * rad,
        y: Math.sin(t) * g.ry * rad,
        r: 1.25 + (i % 3) * 0.22,
      })
    }
    return out
  }
  if (g.kind === "solar") {
    SOLAR_ORBITS.forEach((rad, oi) => {
      const t = (g.seed * 0.17 + oi * 1.37) % (Math.PI * 2)
      out.push({
        x: Math.cos(t) * g.rx * rad,
        y: Math.sin(t) * g.ry * rad,
        r: 2.05 - oi * 0.18,
      })
    })
    const moonT = (g.seed * 0.17 + 1.37) % (Math.PI * 2)
    out.push({
      x: Math.cos(moonT) * g.rx * 0.55 + 7.5,
      y: Math.sin(moonT) * g.ry * 0.55,
      r: 1.1,
    })
    return out
  }
  for (let i = 0; i < g.n; i++) {
    const t = galaxyRand(g.seed, i) * Math.PI * 2
    const rad = Math.pow(galaxyRand(g.seed, i + 40), 0.68) * 0.88
    out.push({
      x: Math.cos(t) * g.rx * rad,
      y: Math.sin(t) * g.ry * rad,
      r: 1.35 + (i % 5) * 0.3,
    })
  }
  return out
}

export const SOCIAL_CLUSTERS = [
  { id: "family", label: "FAMILY", x: 240, y: 148 },
  { id: "work", label: "WORK", x: 180, y: 330 },
  { id: "city", label: "COMMUNITY", x: 240, y: 500 },
  { id: "kin", label: "FRIENDS", x: 1340, y: 148 },
  { id: "forum", label: "GOVERNMENT", x: 1380, y: 360 },
  { id: "school", label: "SCHOOL", x: 1340, y: 560 },
] as const

/**
 * Five market sectors paired with the societal cluster they trade with most
 * directly (retail↔family, manufacturing↔work, services↔community,
 * technology↔friends, finance↔government) — positioned right at that
 * cluster's own label so the market sector reads as laid over the society
 * network, not floating above it in empty space. Commodities is the
 * exception: it trades with the earth/food-web layer, not a social cluster,
 * so instead of sitting over a society cluster it moves off to the side of
 * the body figure (its nodes sit at torso height; a label at (800, 612)
 * lands right on the body).
 */
export const MARKET_CLUSTERS = [
  { id: "retail", label: "RETAIL", x: 220, y: 175 },
  { id: "manufacturing", label: "MANUFACTURING", x: 200, y: 300 },
  { id: "services", label: "SERVICES", x: 260, y: 470 },
  { id: "technology", label: "TECHNOLOGY", x: 1320, y: 175 },
  { id: "finance", label: "FINANCE", x: 1360, y: 330 },
  { id: "commodities", label: "COMMODITIES", x: 1080, y: 650 },
] as const

/** Five-senses names sit beside the sense nodes — never in the audience type band. */
export const SENSE_LABELS = [
  { id: "vision", label: "VISION", x: 710, y: 136 },
  { id: "hearing", label: "HEARING", x: 658, y: 168 },
  { id: "smell", label: "SMELL", x: 878, y: 174 },
  { id: "taste", label: "TASTE", x: 872, y: 220 },
  { id: "touch", label: "TOUCH", x: 548, y: 260 },
] as const

export const INK_GLYPHS = ["א", "a", "文", "λ", "و", "m", "ش"] as const

export function somaNode(id: string) {
  return SOMA_NODES.find((n) => n.id === id)
}

export function isSomaBrain(id: string) {
  return somaNode(id)?.kind === "brain"
}

export function visibleSoma(era: SomaEra) {
  return {
    nodes: SOMA_NODES.filter((n) => era > 0 && n.era <= era),
    edges: SOMA_EDGES.filter((e) => e.era <= era && era > 0),
  }
}

/**
 * One spatial world. Each `appear` is a reveal threshold — once a layer is
 * shown it stays. Cosmos (1) opens the show. Water (2) then mycelium (3)
 * fill the earth band. The body arrives in that world. Food web (4) lives
 * in the appendix — not the main prelude. Language / art / music / invention
 * (5), then society (6) and markets (7). Satellites and ships (8), then the
 * internet (9). Pullback is camera, not a new graphic.
 *
 *                    COSMOS — perfect circle around (800, 450)
 *                 clouds (sky asterism) return vapor to the peaks
 *                              society · markets · transit
 *                    \  MUSIC  ART  LANGUAGE  INVENTION  /
 *                     \         (from the BRAIN)        /
 *                      \         HUMAN + BRAIN         /
 *     LEFT mountains → blue river → soil / mycelium → ocean RIGHT
 */
export type SomaCompanion = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/** Soil cross-section. Stays open once the earth is revealed. */
export type SomaEarth = "none" | "mycelium" | "photosynthesis" | "food"

export type CompanionId =
  | "mycelium"
  | "cosmos"
  | "watercycle"
  | "foodweb"
  | "social"
  | "economy"
  | "writing"
  | "music"
  | "art"
  | "invention"
  | "internet"

export type CompanionMark =
  | "dot"
  | "glyph"
  | "person"
  | "letter"
  | "note"
  | "stroke"
  | "gear"
export type CompanionPulse = "dot" | "ink" | "note" | "stroke" | "gear" | "none"

export interface NatureNode {
  id: string
  x: number
  y: number
  r: number
  mark?: CompanionMark
  /** Person-asterism scale. */
  scale?: number
  cluster?:
    | "family"
    | "work"
    | "city"
    | "kin"
    | "forum"
    | "school"
    | "retail"
    | "manufacturing"
    | "services"
    | "technology"
    | "finance"
    | "commodities"
}

export interface NatureEdge {
  source: string
  target: string
  cx: number
  cy: number
}

export interface NatureGraph {
  id: CompanionId
  label: string
  appear: Exclude<SomaCompanion, 0>
  labelX: number
  labelY: number
  pulse: CompanionPulse
  /** Soma edge kinds that re-light when this graph is watched. */
  rhyme: SomaEdgeKind[]
  nodes: NatureNode[]
  edges: NatureEdge[]
}

export const NATURE_GRAPHS: NatureGraph[] = [
  {
    id: "mycelium",
    label: "mycelium",
    appear: 3,
    labelX: 932,
    labelY: EARTH_HORIZON_Y + 64 + MYCELIUM_WEB_DY,
    pulse: "dot",
    rhyme: ["nerve"],
    nodes: [
      { id: "m0", x: 800, y: 842 + MYCELIUM_WEB_DY, r: 3.2 },
      { id: "m1", x: 668, y: 844 + MYCELIUM_WEB_DY, r: 2.4 },
      { id: "m2", x: 932, y: 844 + MYCELIUM_WEB_DY, r: 2.4 },
      { id: "m3", x: 548, y: 848 + MYCELIUM_WEB_DY, r: 2.1 },
      { id: "m4", x: 1020, y: 832 + MYCELIUM_WEB_DY, r: 2.1 },
      { id: "m5", x: 748, y: 836 + MYCELIUM_WEB_DY, r: 1.8 },
      { id: "m6", x: 852, y: 836 + MYCELIUM_WEB_DY, r: 1.8 },
      { id: "m7", x: 488, y: 840 + MYCELIUM_WEB_DY, r: 1.6 },
      { id: "m8", x: 1070, y: 848 + MYCELIUM_WEB_DY, r: 1.6 },
      { id: "m9", x: 800, y: 854 + MYCELIUM_WEB_DY, r: 2.0 },
    ],
    edges: [
      { source: "m0", target: "m1", cx: 730, cy: 838 + MYCELIUM_WEB_DY },
      { source: "m0", target: "m2", cx: 870, cy: 836 + MYCELIUM_WEB_DY },
      { source: "m1", target: "m3", cx: 600, cy: 848 + MYCELIUM_WEB_DY },
      { source: "m2", target: "m4", cx: 980, cy: 836 + MYCELIUM_WEB_DY },
      { source: "m1", target: "m5", cx: 700, cy: 842 + MYCELIUM_WEB_DY },
      { source: "m2", target: "m6", cx: 900, cy: 842 + MYCELIUM_WEB_DY },
      { source: "m3", target: "m7", cx: 510, cy: 846 + MYCELIUM_WEB_DY },
      { source: "m4", target: "m8", cx: 1050, cy: 842 + MYCELIUM_WEB_DY },
      { source: "m5", target: "m9", cx: 770, cy: 848 + MYCELIUM_WEB_DY },
      { source: "m6", target: "m9", cx: 830, cy: 848 + MYCELIUM_WEB_DY },
    ],
  },
  {
    id: "cosmos",
    label: "cosmic web",
    appear: 1,
    labelX: 800,
    labelY: COSMOS_CENTER.y - COSMOS_RADIUS + 36,
    pulse: "dot",
    rhyme: ["nerve"],
    nodes: Array.from({ length: COSMOS_STAR_COUNT }, (_, i) => {
      const p = cosmosPoint(i)
      return { id: `c${i}`, x: p.x, y: p.y, r: i % 6 === 0 ? 2.6 : 1.8 }
    }),
    edges: Array.from({ length: COSMOS_STAR_COUNT }, (_, i) => {
      const j = (i + 1) % COSMOS_STAR_COUNT
      const m = cosmosMid(i, j)
      return { source: `c${i}`, target: `c${j}`, cx: m.x, cy: m.y }
    }),
  },
  {
    id: "watercycle",
    label: "water cycle",
    appear: 2,
    labelX: 90,
    labelY: 360,
    pulse: "none",
    rhyme: ["blood"],
    nodes: [
      { id: "peak", x: 188, y: 668, r: 2.6 },
      { id: "soil", x: 800, y: 842, r: 2.2 },
      { id: "ocean", x: 1488, y: 824, r: 2.4 },
      { id: "cloud-e", x: 1224, y: 336, r: 2.2 },
      { id: "cloud", x: 428, y: 322, r: 2.4 },
    ],
    edges: [
      { source: "peak", target: "soil", cx: 420, cy: 790 },
      { source: "soil", target: "ocean", cx: 1140, cy: 838 },
      { source: "ocean", target: "cloud-e", cx: 1580, cy: 580 },
      { source: "cloud-e", target: "cloud", cx: 736, cy: 280 },
      { source: "cloud", target: "peak", cx: 280, cy: 500 },
    ],
  },
  {
    id: "foodweb",
    label: "food web",
    appear: 4,
    labelX: 800,
    labelY: 500,
    pulse: "dot",
    rhyme: ["blood", "hormone"],
    nodes: [
      { id: "f-insect", x: 430, y: 724, r: 1.8 },
      { id: "f-hare", x: 520, y: 688, r: 2.4 },
      { id: "f-insect-c", x: 736, y: 776, r: 1.7 },
      { id: "f-fox", x: 500, y: 575, r: 2.8 },
      { id: "f-bird", x: 1008, y: 498, r: 2.6 },
      { id: "f-fish", x: 1224, y: 786, r: 2.4 },
      { id: "f-mouth", x: 800, y: 210, r: 2.2 },
      { id: "f-gut", x: 808, y: 448, r: 2.0 },
    ],
    edges: [
      { source: "f-insect", target: "f-hare", cx: 468, cy: 710 },
      { source: "f-hare", target: "f-fox", cx: 508, cy: 628 },
      { source: "f-hare", target: "f-bird", cx: 760, cy: 560 },
      { source: "f-insect", target: "f-bird", cx: 680, cy: 580 },
      { source: "f-insect-c", target: "f-bird", cx: 920, cy: 620 },
      { source: "f-fish", target: "f-bird", cx: 1140, cy: 620 },
      { source: "f-fox", target: "f-mouth", cx: 640, cy: 360 },
      { source: "f-bird", target: "f-mouth", cx: 940, cy: 330 },
      { source: "f-hare", target: "f-gut", cx: 650, cy: 540 },
      { source: "f-fish", target: "f-gut", cx: 1040, cy: 560 },
    ],
  },
  {
    id: "social",
    label: "people",
    appear: 6,
    labelX: 800,
    labelY: 96,
    pulse: "dot",
    rhyme: ["motor", "nerve"],
    nodes: [
      {
        id: "sf0",
        x: 220,
        y: 190,
        r: 2.2,
        mark: "person",
        scale: 0.92,
        cluster: "family",
      },
      {
        id: "sf1",
        x: 300,
        y: 210,
        r: 2.2,
        mark: "person",
        scale: 0.95,
        cluster: "family",
      },
      {
        id: "sf2",
        x: 200,
        y: 260,
        r: 2.2,
        mark: "person",
        scale: 0.9,
        cluster: "family",
      },
      {
        id: "sf3",
        x: 290,
        y: 280,
        r: 2.0,
        mark: "person",
        scale: 0.7,
        cluster: "family",
      },
      {
        id: "sw0",
        x: 180,
        y: 380,
        r: 2.2,
        mark: "person",
        scale: 0.88,
        cluster: "work",
      },
      {
        id: "sw1",
        x: 260,
        y: 360,
        r: 2.2,
        mark: "person",
        scale: 0.9,
        cluster: "work",
      },
      {
        id: "sw2",
        x: 340,
        y: 400,
        r: 2.2,
        mark: "person",
        scale: 0.88,
        cluster: "work",
      },
      {
        id: "sw3",
        x: 220,
        y: 440,
        r: 2.1,
        mark: "person",
        scale: 0.86,
        cluster: "work",
      },
      {
        id: "sw4",
        x: 310,
        y: 450,
        r: 2.1,
        mark: "person",
        scale: 0.86,
        cluster: "work",
      },
      {
        id: "sc0",
        x: 170,
        y: 540,
        r: 2.0,
        mark: "person",
        scale: 0.78,
        cluster: "city",
      },
      {
        id: "sc1",
        x: 260,
        y: 560,
        r: 2.0,
        mark: "person",
        scale: 0.8,
        cluster: "city",
      },
      {
        id: "sc2",
        x: 350,
        y: 540,
        r: 2.0,
        mark: "person",
        scale: 0.78,
        cluster: "city",
      },
      {
        id: "sc3",
        x: 400,
        y: 590,
        r: 2.0,
        mark: "person",
        scale: 0.76,
        cluster: "city",
      },
      {
        id: "sc4",
        x: 210,
        y: 610,
        r: 1.9,
        mark: "person",
        scale: 0.74,
        cluster: "city",
      },
      {
        id: "sc5",
        x: 330,
        y: 620,
        r: 1.9,
        mark: "person",
        scale: 0.74,
        cluster: "city",
      },
      {
        id: "sk0",
        x: 1280,
        y: 190,
        r: 2.2,
        mark: "person",
        scale: 0.92,
        cluster: "kin",
      },
      {
        id: "sk1",
        x: 1360,
        y: 210,
        r: 2.2,
        mark: "person",
        scale: 0.95,
        cluster: "kin",
      },
      {
        id: "sk2",
        x: 1260,
        y: 260,
        r: 2.2,
        mark: "person",
        scale: 0.9,
        cluster: "kin",
      },
      {
        id: "sk3",
        x: 1350,
        y: 280,
        r: 2.0,
        mark: "person",
        scale: 0.7,
        cluster: "kin",
      },
      {
        id: "sr0",
        x: 1300,
        y: 400,
        r: 2.2,
        mark: "person",
        scale: 0.88,
        cluster: "forum",
      },
      {
        id: "sr1",
        x: 1380,
        y: 380,
        r: 2.2,
        mark: "person",
        scale: 0.9,
        cluster: "forum",
      },
      {
        id: "sr2",
        x: 1420,
        y: 450,
        r: 2.2,
        mark: "person",
        scale: 0.88,
        cluster: "forum",
      },
      {
        id: "sr3",
        x: 1280,
        y: 480,
        r: 2.1,
        mark: "person",
        scale: 0.86,
        cluster: "forum",
      },
      {
        id: "sr4",
        x: 1370,
        y: 510,
        r: 2.1,
        mark: "person",
        scale: 0.86,
        cluster: "forum",
      },
      {
        id: "sb0",
        x: 1260,
        y: 600,
        r: 1.9,
        mark: "person",
        scale: 0.72,
        cluster: "school",
      },
      {
        id: "sb1",
        x: 1340,
        y: 620,
        r: 1.9,
        mark: "person",
        scale: 0.7,
        cluster: "school",
      },
      {
        id: "sb2",
        x: 1420,
        y: 600,
        r: 1.9,
        mark: "person",
        scale: 0.7,
        cluster: "school",
      },
      {
        id: "sb3",
        x: 1460,
        y: 650,
        r: 1.9,
        mark: "person",
        scale: 0.72,
        cluster: "school",
      },
      {
        id: "sb4",
        x: 1300,
        y: 670,
        r: 1.8,
        mark: "person",
        scale: 0.68,
        cluster: "school",
      },
      {
        id: "sb5",
        x: 1400,
        y: 680,
        r: 1.8,
        mark: "person",
        scale: 0.68,
        cluster: "school",
      },
    ],
    edges: [
      { source: "sf0", target: "sf1", cx: 258, cy: 188 },
      { source: "sf0", target: "sf2", cx: 198, cy: 228 },
      { source: "sf1", target: "sf3", cx: 304, cy: 248 },
      { source: "sf2", target: "sf3", cx: 244, cy: 276 },
      { source: "sw0", target: "sw1", cx: 218, cy: 360 },
      { source: "sw1", target: "sw2", cx: 304, cy: 372 },
      { source: "sw0", target: "sw3", cx: 188, cy: 414 },
      { source: "sw2", target: "sw4", cx: 336, cy: 430 },
      { source: "sw3", target: "sw4", cx: 266, cy: 452 },
      { source: "sc0", target: "sc1", cx: 212, cy: 542 },
      { source: "sc1", target: "sc2", cx: 308, cy: 542 },
      { source: "sc2", target: "sc3", cx: 384, cy: 560 },
      { source: "sc0", target: "sc4", cx: 176, cy: 580 },
      { source: "sc3", target: "sc5", cx: 372, cy: 612 },
      { source: "sf2", target: "sw0", cx: 176, cy: 320 },
      { source: "sf3", target: "sw1", cx: 284, cy: 320 },
      { source: "sw3", target: "sc1", cx: 230, cy: 500 },
      { source: "sw4", target: "sc2", cx: 340, cy: 496 },
      { source: "sk0", target: "sk1", cx: 1320, cy: 188 },
      { source: "sk0", target: "sk2", cx: 1258, cy: 228 },
      { source: "sk1", target: "sk3", cx: 1364, cy: 248 },
      { source: "sk2", target: "sk3", cx: 1304, cy: 276 },
      { source: "sr0", target: "sr1", cx: 1340, cy: 380 },
      { source: "sr1", target: "sr2", cx: 1410, cy: 410 },
      { source: "sr0", target: "sr3", cx: 1278, cy: 444 },
      { source: "sr2", target: "sr4", cx: 1406, cy: 484 },
      { source: "sr3", target: "sr4", cx: 1326, cy: 504 },
      { source: "sk2", target: "sr0", cx: 1268, cy: 330 },
      { source: "sk3", target: "sr1", cx: 1374, cy: 330 },
      { source: "sb0", target: "sb1", cx: 1298, cy: 604 },
      { source: "sb1", target: "sb2", cx: 1380, cy: 604 },
      { source: "sb2", target: "sb3", cx: 1448, cy: 620 },
      { source: "sb0", target: "sb4", cx: 1268, cy: 640 },
      { source: "sb3", target: "sb5", cx: 1436, cy: 670 },
      { source: "sr3", target: "sb0", cx: 1260, cy: 536 },
      { source: "sr4", target: "sb1", cx: 1360, cy: 562 },
    ],
  },
  {
    id: "economy",
    label: "markets",
    appear: 7,
    // Overall category label, same top-center convention as "people" (800,
    // 96) — the six sector labels (MARKET_CLUSTERS) carry the per-cluster
    // names, including "COMMODITIES" at the old (800, 612) spot.
    labelX: 800,
    labelY: 96,
    pulse: "dot",
    rhyme: ["blood"],
    nodes: [
      { id: "e0", x: 250, y: 250, r: 3.0, cluster: "manufacturing" },
      { id: "e1", x: 280, y: 400, r: 3.2, cluster: "manufacturing" },
      { id: "e2", x: 300, y: 560, r: 3.0, cluster: "services" },
      { id: "e3", x: 420, y: 480, r: 2.6, cluster: "services" },
      { id: "e4", x: 1320, y: 250, r: 3.0, cluster: "finance" },
      { id: "e5", x: 1340, y: 430, r: 3.2, cluster: "finance" },
      { id: "e6", x: 1280, y: 560, r: 3.0, cluster: "finance" },
      { id: "e7", x: 640, y: 650, r: 2.6, cluster: "commodities" },
      { id: "e8", x: 960, y: 650, r: 2.6, cluster: "commodities" },
      { id: "e9", x: 800, y: 630, r: 2.8, cluster: "commodities" },
      { id: "e10", x: 200, y: 480, r: 2.0, cluster: "manufacturing" },
      { id: "e11", x: 1440, y: 480, r: 2.0, cluster: "finance" },
      { id: "e12", x: 360, y: 330, r: 1.8, cluster: "manufacturing" },
      { id: "e13", x: 1240, y: 330, r: 1.8, cluster: "finance" },
      // Retail and technology have no pre-existing market presence near
      // family/friends — small new clusters laid right over that same node
      // patch (family's sf0-3 / kin's sk0-3 sit at x200-300/x1260-1360,
      // y190-280) instead of floating above it, wired into the existing
      // mesh through e0/e4 so they read as part of the same market, not
      // islands.
      { id: "r0", x: 230, y: 205, r: 2.0, cluster: "retail" },
      { id: "r1", x: 285, y: 225, r: 2.0, cluster: "retail" },
      { id: "r2", x: 245, y: 255, r: 1.8, cluster: "retail" },
      { id: "t0", x: 1310, y: 205, r: 2.0, cluster: "technology" },
      { id: "t1", x: 1355, y: 225, r: 2.0, cluster: "technology" },
      { id: "t2", x: 1315, y: 255, r: 1.8, cluster: "technology" },
    ],
    edges: [
      { source: "r0", target: "r1", cx: 257, cy: 210 },
      { source: "r0", target: "r2", cx: 232, cy: 232 },
      { source: "r1", target: "r2", cx: 270, cy: 245 },
      { source: "r2", target: "e0", cx: 248, cy: 252 },
      { source: "t0", target: "t1", cx: 1338, cy: 210 },
      { source: "t0", target: "t2", cx: 1308, cy: 232 },
      { source: "t1", target: "t2", cx: 1340, cy: 245 },
      { source: "t2", target: "e4", cx: 1318, cy: 252 },
      { source: "e0", target: "e12", cx: 300, cy: 280 },
      { source: "e12", target: "e1", cx: 330, cy: 370 },
      { source: "e1", target: "e10", cx: 230, cy: 440 },
      { source: "e10", target: "e2", cx: 240, cy: 530 },
      { source: "e1", target: "e3", cx: 360, cy: 430 },
      { source: "e2", target: "e3", cx: 370, cy: 530 },
      { source: "e2", target: "e7", cx: 460, cy: 620 },
      { source: "e7", target: "e9", cx: 720, cy: 646 },
      { source: "e9", target: "e8", cx: 880, cy: 646 },
      { source: "e8", target: "e6", cx: 1140, cy: 620 },
      { source: "e4", target: "e13", cx: 1288, cy: 280 },
      { source: "e13", target: "e5", cx: 1300, cy: 380 },
      { source: "e5", target: "e11", cx: 1400, cy: 450 },
      { source: "e11", target: "e6", cx: 1370, cy: 530 },
      { source: "e5", target: "e6", cx: 1320, cy: 500 },
      { source: "e0", target: "e1", cx: 280, cy: 320 },
      { source: "e4", target: "e5", cx: 1348, cy: 330 },
      { source: "e3", target: "e9", cx: 580, cy: 560 },
      { source: "e13", target: "e9", cx: 1040, cy: 480 },
    ],
  },
  {
    id: "writing",
    label: "language",
    appear: 5,
    labelX: 1072,
    labelY: 92,
    pulse: "ink",
    rhyme: [],
    nodes: [
      { id: "mind", x: BRAIN_CENTER.x, y: BRAIN_CENTER.y, r: 2.8 },
      { id: "w1", x: 888, y: 128, r: 2.0, mark: "letter" },
      { id: "w2", x: 948, y: 156, r: 2.0, mark: "letter" },
      { id: "w3", x: 1008, y: 118, r: 2.0, mark: "letter" },
      { id: "w4", x: 1040, y: 178, r: 1.9, mark: "letter" },
      { id: "w5", x: 920, y: 208, r: 1.9, mark: "letter" },
      { id: "w6", x: 988, y: 228, r: 1.9, mark: "letter" },
      { id: "w7", x: 1060, y: 210, r: 1.8, mark: "letter" },
    ],
    edges: [
      { source: "mind", target: "w1", cx: 840, cy: 128 },
      { source: "mind", target: "w2", cx: 868, cy: 166 },
      { source: "mind", target: "w5", cx: 848, cy: 196 },
      { source: "w1", target: "w3", cx: 948, cy: 112 },
      { source: "w2", target: "w4", cx: 1000, cy: 160 },
      { source: "w2", target: "w6", cx: 968, cy: 200 },
      { source: "w5", target: "w6", cx: 952, cy: 226 },
      { source: "w3", target: "w4", cx: 1030, cy: 140 },
      { source: "w4", target: "w7", cx: 1056, cy: 190 },
      { source: "w6", target: "w7", cx: 1028, cy: 226 },
    ],
  },
  {
    id: "music",
    label: "music",
    appear: 5,
    labelX: 528,
    labelY: 88,
    pulse: "note",
    rhyme: [],
    nodes: [
      { id: "mind", x: BRAIN_CENTER.x, y: BRAIN_CENTER.y, r: 2.8 },
      { id: "n1", x: 712, y: 124, r: 2.0, mark: "note" },
      { id: "n2", x: 652, y: 152, r: 2.0, mark: "note" },
      { id: "n3", x: 592, y: 118, r: 2.0, mark: "note" },
      { id: "n4", x: 560, y: 176, r: 1.9, mark: "note" },
      { id: "n5", x: 680, y: 204, r: 1.9, mark: "note" },
      { id: "n6", x: 612, y: 224, r: 1.9, mark: "note" },
      { id: "n7", x: 548, y: 208, r: 1.8, mark: "note" },
    ],
    edges: [
      { source: "mind", target: "n1", cx: 760, cy: 126 },
      { source: "mind", target: "n2", cx: 732, cy: 164 },
      { source: "mind", target: "n5", cx: 752, cy: 194 },
      { source: "n1", target: "n3", cx: 652, cy: 110 },
      { source: "n2", target: "n4", cx: 600, cy: 158 },
      { source: "n2", target: "n6", cx: 632, cy: 196 },
      { source: "n5", target: "n6", cx: 648, cy: 222 },
      { source: "n3", target: "n4", cx: 568, cy: 140 },
      { source: "n4", target: "n7", cx: 546, cy: 190 },
      { source: "n6", target: "n7", cx: 576, cy: 224 },
    ],
  },
  /**
   * Mirrors `invention` exactly (same shape, x reflected across the 800
   * midline) so the four thought packets read as two symmetric pairs:
   * music/art on the right hemisphere (screen-left) and language/invention
   * on the left hemisphere (screen-right) — see `CAM_LANGUAGE`.
   */
  {
    id: "art",
    label: "art",
    appear: 5,
    labelX: 444,
    labelY: 220,
    pulse: "stroke",
    rhyme: [],
    nodes: [
      { id: "mind", x: BRAIN_CENTER.x, y: BRAIN_CENTER.y, r: 2.8 },
      { id: "a1", x: 648, y: 236, r: 2.0, mark: "stroke" },
      { id: "a2", x: 584, y: 258, r: 2.0, mark: "stroke" },
      { id: "a3", x: 516, y: 230, r: 2.0, mark: "stroke" },
      { id: "a4", x: 548, y: 292, r: 1.9, mark: "stroke" },
      { id: "a5", x: 620, y: 296, r: 1.9, mark: "stroke" },
      { id: "a6", x: 484, y: 276, r: 1.9, mark: "stroke" },
      { id: "a7", x: 564, y: 328, r: 1.8, mark: "stroke" },
    ],
    edges: [
      { source: "mind", target: "a1", cx: 732, cy: 208 },
      { source: "mind", target: "a2", cx: 700, cy: 224 },
      { source: "mind", target: "a5", cx: 740, cy: 248 },
      { source: "a1", target: "a3", cx: 580, cy: 220 },
      { source: "a2", target: "a4", cx: 556, cy: 268 },
      { source: "a2", target: "a6", cx: 528, cy: 256 },
      { source: "a5", target: "a4", cx: 584, cy: 304 },
      { source: "a3", target: "a6", cx: 492, cy: 248 },
      { source: "a4", target: "a7", cx: 552, cy: 318 },
      { source: "a6", target: "a7", cx: 516, cy: 312 },
    ],
  },
  {
    id: "invention",
    label: "invention",
    appear: 5,
    labelX: 1156,
    labelY: 220,
    pulse: "gear",
    rhyme: [],
    nodes: [
      { id: "mind", x: BRAIN_CENTER.x, y: BRAIN_CENTER.y, r: 2.8 },
      { id: "g1", x: 952, y: 236, r: 2.0, mark: "gear" },
      { id: "g2", x: 1016, y: 258, r: 2.0, mark: "gear" },
      { id: "g3", x: 1084, y: 230, r: 2.0, mark: "gear" },
      { id: "g4", x: 1052, y: 292, r: 1.9, mark: "gear" },
      { id: "g5", x: 980, y: 296, r: 1.9, mark: "gear" },
      { id: "g6", x: 1116, y: 276, r: 1.9, mark: "gear" },
      { id: "g7", x: 1036, y: 328, r: 1.8, mark: "gear" },
    ],
    edges: [
      { source: "mind", target: "g1", cx: 868, cy: 208 },
      { source: "mind", target: "g2", cx: 900, cy: 224 },
      { source: "mind", target: "g5", cx: 860, cy: 248 },
      { source: "g1", target: "g3", cx: 1020, cy: 220 },
      { source: "g2", target: "g4", cx: 1044, cy: 268 },
      { source: "g2", target: "g6", cx: 1072, cy: 256 },
      { source: "g5", target: "g4", cx: 1016, cy: 304 },
      { source: "g3", target: "g6", cx: 1108, cy: 248 },
      { source: "g4", target: "g7", cx: 1048, cy: 318 },
      { source: "g6", target: "g7", cx: 1084, cy: 312 },
    ],
  },
  {
    id: "internet",
    label: "internet",
    appear: 9,
    labelX: 800,
    labelY: -20,
    pulse: "dot",
    rhyme: [],
    nodes: [
      { id: "n0", x: 800, y: 8, r: 2.6 },
      { id: "n1", x: 420, y: 20, r: 2.2 },
      { id: "n2", x: 1180, y: 20, r: 2.2 },
      { id: "n3", x: 40, y: 260, r: 2.2 },
      { id: "n4", x: 1560, y: 260, r: 2.2 },
      { id: "n5", x: 30, y: 560, r: 2.0 },
      { id: "n6", x: 1570, y: 560, r: 2.0 },
      { id: "n7", x: 200, y: 100, r: 1.8 },
      { id: "n8", x: 1400, y: 100, r: 1.8 },
      { id: "n9", x: 180, y: 720, r: 1.8 },
      { id: "n10", x: 1420, y: 720, r: 1.8 },
    ],
    edges: [
      { source: "n1", target: "n0", cx: 600, cy: -4 },
      { source: "n0", target: "n2", cx: 1000, cy: -4 },
      { source: "n1", target: "n7", cx: 300, cy: 48 },
      { source: "n2", target: "n8", cx: 1300, cy: 48 },
      { source: "n7", target: "n3", cx: 80, cy: 170 },
      { source: "n8", target: "n4", cx: 1520, cy: 170 },
      { source: "n3", target: "n5", cx: 10, cy: 410 },
      { source: "n4", target: "n6", cx: 1590, cy: 410 },
      { source: "n5", target: "n9", cx: 80, cy: 650 },
      { source: "n6", target: "n10", cx: 1520, cy: 650 },
      { source: "n0", target: "n8", cx: 1140, cy: 20 },
      { source: "n0", target: "n7", cx: 460, cy: 20 },
      { source: "n9", target: "n10", cx: 800, cy: 780 },
    ],
  },
]

export function natureNode(graph: NatureGraph, id: string) {
  return graph.nodes.find((n) => n.id === id)
}

export function companionByAppear(level: SomaCompanion) {
  return NATURE_GRAPHS.find((g) => g.appear === level)
}

export function layerRevealed(
  appear: Exclude<SomaCompanion, 0>,
  level: SomaCompanion
) {
  return level >= appear
}

export type BridgeKind =
  | "food"
  | "water"
  | "social"
  | "trade"
  | "thought"
  | "cosmos"

/** Filaments between regions — the world is one asterism, not isolated motifs. */
export interface WorldBridge {
  id: string
  appear: Exclude<SomaCompanion, 0>
  kind: BridgeKind
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
  /** Attach once structure exists (era ≥ 3). Presence / energy only densify the figure. */
  needsBody?: boolean
  /** Traveling particle renders as this icon instead of a plain dot — the thought-packet bridges into `internet` carry their own glyph. */
  mark?: CompanionMark
}

export const WORLD_BRIDGES: WorldBridge[] = [
  // Plants / life → body once the figure exists (food beat draws its own fuel paths)
  {
    id: "food-tree-l-foot",
    appear: 4,
    kind: "food",
    x1: 400,
    y1: 680,
    cx: 540,
    cy: 720,
    x2: 754.9,
    y2: 800,
    needsBody: true,
  },
  {
    id: "food-tree-l-gut",
    appear: 4,
    kind: "food",
    x1: 400,
    y1: 680,
    cx: 560,
    cy: 540,
    x2: 804.4,
    y2: 606.4,
    needsBody: true,
  },
  {
    id: "food-tree-r-foot",
    appear: 4,
    kind: "food",
    x1: 1040,
    y1: 686,
    cx: 980,
    cy: 720,
    x2: 845.1,
    y2: 800,
    needsBody: true,
  },
  {
    id: "food-tree-r-gut",
    appear: 4,
    kind: "food",
    x1: 1040,
    y1: 686,
    cx: 1000,
    cy: 520,
    x2: 804.4,
    y2: 606.4,
    needsBody: true,
  },
  {
    id: "food-mid-pelvis",
    appear: 4,
    kind: "food",
    x1: 500,
    y1: 575,
    cx: 680,
    cy: 520,
    x2: 800,
    y2: 621.8,
    needsBody: true,
  },
  {
    id: "food-harvest-gut",
    appear: 4,
    kind: "food",
    x1: 736,
    y1: 776,
    cx: 808,
    cy: 620,
    x2: 804.4,
    y2: 606.4,
    needsBody: true,
  },
  {
    id: "food-harvest-l-foot",
    appear: 4,
    kind: "food",
    x1: 520,
    y1: 688,
    cx: 620,
    cy: 760,
    x2: 754.9,
    y2: 800,
    needsBody: true,
  },
  {
    id: "food-harvest-r-foot",
    appear: 4,
    kind: "food",
    x1: 1008,
    y1: 498,
    cx: 960,
    cy: 680,
    x2: 845.1,
    y2: 800,
    needsBody: true,
  },
  // Markets attach to the food web and feed the mouth
  {
    id: "food-f2-mouth",
    appear: 7,
    kind: "food",
    x1: 500,
    y1: 575,
    cx: 680,
    cy: 380,
    x2: 800,
    y2: 475.5,
    needsBody: true,
  },
  {
    id: "food-f1-mouth",
    appear: 7,
    kind: "food",
    x1: 520,
    y1: 688,
    cx: 640,
    cy: 420,
    x2: 800,
    y2: 475.5,
    needsBody: true,
  },
  {
    id: "food-f3-mouth",
    appear: 7,
    kind: "food",
    x1: 1008,
    y1: 498,
    cx: 920,
    cy: 340,
    x2: 800,
    y2: 475.5,
    needsBody: true,
  },
  {
    id: "food-mouth-gut",
    appear: 7,
    kind: "food",
    x1: 800,
    y1: 475.5,
    cx: 812,
    cy: 330,
    x2: 804.4,
    y2: 606.4,
    needsBody: true,
  },
  {
    id: "food-h0-e2",
    appear: 7,
    kind: "food",
    x1: 430,
    y1: 724,
    cx: 340,
    cy: 660,
    x2: 300,
    y2: 560,
  },
  {
    id: "food-h1-e3",
    appear: 7,
    kind: "food",
    x1: 520,
    y1: 688,
    cx: 480,
    cy: 580,
    x2: 420,
    y2: 480,
  },
  {
    id: "food-h2-e9",
    appear: 7,
    kind: "food",
    x1: 500,
    y1: 575,
    cx: 680,
    cy: 620,
    x2: 800,
    y2: 630,
  },
  {
    id: "food-h3-e6",
    appear: 7,
    kind: "food",
    x1: 1008,
    y1: 498,
    cx: 1160,
    cy: 540,
    x2: 1280,
    y2: 560,
  },
  {
    id: "food-h4-e5",
    appear: 7,
    kind: "food",
    x1: 1224,
    y1: 786,
    cx: 1280,
    cy: 600,
    x2: 1340,
    y2: 430,
  },
  {
    id: "food-tree-l-e1",
    appear: 7,
    kind: "food",
    x1: 400,
    y1: 680,
    cx: 320,
    cy: 520,
    x2: 280,
    y2: 400,
  },
  {
    id: "food-tree-r-e4",
    appear: 7,
    kind: "food",
    x1: 1040,
    y1: 686,
    cx: 1180,
    cy: 430,
    x2: 1320,
    y2: 250,
  },
  {
    id: "food-h5-e0",
    appear: 7,
    kind: "food",
    x1: 500,
    y1: 575,
    cx: 360,
    cy: 400,
    x2: 250,
    y2: 250,
  },
  {
    id: "food-e9-mouth",
    appear: 7,
    kind: "food",
    x1: 800,
    y1: 630,
    cx: 800,
    cy: 400,
    x2: 800,
    y2: 475.5,
    needsBody: true,
  },
  {
    id: "food-e3-mouth",
    appear: 7,
    kind: "food",
    x1: 420,
    y1: 480,
    cx: 560,
    cy: 320,
    x2: 800,
    y2: 475.5,
    needsBody: true,
  },
  {
    id: "food-e6-mouth",
    appear: 7,
    kind: "food",
    x1: 1280,
    y1: 560,
    cx: 1100,
    cy: 360,
    x2: 800,
    y2: 475.5,
    needsBody: true,
  },
  // Water cycle: rain → mountains → rivers → ocean → clouds (closed loop)
  {
    id: "water-rain",
    appear: 2,
    kind: "water",
    x1: 428,
    y1: 322,
    cx: 260,
    cy: 500,
    x2: 188,
    y2: 668,
  },
  {
    id: "water-peak-soil",
    appear: 2,
    kind: "water",
    x1: 200,
    y1: 712,
    cx: 420,
    cy: 790,
    x2: 800,
    y2: 842,
  },
  {
    id: "water-soil-ocean",
    appear: 2,
    kind: "water",
    x1: 800,
    y1: 842,
    cx: 1080,
    cy: 838,
    x2: 1368,
    y2: 824,
  },
  {
    id: "water-foot-l",
    appear: 2,
    kind: "water",
    x1: 754.9,
    y1: 800,
    cx: 730,
    cy: 820,
    x2: 771.4,
    y2: 819.8,
    needsBody: true,
  },
  {
    id: "water-foot-r",
    appear: 2,
    kind: "water",
    x1: 845.1,
    y1: 800,
    cx: 870,
    cy: 820,
    x2: 828.6,
    y2: 819.8,
    needsBody: true,
  },
  {
    id: "water-ocean-vapor",
    appear: 2,
    kind: "water",
    x1: 1488,
    y1: 844,
    cx: 1520,
    cy: 620,
    x2: 1224,
    y2: 336,
  },
  {
    id: "water-vapor-cloud",
    appear: 2,
    kind: "water",
    x1: 1224,
    y1: 336,
    cx: 736,
    cy: 268,
    x2: 428,
    y2: 322,
  },
  {
    id: "water-land-vapor",
    appear: 2,
    kind: "water",
    x1: 488,
    y1: 840,
    cx: 400,
    cy: 520,
    x2: 428,
    y2: 322,
  },
  // Body ↔ people on both sides (school sits under government, not between the legs)
  {
    id: "social-hand-l-work",
    appear: 6,
    kind: "social",
    x1: 674.6,
    y1: 666.9,
    cx: 420,
    cy: 480,
    x2: 340,
    y2: 400,
    needsBody: true,
  },
  {
    id: "social-hand-l-city",
    appear: 6,
    kind: "social",
    x1: 674.6,
    y1: 666.9,
    cx: 450,
    cy: 590,
    x2: 400,
    y2: 590,
    needsBody: true,
  },
  {
    id: "social-skin-family",
    appear: 6,
    kind: "social",
    x1: 705.4,
    y1: 507.4,
    cx: 440,
    cy: 240,
    x2: 300,
    y2: 210,
    needsBody: true,
  },
  {
    id: "social-hand-r-forum",
    appear: 6,
    kind: "social",
    x1: 925.4,
    y1: 666.9,
    cx: 1160,
    cy: 500,
    x2: 1280,
    y2: 480,
    needsBody: true,
  },
  {
    id: "social-hand-r-kin",
    appear: 6,
    kind: "social",
    x1: 925.4,
    y1: 666.9,
    cx: 1160,
    cy: 360,
    x2: 1260,
    y2: 260,
    needsBody: true,
  },
  /**
   * Was anchored at (950, 236) — almost exactly `invention`'s g1 node
   * (952, 236), not a real body point, and missing `needsBody` unlike every
   * other body-connecting bridge here — so it read as sprouting from the
   * invention glyph instead of the figure. Mirrors `social-skin-family`'s
   * source exactly (1600 - 705.4 = 894.6) so kin/friends connects to the
   * human the same way family does.
   */
  {
    id: "social-skin-kin",
    appear: 6,
    kind: "social",
    x1: 894.6,
    y1: 507.4,
    cx: 1160,
    cy: 240,
    x2: 1280,
    y2: 190,
    needsBody: true,
  },
  {
    id: "social-hand-r-school",
    appear: 6,
    kind: "social",
    x1: 925.4,
    y1: 666.9,
    cx: 1140,
    cy: 580,
    x2: 1260,
    y2: 600,
    needsBody: true,
  },
  {
    id: "social-hip-gather-r",
    appear: 6,
    kind: "social",
    x1: 835.2,
    y1: 633.9,
    cx: 1080,
    cy: 560,
    x2: 1300,
    y2: 670,
    needsBody: true,
  },
  // People ↔ economy (value on the social edges)
  {
    id: "trade-hand-l",
    appear: 7,
    kind: "trade",
    x1: 420,
    y1: 480,
    cx: 490,
    cy: 520,
    x2: 674.6,
    y2: 666.9,
    needsBody: true,
  },
  {
    id: "trade-hand-r",
    appear: 7,
    kind: "trade",
    x1: 1340,
    y1: 430,
    cx: 1180,
    cy: 500,
    x2: 925.4,
    y2: 666.9,
    needsBody: true,
  },
  // trade-work: manufacturing (e1) ↔ work. trade-forum: finance (e5) ↔ government.
  {
    id: "trade-work",
    appear: 7,
    kind: "trade",
    x1: 280,
    y1: 400,
    cx: 310,
    cy: 400,
    x2: 340,
    y2: 400,
  },
  {
    id: "trade-forum",
    appear: 7,
    kind: "trade",
    x1: 1340,
    y1: 430,
    cx: 1360,
    cy: 440,
    x2: 1380,
    y2: 380,
  },
  // commodities (e9) ↔ the earth/food-web layer, not a social cluster.
  {
    id: "trade-gather",
    appear: 7,
    kind: "trade",
    x1: 800,
    y1: 630,
    cx: 800,
    cy: 660,
    x2: 800,
    y2: 700,
  },
  // The two market sectors with no pre-existing node near their society
  // cluster (see MARKET_CLUSTERS), plus a services ↔ community spoke that
  // had no trade-kind bridge at all before.
  {
    id: "trade-retail-family",
    appear: 7,
    kind: "trade",
    x1: 230,
    y1: 205,
    cx: 225,
    cy: 198,
    x2: 220,
    y2: 190,
  },
  {
    id: "trade-technology-kin",
    appear: 7,
    kind: "trade",
    x1: 1310,
    y1: 205,
    cx: 1295,
    cy: 198,
    x2: 1280,
    y2: 190,
  },
  {
    id: "trade-services-city",
    appear: 7,
    kind: "trade",
    x1: 360,
    y1: 520,
    cx: 300,
    cy: 555,
    x2: 260,
    y2: 560,
  },
  // Culture from the skull — four original thought packets, one bridge per hemisphere
  {
    id: "thought-write-invent",
    appear: 5,
    kind: "thought",
    x1: 1060,
    y1: 210,
    cx: 1076,
    cy: 216,
    x2: 1084,
    y2: 230,
  },
  /**
   * Was anchored to `art`'s old top-center node (880, 88); art now mirrors
   * invention on the opposite hemisphere (screen-left, next to music), so
   * that point is empty and the line read as dangling in from nowhere.
   * Mirrors `thought-write-invent` exactly: music's n7 (548, 208) to art's
   * a3 (516, 230), same as language's w7 to invention's g3.
   */
  {
    id: "thought-music-art",
    appear: 5,
    kind: "thought",
    x1: 548,
    y1: 208,
    cx: 524,
    cy: 216,
    x2: 516,
    y2: 230,
  },
  /**
   * Internet closes the ring and binds society + markets. All four thought
   * packets get their own purple line into the internet now, each carrying
   * its own icon (`mark`) rather than a plain dot — one per internet-graph
   * anchor node (`n1`/`n2` up top, `n7`/`n8` one tier down), mirrored
   * left/right the same way the packets themselves mirror each other.
   */
  {
    id: "net-invent",
    appear: 9,
    kind: "thought",
    x1: 1180,
    y1: 20,
    cx: 1160,
    cy: 140,
    x2: 1116,
    y2: 276,
    mark: "gear",
  },
  {
    id: "net-art",
    appear: 9,
    kind: "thought",
    x1: 420,
    y1: 20,
    cx: 440,
    cy: 140,
    x2: 484,
    y2: 276,
    mark: "stroke",
  },
  {
    id: "net-write",
    appear: 9,
    kind: "thought",
    x1: 1400,
    y1: 100,
    cx: 1204,
    cy: 70,
    x2: 1008,
    y2: 118,
    mark: "letter",
  },
  {
    id: "net-music",
    appear: 9,
    kind: "thought",
    x1: 200,
    y1: 100,
    cx: 396,
    cy: 70,
    x2: 592,
    y2: 118,
    mark: "note",
  },
  {
    id: "net-mind",
    appear: 9,
    kind: "thought",
    x1: 800,
    y1: 8,
    cx: 800,
    cy: 80,
    x2: BRAIN_CENTER.x,
    y2: BRAIN_CENTER.y,
  },
  {
    id: "net-forum",
    appear: 9,
    kind: "social",
    x1: 1570,
    y1: 560,
    cx: 1480,
    cy: 520,
    x2: 1420,
    y2: 450,
  },
  {
    id: "net-city",
    appear: 9,
    kind: "social",
    x1: 30,
    y1: 560,
    cx: 100,
    cy: 560,
    x2: 170,
    y2: 540,
  },
  /** The other two social clusters now reach the internet too, not just forum/city. */
  {
    id: "net-family",
    appear: 9,
    kind: "social",
    x1: 40,
    y1: 260,
    cx: 90,
    cy: 200,
    x2: 220,
    y2: 190,
  },
  {
    id: "net-work",
    appear: 9,
    kind: "social",
    x1: 180,
    y1: 720,
    cx: 120,
    cy: 550,
    x2: 180,
    y2: 380,
  },
  {
    id: "net-kin",
    appear: 9,
    kind: "social",
    x1: 1560,
    y1: 260,
    cx: 1510,
    cy: 200,
    x2: 1280,
    y2: 190,
  },
  {
    id: "net-school",
    appear: 9,
    kind: "social",
    x1: 1420,
    y1: 720,
    cx: 1480,
    cy: 550,
    x2: 1260,
    y2: 600,
  },
  {
    id: "net-e5",
    appear: 9,
    kind: "trade",
    x1: 1560,
    y1: 260,
    cx: 1460,
    cy: 350,
    x2: 1340,
    y2: 430,
  },
  {
    id: "net-e1",
    appear: 9,
    kind: "trade",
    x1: 40,
    y1: 260,
    cx: 160,
    cy: 330,
    x2: 280,
    y2: 400,
  },
  {
    id: "net-e9",
    appear: 9,
    kind: "trade",
    x1: 800,
    y1: 8,
    cx: 800,
    cy: 320,
    x2: 800,
    y2: 630,
  },
  // Cosmos filaments attach as their inner targets exist
  {
    id: "cosmos-crown",
    appear: 3,
    kind: "cosmos",
    x1: cosmosPoint(0).x,
    y1: cosmosPoint(0).y,
    cx: 800,
    cy: 12,
    x2: 800,
    y2: 419.4,
    needsBody: true,
  },
  {
    id: "cosmos-social",
    appear: 6,
    kind: "cosmos",
    x1: cosmosPoint(20).x,
    y1: cosmosPoint(20).y,
    cx: 40,
    cy: 240,
    x2: 220,
    y2: 190,
  },
  {
    id: "cosmos-markets",
    appear: 7,
    kind: "cosmos",
    x1: cosmosPoint(10).x,
    y1: cosmosPoint(10).y,
    cx: 1380,
    cy: 860,
    x2: 1280,
    y2: 560,
  },
  {
    id: "cosmos-internet",
    appear: 9,
    kind: "cosmos",
    x1: cosmosPoint(4).x,
    y1: cosmosPoint(4).y,
    cx: 1640,
    cy: 140,
    x2: 1560,
    y2: 260,
  },
]

export type JunctionHue = "water" | "soil" | "plant" | "food" | "trade"

/** Shared stars where two networks occupy the same coordinate — not stacked drawings. */
export interface WorldJunction {
  id: string
  x: number
  y: number
  hues: readonly JunctionHue[]
  appear: Exclude<SomaCompanion, 0>
}

export const WORLD_JUNCTIONS: WorldJunction[] = [
  ...WATER_SOIL_JUNCTIONS.map((j) => ({
    id: j.id,
    x: j.x,
    y: j.y,
    hues: ["water", "soil", "plant"] as const,
    appear: 3 as const,
  })),
  { id: "xj-harvest-f0", x: 430, y: 724, hues: ["food", "plant"], appear: 4 },
  { id: "xj-harvest-f2", x: 500, y: 575, hues: ["food", "plant"], appear: 4 },
  { id: "xj-harvest-f4", x: 1224, y: 786, hues: ["food", "plant"], appear: 4 },
  { id: "xj-mouth", x: 800, y: 475.5, hues: ["food", "trade"], appear: 7 },
  { id: "xj-h0-e2", x: 300, y: 560, hues: ["food", "trade"], appear: 7 },
  { id: "xj-h1-e3", x: 420, y: 480, hues: ["food", "trade"], appear: 7 },
  { id: "xj-h2-e9", x: 800, y: 630, hues: ["food", "trade"], appear: 7 },
  { id: "xj-h3-e6", x: 1280, y: 560, hues: ["food", "trade"], appear: 7 },
  { id: "xj-h4-e5", x: 1340, y: 430, hues: ["food", "trade"], appear: 7 },
  { id: "xj-tree-e1", x: 280, y: 400, hues: ["food", "trade"], appear: 7 },
]

export const EARTH_HORIZON_STARS = Array.from({ length: 12 }, (_, i) => ({
  x: EARTH_BAND_LEFT + 8 + i * 62,
  y: EARTH_HORIZON_Y + (i % 3) * 2 - 2,
  r: 1.15 + (i % 4) * 0.22,
}))

export type EarthPlantKind = "blade" | "stem" | "tree" | "shrub" | "reed"

export interface EarthPlant {
  x: number
  kind: EarthPlantKind
  h: number
  lean: number
  /** Extra life that arrives on the food-web beat. */
  food?: boolean
}

export const EARTH_PLANTS: EarthPlant[] = [
  { x: 380, kind: "blade", h: 22, lean: -0.18 },
  { x: 400, kind: "tree", h: 148, lean: -0.02 },
  { x: 428, kind: "blade", h: 28, lean: 0.12 },
  { x: 456, kind: "shrub", h: 54, lean: -0.06 },
  { x: 488, kind: "blade", h: 30, lean: -0.1 },
  { x: 520, kind: "stem", h: 72, lean: 0.05 },
  { x: 556, kind: "blade", h: 24, lean: 0.14 },
  { x: 590, kind: "blade", h: 34, lean: -0.12 },
  { x: 628, kind: "shrub", h: 50, lean: 0.04 },
  { x: 668, kind: "blade", h: 20, lean: 0.1 },
  { x: 708, kind: "blade", h: 26, lean: -0.08 },
  { x: 748, kind: "stem", h: 48, lean: 0.06 },
  { x: 852, kind: "stem", h: 48, lean: -0.05 },
  { x: 892, kind: "blade", h: 22, lean: 0.12 },
  { x: 932, kind: "blade", h: 32, lean: -0.1 },
  { x: 972, kind: "shrub", h: 56, lean: 0.04 },
  { x: 1008, kind: "blade", h: 24, lean: -0.16 },
  { x: 1040, kind: "tree", h: 142, lean: 0.02 },
  { x: 1072, kind: "blade", h: 28, lean: 0.14 },
  { x: 360, kind: "stem", h: 52, lean: 0.1, food: true },
  { x: 512, kind: "blade", h: 38, lean: 0.06, food: true },
  { x: 800, kind: "blade", h: 20, lean: -0.04, food: true },
  { x: 960, kind: "blade", h: 36, lean: -0.12, food: true },
  { x: 1088, kind: "shrub", h: 44, lean: 0.08, food: true },
  { x: 1148, kind: "reed", h: 92, lean: 0.14, food: true },
]

export interface EarthRootNode {
  id: string
  x: number
  y: number
  r: number
  tip?: boolean
}

export interface EarthRootEdge {
  source: string
  target: string
  cx: number
  cy: number
}

/** One plant's underground constellation — crown at the horizon, tips in the soil. */
export interface EarthRoot {
  plantX: number
  food?: boolean
  nodes: EarthRootNode[]
  edges: EarthRootEdge[]
}

function rootKey(x: number, slot: string) {
  return `rt-${Math.round(x)}-${slot}`
}

function makeRoot(plant: EarthPlant): EarthRoot {
  const y0 = EARTH_HORIZON_Y
  const depth =
    plant.kind === "tree"
      ? 38
      : plant.kind === "stem" || plant.kind === "shrub"
        ? 30
        : plant.kind === "reed"
          ? 16
          : 22
  const spread =
    plant.kind === "tree"
      ? 24
      : plant.kind === "shrub"
        ? 18
        : plant.kind === "stem"
          ? 15
          : plant.kind === "reed"
            ? 8
            : 11
  const lean = plant.lean * 10
  const crown: EarthRootNode = {
    id: rootKey(plant.x, "c"),
    x: plant.x,
    y: y0,
    r: plant.kind === "tree" ? 1.85 : 1.55,
  }
  const mid: EarthRootNode = {
    id: rootKey(plant.x, "m"),
    x: plant.x + lean,
    y: y0 + depth * 0.42,
    r: 1.25,
  }
  const left: EarthRootNode = {
    id: rootKey(plant.x, "l"),
    x: plant.x - spread + lean * 0.3,
    y: y0 + depth * 0.9,
    r: 1.2,
    tip: true,
  }
  const right: EarthRootNode = {
    id: rootKey(plant.x, "r"),
    x: plant.x + spread * 0.88 + lean * 0.2,
    y: y0 + depth * 0.86,
    r: 1.15,
    tip: true,
  }
  const nodes: EarthRootNode[] = [crown, mid, left, right]
  const edges: EarthRootEdge[] = [
    {
      source: crown.id,
      target: mid.id,
      cx: plant.x + lean * 0.4,
      cy: y0 + depth * 0.2,
    },
    {
      source: mid.id,
      target: left.id,
      cx: plant.x - spread * 0.45,
      cy: y0 + depth * 0.62,
    },
    {
      source: mid.id,
      target: right.id,
      cx: plant.x + spread * 0.4,
      cy: y0 + depth * 0.6,
    },
  ]
  if (plant.kind === "tree") {
    const tap: EarthRootNode = {
      id: rootKey(plant.x, "t"),
      x: plant.x + lean * 0.5,
      y: y0 + depth + 8,
      r: 1.25,
      tip: true,
    }
    const farL: EarthRootNode = {
      id: rootKey(plant.x, "fl"),
      x: plant.x - spread - 8,
      y: y0 + depth * 0.7,
      r: 1.1,
      tip: true,
    }
    nodes.push(tap, farL)
    edges.push(
      {
        source: mid.id,
        target: tap.id,
        cx: plant.x + lean * 0.3,
        cy: y0 + depth * 0.75,
      },
      {
        source: crown.id,
        target: farL.id,
        cx: plant.x - spread * 0.7,
        cy: y0 + 10,
      }
    )
  }
  return { plantX: plant.x, food: plant.food, nodes, edges }
}

function snapClosestTip(
  root: EarthRoot,
  at: { x: number; y: number }
): EarthRoot {
  const tips = root.nodes.filter((n) => n.tip)
  if (tips.length === 0) return root
  const tip = tips.reduce((best, n) => {
    const d = (n.x - at.x) ** 2 + (n.y - at.y) ** 2
    const bd = (best.x - at.x) ** 2 + (best.y - at.y) ** 2
    return d < bd ? n : best
  })
  return {
    ...root,
    nodes: root.nodes.map((n) =>
      n.id === tip.id ? { ...n, x: at.x, y: at.y, r: Math.max(n.r, 1.75) } : n
    ),
  }
}

export const EARTH_ROOTS: EarthRoot[] = EARTH_PLANTS.map((p) => {
  const root = makeRoot(p)
  const j = WATER_SOIL_JUNCTIONS.find((n) => n.plantX === p.x)
  return j ? snapClosestTip(root, j) : root
})

export interface WaterUptake {
  id: string
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
  x3: number
  y3: number
}

/** Blue water climbs the shared root star and greens as it becomes plant life. */
export const WATER_UPTAKE: WaterUptake[] = WATER_SOIL_JUNCTIONS.map((j) => {
  const root = EARTH_ROOTS.find((r) => r.plantX === j.plantX)
  const plant = EARTH_PLANTS.find((p) => p.x === j.plantX)
  const crown = root?.nodes[0] ?? { x: j.plantX, y: EARTH_HORIZON_Y }
  const mid = root?.nodes.find((n) => n.id.endsWith("-m")) ?? crown
  const h = plant?.h ?? 40
  const lean = plant?.lean ?? 0
  return {
    id: j.id,
    x1: j.x,
    y1: j.y,
    cx: mid.x,
    cy: mid.y,
    x2: crown.x,
    y2: crown.y,
    x3: (plant?.x ?? j.plantX) + lean * h * 0.85,
    y3: EARTH_HORIZON_Y - h * 0.85,
  }
})

export interface EarthHypha {
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
  /** Arrives with the food-web plants. */
  food?: boolean
}

function hyphaBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
  sag: number,
  food?: boolean
): EarthHypha {
  return {
    x1: a.x,
    y1: a.y,
    cx: (a.x + b.x) / 2,
    cy: (a.y + b.y) / 2 + sag,
    x2: b.x,
    y2: b.y,
    ...(food ? { food: true } : {}),
  }
}

type RootTip = EarthRootNode & { food?: boolean }

/** Gold hyphae weave through root tips and mid-nodes — shared junctions, crossing filaments. */
export const EARTH_HYPHAE: EarthHypha[] = (() => {
  const out: EarthHypha[] = []
  const seen = new Set<string>()
  const add = (h: EarthHypha) => {
    const key = `${Math.round(h.x1)},${Math.round(h.y1)}-${Math.round(h.x2)},${Math.round(h.y2)}`
    const rev = `${Math.round(h.x2)},${Math.round(h.y2)}-${Math.round(h.x1)},${Math.round(h.y1)}`
    if (seen.has(key) || seen.has(rev)) return
    seen.add(key)
    out.push(h)
  }

  const tips: RootTip[] = EARTH_ROOTS.flatMap((r) =>
    r.nodes.filter((n) => n.tip).map((n) => ({ ...n, food: r.food }))
  ).sort((a, b) => a.x - b.x)

  for (let i = 0; i < tips.length; i++) {
    const a = tips[i]
    if (!a) continue
    const b = tips[i + 1]
    const c = tips[i + 2]
    if (b && Math.abs(b.x - a.x) < 86) {
      add(hyphaBetween(a, b, 5 + (i % 3) * 3, a.food || b.food))
    }
    if (c && Math.abs(c.x - a.x) < 130 && i % 2 === 0) {
      add(hyphaBetween(a, c, -6 - (i % 2) * 3, a.food || c.food))
    }
  }

  const mids: RootTip[] = EARTH_ROOTS.flatMap((r) => {
    const n = r.nodes.find((node) => node.id.endsWith("-m"))
    return n ? [{ ...n, food: r.food }] : []
  })

  for (let i = 0; i < mids.length - 1; i++) {
    const a = mids[i]
    const b = mids[i + 1]
    if (!a || !b) continue
    if (Math.abs(b.x - a.x) < 95) {
      add(hyphaBetween(a, b, i % 2 === 0 ? 9 : -5, a.food || b.food))
    }
  }

  for (let i = 0; i < EARTH_ROOTS.length - 1; i++) {
    const here = EARTH_ROOTS[i]
    const next = EARTH_ROOTS[i + 1]
    if (!here || !next) continue
    const mid = here.nodes.find((n) => n.id.endsWith("-m"))
    const tip = next.nodes.find((n) => n.tip)
    if (mid && tip && Math.abs(next.plantX - here.plantX) < 100) {
      add(hyphaBetween(mid, tip, 4, here.food || next.food))
    }
  }

  const underL = EARTH_ROOTS.find((r) => r.plantX === 748)
  const underR = EARTH_ROOTS.find((r) => r.plantX === 852)
  const leftTip = underL?.nodes.find((n) => n.tip)
  const rightTip = underR?.nodes.find((n) => n.tip)
  if (leftTip && rightTip) add(hyphaBetween(leftTip, rightTip, 8))

  const deep = tips.filter((_, i) => i % 3 === 0)
  for (let i = 0; i < deep.length - 1; i++) {
    const a = deep[i]
    const b = deep[i + 1]
    if (!a || !b) continue
    add(hyphaBetween(a, b, 12, a.food || b.food))
  }

  const web = out.map((h) => ({
    ...h,
    y1: h.y1 + MYCELIUM_WEB_DY,
    cy: h.cy + MYCELIUM_WEB_DY,
    y2: h.y2 + MYCELIUM_WEB_DY,
  }))

  for (const root of EARTH_ROOTS) {
    const crown = root.nodes[0]
    const tip = root.nodes.find((n) => n.tip)
    if (!crown || !tip) continue
    web.push(
      hyphaBetween(
        crown,
        { x: tip.x, y: tip.y + MYCELIUM_WEB_DY },
        6,
        root.food
      )
    )
  }

  return web
})()

export type EarthLifeKind = "hare" | "fish" | "insect" | "bird" | "fox"
export type EarthLifeTier = "primary" | "predator"

/** Animal asterisms — who-eats-whom, not farm clip-art. */
export interface EarthLife {
  id: string
  kind: EarthLifeKind
  tier: EarthLifeTier
  x: number
  y: number
  scale?: number
}

export const EARTH_MOUTH = { x: 800, y: 475.5 }
export const EARTH_GUT = { x: 804.4, y: 606.4 }

export const EARTH_LIFE: EarthLife[] = [
  {
    id: "insect",
    kind: "insect",
    tier: "primary",
    x: 430,
    y: 724,
    scale: 0.72,
  },
  { id: "hare", kind: "hare", tier: "primary", x: 520, y: 688, scale: 1.05 },
  {
    id: "insect-c",
    kind: "insect",
    tier: "primary",
    x: 736,
    y: 776,
    scale: 0.62,
  },
  { id: "fish", kind: "fish", tier: "primary", x: 1224, y: 786, scale: 1.08 },
  { id: "fox", kind: "fox", tier: "predator", x: 500, y: 575, scale: 1.28 },
  { id: "bird", kind: "bird", tier: "predator", x: 1008, y: 498, scale: 1.22 },
]

export interface EarthFoodLink {
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
  /** Harvest filaments that arrive at the whisper body. */
  toBody?: boolean
}

/** Producers → grazers → predators → mouth / gut. */
export const EARTH_FOOD_LINKS: readonly EarthFoodLink[] = [
  { x1: 456, y1: 774, cx: 482, cy: 730, x2: 520, y2: 688 },
  { x1: 488, y1: 798, cx: 502, cy: 748, x2: 520, y2: 688 },
  { x1: 397, y1: 680, cx: 450, cy: 678, x2: 520, y2: 688 },
  { x1: 428, y1: 800, cx: 428, cy: 762, x2: 430, y2: 724 },
  { x1: 748, y1: 780, cx: 742, cy: 778, x2: 736, y2: 776 },
  { x1: 1159, y1: 736, cx: 1188, cy: 760, x2: 1224, y2: 786 },
  { x1: 520, y1: 688, cx: 508, cy: 628, x2: 500, y2: 575 },
  { x1: 520, y1: 688, cx: 760, cy: 560, x2: 1008, y2: 498 },
  { x1: 430, y1: 724, cx: 680, cy: 580, x2: 1008, y2: 498 },
  { x1: 736, y1: 776, cx: 880, cy: 620, x2: 1008, y2: 498 },
  { x1: 1224, y1: 786, cx: 1140, cy: 620, x2: 1008, y2: 498 },
  {
    x1: 500,
    y1: 575,
    cx: 640,
    cy: 360,
    x2: EARTH_MOUTH.x,
    y2: EARTH_MOUTH.y,
    toBody: true,
  },
  {
    x1: 1008,
    y1: 498,
    cx: 940,
    cy: 330,
    x2: EARTH_MOUTH.x,
    y2: EARTH_MOUTH.y,
    toBody: true,
  },
  {
    x1: 520,
    y1: 688,
    cx: 650,
    cy: 540,
    x2: EARTH_GUT.x,
    y2: EARTH_GUT.y,
    toBody: true,
  },
  {
    x1: 1224,
    y1: 786,
    cx: 1040,
    cy: 560,
    x2: EARTH_GUT.x,
    y2: EARTH_GUT.y,
    toBody: true,
  },
]
