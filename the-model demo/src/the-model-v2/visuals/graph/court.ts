/**
 * The basketball movements — one shot, then one team.
 *
 * This is the hinge of the whole argument, so it is deliberately built on top
 * of the existing body rather than beside it. The shooter *is* the soma figure
 * from the prelude (graph/soma.ts, drawn at `BODY_SCALE` around
 * `BODY_ANCHOR`): the same gold nerves the audience watched disclose
 * organ-by-organ now carry a motor command to a wrist. Nothing new is
 * introduced except a basket, a defender and a ball.
 *
 * Coordinates here are final screen space in the 1600×900 viewBox — the body
 * tables in graph/soma.ts are already run through `bx`/`by`, so anything that
 * has to line up with the figure is placed against the transformed values,
 * measured rather than estimated:
 *
 *     crown       800, 419      feet        755/845, 800
 *     eye         788, 448      ankles      757/843, 774
 *     shoulder-r  883, 489      hand-r      925, 667
 *
 * Body height is therefore 381 units. A regulation rim is 1.6 body-heights
 * above the floor, which puts it at y≈190; it sits at 250 instead, because
 * the extra 60 units of headroom cost nothing legible and keep the rim off
 * the top edge at this camera. The anatomical figure stays put — its nerves
 * are the motor chain — and the shot itself is a reduced copy of the same
 * skeleton the team uses. The ball leaves the shooting hand's fingertips.
 *
 * The team sequence then replaces the single figure with five reduced copies
 * of this same skeleton — structural joints only, at the same proportions —
 * and plays one possession: the inbound, the step in, the call, the three,
 * the crash, the tip.
 */

/** Right of the figure, rim at shooting height. The body faces screen-right. */
export const COURT_HOOP = { x: 1248, y: 250 }
export const COURT_RIM_RX = 30
export const COURT_BACKBOARD = { x: 1286, y: 178, w: 13, h: 112 }
export const COURT_POLE = { x: 1293, y: 290, y2: 800 }

/** The floor line the figure already stands on — `foot-l`/`foot-r`, not `BODY_ANCHOR`. */
export const COURT_FLOOR_Y = 800
export const COURT_FLOOR_LEFT = 360
export const COURT_FLOOR_RIGHT = 1380

/**
 * The solo shooter, between the anatomical figure and the rim. Same reduced
 * skeleton as the team. `layoutMiniSoma` plants the feet on `COURT_FLOOR_Y`.
 */
export const COURT_DEFENDER = {
  x: 992,
  y: 683,
  h: 352,
}

/**
 * What has to reach the brain before the shot. Every stream ends at the
 * cortex. The labels name the information, and the picture is the claim.
 */
export const COURT_PERCEPTION: Array<{
  id: string
  label: string
  /** Where in the scene this signal originates. */
  x: number
  y: number
}> = [
  { id: "basket", label: "BASKET", x: 1248, y: 250 },
  { id: "defender", label: "DEFENDER", x: 1036, y: 540 },
  { id: "ball", label: "BALL", x: 968, y: 704 },
  { id: "balance", label: "BALANCE", x: 640, y: 400 },
  { id: "stance", label: "STANCE", x: 690, y: 790 },
  { id: "contact", label: "CONTACT", x: 700, y: 610 },
]

/**
 * Already resident, the same verbs as the inbound pause. They sit in the
 * open air left of the skull so the arm can be the thing that leaves.
 */
export const SHOT_SYSTEMS: Array<{ id: string; label: string; x: number; y: number }> = [
  { id: "perceive", label: "PERCEIVE", x: 560, y: 330 },
  { id: "model", label: "MODEL", x: 530, y: 410 },
  { id: "act", label: "ACT", x: 575, y: 490 },
]

/** Brain → the shooting arm. The network that takes the action. */
export const SHOT_ACTION = ["cortex-r", "stem", "shoulder-r", "elbow-r", "wrist-r", "hand-r"] as const

/**
 * Brain → spinal cord → periphery, in firing order. The beat's line is "the
 * network coordinates the action," and this is the literal path the pulse
 * takes: no single node in it produces the shot.
 */
export const COURT_MOTOR_CHAIN = [
  "cortex-r",
  "stem",
  "spine-mid",
  "hip-r",
  "knee-r",
  "ankle-r",
  "hip-l",
  "spine-mid",
  "shoulder-r",
  "elbow-r",
  "wrist-r",
  "hand-r",
] as const

/** Observe → model → predict → act → sense. Five stations, small orbit beside
 *  the figure — the seed the final enterprise loop grows from. */
export const COURT_LOOP_STATIONS = [
  { id: "perceive", label: "Perceive", x: 414, y: 372 },
  { id: "model", label: "Model", x: 530, y: 290 },
  { id: "predict", label: "Predict", x: 646, y: 372 },
  { id: "act", label: "Act", x: 600, y: 512 },
  { id: "sense", label: "Sense", x: 460, y: 512 },
] as const

export const COURT_LOOP_PATH =
  "M 414 372 C 430 316, 480 286, 530 290 C 584 294, 636 324, 646 372 C 654 430, 632 488, 600 512 C 552 544, 492 540, 460 512 C 420 478, 398 422, 414 372 Z"

export type CourtStage = 0 | 1 | 2 | 3

// ── A reduced copy of the soma ──────────────────────────────────────────
//
// Joints below are the structural subset of graph/soma.ts, measured off the
// raw body (crown y 108, feet y 800, height 692) and stored as fractions of
// that height. x is anatomical right, which faces the basket (+screen x).
// y is up from the feet. Arms and legs are the same segment lengths as the
// original; a pose only changes their angles.

/**
 * Shoulder angle: 0 hangs down, positive swings toward +x, π is straight up.
 * Elbow is added to the shoulder. Wrist is added after the elbow — positive
 * cocks the hand back, negative snaps it toward the basket. Grip is 0 when
 * the fingers are extended and 1 when they curl around the ball.
 */
export interface ArmJoint {
  shoulder: number
  elbow: number
  wrist?: number
  grip?: number
}

export interface MiniPose {
  /** Radians. Positive leans the head toward the basket. */
  lean: number
  /** Screen pixels the whole body rises. */
  jump: number
  /** Screen pixels the pelvis drops. Knees have to bend with it. */
  crouch: number
  armL: ArmJoint
  armR: ArmJoint
  legL: { hip: number; knee: number }
  legR: { hip: number; knee: number }
}

const STAND: MiniPose = {
  lean: 0,
  jump: 0,
  crouch: 0,
  armL: { shoulder: -0.22, elbow: 0.42 },
  armR: { shoulder: 0.22, elbow: -0.42 },
  legL: { hip: 0.05, knee: 0.12 },
  legR: { hip: -0.04, knee: 0.12 },
}

