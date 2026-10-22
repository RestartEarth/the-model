import { graph } from "../design/tokens"
import type { ActId, Beat, WorldState } from "../stage/types"
import {
  GAGE_QUOTE,
  M1,
  M2,
  M3,
  M4,
  M5,
  M6,
  M7,
  N_COSMOS,
  N_ATMOS,
  N_WATER,
  N_MYCELIUM,
  N_PHOTOSYNTHESIS,
  N_FOODWEB,
  N_REPEATS,
  B_PRESENCE,
  B_ENERGY,
  B_STRUCTURE,
  B_CIRCULATION,
  B_VISCERA,
  B_LYMPH,
  B_NERVES,
  B_BRAIN,
  B_NEURAL,
  B_SENSES,
  B_LOOP,
  H_LANGUAGE,
  H_PEOPLE,
  H_ECONOMY,
  H_SPACE,
  H_INTERNET,
  C_REVEAL,
  C_PERCEIVE,
  C_MOTOR,
  T_REVEAL,
  T_LINKS,
  T_MIND,
  T_MIND_MODEL,
  T_MIND_DECIDE,
  T_SIGNALS,
  T_MODEL,
  T_EMERGE,
  H_PULLBACK,
  P_OPEN,
  P_PATH,
  P_LAYERS,
  E_OPEN,
  E_AIR,
  E_GROUND,
  E_HUBS,
  E_OPS,
  E_IT,
  E_ORGANISM,
  E_PACKAGE,
  E_COMMITMENT,
  E_DISRUPT,
  E_DEPEND,
  E_REROUTE,
  E_FINE,
  E_DISPATCH,
  E_DISPATCH_ACT,
  A_PERCEIVE,
  A_MODEL,
  A_SEMANTICS,
  A_FEDERATE,
  A_FEDERATE_HOLD,
  A_AI,
  A_TRAFFIC,
  A_TAGS,
  A_ACT,
  A_VERIFY,
  A_NETWORK_CENTRIC,
  A_HUMANS,
  Z_ENTERPRISE,
  Z_SCALE,
  Z_MODEL,
  Z_HUMANS,
  AIR_SEAT,
  AIR_SMOOTH,
  AIR_WITNESS,
  AIR_SPLIT,
  AIR_HERD,
  AIR_BOUNDARY,
  AIR_ONCE,
  AIR_NAMED,
  AIR_OPERATE,
  RECAP_ARCHITECTURE,
  RECAP_OPERATE,
  RECAP_MODEL,
  Z_CLOSE,
  Z_ONUG,
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

/**
 * After the human reroute: the aircraft story (air-*, RouteSky), then the
 * traffic diagram (ai-*, AiNetwork) through the commit rule and the
 * perceive / model / meaning readings. The enterprise map returns at
 * federation.
 */
const AI_FILE =
  "People got this shipment this far, and an agent now files the route, because a disrupted jet stream is harder than a closed hub, and that one decision becomes many transactions that all have to return inside the decision window."
const AI_FANOUT =
  "The forecast is a fan-out, so the route finishes at the slowest model."
const AI_STREAM =
  "If the forecast session breaks, the agent is routing on yesterday's jet stream."
const AI_STALL =
  "Nothing is down. The route is late, so the shipment misses the cutoff on a track the forecast no longer supports."
const AI_RETRY =
  "The agent asks again and files a second plan, moving the shipment onto a second aircraft."
const AI_CROWD =
  "Every other flight asks at once. The shared turbulence service is where this shipment loses the window, while the links still look fine."
const AI_TRACE =
  "The operation blames the routing model. The trace stops at the weather provider, and the retry takes that same feed."
const AI_FRESH =
  "The route is filed only when a fresh turbulence field has returned inside the decision window."
const AI_COMPLETE =
  "A partial field does not clear the flight. The tool runs only on a complete answer."
const AI_ONCE = "Asking again files the same plan once."
const AI_ISOLATE =
  "This shipment has its own path to the forecast, so the fleet's questions do not bury it."
const AI_MEASURE =
  "The carrier measures up to the weather boundary and keeps a second product: delay, a different altitude, a different route."
const AI_ENROUTE =
  "En route, aircraft sensors and ride reports come back, and the next sector can change."
const AI_FABRIC =
  "The agent may commit only on evidence that is still live, only once, inside the cutoff, with the critical call isolated from the herd, and with the path measured out to the system it does not own."

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
    air: 0,
    promiseRisk: false,
    networkWide: false,

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
/**
 * The greenhouse band and the ground it conditions. Higher than `CAM_WATER`
 * so the transport layer is the subject, not the circuit that will run on it.
 */
export const CAM_ATMOS = { ...frameBox(-120, 160, 1720, 900, 0.08), focusY: 520 }
export const CAM_SOIL = frameBox(320, 618, 1164, 936, 0.18)
/** Pulls back from `CAM_SOIL` to include the canopy the light falls through. */
export const CAM_CANOPY = frameBox(320, 260, 1164, 936, 0.16)
/** Life asterisms + fuel arriving at the whisper mouth. */
const CAM_FOOD = { ...frameBox(280, 170, 1340, 920, 0.2), focusY: 568 }
/**
 * The figure is drawn at `BODY_SCALE` (0.55) around `BODY_ANCHOR`, so these
 * body-detail boxes are pre-scale boxes run through the same anchor+scale —
 * `frameBox`'s zoom compensates. The wide shots below are deliberately left
 * at their original boxes; that is what lets the body read as small in them.
 */
const CAM_FIGURE = frameBox(646, 376.5, 960.6, 855, 0.14)
export const CAM_TORSO = frameBox(657, 448, 943, 701, 0.18)
export const CAM_VISCERA = frameBox(723, 492, 877, 651.5, 0.22)
export const CAM_ENDO = frameBox(690, 426, 910, 657, 0.18)
const CAM_NERVES = frameBox(657, 376.5, 943, 827.5, 0.16)
/** Cortex and brainstem — before the head pulls back for the senses. */
export const CAM_BRAIN = frameBox(745, 409.5, 855, 503, 0.22)
/** Tighter still: the cortex web only. The connections, not the organ. */
const CAM_NEURAL = frameBox(764.25, 419.4, 835.75, 457.9, 0.32)
const CAM_HEAD = frameBox(668, 371, 932, 596.5, 0.18)
export const CAM_LOOP = frameBox(646, 376.5, 1036.5, 855, 0.14)
export const CAM_PEOPLE = frameBox(140, 70, 1460, 740, 0.16)
export const CAM_TRADE = frameBox(140, 70, 1480, 760, 0.16)
export const CAM_LANGUAGE = frameBox(430, 90, 1170, 340, 0.18)
export const CAM_NET = frameBox(-20, -70, 1620, 780, 0.14)
/** Satellite ring and the ships leaving it. Wide enough that the orbit is the subject. */
export const CAM_SPACE = frameCircle(800, 450, 1080, 0.14)
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
const CAM_OG_MIND = frameBox(360, -13, 1080, 362, 0.05)

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
export const CAM_STORM = frameBox(280, 40, 1100, 880, 0.04)

/** Logistics picture held under the route chapter if Fabric ever flashes. */
const ROUTE_HELD = world({
  ent: 7,
  entPackage: true,
  entModel: true,
  entDisrupt: "reroute",
  entRelations: true,
  ...FULL,
})

export const BEATS: Beat[] = [
  // MOVEMENT 1 · An architecture that repeats,

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
    N_ATMOS,
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

  /**
   * Companion stays at 1 so the water circuit does not open yet. The sky
   * band is at full brightness; the next beat leaves it up, dimmed, under
   * the circuit.
   */
  beat(
    "atmosphere",
    1,
    M1,
    N_ATMOS,
    N_WATER,
    14000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 1,
      somaAtmosphere: true,
      somaAtmosphereFocus: true,
      somaRhyme: true,
      ...CAM_ATMOS,
    })
  ),

  beat(
    "water",
    1,
    M1,
    N_WATER,
    N_MYCELIUM,
    23000,
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
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 4,
      somaEarth: "food",
      somaRhyme: true,
      ...CAM_FOOD,
    })
  ),

  beat(
    "architecture-repeats",
    1,
    M1,
    N_REPEATS,
    B_PRESENCE,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaCompanion: 4,
      somaEarth: "food",
      somaPullback: true,
      somaRhyme: true,
      ...CAM_WORLD,
    })
  ),

  // MOVEMENT 2 · Networks make intelligence,

  beat(
    "body",
    2,
    M2,
    B_PRESENCE,
    B_ENERGY,
    12000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 1,
      ...EARTH,
      ...CAM_FIGURE,
    })
  ),

  beat(
    "body-energy",
    2,
    M2,
    B_ENERGY,
    B_STRUCTURE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 2,
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
    22000,
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
    18000,
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
    18000,
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
    20000,
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
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 7,
      somaSpikes: true,
      ...EARTH,
      ...CAM_BRAIN,
    })
  ),

  beat(
    "neural",
    2,
    M2,
    B_NEURAL,
    H_LANGUAGE,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      showTitle: true,
      somaEra: 7,
      somaSpikes: true,
      somaWeighted: true,
      ...EARTH,
      ...CAM_NEURAL,
    })
  ),

  beat(
    "language",
    2,
    M2,
    H_LANGUAGE,
    H_PEOPLE,
    16000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 5,
      somaEarth: "mycelium",
      somaMind: true,
      ...CAM_LANGUAGE,
    })
  ),

  beat(
    "people",
    2,
    M2,
    H_PEOPLE,
    H_ECONOMY,
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
    "markets",
    2,
    M2,
    H_ECONOMY,
    H_SPACE,
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
    "satellites",
    2,
    M2,
    H_SPACE,
    H_INTERNET,
    20000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 8,
      somaEarth: "mycelium",
      somaRhyme: true,
      ...CAM_SPACE,
    })
  ),

  beat(
    "internet",
    2,
    M2,
    H_INTERNET,
    B_SENSES,
    18000,
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
    "senses",
    2,
    M2,
    B_SENSES,
    C_REVEAL,
    20000,
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
    "shot-reveal",
    2,
    M2,
    C_REVEAL,
    C_PERCEIVE,
    15000,
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
    20000,
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
    B_LOOP,
    19000,
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
    B_LOOP,
    T_REVEAL,
    22000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      court: 3,
      ...CAM_COURT,
    })
  ),

  // MOVEMENT 3 · Intelligence networks with intelligence,

  beat(
    "team",
    3,
    M3,
    T_REVEAL,
    T_LINKS,
    13000,
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
    20000,
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
    19000,
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
    23000,
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
    19000,
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
    21000,
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
    17000,
    world({
      shot: "soma",
      graphOpacity: 0,
      team: 2,
      ...CAM_TEAM,
    })
  ),

  beat(
    "team-emergence",
    3,
    M3,
    T_EMERGE,
    H_PULLBACK,
    19000,
    world({
      shot: "soma",
      graphOpacity: 0,
      showTitle: true,
      team: 3,
      ...CAM_TEAM,
    })
  ),

  // MOVEMENT 4 · 1984,

  beat(
    "all-of-it",
    4,
    M4,
    H_PULLBACK,
    GAGE_QUOTE,
    18000,
    world({
      shot: "soma",
      graphOpacity: 0,
      somaEra: 9,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 9,
      somaEarth: "mycelium",
      somaPullback: true,
      somaRhyme: true,
      ...CAM_WORLD,
    })
  ),

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
      showQuote: true,
      somaEra: 10,
      somaSpikes: true,
      somaSense: true,
      somaCompanion: 9,
      somaEarth: "mycelium",
      somaPullback: true,
      ...CAM_WORLD,
    })
  ),

  beat(
    "gage",
    4,
    M4,
    GAGE_QUOTE,
    P_LAYERS,
    20000,
    world({
      shot: "gage",
      graphOpacity: 0,
      showQuote: true,
      somaDissolve: true,
      somaGage: true,
      ...CAM_WORLD,
    })
  ),

  beat(
    "packet-layers",
    4,
    M4,
    P_LAYERS,
    P_OPEN,
    22000,
    world({
      shot: "packet",
      graphOpacity: 0,
      packetLife: 4,
      ...FULL,
    })
  ),

  beat(
    "packet-open",
    4,
    M4,
    P_OPEN,
    P_PATH,
    19000,
    world({
      shot: "packet",
      graphOpacity: 0,
      packetLife: 1,
      ...FULL,
    })
  ),

  beat(
    "packet-path",
    4,
    M4,
    P_PATH,
    E_OPEN,
    20000,
    world({
      shot: "packet",
      graphOpacity: 0,
      packetLife: 3,
      ...FULL,
    })
  ),

  // MOVEMENT 5 · The enterprise,

  beat(
    "ent-open",
    5,
    M5,
    E_OPEN,
    E_AIR,
    21000,
    world({
      ent: 1,
      ...FULL,
    })
  ),

  beat(
    "ent-air",
    5,
    M5,
    E_AIR,
    E_GROUND,
    14000,
    world({
      ent: 2,
      ...CAM_ENT_AIR,
    })
  ),

  beat(
    "ent-ground",
    5,
    M5,
    E_GROUND,
    E_HUBS,
    13000,
    world({
      ent: 2,
      ...CAM_ENT_AMERICAS,
    })
  ),

  beat(
    "ent-hub",
    5,
    M5,
    E_HUBS,
    E_OPS,
    16000,
    world({
      ent: 2,
      ...CAM_ENT_HUB,
    })
  ),

  beat(
    "ent-people",
    5,
    M5,
    E_OPS,
    E_IT,
    18000,
    world({
      ent: 2,
      ...CAM_ENT_OPS,
    })
  ),

  beat(
    "ent-systems",
    5,
    M5,
    E_IT,
    E_ORGANISM,
    18000,
    world({
      ent: 7,
      ...CAM_ENT_IT,
    })
  ),

  beat(
    "ent-organism",
    5,
    M5,
    E_ORGANISM,
    E_PACKAGE,
    21000,
    world({
      showTitle: true,
      ent: 7,
      ...FULL,
    })
  ),

  beat(
    "ent-package",
    5,
    M5,
    E_PACKAGE,
    E_COMMITMENT,
    22000,
    world({
      ent: 7,
      entPackage: true,
      ...FULL,
    })
  ),

  beat(
    "ent-commitment",
    5,
    M5,
    E_COMMITMENT,
    E_DISRUPT,
    21000,
    world({
      ent: 7,
      entModel: true,
      entPackage: true,
      ...FULL,
    })
  ),

  beat(
    "ent-weather",
    5,
    M5,
    E_DISRUPT,
    E_DEPEND,
    16000,
    world({
      ent: 7,
      entModel: true,
      entPackage: true,
      entDisrupt: "onset",
      ...CAM_ENT_GATEWAY,
    })
  ),

  beat(
    "ent-depends",
    5,
    M5,
    E_DEPEND,
    E_FINE,
    21000,
    world({
      ent: 7,
      entModel: true,
      entPackage: true,
      entDisrupt: "onset",
      entRelations: true,
      ...FULL,
    })
  ),

  beat(
    "ent-fine",
    5,
    M5,
    E_FINE,
    E_DISPATCH,
    20000,
    world({
      ent: 7,
      entPackage: true,
      entDisrupt: "onset",
      promiseRisk: true,
      ...CAM_DISPATCH,
    })
  ),

  beat(
    "ent-dispatch",
    5,
    M5,
    E_DISPATCH,
    E_DISPATCH_ACT,
    17000,
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
    12000,
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
    AIR_SEAT,
    20000,
    world({
      ent: 7,
      entModel: true,
      entPackage: true,
      entDisrupt: "reroute",
      entRelations: true,
      ...FULL,
    })
  ),

  // Use case: one autonomous aircraft, sensitive cargo, turbulence.
  // RouteSky draws these beats. The network view follows.

  beat(
    "air-seat",
    5,
    M5,
    AIR_SEAT,
    AIR_SMOOTH,
    18000,
    ROUTE_HELD
  ),
  beat(
    "air-smooth",
    5,
    M5,
    AIR_SMOOTH,
    AIR_WITNESS,
    18000,
    ROUTE_HELD
  ),
  beat(
    "air-witness",
    5,
    M5,
    AIR_WITNESS,
    AIR_SPLIT,
    18000,
    ROUTE_HELD
  ),
  beat(
    "air-split",
    5,
    M5,
    AIR_SPLIT,
    AIR_HERD,
    18000,
    ROUTE_HELD
  ),
  beat(
    "air-herd",
    5,
    M5,
    AIR_HERD,
    AIR_BOUNDARY,
    18000,
    ROUTE_HELD
  ),
  beat(
    "air-boundary",
    5,
    M5,
    AIR_BOUNDARY,
    AIR_ONCE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "air-once",
    5,
    M5,
    AIR_ONCE,
    AIR_NAMED,
    18000,
    ROUTE_HELD
  ),
  beat(
    "air-named",
    5,
    M5,
    AIR_NAMED,
    AIR_OPERATE,
    20000,
    ROUTE_HELD
  ),
  beat(
    "air-operate",
    5,
    M5,
    AIR_OPERATE,
    AI_FILE,
    22000,
    ROUTE_HELD
  ),

  // Same filing, network and transaction. AiNetwork draws these beats.

  beat(
    "ai-file",
    5,
    M5,
    AI_FILE,
    AI_FANOUT,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-fanout",
    5,
    M5,
    AI_FANOUT,
    AI_STREAM,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-stream",
    5,
    M5,
    AI_STREAM,
    AI_STALL,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-stall",
    5,
    M5,
    AI_STALL,
    AI_RETRY,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-retry",
    5,
    M5,
    AI_RETRY,
    AI_CROWD,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-crowd",
    5,
    M5,
    AI_CROWD,
    AI_TRACE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-trace",
    5,
    M5,
    AI_TRACE,
    AI_FRESH,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-fresh",
    5,
    M5,
    AI_FRESH,
    AI_COMPLETE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-complete",
    5,
    M5,
    AI_COMPLETE,
    AI_ONCE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-once",
    5,
    M5,
    AI_ONCE,
    AI_ISOLATE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-isolate",
    5,
    M5,
    AI_ISOLATE,
    AI_MEASURE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-measure",
    5,
    M5,
    AI_MEASURE,
    AI_ENROUTE,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-enroute",
    5,
    M5,
    AI_ENROUTE,
    AI_FABRIC,
    18000,
    ROUTE_HELD
  ),
  beat(
    "ai-fabric",
    5,
    M5,
    AI_FABRIC,
    A_PERCEIVE,
    24000,
    ROUTE_HELD
  ),

  // Same traffic diagram as ai-fabric. The page holds that frame (labels
  // on) and advances the bottom caption. Movement 6 starts at federation.

  beat(
    "auto-perceive",
    5,
    M5,
    A_PERCEIVE,
    A_MODEL,
    17000,
    world({
      ent: 7,
      entModel: true,
      entSignals: true,
      ...FULL,
    })
  ),

  beat(
    "auto-model",
    5,
    M5,
    A_MODEL,
    A_SEMANTICS,
    18000,
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
    5,
    M5,
    A_SEMANTICS,
    A_FEDERATE,
    19000,
    world({
      ent: 7,
      entModel: true,
      entSignals: true,
      entRelations: true,
      ...FULL,
    })
  ),

  // MOVEMENT 6 · What autonomy requires,

  beat(
    "auto-federate",
    6,
    M6,
    A_FEDERATE,
    A_FEDERATE_HOLD,
    21000,
    world({
      ent: 7,
      entModel: true,
      federation: true,
      ...FULL,
    })
  ),

  beat(
    "auto-federate-hold",
    6,
    M6,
    A_FEDERATE_HOLD,
    A_AI,
    20000,
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
    16000,
    world({
      ent: 8,
      entModel: true,
      ...CAM_ENT_AGENTS,
    })
  ),

  beat(
    "auto-traffic",
    6,
    M6,
    A_TRAFFIC,
    A_TAGS,
    21000,
    world({
      networkWide: true,
      ...FULL,
    })
  ),

  beat(
    "auto-relationships",
    6,
    M6,
    A_TAGS,
    A_ACT,
    20000,
    world({
      networkWide: true,
      ...FULL,
    })
  ),

  beat(
    "auto-act",
    6,
    M6,
    A_ACT,
    A_VERIFY,
    16000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entTags: true,
      ...FULL,
    })
  ),

  beat(
    "auto-verify",
    6,
    M6,
    A_VERIFY,
    A_NETWORK_CENTRIC,
    24000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entSignals: true,
      entTags: true,
      ...FULL,
    })
  ),

  beat(
    "network-centric",
    6,
    M6,
    A_NETWORK_CENTRIC,
    A_HUMANS,
    22000,
    world({
      showTitle: true,
      networkWide: true,
      ...FULL,
    })
  ),

  beat(
    "humans",
    6,
    M6,
    A_HUMANS,
    Z_ENTERPRISE,
    20000,
    world({
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entHumans: true,
      ...CAM_ENT_OPS,
    })
  ),

  // MOVEMENT 7 · The autonomous enterprise,

  beat(
    "autonomous-enterprise",
    7,
    M7,
    Z_ENTERPRISE,
    Z_SCALE,
    18000,
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
    18000,
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

  beat(
    "the-model",
    7,
    M7,
    Z_MODEL,
    Z_HUMANS,
    21000,
    world({
      showTitle: true,
      titleFlash: true,
      ent: 9,
      entModel: true,
      entAutonomy: true,
      entHumans: true,
      verified: true,
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

  beat(
    "gage-returns",
    7,
    M7,
    GAGE_QUOTE,
    RECAP_ARCHITECTURE,
    21000,
    world({
      shot: "gage",
      graphOpacity: 0,
      showQuote: true,
      somaGage: true,
      verified: true,
      ...CAM_WORLD,
    })
  ),

  beat(
    "recap-architecture",
    7,
    M7,
    RECAP_ARCHITECTURE,
    RECAP_OPERATE,
    20000,
    world({
      showTitle: true,
      ent: 7,
      entPackage: true,
      ...FULL,
    })
  ),

  beat(
    "recap-operate",
    7,
    M7,
    RECAP_OPERATE,
    RECAP_MODEL,
    18000,
    world({
      showTitle: true,
      networkWide: true,
      ...FULL,
    })
  ),

  beat(
    "recap-model",
    7,
    M7,
    RECAP_MODEL,
    Z_CLOSE,
    23000,
    world({
      showTitle: true,
      networkWide: true,
      ...FULL,
    })
  ),

  beat(
    "close",
    7,
    M7,
    Z_CLOSE,
    Z_ONUG,
    16000,
    world({
      shot: "title",
      graphOpacity: 0,
      showTitle: true,
      ...FULL,
    })
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

/** 1-based stage in the use-case airplane chapter (RouteSky), or 0. */
export function airChapterStage(id: string): number {
  if (!id.startsWith("air-")) return 0
  let n = 0
  for (const beat of BEATS) {
    if (!beat.id.startsWith("air-")) continue
    n += 1
    if (beat.id === id) return n
  }
  return 0
}

/** 1-based altitude in the network/transaction chapter (AiNetwork), or 0. */
export function aiChapterAltitude(id: string): number {
  if (!id.startsWith("ai-")) return 0
  let n = 0
  for (const beat of BEATS) {
    if (!beat.id.startsWith("ai-")) continue
    n += 1
    if (beat.id === id) return n
  }
  return 0
}

/** Index of the first beat of each movement, for the `1`–`7` jump keys. */
export const ACT_START = Object.fromEntries(
  ([1, 2, 3, 4, 5, 6, 7] as ActId[]).map((act) => [
    act,
    Math.max(0, BEATS.findIndex((b) => b.act === act)),
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
