import { graph } from "../design/tokens"
import type { ActId, Beat, WorldState } from "../stage/types"
import {
  A_ACT,
  A_AI,
  A_FEDERATE,
  A_FEDERATE_HOLD,
  A_HUMANS,
  A_MODEL,
  A_NETWORK_CENTRIC,
  A_OPEN,
  A_PERCEIVE,
  A_SEMANTICS,
  A_STORM_ACT,
  A_STORM_LIVE,
  A_STORM_PATH,
  A_TAGS,
  A_TRAFFIC,
  A_VERIFY,
  B_BRAIN,
  B_CIRCULATION,
  B_INTELLIGENCE,
  B_LOOP,
  B_LYMPH,
  B_NERVES,
  B_NEURAL,
  B_PRESENCE,
  B_SENSES,
  B_STRUCTURE,
  B_VISCERA,
  C_LOOP,
  C_MOTOR,
  C_PERCEIVE,
  C_REVEAL,
  E_AIR,
  E_COMMITMENT,
  E_DEPEND,
  E_DISPATCH,
  E_DISPATCH_ACT,
  E_DISRUPT,
  E_GROUND,
  E_HUBS,
  E_IT,
  E_OPEN,
  E_OPS,
  E_ORGANISM,
  E_PACKAGE,
  E_REROUTE,
  GAGE_QUOTE,
  H_ECONOMY,
  H_GAGE,
  H_INTERNET,
  H_LANGUAGE,
  H_PEOPLE,
  H_PULLBACK,
  L_ACT,
  L_DECIDE,
  L_OBSERVE,
  L_REVEAL,
  L_RUN,
  L_UNDERSTAND,
  L_VERIFY,
  M1,
  M2,
  M3,
  M4,
  M5,
  M6,
  M7,
  N_COSMOS,
  N_FOODWEB,
  N_INDRA,
  N_MYCELIUM,
  N_PHOTOSYNTHESIS,
  N_REPEATS,
  N_WATER,
  P_LAYERS,
  P_OPEN,
  P_PATH,
  T_EMERGE,
  T_LINKS,
  T_MIND,
  T_MIND_DECIDE,
  T_MIND_MODEL,
  T_MODEL,
  T_REVEAL,
  T_SCALE,
  T_SIGNALS,
  Z_CLOSE,
  Z_ENTERPRISE,
  Z_HUMANS,
  Z_MODEL,
  Z_ONUG,
  Z_SCALE,
} from "../content/copy"

/**
 * The run order.
 *
 * One argument, told once, in seven movements:
 *
 *   1  networks are a recurring architecture
 *   2  at sufficient density, a network produces intelligence
 *   3  intelligences network with each other and produce more
 *   4  we recognised this and built one on purpose
 *   5  an enterprise is the same thing at planetary scale
 *   6  autonomy therefore requires understanding the relationships
 *   7  the network becomes part of the intelligence
 *
 * Nothing here teaches networking, protocols, or incident response. The
 * earlier show's fictional outage, its protocol pedagogy, and its twelve-stage
 * packet lesson are gone; what survives of them is visual — the fabric, the
 * travelling edges, the camera, the loop — carrying the new argument.
 *
 * Every beat is a complete `WorldState` snapshot, not a diff, so jumping to
 * any beat produces exactly the frame the presenter expects. `world()` fills
 * the defaults; a beat names only what it turns on.
 *
 * Cinema plays this list straight through. The PowerPoint films are not a
 * second script — they are contiguous ranges of these beats, each one ending
 * on a frame that can sit on screen while you talk. That map is
 * `beats/segments.ts`, and it checks the partition on import, so a new or
 * reordered beat has to be placed in a chapter before the show will build.
 */

const FULL = { zoom: 1, focusX: 800, focusY: 450 }

function world(partial: Partial<WorldState>): WorldState {
  return {
    shot: "era",
    zoom: FULL.zoom,
    focusX: FULL.focusX,
    focusY: FULL.focusY,
    graphOpacity: 1,
    showQuote: false,
    showTitle: false,
    titleFlash: false,
    fadeToBlack: false,

    somaEra: 0,
    somaSpikes: false,
    somaSense: false,
    somaLoop: false,
    somaDissolve: false,
    somaCompanion: 0,
    somaIndra: false,
    somaEarth: "none",
    somaAtmosphere: false,
    somaAtmosphereFocus: false,
    somaPullback: false,
    somaRhyme: false,
    somaMind: false,
    somaWeighted: false,
    somaGage: false,

    court: 0,
    courtMind: false,
    team: 0,
    teamMind: 0,

    packetLife: 0,

    ent: 0,
    entModel: false,
    entPackage: false,
    entAutonomy: false,
    entHumans: false,
    entDisrupt: "none",
    dispatch: 0,
    entSignals: false,
    entRelations: false,
    entTags: false,
    federation: false,
    federationHold: false,
    station: "none",
    loopTour: false,
    verified: false,
    scaleTour: false,

    ...partial,
  }
}