/** Upright, both hands at the chest. He is facing the camera. */
const INBOUND: MiniPose = {
  ...STAND,
  lean: 0,
  armL: { shoulder: -0.2, elbow: 1.9 },
  armR: { shoulder: 0.2, elbow: -1.9 },
  legL: { hip: 0.04, knee: 0.08 },
  legR: { hip: -0.04, knee: 0.08 },
}

/** Planted, facing the camera, one arm up. He is not moving. */
const CALL: MiniPose = {
  ...STAND,
  lean: 0,
  armL: { shoulder: 0.2, elbow: 0.3 },
  armR: { shoulder: 2.95, elbow: -0.06 },
  legL: { hip: 0.05, knee: 0.08 },
  legR: { hip: -0.05, knee: 0.08 },
}

/** On the floor, body pitched toward the rim, legs in a stride. */
const SPRINT: MiniPose = {
  ...STAND,
  lean: 0.46,
  armL: { shoulder: 0.85, elbow: 0.7, wrist: 0, grip: 0 },
  armR: { shoulder: 1.55, elbow: 0.35, wrist: 0, grip: 0 },
  legL: { hip: 0.72, knee: 0.62 },
  legR: { hip: -0.48, knee: 0.45 },
}

/** The stride settles as he leaves the floor. Joints only move one way into the tip. */
const GATHER: MiniPose = {
  ...SPRINT,
  lean: 0.4,
  armL: { shoulder: 0.2, elbow: 0.4, wrist: 0, grip: 0 },
  armR: { shoulder: 1.85, elbow: 0.12, wrist: 0, grip: 0 },
  legL: { hip: 0.32, knee: 0.38 },
  legR: { hip: -0.22, knee: 0.28 },
}

const READY: MiniPose = {
  ...STAND,
  crouch: 6,
  armL: { shoulder: 0.55, elbow: 0.72 },
  armR: { shoulder: 0.72, elbow: 0.5 },
  legL: { hip: 0.28, knee: 0.5 },
  legR: { hip: -0.08, knee: 0.38 },
}

const CATCH: MiniPose = {
  ...STAND,
  armL: { shoulder: 0.95, elbow: 1.05, wrist: 0.08, grip: 0.35 },
  armR: { shoulder: 1.2, elbow: 1.12, wrist: 0.16, grip: 0.45 },
  legL: { hip: 0.14, knee: 0.22 },
  legR: { hip: -0.05, knee: 0.16 },
}

/** Right hand up and out, securing a pass that is getting away from him. */
const REACH: MiniPose = {
  ...STAND,
  lean: -0.08,
  crouch: 4,
  armL: { shoulder: 0.4, elbow: 0.55, wrist: 0, grip: 0 },
  armR: { shoulder: 1.85, elbow: 0.28, wrist: 0.06, grip: 0.1 },
  legL: { hip: 0.16, knee: 0.28 },
  legR: { hip: -0.22, knee: 0.2 },
}

const WATCH: MiniPose = {
  ...STAND,
  lean: 0.1,
  armL: { shoulder: 0.35, elbow: 0.3 },
  armR: { shoulder: 0.85, elbow: 0.4 },
}

/** Leaving the floor as the ball hits, arm rising toward the rim. */
const TAKEOFF: MiniPose = {
  ...STAND,
  lean: 0.18,
  jump: 36,
  armL: { shoulder: -0.7, elbow: 0.2 },
  armR: { shoulder: 2.15, elbow: -0.08 },
  legL: { hip: -0.72, knee: 0.5 },
  legR: { hip: -0.28, knee: 0.32 },
}

/** After the takeoff: body pitched, one arm reaching, legs trailing. */
const GLIDE: MiniPose = {
  ...STAND,
  lean: 0.62,
  jump: 88,
  armL: { shoulder: -1.05, elbow: 0.28 },
  armR: { shoulder: 1.85, elbow: -0.2 },
  legL: { hip: -0.95, knee: 0.8 },
  legR: { hip: -0.45, knee: 0.48 },
}

/** Right arm straight up, fingers open. The tip is a fingertip, not a grab. */
const TIP: MiniPose = {
  ...GLIDE,
  lean: 0.28,
  jump: 154,
  armL: { shoulder: -0.45, elbow: 0.35, wrist: 0, grip: 0 },
  armR: { shoulder: 2.88, elbow: 0.05, wrist: -0.28, grip: 0 },
  legL: { hip: -0.62, knee: 0.55 },
  legR: { hip: -0.22, knee: 0.32 },
}

const LAND: MiniPose = {
  ...STAND,
  lean: 0.1,
  crouch: 16,
  armL: { shoulder: 0.45, elbow: 0.55, grip: 0 },
  armR: { shoulder: 0.85, elbow: 0.5, grip: 0 },
  legL: { hip: 0.28, knee: 0.7 },
  legR: { hip: -0.12, knee: 0.55 },
}

const HANDS_UP: MiniPose = {
  ...STAND,
  armL: { shoulder: -1.95, elbow: 0.32 },
  armR: { shoulder: 2.05, elbow: -0.28 },
}

/** Torso joints. y is fraction of height above the feet; x is fraction of height. */
const TORSO: Array<{ id: string; x: number; y: number; r: number }> = [
  { id: "crown", x: 0, y: 1, r: 2.15 },
  { id: "temple-l", x: -0.075, y: 0.948, r: 1.55 },
  { id: "temple-r", x: 0.075, y: 0.948, r: 1.55 },
  { id: "skull", x: 0, y: 0.928, r: 1.9 },
  { id: "jaw-l", x: -0.046, y: 0.87, r: 1.35 },
  { id: "jaw-r", x: 0.046, y: 0.87, r: 1.35 },
  { id: "jaw", x: 0, y: 0.852, r: 1.5 },
  { id: "neck", x: 0, y: 0.826, r: 1.6 },
  { id: "clavicle-l", x: -0.116, y: 0.829, r: 1.25 },
  { id: "clavicle-r", x: 0.116, y: 0.829, r: 1.25 },
  { id: "shoulder-l", x: -0.217, y: 0.818, r: 1.7 },
  { id: "shoulder-r", x: 0.217, y: 0.818, r: 1.7 },
  { id: "scapula-l", x: -0.191, y: 0.769, r: 1.25 },
  { id: "scapula-r", x: 0.191, y: 0.769, r: 1.25 },
  { id: "sternum", x: 0, y: 0.751, r: 1.4 },
  { id: "rib-l", x: -0.113, y: 0.711, r: 1.3 },
  { id: "rib-r", x: 0.113, y: 0.711, r: 1.3 },
  { id: "thorax", x: 0, y: 0.705, r: 1.65 },
  { id: "rib-l2", x: -0.095, y: 0.653, r: 1.25 },
  { id: "rib-r2", x: 0.095, y: 0.653, r: 1.25 },
  { id: "spine", x: 0, y: 0.59, r: 1.55 },
  { id: "sacrum", x: 0, y: 0.503, r: 1.4 },
  { id: "iliac-l", x: -0.061, y: 0.494, r: 1.3 },
  { id: "iliac-r", x: 0.061, y: 0.494, r: 1.3 },
  { id: "pelvis", x: 0, y: 0.468, r: 1.7 },
  { id: "hip-l", x: -0.092, y: 0.436, r: 1.55 },
  { id: "hip-r", x: 0.092, y: 0.436, r: 1.55 },
]

