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
 * the top edge at this camera. The figure's arms hang at its sides and
 * cannot be posed, so the ball releases from `hand-r` — a push shot, which
 * is honest about the art rather than faking a jump shot.
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
 * Between shooter and basket, arms up. Drawn as the same star-and-line
 * asterism as the society figures (`PersonAsterism`) but in the muted
 * secondary ink, so the defender reads as another intelligent actor rather
 * than an obstacle.
 */
export const COURT_DEFENDER = {
  x: 992,
  /**
   * `Figure` anchors on the hips, not the feet: head sits at y − 2h/3 and
   * feet at y + h/3. 683 + 352/3 puts this one's feet on `COURT_FLOOR_Y`,
   * and 683 − 2(352)/3 puts its head level with the shooter's eye (y 448),
   * so the two read as the same size.
   */
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

/**
 * Release → apex → rim. A plain quadratic through a high apex; the ball is a
 * single filled dot, not a textured sphere, so it stays inside the show's
 * flat-glyph vocabulary.
 */
export const COURT_SHOT_ARC = {
  from: { x: 925, y: 667 },
  apex: { x: 1090, y: 120 },
  to: COURT_HOOP,
}

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

export interface MiniPose {
  /** Radians. Positive leans the head toward the basket. */
  lean: number
  /** Screen pixels the whole body rises. */
  jump: number
  /** Screen pixels the pelvis drops. Knees have to bend with it. */
  crouch: number
  armL: { shoulder: number; elbow: number }
  armR: { shoulder: number; elbow: number }
  legL: { hip: number; knee: number }
  legR: { hip: number; knee: number }
}

/** Shoulder/hip angle: 0 hangs down, positive swings toward +x, π is straight up. */
const STAND: MiniPose = {
  lean: 0,
  jump: 0,
  crouch: 0,
  armL: { shoulder: -0.22, elbow: 0.42 },
  armR: { shoulder: 0.22, elbow: -0.42 },
  legL: { hip: 0.05, knee: 0.12 },
  legR: { hip: -0.04, knee: 0.12 },
}

export const MINI_ARMS_UP: MiniPose = {
  ...STAND,
  armL: { shoulder: -2.55, elbow: 0.18 },
  armR: { shoulder: 2.55, elbow: -0.18 },
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
  lean: 0.82,
  armL: { shoulder: 1.2, elbow: 0.95 },
  armR: { shoulder: -0.45, elbow: -0.9 },
  legL: { hip: 1.05, knee: 0.9 },
  legR: { hip: -0.95, knee: 0.75 },
}

const SPRINT2: MiniPose = {
  ...SPRINT,
  armL: { shoulder: -0.45, elbow: 0.9 },
  armR: { shoulder: 1.2, elbow: -0.95 },
  legL: { hip: -0.95, knee: 0.75 },
  legR: { hip: 1.05, knee: 0.9 },
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
  armL: { shoulder: 1.15, elbow: 0.48 },
  armR: { shoulder: 1.42, elbow: 0.28 },
  legL: { hip: 0.16, knee: 0.22 },
  legR: { hip: -0.06, knee: 0.16 },
}

const GATHER: MiniPose = {
  ...STAND,
  crouch: 10,
  armL: { shoulder: 0.82, elbow: 1.12 },
  armR: { shoulder: 0.98, elbow: 1.2 },
  legL: { hip: 0.42, knee: 0.9 },
  legR: { hip: -0.12, knee: 0.72 },
}

const RELEASE: MiniPose = {
  ...STAND,
  lean: -0.05,
  jump: 44,
  armL: { shoulder: 2.05, elbow: 0.48 },
  armR: { shoulder: 2.48, elbow: 0.32 },
  legL: { hip: 0.08, knee: 0.16 },
  legR: { hip: -0.1, knee: 0.12 },
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

const TIP: MiniPose = {
  ...GLIDE,
  lean: 0.36,
  jump: 154,
  armR: { shoulder: 2.92, elbow: 0.04 },
  legL: { hip: -0.62, knee: 0.55 },
  legR: { hip: -0.22, knee: 0.32 },
}

const LAND: MiniPose = {
  ...STAND,
  lean: 0.06,
  crouch: 8,
  armL: { shoulder: 0.7, elbow: 0.4 },
  armR: { shoulder: 1.1, elbow: 0.35 },
  legL: { hip: 0.2, knee: 0.45 },
  legR: { hip: -0.1, knee: 0.35 },
}

const CONTEST: MiniPose = {
  ...STAND,
  lean: -0.14,
  armL: { shoulder: -2.4, elbow: 0.22 },
  armR: { shoulder: 0.45, elbow: 0.28 },
}

const LATE: MiniPose = {
  ...STAND,
  jump: 36,
  armL: { shoulder: -2.85, elbow: 0.12 },
  armR: { shoulder: 2.9, elbow: -0.1 },
  legL: { hip: 0.1, knee: 0.3 },
  legR: { hip: -0.16, knee: 0.35 },
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
    theta: number,
    bend: number,
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
    const humerus = step(theta, upper * 0.42, joint)
    const elbow = step(theta, upper, joint)
    const foreAngle = theta + bend
    const radius = step(foreAngle, fore * 0.45, elbow)
    const wrist = step(foreAngle, fore, elbow)
    const palm = step(foreAngle, hand, wrist)
    const put = (id: string, p: { x: number; y: number }, r: number) =>
      nodes.set(id, { id, x: p.x, y: p.y, r: r * k })
    put(`humerus-${side}`, humerus, 1.3)
    put(`elbow-${side}`, elbow, 1.55)
    put(`radius-${side}`, radius, 1.25)
    put(`wrist-${side}`, wrist, 1.4)
    put(`hand-${side}`, palm, 1.65)
  }

  // Segment lengths are the original body's, as fractions of height.
  limb("l", "shoulder-l", pose.armL.shoulder, pose.armL.elbow, 0.241 * h, 0.194 * h, 0.048 * h)
  limb("r", "shoulder-r", pose.armR.shoulder, pose.armR.elbow, 0.241 * h, 0.194 * h, 0.048 * h)

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

export interface TipActor {
  id: string
  /** Gold teammates, or the two defenders drawn in the secondary ink. */
  side: "team" | "defense"
  h: number
  nodes: MiniNode[]
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
  const j = (
    p: { shoulder: number; elbow: number },
    q: { shoulder: number; elbow: number }
  ) => ({
    shoulder: lerp(p.shoulder, q.shoulder, f),
    elbow: lerp(p.elbow, q.elbow, f),
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

function sampleKey(keys: Key[], t: number) {
  const tt = Math.max(0, Math.min(0.999, t))
  if (tt <= keys[0]!.t) return keys[0]!
  const last = keys[keys.length - 1]!
  if (tt >= last.t) return last
  let i = 0
  while (keys[i + 1]! && keys[i + 1]!.t < tt) i++
  const a = keys[i]!
  const b = keys[i + 1]!
  const f = smooth((tt - a.t) / (b.t - a.t))
  return { t: tt, x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), pose: lerpPose(a.pose, b.pose, f) }
}

const OG_KEYS: Key[] = [
  { t: 0, x: 520, y: 400, pose: INBOUND },
  { t: 0.12, x: 600, y: 448, pose: INBOUND },
  // Planted on the three-point line until Brunson starts the shot.
  { t: 0.2, x: 690, y: 500, pose: CALL },
  { t: 0.42, x: 690, y: 500, pose: CALL },
  { t: 0.48, x: 770, y: 540, pose: SPRINT },
  { t: 0.54, x: 850, y: 582, pose: SPRINT2 },
  // Still short of the rim, on the floor, as the ball arrives.
  { t: 0.58, x: 900, y: 608, pose: { ...SPRINT, armR: { shoulder: 1.05, elbow: -0.3 } } },
  { t: 0.66, x: 920, y: 620, pose: { ...TAKEOFF, lean: 0.1, jump: 80, armR: { shoulder: 1.8, elbow: -0.08 } } },
  { t: 0.7, x: 970, y: 700, pose: {
      ...TIP,
      lean: 0.2,
      jump: 110,
      armR: { shoulder: 2.7, elbow: 0.02 },
      legL: { hip: -1.05, knee: 0.45 },
      legR: { hip: -0.75, knee: 0.4 },
    } },
  { t: 0.74, x: 980, y: 728, pose: { ...TIP, jump: 178 } },
  { t: 0.86, x: 1040, y: 740, pose: { ...TIP, jump: 100 } },
  { t: 0.96, x: 1048, y: 748, pose: LAND },
]

const BRUNSON_KEYS: Key[] = [
  { t: 0, x: 700, y: 748, pose: READY },
  { t: 0.18, x: 712, y: 742, pose: CATCH },
  { t: 0.3, x: 728, y: 752, pose: GATHER },
  { t: 0.42, x: 744, y: 734, pose: RELEASE },
  { t: 0.6, x: 736, y: 746, pose: WATCH },
  { t: 0.99, x: 730, y: 748, pose: WATCH },
]

const TOWNS_KEYS: Key[] = [
  { t: 0, x: 980, y: 660, pose: STAND },
  { t: 0.5, x: 992, y: 652, pose: STAND },
  { t: 0.66, x: 1000, y: 648, pose: HANDS_UP },
  { t: 0.99, x: 996, y: 654, pose: HANDS_UP },
]

const WING_KEYS: Key[] = [
  { t: 0, x: 820, y: 560, pose: STAND },
  { t: 0.99, x: 828, y: 566, pose: STAND },
]

const CORNER_KEYS: Key[] = [
  { t: 0, x: 960, y: 500, pose: STAND },
  { t: 0.99, x: 968, y: 496, pose: STAND },
]

const WEMBY_KEYS: Key[] = [
  { t: 0, x: 840, y: 700, pose: STAND },
  { t: 0.28, x: 870, y: 688, pose: CONTEST },
  { t: 0.5, x: 888, y: 692, pose: CONTEST },
  { t: 0.72, x: 876, y: 696, pose: STAND },
  { t: 0.99, x: 860, y: 700, pose: STAND },
]

const HARPER_KEYS: Key[] = [
  { t: 0, x: 900, y: 540, pose: STAND },
  { t: 0.4, x: 940, y: 580, pose: STAND },
  { t: 0.62, x: 1008, y: 640, pose: STAND },
  { t: 0.78, x: 1040, y: 668, pose: LATE },
  { t: 0.99, x: 1036, y: 674, pose: STAND },
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

function actorAt(
  id: string,
  side: TipActor["side"],
  h: number,
  keys: Key[],
  t: number
): TipActor {
  const s = sampleKey(keys, t)
  return { id, side, h, nodes: layoutMiniSoma(s.pose, h, s.x, s.y) }
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
  const og = actorAt("team-og", "team", 210, OG_KEYS, t)
  const brunson = actorAt("team-brunson", "team", 190, BRUNSON_KEYS, t)
  const towns = actorAt("team-towns", "team", 228, TOWNS_KEYS, t)
  const wing = actorAt("team-wing", "team", 200, WING_KEYS, t)
  const corner = actorAt("team-corner", "team", 196, CORNER_KEYS, t)
  const wemby = actorAt("team-wemby", "defense", 262, WEMBY_KEYS, t)
  const harper = actorAt("team-harper", "defense", 204, HARPER_KEYS, t)

  const ogHand = handOf(og)
  const brHand = handOf(brunson)
  const passOg = actorAt("team-og", "team", 210, OG_KEYS, 0.08)
  const passFrom = {
    x: (handOf(passOg).x + handOf(passOg, "hand-l").x) / 2,
    y: (handOf(passOg).y + handOf(passOg, "hand-l").y) / 2,
  }
  const catchAt = handOf(actorAt("team-brunson", "team", 190, BRUNSON_KEYS, 0.2))
  const release = handOf(actorAt("team-brunson", "team", 190, BRUNSON_KEYS, 0.42))
  const tipHand = handOf(actorAt("team-og", "team", 210, OG_KEYS, 0.74))
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
  } else if (t < 0.28) ball = { x: brHand.x, y: brHand.y }
  else if (t < 0.36) {
    const f = (t - 0.28) / 0.08
    const bounce = f < 0.5 ? f / 0.5 : (1 - f) / 0.5
    ball = {
      x: lerp(brHand.x, dribbleFloor.x + 8, bounce),
      y: lerp(brHand.y, dribbleFloor.y - 4, bounce),
    }
  } else if (t < 0.42) ball = { x: brHand.x, y: brHand.y }
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

  const call = t >= 0.2 && t < 0.42 ? { x: ogHand.x + 8, y: ogHand.y - 16 } : null
  const made = t >= 0.84

  const frame: TipFrame = {
    actors: [wemby, harper, towns, wing, corner, brunson, og],
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
const HAND_STACK = { x: 830, y: 338 }

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
  return { id, side, h, nodes: hands ? gatherHands(nodes, 1) : nodes }
}

/** The make, then this. Feet staggered so the five crowns share a height and the hands stack above them. */
const HUDDLE_ACTORS: TipActor[] = [
  huddleActor("team-wemby", "defense", 262, 600, 790, STAND, false),
  huddleActor("team-harper", "defense", 204, 1160, 600, STAND, false),
  huddleActor("team-towns", "team", 228, 830, 626, HUDDLE_CENTER, true),
  huddleActor("team-wing", "team", 200, 778, 596, HUDDLE_LEFT, true),
  huddleActor("team-corner", "team", 196, 882, 594, HUDDLE_RIGHT, true),
  huddleActor("team-brunson", "team", 190, 858, 602, HUDDLE_RIGHT, true),
  huddleActor("team-og", "team", 210, 802, 608, HUDDLE_LEFT, true),
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
  { id: "team-og", label: "", role: "inbound", x: 520, y: 400, h: 210 },
  { id: "team-brunson", label: "", role: "handler", x: 700, y: 748, h: 190 },
  { id: "team-towns", label: "", role: "post", x: 980, y: 660, h: 228 },
  { id: "team-wing", label: "", role: "wing", x: 820, y: 560, h: 200 },
  { id: "team-corner", label: "", role: "corner", x: 960, y: 500, h: 196 },
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

/** Skull of the inbound pose. Streams and the model meet here. */
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
 * The model he brought to the inbound. Both branches are loaded. Only the
 * first one is the sequence this possession runs.
 */
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
    thenLabel: "CRASH",
    gate: { x: 648, y: 128 },
    act: { x: 748, y: 108 },
    chosen: true,
  },
  {
    id: "pass",
    ifLabel: "IF HE PASSES",
    thenLabel: "HE SHOOTS",
    gate: { x: 656, y: 196 },
    act: { x: 756, y: 220 },
    chosen: false,
  },
]
