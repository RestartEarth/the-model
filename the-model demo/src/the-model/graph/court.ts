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
 * The team sequence then replaces the single figure with five simplified
 * person asterisms in the same gold grammar, because the point of that
 * movement is relationships between actors, not anatomy inside one.
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
 * What the player is actually integrating. Each stream runs from a point in
 * the scene to the brain, and the beat's claim is that none of them alone is
 * the shot — the model of the moment is their composition. Labels are
 * functional, not the names of sense organs: the rhyme we want is with
 * `ENT_SIGNALS` in graph/enterprise.ts, which does the same thing for an
 * enterprise.
 */
export const COURT_PERCEPTION: Array<{
  id: string
  label: string
  /** Where in the scene this signal originates. */
  x: number
  y: number
  /** Body node the stream terminates at, or null for the brain itself. */
  via: string | null
}> = [
  { id: "basket", label: "BASKET", x: 1248, y: 250, via: "eye" },
  { id: "defender", label: "DEFENDER", x: 1036, y: 540, via: "eye" },
  { id: "ball", label: "BALL", x: 952, y: 690, via: "hand-r" },
  { id: "balance", label: "BALANCE", x: 724, y: 430, via: "ear-l" },
  { id: "stance", label: "STANCE", x: 712, y: 790, via: "ankle-l" },
  { id: "contact", label: "CONTACT", x: 898, y: 612, via: "skin" },
]

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

// ── Team ────────────────────────────────────────────────────────────────

export type TeamRole = "handler" | "wing" | "post" | "corner" | "shooter"

export interface TeamPlayer {
  id: string
  label: string
  role: TeamRole
  x: number
  y: number
  /** Height of the asterism figure in screen units. */
  h: number
}

/**
 * Five actors with spacing that reads as a half-court set, not a ring. The
 * shooter keeps the position the single figure occupied (x≈800) so the pull
 * back from one body to five people lands as a camera move rather than a cut.
 */
export const TEAM_PLAYERS: TeamPlayer[] = [
  { id: "team-handler", label: "", role: "handler", x: 470, y: 560, h: 268 },
  { id: "team-wing", label: "", role: "wing", x: 640, y: 440, h: 252 },
  { id: "team-shooter", label: "", role: "shooter", x: 800, y: 556, h: 288 },
  { id: "team-post", label: "", role: "post", x: 1000, y: 452, h: 262 },
  { id: "team-corner", label: "", role: "corner", x: 1172, y: 588, h: 252 },
]

export function teamPlayer(id: string) {
  return TEAM_PLAYERS.find((p) => p.id === id)
}

/**
 * Relationships, not passes. These are the things practice created: who
 * spaces off whom, who screens for whom, who expects whom to be somewhere.
 * They exist before any ball moves, which is the entire point of the
 * `team-training` beat.
 */
export const TEAM_LINKS: Array<{
  source: string
  target: string
  /** Reveal stage: 1 training (structure), 2 runtime (live signals). */
  stage: 1 | 2
}> = [
  { source: "team-handler", target: "team-wing", stage: 1 },
  { source: "team-wing", target: "team-shooter", stage: 1 },
  { source: "team-shooter", target: "team-post", stage: 1 },
  { source: "team-post", target: "team-corner", stage: 1 },
  { source: "team-handler", target: "team-shooter", stage: 1 },
  { source: "team-wing", target: "team-post", stage: 1 },
  { source: "team-handler", target: "team-corner", stage: 2 },
  { source: "team-shooter", target: "team-corner", stage: 2 },
  { source: "team-wing", target: "team-corner", stage: 2 },
  { source: "team-handler", target: "team-post", stage: 2 },
]

/**
 * The small signals that carry enormous meaning because the model is shared —
 * a hand signal, a screen, a cut, eye contact. Anchored between the two
 * players they pass between so the label sits on the relationship, not on a
 * person.
 */
export const TEAM_SIGNALS: Array<{
  id: string
  label: string
  source: string
  target: string
}> = [
  { id: "call", label: "CALL", source: "team-handler", target: "team-wing" },
  { id: "screen", label: "SCREEN", source: "team-post", target: "team-shooter" },
  { id: "cut", label: "CUT", source: "team-corner", target: "team-post" },
  { id: "eyes", label: "EYES", source: "team-wing", target: "team-shooter" },
]

/** Ball movement on the runtime beat: handler → wing → shooter. */
export const TEAM_PASS_ROUTE = [
  "team-handler",
  "team-wing",
  "team-shooter",
] as const

/** Two defenders, enough to make the spacing mean something. */
export const TEAM_DEFENDERS = [
  { x: 560, y: 500, h: 236 },
  { x: 900, y: 470, h: 240 },
]

export type TeamStage = 0 | 1 | 2 | 3