/** Side-view hand. `fan` opens across the palm; `reach` is relative to the middle finger. */
const DIGITS = [
  { id: "thumb", fan: -0.5, reach: 0.68 },
  { id: "index", fan: -0.18, reach: 0.92 },
  { id: "middle", fan: 0.02, reach: 1 },
  { id: "ring", fan: 0.2, reach: 0.88 },
  { id: "pinky", fan: 0.4, reach: 0.68 },
] as const

const MINI_EDGES: Array<[string, string]> = [
  ["crown", "temple-l"],
  ["crown", "temple-r"],
  ["temple-l", "skull"],
  ["temple-r", "skull"],
  ["temple-l", "jaw-l"],
  ["temple-r", "jaw-r"],
  ["skull", "jaw"],
  ["jaw", "jaw-l"],
  ["jaw", "jaw-r"],
  ["jaw", "neck"],
  ["neck", "clavicle-l"],
  ["neck", "clavicle-r"],
  ["clavicle-l", "shoulder-l"],
  ["clavicle-r", "shoulder-r"],
  ["shoulder-l", "scapula-l"],
  ["shoulder-r", "scapula-r"],
  ["neck", "sternum"],
  ["sternum", "thorax"],
  ["thorax", "rib-l"],
  ["thorax", "rib-r"],
  ["thorax", "spine"],
  ["spine", "rib-l2"],
  ["spine", "rib-r2"],
  ["spine", "sacrum"],
  ["sacrum", "pelvis"],
  ["pelvis", "iliac-l"],
  ["pelvis", "iliac-r"],
  ["pelvis", "hip-l"],
  ["pelvis", "hip-r"],
  ["shoulder-l", "humerus-l"],
  ["humerus-l", "elbow-l"],
  ["elbow-l", "radius-l"],
  ["radius-l", "wrist-l"],
  ["wrist-l", "hand-l"],
  ["shoulder-r", "humerus-r"],
  ["humerus-r", "elbow-r"],
  ["elbow-r", "radius-r"],
  ["radius-r", "wrist-r"],
  ["wrist-r", "hand-r"],
  ["hip-l", "femur-l"],
  ["femur-l", "knee-l"],
  ["knee-l", "tibia-l"],
  ["tibia-l", "ankle-l"],
  ["ankle-l", "foot-l"],
  ["hip-r", "femur-r"],
  ["femur-r", "knee-r"],
  ["knee-r", "tibia-r"],
  ["tibia-r", "ankle-r"],
  ["ankle-r", "foot-r"],
]

for (const side of ["l", "r"] as const) {
  for (const digit of DIGITS) {
    MINI_EDGES.push([`hand-${side}`, `hand-${side}-${digit.id}`])
    MINI_EDGES.push([`hand-${side}-${digit.id}`, `hand-${side}-${digit.id}-tip`])
  }
}

export interface MiniNode {
  id: string
  x: number
  y: number
  r: number
}

export function layoutMiniSoma(
  pose: MiniPose,
  h: number,
  cx: number,
  floorY: number
): MiniNode[] {
  const k = h / 220
  const footLine = floorY - pose.jump + pose.crouch
  const pelvis = { x: cx, y: footLine - 0.468 * h }
  const c = Math.cos(pose.lean)
  const s = Math.sin(pose.lean)
  const nodes = new Map<string, MiniNode>()

  for (const n of TORSO) {
    const dx = n.x * h
    const dy = -(n.y - 0.468) * h
    nodes.set(n.id, {
      id: n.id,
      x: pelvis.x + dx * c - dy * s,
      y: pelvis.y + dx * s + dy * c,
      r: n.r * k,
    })
  }

  const limb = (
    side: "l" | "r",
    jointId: string,
    arm: ArmJoint,
    upper: number,
    fore: number,
    hand: number
  ) => {
    const joint = nodes.get(jointId)
    if (!joint) return
    const step = (ang: number, len: number, from: { x: number; y: number }) => ({
      x: from.x + Math.sin(ang) * len,
      y: from.y + Math.cos(ang) * len,
    })
    const theta = arm.shoulder
    const grip = arm.grip ?? 0
    const humerus = step(theta, upper * 0.42, joint)
    const elbow = step(theta, upper, joint)
    const foreAngle = theta + arm.elbow
    const radius = step(foreAngle, fore * 0.45, elbow)
    const wrist = step(foreAngle, fore, elbow)
    const handAngle = foreAngle + (arm.wrist ?? 0)
    const palm = step(handAngle, hand, wrist)
    const put = (id: string, p: { x: number; y: number }, r: number) =>
      nodes.set(id, { id, x: p.x, y: p.y, r: r * k })
    put(`humerus-${side}`, humerus, 1.3)
    put(`elbow-${side}`, elbow, 1.55)
    put(`radius-${side}`, radius, 1.25)
    put(`wrist-${side}`, wrist, 1.4)
    put(`hand-${side}`, palm, 1.65)
    // Curl swings the tips back under the ball. An open hand is a wider fan.
    const fingerLen = 0.072 * h
    const curl = grip * 1.15
    const fan = 0.42 + 0.58 * (1 - grip)
    for (const digit of DIGITS) {
      const base = handAngle + digit.fan * fan
      const tipAngle = base - curl * (digit.id === "thumb" ? 0.55 : 1)
      const knuckle = step(base, fingerLen * 0.4 * digit.reach, palm)
      const tip = step(tipAngle, fingerLen * 0.64 * digit.reach, knuckle)
      put(`hand-${side}-${digit.id}`, knuckle, 0.95)
      put(`hand-${side}-${digit.id}-tip`, tip, 0.8)
    }
  }

  // Segment lengths are the original body's, as fractions of height.
  limb("l", "shoulder-l", pose.armL, 0.241 * h, 0.194 * h, 0.048 * h)
  limb("r", "shoulder-r", pose.armR, 0.241 * h, 0.194 * h, 0.048 * h)

  const leg = (
    side: "l" | "r",
    hipAngle: number,
    kneeBend: number
  ) => {
    const hip = nodes.get(`hip-${side}`)
    if (!hip) return
    const thigh = 0.202 * h
    const shin = 0.165 * h
    const foot = 0.062 * h
    const step = (ang: number, len: number, from: { x: number; y: number }) => ({
      x: from.x + Math.sin(ang) * len,
      y: from.y + Math.cos(ang) * len,
    })
    const femur = step(hipAngle, thigh * 0.5, hip)
    const knee = step(hipAngle, thigh, hip)
    const shinAngle = hipAngle - kneeBend
    const tibia = step(shinAngle, shin * 0.5, knee)
    const ankle = step(shinAngle, shin, knee)
    const toe = step(shinAngle, foot, ankle)
    const put = (id: string, p: { x: number; y: number }, r: number) =>
      nodes.set(id, { id, x: p.x, y: p.y, r: r * k })
    put(`femur-${side}`, femur, 1.35)
    put(`knee-${side}`, knee, 1.6)
    put(`tibia-${side}`, tibia, 1.25)
    put(`ankle-${side}`, ankle, 1.4)
    put(`foot-${side}`, toe, 1.5)
  }

  leg("l", pose.legL.hip, pose.legL.knee)
  leg("r", pose.legR.hip, pose.legR.knee)

  return [...nodes.values()]
}