function beat(
  id: string,
  act: ActId,
  actLabel: string,
  line: string,
  nextHint: string,
  durationMs: number,
  w: WorldState
): Beat {
  return { id, act, actLabel, line, nextHint, durationMs, world: w }
}

/** Frame a region with air around it — pad is extra size on each axis (0.16 ≈ 16%). */
function frameBox(
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  pad = 0.16
) {
  const w = Math.max(160, (maxX - minX) * (1 + pad))
  const h = Math.max(160, (maxY - minY) * (1 + pad))
  return {
    zoom: Math.min(graph.width / w, graph.height / h),
    focusX: (minX + maxX) / 2,
    focusY: (minY + maxY) / 2,
  }
}

function frameCircle(cx: number, cy: number, r: number, pad = 0.16) {
  return frameBox(cx - r, cy - r, cx + r, cy + r, pad)
}

// ── Cameras: the organic world ───────────────────────────────────────
// Unchanged from the previous show. The composition these were fitted to
// (graph/soma.ts) has not moved, and the prelude is the one part of the
// script the recast keeps nearly intact.

/** Galaxy discs extend ~160px past r=920; pad keeps labels in frame. */
const CAM_COSMOS = frameCircle(800, 450, 1080, 0.14)
/**
 * Earth L→R plus the sky return, edge-to-edge. Bbox includes the cloud
 * asterism; focusY stays high so the band does not sink into audience type.
 */
const CAM_WATER = { ...frameBox(-220, 230, 1800, 912, 0.06), focusY: 728 }
const CAM_SOIL = frameBox(320, 618, 1164, 936, 0.18)
/** Pulls back from `CAM_SOIL` to include the canopy the light falls through. */
const CAM_CANOPY = frameBox(320, 260, 1164, 936, 0.16)
/** Life asterisms + fuel arriving at the whisper mouth. */
const CAM_FOOD = { ...frameBox(280, 170, 1340, 920, 0.2), focusY: 568 }
/**
 * The figure is drawn at `BODY_SCALE` (0.55) around `BODY_ANCHOR`, so these
 * body-detail boxes are pre-scale boxes run through the same anchor+scale —
 * `frameBox`'s zoom compensates. The wide shots below are deliberately left
 * at their original boxes; that is what lets the body read as small in them.
 */
const CAM_FIGURE = frameBox(646, 376.5, 960.6, 855, 0.14)
const CAM_TORSO = frameBox(657, 448, 943, 701, 0.18)
const CAM_VISCERA = frameBox(723, 492, 877, 651.5, 0.22)
const CAM_ENDO = frameBox(690, 426, 910, 657, 0.18)
const CAM_NERVES = frameBox(657, 376.5, 943, 827.5, 0.16)
/** Cortex and brainstem — before the head pulls back for the senses. */
const CAM_BRAIN = frameBox(745, 409.5, 855, 503, 0.22)
/** Tighter still: the cortex web only. The connections, not the organ. */
const CAM_NEURAL = frameBox(764.25, 419.4, 835.75, 457.9, 0.32)
const CAM_HEAD = frameBox(668, 371, 932, 596.5, 0.18)
const CAM_LOOP = frameBox(646, 376.5, 1036.5, 855, 0.14)
const CAM_PEOPLE = frameBox(140, 70, 1460, 740, 0.16)
const CAM_TRADE = frameBox(140, 70, 1480, 760, 0.16)
const CAM_LANGUAGE = frameBox(430, 90, 1170, 340, 0.18)
const CAM_NET = frameBox(-20, -70, 1620, 780, 0.14)
const CAM_WORLD = frameCircle(800, 450, 1100, 0.2)

/**
 * The basketball court. Wider and lower than `CAM_FIGURE`: the shooter *is*
 * the soma figure (same anchor, same scale), so this is the prelude camera
 * pulling back to admit a hoop and a floor rather than cutting to a new
 * scene — see §34 and graph/court.ts.
 */
const CAM_COURT = frameBox(380, 160, 1330, 830, 0.08)
/** Scoreboard above the inbound, the shot in the bottom half, rim upper right. */
const CAM_TEAM = frameBox(400, 10, 1240, 800, 0.05)
/** Inside the inbounder's skull while the ball is still in his hands. */
const CAM_OG_MIND = frameBox(280, 60, 820, 390, 0.08)

/**
 * Once the earth is open it stays open under everything that follows —
 * except the court, where a soil cross-section under a basketball floor
 * reads as leftover scenery rather than continuity.
 */