export function miniEdges() {
  return MINI_EDGES
}

export function miniNode(nodes: MiniNode[], id: string) {
  return nodes.find((n) => n.id === id)
}

/**
 * Where the ball sits on a hand: past the palm, along the wrist, on the
 * finger pads. Independent of curl, so a cocked hand holds the ball and the
 * snap carries it off the fingertips.
 */
export function shotPoint(nodes: MiniNode[], side: "l" | "r" = "r") {
  const wrist = miniNode(nodes, `wrist-${side}`)
  const palm = miniNode(nodes, `hand-${side}`)
  if (!wrist || !palm) return { x: palm?.x ?? 0, y: palm?.y ?? 0 }
  const dx = palm.x - wrist.x
  const dy = palm.y - wrist.y
  const len = Math.hypot(dx, dy) || 1
  const extra = len * 1.35
  return { x: palm.x + (dx / len) * extra, y: palm.y + (dy / len) * extra }
}

// ── The tip ─────────────────────────────────────────────────────────────
//
// Game 4, Knicks–Spurs, from the replay angle: the inbounder is at the top
// of the frame, facing the camera. He stops on the three-point line to call
// for the pass. When the shot goes up he sprints, jumps as the ball hits the
// front rim, and tips it on the way down off that bounce.

/** The possession, played once, in seconds. It does not loop. */
export const TIP_CYCLE = 7.6
/** Hold on the make before anyone moves. */
export const TIP_HOLD = 1.8
/** The five close up and stack their hands. */
export const TIP_GATHER = 3.6

export const TEAM_HOOP = { x: 1094, y: 314 }
export const TEAM_RIM_RX = 30
export const TEAM_BACKBOARD = { x: 1132, y: 236, w: 12, h: 116 }
export const TEAM_POLE = { x: 1138, y: 352, y2: 780 }
export const TEAM_FLOOR_Y = 760

/**
 * Half court in the same view as the rim: baseline on the right, far sideline
 * up the frame, near sideline along the floor. Feet, not pixels — the key,
 * the foul line, and the three-point arc are the real markings, projected.
 */
const COURT_FAR_BASE = { x: 1044, y: 372 }
const COURT_FAR_HALF = { x: 508, y: 396 }
const COURT_NEAR_BASE = { x: 1128, y: 760 }
const COURT_NEAR_HALF = { x: 408, y: 760 }

function courtPt(u: number, v: number) {
  const fu = u / 47
  const fv = v / 50
  const far = {
    x: COURT_FAR_BASE.x + (COURT_FAR_HALF.x - COURT_FAR_BASE.x) * fu,
    y: COURT_FAR_BASE.y + (COURT_FAR_HALF.y - COURT_FAR_BASE.y) * fu,
  }
  const near = {
    x: COURT_NEAR_BASE.x + (COURT_NEAR_HALF.x - COURT_NEAR_BASE.x) * fu,
    y: COURT_NEAR_BASE.y + (COURT_NEAR_HALF.y - COURT_NEAR_BASE.y) * fu,
  }
  return {
    x: far.x + (near.x - far.x) * fv,
    y: far.y + (near.y - far.y) * fv,
  }
}

function courtPath(pts: Array<{ x: number; y: number }>) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
}

/** Sidelines, baseline, half-court edge, lane, foul line, and the three-point line. */
export function courtLines() {
  const boundary = [courtPt(0, 0), courtPt(47, 0), courtPt(47, 50), courtPt(0, 50), courtPt(0, 0)]
  const lane = [courtPt(0, 17), courtPt(19, 17), courtPt(19, 33), courtPt(0, 33)]
  const circle: Array<{ x: number; y: number }> = []
  for (let i = 0; i <= 18; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / 18
    circle.push(courtPt(19 + Math.cos(a) * 6, 25 + Math.sin(a) * 6))
  }
  const arcR = 23.75
  const basketU = 5.25
  const basketV = 25
  const cornerV = 3
  const du = Math.sqrt(arcR * arcR - (basketV - cornerV) ** 2)
  const breakU = basketU + du
  const a0 = Math.atan2(cornerV - basketV, du)
  const a1 = Math.atan2(50 - cornerV - basketV, du)
  const arc = [courtPt(0, cornerV), courtPt(breakU, cornerV)]
  for (let i = 0; i <= 28; i++) {
    const a = a0 + ((a1 - a0) * i) / 28
    arc.push(courtPt(basketU + Math.cos(a) * arcR, basketV + Math.sin(a) * arcR))
  }
  arc.push(courtPt(breakU, 50 - cornerV), courtPt(0, 50 - cornerV))
  return {
    boundary: courtPath(boundary),
    lane: courtPath(lane),
    foul: courtPath(circle),
    three: courtPath(arc),
  }
}

export interface TipActor {
  id: string
  side: "team"
  h: number
  nodes: MiniNode[]
  /** Knicks jersey number. */
  number?: string
}

/**
 * Closing five, Game 4, Madison Square Garden, June 10 2026.
 * Brunson 11 shoots the three. Hart 3 and Bridges 25 space the floor.
 * Towns 32 is sealed on the box. Anunoby 8 inbounds, crashes, and tips it.
 */
const KNICKS_NUMBER: Record<string, string> = {
  "team-brunson": "11",
  "team-corner": "3",
  "team-wing": "25",
  "team-og": "8",
  "team-towns": "32",
}

export interface TipFrame {
  actors: TipActor[]
  ball: { x: number; y: number } | null
  /** Dashed arc of the three, once it has left the hand. */
  trail: { from: { x: number; y: number }; apex: { x: number; y: number }; to: { x: number; y: number } } | null
  call: { x: number; y: number } | null
  /**
   * Game 4 board. Spurs stay at 106. Knicks go 105 → 107 when the tip is
   * through. `clock` here is only the reading at this frame of the play;
   * the live countdown, which keeps going through the huddle, is
   * {@link possessionClock}.
   */
  board: { spurs: number; knicks: number; clock: number }
}

interface Key {
  t: number
  x: number
  y: number
  pose: MiniPose
}

function lerp(a: number, b: number, f: number) {
  return a + (b - a) * f
}

function smooth(f: number) {
  const u = Math.max(0, Math.min(1, f))
  return u * u * (3 - 2 * u)
}

function lerpPose(a: MiniPose, b: MiniPose, f: number): MiniPose {
  const j = (p: ArmJoint, q: ArmJoint): ArmJoint => ({
    shoulder: lerp(p.shoulder, q.shoulder, f),
    elbow: lerp(p.elbow, q.elbow, f),
    wrist: lerp(p.wrist ?? 0, q.wrist ?? 0, f),
    grip: lerp(p.grip ?? 0, q.grip ?? 0, f),
  })
  const leg = (
    p: { hip: number; knee: number },
    q: { hip: number; knee: number }
  ) => ({ hip: lerp(p.hip, q.hip, f), knee: lerp(p.knee, q.knee, f) })
  return {
    lean: lerp(a.lean, b.lean, f),
    jump: lerp(a.jump, b.jump, f),
    crouch: lerp(a.crouch, b.crouch, f),
    armL: j(a.armL, b.armL),
    armR: j(a.armR, b.armR),
    legL: leg(a.legL, b.legL),
    legR: leg(a.legR, b.legR),
  }
}

/**
 * Right-handed jumper, authored at a 200px body and scaled to `h`.
 * 0 is the dip (elbow loaded, ball at the chest). 1 is the finger release.
 * The elbow opens before the wrist snaps, which is the order a shot actually fires.
 */
const JUMPER_KEYS: Array<{ t: number; pose: MiniPose }> = [
  {
    t: 0,
    pose: {
      lean: 0.06,
      jump: 0,
      crouch: 14,
      armL: { shoulder: 0.85, elbow: 1.2, wrist: 0.1, grip: 0.7 },
      armR: { shoulder: 1.15, elbow: 1.55, wrist: 0.38, grip: 0.9 },
      legL: { hip: 0.28, knee: 0.95 },
      legR: { hip: -0.05, knee: 0.82 },
    },
  },
  {
    // Elbow under the ball, forearm vertical, wrist cocked, guide hand on the ball.
    t: 0.34,
    pose: {
      lean: 0.02,
      jump: 4,
      crouch: 4,
      armL: { shoulder: 2.2, elbow: 0.42, wrist: 0.08, grip: 0.55 },
      armR: { shoulder: 1.72, elbow: 1.42, wrist: 0.52, grip: 1 },
      legL: { hip: 0.14, knee: 0.42 },
      legR: { hip: -0.04, knee: 0.32 },
    },
  },
  {
    // Elbow opens. Wrist stays cocked so the ball is still on the fingers.
    t: 0.7,
    pose: {
      lean: -0.02,
      jump: 20,
      crouch: 0,
      armL: { shoulder: 0.35, elbow: 0.55, wrist: 0, grip: 0 },
      armR: { shoulder: 2.38, elbow: 0.38, wrist: 0.46, grip: 0.72 },
      legL: { hip: 0.05, knee: 0.14 },
      legR: { hip: -0.03, knee: 0.1 },
    },
  },
  {
    t: 0.88,
    pose: {
      lean: -0.04,
      jump: 28,
      crouch: 0,
      armL: { shoulder: -0.08, elbow: 0.36, wrist: 0, grip: 0 },
      armR: { shoulder: 2.5, elbow: 0.16, wrist: 0.36, grip: 0.28 },
      legL: { hip: 0.03, knee: 0.08 },
      legR: { hip: -0.02, knee: 0.06 },
    },
  },
  {
    // Wrist snaps and the fingers open toward the rim.
    t: 1,
    pose: {
      lean: -0.04,
      jump: 30,
      crouch: 0,
      armL: { shoulder: -0.22, elbow: 0.28, wrist: 0, grip: 0 },
      armR: { shoulder: 2.55, elbow: 0.08, wrist: -0.36, grip: 0 },
      legL: { hip: 0.02, knee: 0.05 },
      legR: { hip: -0.02, knee: 0.04 },
    },
  },
]

function samplePose(keys: Array<{ t: number; pose: MiniPose }>, t: number): MiniPose {
  const tt = Math.max(0, Math.min(1, t))
  const first = keys[0]!
  if (tt <= first.t) return first.pose
  const last = keys[keys.length - 1]!
  if (tt >= last.t) return last.pose
  let i = 0
  while (keys[i + 1]! && keys[i + 1]!.t < tt) i++
  const a = keys[i]!
  const b = keys[i + 1]!
  return lerpPose(a.pose, b.pose, smooth((tt - a.t) / (b.t - a.t)))
}

/** `h` scales the hop and the dip. Angles are the same at every size. */
export function jumperPose(u: number, h: number): MiniPose {
  const pose = samplePose(JUMPER_KEYS, u)
  const s = h / 200
  return { ...pose, jump: pose.jump * s, crouch: pose.crouch * s }
}

function sampleKey(keys: Key[], t: number, ease = true) {
  const tt = Math.max(0, Math.min(0.999, t))
  if (tt <= keys[0]!.t) return keys[0]!
  const last = keys[keys.length - 1]!
  if (tt >= last.t) return last
  let i = 0
  while (keys[i + 1]! && keys[i + 1]!.t < tt) i++
  const a = keys[i]!
  const b = keys[i + 1]!
  const u = (tt - a.t) / (b.t - a.t)
  const f = ease ? smooth(u) : u
  return { t: tt, x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), pose: lerpPose(a.pose, b.pose, f) }
}

const OG_KEYS: Key[] = [
  // Out of bounds, above the arc. The pass leaves, he runs down onto the
  // three-point line and calls, then one glide carries him to the rim.
  { t: 0, x: 660, y: 352, pose: INBOUND },
  { t: 0.1, x: 692, y: 440, pose: INBOUND },
  { t: 0.18, x: 712, y: 496, pose: CALL },
  { t: 0.28, x: 724, y: 520, pose: CALL },
  { t: 0.4, x: 820, y: 548, pose: SPRINT },
  { t: 0.52, x: 880, y: 582, pose: { ...GATHER, jump: 10 } },
  { t: 0.6, x: 930, y: 612, pose: {
      ...TAKEOFF,
      lean: 0.26,
      jump: 32,
      armR: { shoulder: 2.15, elbow: 0.06, wrist: -0.08, grip: 0 },
    } },
  { t: 0.68, x: 970, y: 640, pose: {
      ...GLIDE,
      lean: 0.14,
      jump: 58,
      armR: { shoulder: 2.55, elbow: 0.04, wrist: -0.16, grip: 0 },
    } },
  { t: 0.74, x: 998, y: 668, pose: { ...TIP, lean: 0.08, jump: 70 } },
  { t: 0.86, x: 1024, y: 652, pose: {
      ...TIP,
      lean: 0.05,
      jump: 28,
      armR: { shoulder: 2.35, elbow: 0.1, wrist: -0.08, grip: 0 },
    } },
  { t: 0.96, x: 1020, y: 640, pose: LAND },
]