const EARTH = {
  somaCompanion: 3 as const,
  somaEarth: "mycelium" as const,
}

// ── Cameras: the enterprise ──────────────────────────────────────────
// Boxes are the cluster ellipses from graph/enterprise.ts, so a beat that
// names a band is framed on exactly that band.

const CAM_ENT_AIR = frameBox(444, 178, 1044, 386, 0.14)
const CAM_ENT_HUB = frameBox(610, 426, 974, 698, 0.14)
const CAM_ENT_AMERICAS = frameBox(1056, 432, 1528, 736, 0.14)
const CAM_ENT_OPS = frameBox(144, 740, 680, 900, 0.14)
const CAM_ENT_IT = frameBox(866, 750, 1466, 900, 0.14)
const CAM_ENT_AGENTS = frameBox(278, 40, 1518, 260, 0.14)
/** The Pacific gateway and what sits either side of it. */
const CAM_ENT_GATEWAY = frameBox(380, 180, 1060, 700, 0.12)
/** The dispatcher, the storm, and the five facts she is waiting on. */
const CAM_DISPATCH = frameBox(280, 180, 880, 900, 0.05)
/** The same storm, now meeting in the planning agent. */
const CAM_STORM = frameBox(280, 40, 1100, 880, 0.04)

export const BEATS: Beat[] = [
  // ════════════════════════════════════════════════════════════════════
  // MOVEMENT 1 · An architecture that repeats
  //
  // Four unrelated natural systems, each one a network. No argument is made
  // yet; the room is just being shown the same shape four times so that the
  // word "network" has weight before it is used about a company.
  // ════════════════════════════════════════════════════════════════════

  /**
   * Cold open. The cosmic web is already turning before anyone says
   * anything — no caption, no title, no label. The first click names it.
   */
  beat(
    "open",
    1,
    M1,
    "",
    N_COSMOS,
    8000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 1,
      somaRhyme: true,
      ...CAM_COSMOS,
    })
  ),

  beat(
    "cosmos",
    1,
    M1,
    N_COSMOS,
    N_INDRA,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 1,
      somaIndra: true,
      somaRhyme: true,
      ...CAM_COSMOS,
    })
  ),

  /** The lattice flare stays lit through this beat — relationships, not objects. */
  beat(
    "cosmos-relations",
    1,
    M1,
    N_INDRA,
    N_WATER,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 1,
      somaIndra: true,
      somaRhyme: true,
      ...CAM_COSMOS,
    })
  ),

  beat(
    "water",
    1,
    M1,
    N_WATER,
    N_MYCELIUM,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 2,
      somaAtmosphere: true,
      somaRhyme: true,
      ...CAM_WATER,
    })
  ),

  beat(
    "mycelium",
    1,
    M1,
    N_MYCELIUM,
    N_PHOTOSYNTHESIS,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 3,
      somaEarth: "mycelium",
      somaAtmosphere: true,
      somaRhyme: true,
      ...CAM_SOIL,
    })
  ),

  beat(
    "photosynthesis",
    1,
    M1,
    N_PHOTOSYNTHESIS,
    N_FOODWEB,
    17000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 3,
      somaEarth: "photosynthesis",
      somaAtmosphere: true,
      somaRhyme: true,
      ...CAM_CANOPY,
    })
  ),

  beat(
    "foodweb",
    1,
    M1,
    N_FOODWEB,
    N_REPEATS,
    17000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 4,
      somaEarth: "food",
      somaRhyme: true,
      ...CAM_FOOD,
    })
  ),

  /** The movement's only claim, and it is deliberately modest. */
  beat(
    "architecture-repeats",
    1,
    M1,
    N_REPEATS,
    B_PRESENCE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 4,
      somaEarth: "food",
      somaRhyme: true,
      somaPullback: true,
      ...CAM_WORLD,
    })
  ),

  // ════════════════════════════════════════════════════════════════════
  // MOVEMENT 2 · Networks make intelligence
  //
  // One body, disclosed layer by layer, ending at the cortex. Then the
  // networks people already form — language, families, communities — and only
  // then the same body doing something, so intelligence is behaviour.
  // ════════════════════════════════════════════════════════════════════

  beat(
    "body",
    2,
    M2,
    B_PRESENCE,
    B_STRUCTURE,
    16000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 1,
      ...EARTH,
      ...CAM_FIGURE,
    })
  ),

  beat(
    "body-structure",
    2,
    M2,
    B_STRUCTURE,
    B_CIRCULATION,
    17000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 3,
      ...EARTH,
      ...CAM_FIGURE,
    })
  ),

  beat(
    "body-circulation",
    2,
    M2,
    B_CIRCULATION,
    B_VISCERA,
    17000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 4,
      ...EARTH,
      ...CAM_TORSO,
    })
  ),

  beat(
    "body-viscera",
    2,
    M2,
    B_VISCERA,
    B_LYMPH,
    15000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 5,
      ...EARTH,
      ...CAM_VISCERA,
    })
  ),

  beat(
    "body-lymph",
    2,
    M2,
    B_LYMPH,
    B_NERVES,
    16000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 6,
      ...EARTH,
      ...CAM_ENDO,
    })
  ),

  beat(
    "body-nerves",
    2,
    M2,
    B_NERVES,
    B_BRAIN,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 7,
      somaSpikes: true,
      ...EARTH,
      ...CAM_NERVES,
    })
  ),

  beat(
    "body-brain",
    2,
    M2,
    B_BRAIN,
    B_NEURAL,
    16000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 7,
      somaSpikes: true,
      ...EARTH,
      ...CAM_BRAIN,
    })
  ),

  /**
   * §42 pause. The camera is inside the cortex, edges carrying unequal
   * weight, and the sentence is centred instead of in the corner panel.
   * This is the hinge of the first half: everything after it depends on the
   * room accepting that intelligence lives in relationships.
   */
  beat(
    "neural",
    2,
    M2,
    B_NEURAL,
    B_SENSES,
    22000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 7,
      somaSpikes: true,
      somaWeighted: true,
      showTitle: true,
      ...EARTH,
      ...CAM_NEURAL,
    })
  ),

  beat(
    "senses",
    2,
    M2,
    B_SENSES,
    B_LOOP,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 8,
      somaSpikes: true,
      somaSense: true,
      ...EARTH,
      ...CAM_HEAD,
    })
  ),

  beat(
    "body-loop",
    2,
    M2,
    B_LOOP,
    B_INTELLIGENCE,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaLoop: true,
      ...EARTH,
      ...CAM_LOOP,
    })
  ),

  beat(
    "body-intelligence",
    2,
    M2,
    B_INTELLIGENCE,
    H_PEOPLE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaLoop: true,
      ...EARTH,
      ...CAM_LOOP,
    })
  ),

  beat(
    "people",
    2,
    M2,
    H_PEOPLE,
    H_LANGUAGE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 6,
      somaEarth: "mycelium",
      somaRhyme: true,
      ...CAM_PEOPLE,
    })
  ),

  beat(
    "language",
    2,
    M2,
    H_LANGUAGE,
    C_REVEAL,
    22000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 6,
      somaEarth: "mycelium",
      somaMind: true,
      ...CAM_LANGUAGE,
    })
  ),

  /**
   * The same figure, now with a floor and a hoop. §34: the camera pulls back
   * and the world admits a court — no cut, no new scene, no new body.
   */
  beat(
    "shot-reveal",
    2,
    M2,
    C_REVEAL,
    C_PERCEIVE,
    14000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      court: 1,
      ...CAM_COURT,
    })
  ),

  beat(
    "shot-perceive",
    2,
    M2,
    C_PERCEIVE,
    C_MOTOR,
    26000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      court: 1,
      courtMind: true,
      ...CAM_COURT,
    })
  ),

  beat(
    "shot-motor",
    2,
    M2,
    C_MOTOR,
    C_LOOP,
    26000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      court: 2,
      ...CAM_COURT,
    })
  ),

  beat(
    "shot-loop",
    2,
    M2,
    C_LOOP,
    T_REVEAL,
    22000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaLoop: true,
      court: 3,
      ...CAM_COURT,
    })
  ),

  // ════════════════════════════════════════════════════════════════════
  // MOVEMENT 3 · Intelligence networks with intelligence
  //
  // Five reduced copies of the same body. The point is not teamwork; it is
  // that connecting intelligences produces a new intelligence that none of
  // them contains, which is the exact claim the enterprise half will rest on.
  // The possession they play is the Game 4 tip, once. Before the pass leaves
  // his hands, the camera goes into his skull: the senses, the model he
  // already holds, and the branch that will become the crash. Then the play
  // runs, holds on the make, and the five come together, hands stacked.
  // The scoreboard stays up through all of that. Knicks go 105 → 107 as the
  // tip goes through, and the clock runs from 5.7 down to 0.0 as the hands
  // stack. At 0.0 the board reads "Knicks in Five!". The emergence sentence
  // lands on that celebration, and the board comes down so the line can.
  //
  // `somaEra` drops to 0 here: the anatomical body hands off to the five
  // smaller copies. Keeping both would draw a second body on top of the first.
  // ════════════════════════════════════════════════════════════════════

  beat(
    "team",
    3,
    M3,
    T_REVEAL,
    T_LINKS,
    16000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 1,
      ...CAM_TEAM,
    })
  ),

  beat(
    "team-links",
    3,
    M3,
    T_LINKS,
    T_MIND,
    22000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 1,
      ...CAM_TEAM,
    })
  ),

  beat(
    "team-mind",
    3,
    M3,
    T_MIND,
    T_MIND_MODEL,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 1,
      teamMind: 1,
      ...CAM_OG_MIND,
    })
  ),

  beat(
    "team-mind-model",
    3,
    M3,
    T_MIND_MODEL,
    T_MIND_DECIDE,
    22000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 1,
      teamMind: 2,
      ...CAM_OG_MIND,
    })
  ),

  beat(
    "team-mind-decide",
    3,
    M3,
    T_MIND_DECIDE,
    T_SIGNALS,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 1,
      teamMind: 3,
      ...CAM_OG_MIND,
    })
  ),

  beat(
    "team-signals",
    3,
    M3,
    T_SIGNALS,
    T_MODEL,
    15000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 2,
      ...CAM_TEAM,
    })
  ),

  beat(
    "team-model",
    3,
    M3,
    T_MODEL,
    T_EMERGE,
    8000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 2,
      ...CAM_TEAM,
    })
  ),

  /**
   * The five are already together, hands stacked. The sentence sits on that
   * celebration, and the edges between them come up with it.
   */
  beat(
    "team-emergence",
    3,
    M3,
    T_EMERGE,
    T_SCALE,
    24000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 3,
      showTitle: true,
      ...CAM_TEAM,
    })
  ),

  beat(
    "team-scale",
    3,
    M3,
    T_SCALE,
    H_ECONOMY,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 3,
      ...CAM_TEAM,
    })
  ),

  // ════════════════════════════════════════════════════════════════════
  // MOVEMENT 4 · 1984
  //
  // The uplevel. Families, communities, and the team were networks people
  // form with each other. A market is that shape with no one in charge, the
  // internet is the one we built, and Gage is the sentence that named it.
  // Life of the Packet survives here as a wordless callback — proof we really
  // did build it this way — and not as a lesson in packet switching.
  // ════════════════════════════════════════════════════════════════════

  beat(
    "markets",
    4,
    M4,
    H_ECONOMY,
    H_INTERNET,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 7,
      somaEarth: "mycelium",
      somaRhyme: true,
      ...CAM_TRADE,
    })
  ),

  beat(
    "internet",
    4,
    M4,
    H_INTERNET,
    H_PULLBACK,
    16000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 9,
      somaEarth: "mycelium",
      somaMind: true,
      ...CAM_NET,
    })
  ),

  beat(
    "all-of-it",
    4,
    M4,
    H_PULLBACK,
    H_GAGE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 9,
      somaEarth: "mycelium",
      somaRhyme: true,
      somaPullback: true,
      ...CAM_WORLD,
    })
  ),

  beat(
    "gage-setup",
    4,
    M4,
    H_GAGE,
    GAGE_QUOTE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 10,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 9,
      somaEarth: "mycelium",
      somaMind: true,
      somaPullback: true,
      ...CAM_WORLD,
    })
  ),

  /**
   * §42 pause. The quote lands bare — centred, unattributed, over the world
   * that has just been built. The room gets a beat to decide whether they
   * already know whose line it is.
   */
  beat(
    "gage-quote",
    4,
    M4,
    GAGE_QUOTE,
    "Reveal the man. Hold the silence.",
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 10,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 9,
      somaEarth: "mycelium",
      somaPullback: true,
      showQuote: true,
      ...CAM_WORLD,
    })
  ),

  /** §42 pause, continued: the photograph, the name, the year. */
  beat(
    "gage",
    4,
    M4,
    GAGE_QUOTE,
    P_OPEN,
    22000,
    world({
      shot: "gage",
      graphOpacity: 0,
      somaGage: true,
      somaDissolve: true,
      showQuote: true,
      ...CAM_WORLD,
    })
  ),

  beat(
    "packet-open",
    4,
    M4,
    P_OPEN,
    P_PATH,
    18000,
    world({ shot: "packet", graphOpacity: 0, packetLife: 1, ...FULL })
  ),

  beat(
    "packet-path",
    4,
    M4,
    P_PATH,
    P_LAYERS,
    16000,
    world({ shot: "packet", graphOpacity: 0, packetLife: 3, ...FULL })
  ),

  beat(
    "packet-layers",
    4,
    M4,
    P_LAYERS,
    E_OPEN,
    18000,
    world({ shot: "packet", graphOpacity: 0, packetLife: 4, ...FULL })
  ),

  // ════════════════════════════════════════════════════════════════════
  // MOVEMENT 5 · The enterprise
  //
  // Movement 3's team, scaled to a planet. Everything the audience has been
  // taught to see — specialised parts, dense relationships, a shared model,
  // a loop — now in a company that moves physical objects, so the stakes are
  // legible without a single technical term.
  // ════════════════════════════════════════════════════════════════════

  beat(
    "ent-open",
    5,
    M5,
    E_OPEN,
    E_AIR,
    22000,
    world({ ent: 1, ...FULL })
  ),

  beat(
    "ent-air",
    5,
    M5,
    E_AIR,
    E_GROUND,
    18000,
    world({ ent: 2, ...CAM_ENT_AIR })
  ),

  beat(
    "ent-ground",
    5,
    M5,
    E_GROUND,
    E_HUBS,
    17000,
    world({ ent: 2, ...CAM_ENT_AMERICAS })
  ),

  beat(
    "ent-hub",
    5,
    M5,
    E_HUBS,
    E_OPS,
    22000,
    world({ ent: 2, ...CAM_ENT_HUB })
  ),

  beat(
    "ent-people",
    5,
    M5,
    E_OPS,
    E_IT,
    22000,
    world({ ent: 2, ...CAM_ENT_OPS })
  ),

  beat(
    "ent-systems",
    5,
    M5,
    E_IT,
    E_ORGANISM,
    20000,
    world({ ent: 7, ...CAM_ENT_IT })
  ),

  /**
   * §42 pause. Full pullback, everything revealed at once, one sentence
   * centred. The visual does the work: at this zoom the thing on screen
   * looks like the body from movement 2, which is the entire point.
   */
  beat(
    "ent-organism",
    5,
    M5,
    E_ORGANISM,
    E_PACKAGE,
    22000,
    world({ ent: 7, showTitle: true, ...FULL })
  ),

  /**
   * The enterprise's basketball shot: one package, followed end to end, so
   * the network has a protagonist. Identity, origin, destination, priority,
   * commitment — stated once, on a shipping label, and never turned into an
   * analogy about packet headers (§19).
   */
  beat(
    "ent-package",
    5,
    M5,
    E_PACKAGE,
    E_COMMITMENT,
    30000,
    world({ ent: 7, entPackage: true, ...FULL })
  ),

  beat(
    "ent-commitment",
    5,
    M5,
    E_COMMITMENT,
    E_DISRUPT,
    24000,
    world({ ent: 7, entPackage: true, entModel: true, ...FULL })
  ),

  /**
   * Weather closes the Pacific gateway. Amber, not red: nothing failed, and
   * the beat is about the response, not the event (§20).
   */
  beat(
    "ent-weather",
    5,
    M5,
    E_DISRUPT,
    E_DEPEND,
    26000,
    world({
      ent: 7,
      entPackage: true,
      entModel: true,
      entDisrupt: "onset",
      ...CAM_ENT_GATEWAY,
    })
  ),

  beat(
    "ent-depends",
    5,
    M5,
    E_DEPEND,
    E_DISPATCH,
    28000,
    world({
      ent: 7,
      entPackage: true,
      entModel: true,
      entDisrupt: "onset",
      entRelations: true,
      ...FULL,
    })
  ),

  beat(
    "ent-dispatch",
    5,
    M5,
    E_DISPATCH,
    E_DISPATCH_ACT,
    16000,
    world({
      ent: 7,
      entPackage: true,
      entDisrupt: "onset",
      dispatch: 1,
      ...CAM_DISPATCH,
    })
  ),

  beat(
    "ent-dispatch-act",
    5,
    M5,
    E_DISPATCH_ACT,
    E_REROUTE,
    16000,
    world({
      ent: 7,
      entPackage: true,
      entDisrupt: "reroute",
      dispatch: 2,
      ...CAM_DISPATCH,
    })
  ),

  beat(
    "ent-reroute",
    5,
    M5,
    E_REROUTE,
    A_OPEN,
    26000,
    world({
      ent: 7,
      entPackage: true,
      entModel: true,
      entDisrupt: "reroute",
      entRelations: true,
      ...FULL,
    })
  ),

  // ════════════════════════════════════════════════════════════════════
  // MOVEMENT 6 · What autonomy requires
  //
  // The only argumentative movement. Each beat adds one requirement and the
  // fabric visibly acquires the capability. Protocols appear here as edge
  // labels and are never explained (§5, §6): the claim is about what has to
  // be true, not about which standard carries it.
  // ════════════════════════════════════════════════════════════════════

  beat(
    "auto-open",
    6,
    M6,
    A_OPEN,
    A_PERCEIVE,
    22000,
    world({ ent: 7, entModel: true, ...FULL })
  ),

  /** Perception, framed as a faculty the body already has — not a product. */
  beat(
    "auto-perceive",
    6,
    M6,
    A_PERCEIVE,
    A_MODEL,
    30000,
    world({ ent: 7, entModel: true, entSignals: true, ...FULL })
  ),

  beat(
    "auto-model",
    6,
    M6,
    A_MODEL,
    A_SEMANTICS,
    32000,
    world({
      ent: 7,
      entModel: true,
      entSignals: true,
      entRelations: true,
      ...FULL,
    })
  ),

  beat(
    "auto-semantics",
    6,
    M6,
    A_SEMANTICS,
    A_FEDERATE,
    26000,
    world({
      ent: 7,
      entModel: true,
      entSignals: true,
      entRelations: true,
      ...FULL,
    })
  ),

  beat(
    "auto-federate",
    6,
    M6,
    A_FEDERATE,
    A_FEDERATE_HOLD,
    30000,
    world({ ent: 7, entModel: true, federation: true, ...FULL })
  ),

  beat(
    "auto-federate-hold",
    6,
    M6,
    A_FEDERATE_HOLD,
    A_AI,
    24000,
    world({
      ent: 7,
      entModel: true,
      federation: true,
      federationHold: true,
      ...FULL,
    })
  ),

  beat(
    "auto-reasoning",
    6,
    M6,
    A_AI,
    A_TRAFFIC,
    18000,
    world({ ent: 8, entModel: true, ...CAM_ENT_AGENTS })
  ),

  /**
   * §7: the whole packet/token analogy, reduced to one sentence. Not "tokens
   * are packets" — the claim is only that reasoning has to cross a network
   * to touch anything real, which makes the network part of the reasoning.
   */
  beat(
    "auto-traffic",
    6,
    M6,
    A_TRAFFIC,
    A_TAGS,
    24000,
    world({ ent: 8, entModel: true, entTags: true, ...FULL })
  ),

  beat(
    "auto-relationships",
    6,
    M6,
    A_TAGS,
    A_ACT,
    26000,
    world({
      ent: 8,
      entModel: true,
      entTags: true,
      entRelations: true,
      ...FULL,
    })
  ),

  beat(
    "auto-act",
    6,
    M6,
    A_ACT,
    A_STORM_PATH,
    24000,
    world({
      ent: 9,
      entModel: true,
      entTags: true,
      entAutonomy: true,
      ...FULL,
    })
  ),

  beat(
    "auto-storm-path",
    6,
    M6,
    A_STORM_PATH,
    A_STORM_ACT,
    16000,
    world({
      ent: 9,
      entPackage: true,
      entAutonomy: true,
      entDisrupt: "onset",
      dispatch: 3,
      ...CAM_STORM,
    })
  ),

  beat(
    "auto-storm-act",
    6,
    M6,
    A_STORM_ACT,
    A_STORM_LIVE,
    16000,
    world({
      ent: 9,
      entPackage: true,
      entAutonomy: true,
      entDisrupt: "onset",
      dispatch: 4,
      ...CAM_STORM,
    })
  ),

  beat(
    "auto-storm-live",
    6,
    M6,
    A_STORM_LIVE,
    A_VERIFY,
    18000,
    world({
      ent: 9,
      entPackage: true,
      entAutonomy: true,
      entDisrupt: "reroute",
      dispatch: 5,
      ...CAM_STORM,
    })
  ),

  beat(
    "auto-verify",
    6,
    M6,
    A_VERIFY,
    A_NETWORK_CENTRIC,
    28000,
    world({
      ent: 9,
      entModel: true,
      entTags: true,
      entAutonomy: true,
      entSignals: true,
      ...FULL,
    })
  ),

  /** §22. Said once, plainly, and not repeated anywhere else in the show. */
  beat(
    "network-centric",
    6,
    M6,
    A_NETWORK_CENTRIC,
    A_HUMANS,
    24000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entRelations: true,
      ...FULL,
    })
  ),

  /**
   * §29. The humans have been on screen since `ent-people`; this beat moves
   * them rather than introducing them, and they stay lit for the rest of the
   * show. They are not the fallback for when the machine fails.
   */
  beat(
    "humans",
    6,
    M6,
    A_HUMANS,
    L_REVEAL,
    28000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entHumans: true,
      ...CAM_ENT_OPS,
    })
  ),

  // ════════════════════════════════════════════════════════════════════
  // MOVEMENT 7 · The autonomous enterprise
  //
  // The five requirements resolve into one loop, the loop runs on the whole
  // enterprise, and the pullback shows it is the same loop at every scale
  // the show has visited. Then Gage's sentence returns, meaning something
  // operational rather than poetic.
  // ════════════════════════════════════════════════════════════════════

  beat(
    "loop",
    7,
    M7,
    L_REVEAL,
    L_OBSERVE,
    18000,
    world({ ent: 9, entModel: true, entAutonomy: true, ...FULL })
  ),

  beat(
    "loop-observe",
    7,
    M7,
    L_OBSERVE,
    L_UNDERSTAND,
    16000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entSignals: true,
      station: "observe",
      ...FULL,
    })
  ),

  beat(
    "loop-understand",
    7,
    M7,
    L_UNDERSTAND,
    L_DECIDE,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entRelations: true,
      station: "understand",
      ...FULL,
    })
  ),

  beat(
    "loop-decide",
    7,
    M7,
    L_DECIDE,
    L_ACT,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      station: "decide",
      ...FULL,
    })
  ),

  beat(
    "loop-act",
    7,
    M7,
    L_ACT,
    L_VERIFY,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entDisrupt: "reroute",
      station: "act",
      ...FULL,
    })
  ),

  beat(
    "loop-verify",
    7,
    M7,
    L_VERIFY,
    L_RUN,
    18000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entSignals: true,
      station: "verify",
      verified: true,
      ...FULL,
    })
  ),

  /** The callback: this is the body's loop from movement 2, unchanged. */
  beat(
    "loop-runs",
    7,
    M7,
    L_RUN,
    Z_ENTERPRISE,
    24000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      loopTour: true,
      verified: true,
      ...FULL,
    })
  ),

  beat(
    "autonomous-enterprise",
    7,
    M7,
    Z_ENTERPRISE,
    Z_SCALE,
    28000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entHumans: true,
      entSignals: true,
      entTags: true,
      loopTour: true,
      verified: true,
      ...FULL,
    })
  ),

  beat(
    "scales",
    7,
    M7,
    Z_SCALE,
    Z_MODEL,
    26000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entHumans: true,
      verified: true,
      scaleTour: true,
      ...FULL,
    })
  ),

  /**
   * §42 pause. The show's title has been on the title bar the whole time;
   * this is where it turns out to have meant the second thing. `titleFlash`
   * puts THE MODEL over the frame briefly, then leaves the sentence.
   */
  beat(
    "the-model",
    7,
    M7,
    Z_MODEL,
    Z_HUMANS,
    26000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entHumans: true,
      verified: true,
      showTitle: true,
      titleFlash: true,
      ...FULL,
    })
  ),

  beat(
    "humans-remain",
    7,
    M7,
    Z_HUMANS,
    GAGE_QUOTE,
    22000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entHumans: true,
      verified: true,
      ...CAM_ENT_OPS,
    })
  ),

  /**
   * §42 pause. Same photograph, same sentence, different meaning — `verified`
   * is what swaps the kicker and attribution to "Forty years later / Now an
   * operating requirement."
   */
  beat(
    "gage-returns",
    7,
    M7,
    GAGE_QUOTE,
    Z_CLOSE,
    24000,
    world({
      shot: "gage",
      graphOpacity: 0,
      somaGage: true,
      showQuote: true,
      verified: true,
      ...CAM_WORLD,
    })
  ),

  /** §30. One line, held. Nothing else on screen, nothing else said. */
  beat(
    "close",
    7,
    M7,
    Z_CLOSE,
    Z_ONUG,
    24000,
    world({ shot: "title", graphOpacity: 0, showTitle: true, ...FULL })
  ),

  beat(
    "end",
    7,
    M7,
    Z_ONUG,
    "",
    12000,
    world({
      shot: "title",
      graphOpacity: 0,
      showTitle: true,
      fadeToBlack: true,
      ...FULL,
    })
  ),
]

/** Index of the first beat of each movement, for the `1`–`7` jump keys. */
export const ACT_START = Object.fromEntries(
  ([1, 2, 3, 4, 5, 6, 7] as ActId[]).map((act) => [
    act,
    Math.max(
      0,
      BEATS.findIndex((b) => b.act === act)
    ),
  ])
) as Record<ActId, number>

/** Per-movement runtime, for pacing the rehearsal. */
export const MOVEMENT_MS = Object.fromEntries(
  ([1, 2, 3, 4, 5, 6, 7] as ActId[]).map((act) => [
    act,
    BEATS.filter((b) => b.act === act).reduce((n, b) => n + b.durationMs, 0),
  ])
) as Record<ActId, number>

/**
 * The whole show. Every beat in `BEATS` runs — there is no appendix act and
 * nothing is excluded. Beats the recast removed live in `archive/`, outside
 * the build, so unused material cannot sit inside the presentation.
 */
export const CINEMA_TOTAL_MS = BEATS.reduce((sum, b) => sum + b.durationMs, 0)