/** Right hand low, pushing the dribble. The jumper starts only after it comes back up. */
const DRIBBLE: MiniPose = {
  ...STAND,
  lean: 0.14,
  crouch: 10,
  armL: { shoulder: -0.15, elbow: 0.48, wrist: 0, grip: 0 },
  armR: { shoulder: 0.48, elbow: 0.42, wrist: 0.2, grip: 0.65 },
  legL: { hip: 0.22, knee: 0.5 },
  legR: { hip: -0.12, knee: 0.55 },
}

const BRUNSON_H = 190

/** Right hand closed, raised. Brunson after the make. */
const FIST: MiniPose = {
  ...STAND,
  lean: -0.06,
  armL: { shoulder: 0.25, elbow: 0.4, grip: 0 },
  armR: { shoulder: 2.25, elbow: 0.62, wrist: 0.15, grip: 1 },
}

const BRUNSON_KEYS: Key[] = [
  // Straight-on, deep, left of the arc. One dribble, then the three.
  { t: 0, x: 680, y: 738, pose: READY },
  { t: 0.16, x: 692, y: 730, pose: REACH },
  { t: 0.22, x: 704, y: 724, pose: REACH },
  { t: 0.26, x: 714, y: 728, pose: CATCH },
  { t: 0.28, x: 726, y: 734, pose: DRIBBLE },
  { t: 0.34, x: 740, y: 726, pose: DRIBBLE },
  { t: 0.37, x: 752, y: 712, pose: jumperPose(0.34, BRUNSON_H) },
  { t: 0.4, x: 762, y: 700, pose: jumperPose(0.34, BRUNSON_H) },
  { t: 0.414, x: 768, y: 692, pose: jumperPose(0.82, BRUNSON_H) },
  { t: 0.42, x: 772, y: 686, pose: jumperPose(1, BRUNSON_H) },
  { t: 0.52, x: 766, y: 702, pose: { ...jumperPose(1, BRUNSON_H), jump: 8 } },
  { t: 0.66, x: 758, y: 716, pose: WATCH },
  { t: 0.88, x: 750, y: 722, pose: FIST },
  { t: 0.99, x: 746, y: 724, pose: FIST },
]

/** Back to the basket, arms wide. Towns is the one they box out. */
const BOX_OUT: MiniPose = {
  ...STAND,
  lean: -0.2,
  crouch: 12,
  armL: { shoulder: -0.55, elbow: 1.05, wrist: 0, grip: 0.2 },
  armR: { shoulder: 0.7, elbow: 1.0, wrist: 0, grip: 0.2 },
  legL: { hip: 0.28, knee: 0.55 },
  legR: { hip: -0.16, knee: 0.6 },
}

const CHEER: MiniPose = {
  ...STAND,
  lean: -0.04,
  armL: { shoulder: -1.35, elbow: 0.28, grip: 0.2 },
  armR: { shoulder: 2.05, elbow: 0.4, grip: 0.45 },
}

const TOWNS_KEYS: Key[] = [
  // Paint, under the rim. They box him out; he never gets the flight path.
  { t: 0, x: 1024, y: 560, pose: STAND },
  { t: 0.4, x: 1034, y: 552, pose: STAND },
  { t: 0.52, x: 1046, y: 568, pose: BOX_OUT },
  { t: 0.86, x: 1038, y: 560, pose: BOX_OUT },
  { t: 0.99, x: 1030, y: 554, pose: { ...HANDS_UP, lean: 0.08 } },
]

const WING_KEYS: Key[] = [
  { t: 0, x: 840, y: 600, pose: STAND },
  { t: 0.84, x: 848, y: 606, pose: STAND },
  { t: 0.96, x: 856, y: 612, pose: CHEER },
  { t: 0.99, x: 852, y: 608, pose: CHEER },
]

const CORNER_KEYS: Key[] = [
  { t: 0, x: 960, y: 400, pose: STAND },
  { t: 0.84, x: 966, y: 406, pose: STAND },
  { t: 0.96, x: 972, y: 412, pose: CHEER },
  { t: 0.99, x: 968, y: 408, pose: CHEER },
]

function quad(
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  t: number
) {
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  }
}

/** One loop of the solo jumper: load, release, hold, reset. Matches the motor chain. */
export const SOLO_CYCLE = 4.4
export const SOLO_CHAIN = 2.4
export const SOLO_FLIGHT = 1.1

export function soloShotClock(t: number, reduced: boolean) {
  return reduced ? 1.6 : t % SOLO_CYCLE
}

function soloPose(local: number): MiniPose {
  const h = COURT_DEFENDER.h
  if (local <= SOLO_CHAIN) {
    const chainT = local / SOLO_CHAIN
    const u = chainT < 0.16 ? 0 : (chainT - 0.16) / 0.84
    return jumperPose(u, h)
  }
  const release = jumperPose(1, h)
  const flightEnd = SOLO_CHAIN + SOLO_FLIGHT
  if (local <= flightEnd) return release
  const f = smooth((local - flightEnd) / (SOLO_CYCLE - flightEnd))
  return lerpPose(release, jumperPose(0, h), f)
}

export interface SoloShot {
  nodes: MiniNode[]
  ball: { x: number; y: number }
  trail: { from: { x: number; y: number }; apex: { x: number; y: number }; to: { x: number; y: number } } | null
}

/** Pose plus the ball, which stays on the fingertips until the wrist snaps. */
export function soloShotFrame(local: number): SoloShot {
  const h = COURT_DEFENDER.h
  const nodes = layoutMiniSoma(soloPose(local), h, COURT_DEFENDER.x, COURT_FLOOR_Y)
  const release = shotPoint(
    layoutMiniSoma(jumperPose(1, h), h, COURT_DEFENDER.x, COURT_FLOOR_Y)
  )
  const to = COURT_HOOP
  const apex = {
    x: (release.x + to.x) / 2,
    y: Math.min(release.y, to.y) - 96,
  }
  const flying = local > SOLO_CHAIN
  const flightT = flying ? Math.min(1, (local - SOLO_CHAIN) / SOLO_FLIGHT) : 0
  const ball = flying ? quad(release, apex, to, flightT) : shotPoint(nodes)
  return {
    nodes,
    ball,
    trail: flying ? { from: release, apex, to } : null,
  }
}

function actorAt(
  id: string,
  side: TipActor["side"],
  h: number,
  keys: Key[],
  t: number,
  ease = true
): TipActor {
  const s = sampleKey(keys, t, ease)
  return { id, side, h, nodes: layoutMiniSoma(s.pose, h, s.x, s.y), number: KNICKS_NUMBER[id] }
}

function handOf(actor: TipActor, id = "hand-r") {
  return miniNode(actor.nodes, id) ?? { x: 0, y: 0, r: 0, id }
}

/**
 * Game clock for the last possession, in seconds remaining.
 *
 * 5.7 at the inbound. It then loses time at one steady rate — a tenth is a
 * tenth — until it reads 0.0 as the five finish stacking their hands.
 * The basket is already in by then (Knicks 107), so the horn and the huddle
 * land together. It does not speed up between the release and the rim, and
 * it does not freeze on the make.
 */
export const TIP_CLOCK_START = 5.7

/** Seconds of stage-2 time from the inbound until the huddle has formed. */
export function possessionSpan() {
  return TIP_CYCLE + TIP_HOLD + TIP_GATHER
}

/** Tenths remaining. 5.7 at elapsed 0, 0 once the huddle has formed. */
export function possessionClock(elapsed: number): number {
  const span = possessionSpan()
  const u = Math.min(1, Math.max(0, elapsed) / span)
  if (u >= 1) return 0
  return Math.round(TIP_CLOCK_START * (1 - u) * 10) / 10
}

/**
 * `t` is 0–1 through {@link TIP_CYCLE}. 0 is the inbound. The make is in
 * by 0.84 and the bodies have landed by the end. `gather` then eases from
 * that landing into the five-player celebration.
 */
export function tipPlay(t: number, gather = 0): TipFrame {
  const og = actorAt("team-og", "team", 210, OG_KEYS, t, false)
  const brunson = actorAt("team-brunson", "team", 190, BRUNSON_KEYS, t)
  const towns = actorAt("team-towns", "team", 228, TOWNS_KEYS, t)
  const wing = actorAt("team-wing", "team", 200, WING_KEYS, t)
  const corner = actorAt("team-corner", "team", 196, CORNER_KEYS, t)

  const ogHand = handOf(og)
  const brHand = handOf(brunson)
  const passOg = actorAt("team-og", "team", 210, OG_KEYS, 0.08, false)
  const passFrom = {
    x: (handOf(passOg).x + handOf(passOg, "hand-l").x) / 2,
    y: (handOf(passOg).y + handOf(passOg, "hand-l").y) / 2,
  }
  const catchAt = shotPoint(actorAt("team-brunson", "team", 190, BRUNSON_KEYS, 0.2).nodes)
  const release = shotPoint(actorAt("team-brunson", "team", 190, BRUNSON_KEYS, 0.42).nodes)
  const tipHand = shotPoint(actorAt("team-og", "team", 210, OG_KEYS, 0.74, false).nodes)
  // Front lip, then the top of the one carom. The hand meets the ball falling off that bounce.
  const iron = { x: TEAM_HOOP.x - 18, y: TEAM_HOOP.y + 6 }
  const carom = { x: iron.x - 12, y: iron.y - 56 }
  const dribbleFloor = miniNode(brunson.nodes, "foot-r") ?? {
    x: brHand.x,
    y: brHand.y + 80,
    r: 0,
    id: "foot-r",
  }

  const shotApex = {
    x: (release.x + iron.x) / 2,
    y: Math.min(release.y, iron.y) - 80,
  }

  let ball: { x: number; y: number } | null = null
  if (t < 0.08) {
    const left = handOf(og, "hand-l")
    ball = { x: (ogHand.x + left.x) / 2, y: (ogHand.y + left.y) / 2 }
  }
  else if (t < 0.2) {
    const f = smooth((t - 0.08) / 0.12)
    ball = quad(
      passFrom,
      {
        x: (passFrom.x + catchAt.x) / 2,
        y: (passFrom.y + catchAt.y) / 2 - 24,
      },
      catchAt,
      f
    )
  } else if (t < 0.28) ball = shotPoint(brunson.nodes)
  else if (t < 0.34) {
    const f = (t - 0.28) / 0.06
    const bounce = f < 0.5 ? f / 0.5 : (1 - f) / 0.5
    const hand = shotPoint(brunson.nodes)
    ball = {
      x: lerp(hand.x, dribbleFloor.x + 8, bounce),
      y: lerp(hand.y, dribbleFloor.y - 4, bounce),
    }
  } else if (t < 0.42) ball = shotPoint(brunson.nodes)
  else if (t < 0.58) {
    ball = quad(release, shotApex, iron, (t - 0.42) / 0.16)
  } else if (t < 0.66) {
    const f = smooth((t - 0.58) / 0.08)
    ball = quad(iron, { x: (iron.x + carom.x) / 2, y: carom.y - 6 }, carom, f)
  } else if (t < 0.74) {
    const f = smooth((t - 0.66) / 0.08)
    ball = quad(
      carom,
      { x: (carom.x + tipHand.x) / 2, y: (carom.y + tipHand.y) / 2 },
      tipHand,
      f
    )
  } else if (t < 0.84) {
    ball = quad(tipHand, { x: TEAM_HOOP.x, y: TEAM_HOOP.y - 4 }, TEAM_HOOP, (t - 0.74) / 0.1)
  } else if (t < 0.94) {
    const f = (t - 0.84) / 0.1
    ball = { x: TEAM_HOOP.x, y: lerp(TEAM_HOOP.y, TEAM_HOOP.y + 36, f) }
  }

  const call = t >= 0.14 && t < 0.26 ? { x: ogHand.x + 8, y: ogHand.y - 16 } : null
  const made = t >= 0.84

  const frame: TipFrame = {
    actors: [towns, wing, corner, brunson, og],
    ball,
    trail: t >= 0.42 && t < 0.6 ? { from: release, apex: shotApex, to: iron } : null,
    call,
    board: { spurs: 106, knicks: made ? 107 : 105, clock: possessionClock(t * TIP_CYCLE) },
  }
  if (gather <= 0) return frame
  const f = gather >= 1 ? 1 : smooth(gather)
  const landed = f >= 1 ? frame : tipPlay(0.999, 0)
  return {
    actors: blendActors(landed.actors, HUDDLE_ACTORS, f),
    ball: f > 0.2 ? null : landed.ball,
    trail: null,
    call: null,
    board: { spurs: 106, knicks: 107, clock: possessionClock(TIP_CYCLE + TIP_HOLD + gather * TIP_GATHER) },
  }
}

/** Hands meet here, just above the five crowns, under the closing line. */
const HAND_STACK = { x: 868, y: 338 }

/** Both arms overhead, meeting over his own head. The center of the huddle. */
const HUDDLE_CENTER: MiniPose = {
  ...STAND,
  armL: { shoulder: 2.55, elbow: 0.14 },
  armR: { shoulder: -2.55, elbow: -0.14 },
}

/** Standing left of the stack: both arms reach up and in. */
const HUDDLE_LEFT: MiniPose = {
  ...STAND,
  armL: { shoulder: 1.9, elbow: 0.22 },
  armR: { shoulder: 2.35, elbow: -0.02 },
}

/** Standing right of the stack. */
const HUDDLE_RIGHT: MiniPose = {
  ...STAND,
  armL: { shoulder: -2.35, elbow: 0.02 },
  armR: { shoulder: -1.9, elbow: -0.22 },
}

function gatherHands(nodes: MiniNode[], amount: number) {
  const weight: Record<string, number> = {
    "elbow-l": 0.12,
    "elbow-r": 0.12,
    "radius-l": 0.32,
    "radius-r": 0.32,
    "wrist-l": 0.58,
    "wrist-r": 0.58,
    "hand-l": 0.82,
    "hand-r": 0.82,
  }
  for (const side of ["l", "r"] as const) {
    for (const digit of DIGITS) {
      weight[`hand-${side}-${digit.id}`] = 0.9
      weight[`hand-${side}-${digit.id}-tip`] = 0.96
    }
  }
  return nodes.map((n) => {
    const k = (weight[n.id] ?? 0) * amount
    if (k <= 0) return n
    return {
      ...n,
      x: lerp(n.x, HAND_STACK.x, k),
      y: lerp(n.y, HAND_STACK.y, k),
    }
  })
}

function huddleActor(
  id: string,
  side: TipActor["side"],
  h: number,
  x: number,
  y: number,
  pose: MiniPose,
  hands: boolean
): TipActor {
  const nodes = layoutMiniSoma(pose, h, x, y)
  return { id, side, h, nodes: hands ? gatherHands(nodes, 1) : nodes, number: KNICKS_NUMBER[id] }
}

/** The make, then this. Feet staggered so the five crowns share a height and the hands stack above them. */
const HUDDLE_ACTORS: TipActor[] = [
  huddleActor("team-towns", "team", 228, 868, 626, HUDDLE_CENTER, true),
  huddleActor("team-wing", "team", 200, 748, 596, HUDDLE_LEFT, true),
  huddleActor("team-corner", "team", 196, 988, 594, HUDDLE_RIGHT, true),
  huddleActor("team-brunson", "team", 190, 928, 602, HUDDLE_RIGHT, true),
  huddleActor("team-og", "team", 210, 808, 608, HUDDLE_LEFT, true),
]

function blendActors(from: TipActor[], to: TipActor[], f: number): TipActor[] {
  return from.map((actor) => {
    const next = to.find((a) => a.id === actor.id) ?? actor
    const nodes = actor.nodes.map((n) => {
      const m = next.nodes.find((q) => q.id === n.id) ?? n
      return { ...n, x: lerp(n.x, m.x, f), y: lerp(n.y, m.y, f) }
    })
    return { ...actor, nodes }
  })
}

export type TeamRole = "inbound" | "handler" | "post" | "wing" | "corner"

export interface TeamPlayer {
  id: string
  label: string
  role: TeamRole
  x: number
  y: number
  h: number
}

/** Opening set. Positions match `t = 0` of {@link tipPlay}. */
export const TEAM_PLAYERS: TeamPlayer[] = [
  { id: "team-og", label: "", role: "inbound", x: 660, y: 352, h: 210 },
  { id: "team-brunson", label: "", role: "handler", x: 680, y: 738, h: 190 },
  { id: "team-towns", label: "", role: "post", x: 1024, y: 560, h: 228 },
  { id: "team-wing", label: "", role: "wing", x: 840, y: 600, h: 200 },
  { id: "team-corner", label: "", role: "corner", x: 960, y: 400, h: 196 },
]

/**
 * Relationships that exist before the ball moves: who the inbound is for,
 * who spaces the floor, who is already near the rim.
 */
export const TEAM_LINKS: Array<{
  source: string
  target: string
  stage: 1 | 2
}> = [
  { source: "team-og", target: "team-brunson", stage: 1 },
  { source: "team-brunson", target: "team-wing", stage: 1 },
  { source: "team-wing", target: "team-corner", stage: 1 },
  { source: "team-brunson", target: "team-towns", stage: 1 },
  { source: "team-towns", target: "team-corner", stage: 1 },
  { source: "team-og", target: "team-towns", stage: 2 },
  { source: "team-wing", target: "team-towns", stage: 2 },
  { source: "team-og", target: "team-wing", stage: 2 },
]

export function teamPlayer(id: string) {
  return TEAM_PLAYERS.find((p) => p.id === id)
}

export type TeamStage = 0 | 1 | 2 | 3

/**
 * The hold on the inbound, inside one player's head.
 * 0 off · 1 the sensory streams · 2 the trained model and its two branches ·
 * 3 senses, model, and body resolve together, and the crash branch is the one
 * this possession will run.
 */
export type TeamMind = 0 | 1 | 2 | 3

/**
 * Where the mind diagram was drawn, on the skull of the inbound pose it was
 * authored against. Rendering recenters the whole figure on the live skull.
 */
export const OG_MIND = { x: 520, y: 205 }

/** What is arriving from outside the skull while he still has the ball. */
export const OG_SENSES: Array<{ id: string; label: string; x: number; y: number }> = [
  { id: "clock", label: "CLOCK", x: 348, y: 108 },
  { id: "score", label: "SCORE", x: 328, y: 168 },
  { id: "brunson", label: "BRUNSON", x: 348, y: 236 },
  { id: "defense", label: "DEFENSE", x: 410, y: 300 },
  { id: "rim", label: "RIM", x: 455, y: 92 },
  { id: "balance", label: "BALANCE", x: 300, y: 208 },
]

/**
 * Inner systems, already resident. Same verbs as the body's loop — they are
 * not a second architecture.
 */
export const OG_SYSTEMS: Array<{ id: string; label: string; x: number; y: number }> = [
  { id: "perceive", label: "PERCEIVE", x: 520, y: 142 },
  { id: "model", label: "MODEL", x: 588, y: 168 },
  { id: "predict", label: "PREDICT", x: 572, y: 236 },
  { id: "act", label: "ACT", x: 458, y: 214 },
]

/**
 * The model he brought to the inbound. Both lines start with the pass.
 * Then they split: if Brunson shoots, OG crashes; if the ball comes back, OG shoots.
 * Only the crash is the sequence this possession runs.
 */
export const OG_PASS = { x: 648, y: 162, label: "PASS TO BRUNSON" }

export const OG_BRANCHES: Array<{
  id: string
  ifLabel: string
  thenLabel: string
  gate: { x: number; y: number }
  act: { x: number; y: number }
  chosen: boolean
}> = [
  {
    id: "shoot",
    ifLabel: "IF HE SHOOTS",
    thenLabel: "CRASH THE BOARDS",
    gate: { x: 720, y: 118 },
    act: { x: 800, y: 102 },
    chosen: true,
  },
  {
    id: "pass",
    ifLabel: "IF HE PASSES BACK",
    thenLabel: "I SHOOT",
    gate: { x: 720, y: 208 },
    act: { x: 800, y: 222 },
    chosen: false,
  },
]
