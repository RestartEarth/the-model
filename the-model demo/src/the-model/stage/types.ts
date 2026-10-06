import type { CourtStage, TeamMind, TeamStage } from "../graph/court"
import type { SomaCompanion, SomaEarth, SomaEra } from "../graph/soma"

/**
 * Seven movements, numbered so `ActId` ordering matches run order:
 *   1 networks are a recurring architecture · 2 networks create intelligence ·
 *   3 intelligence networks with intelligence · 4 Gage recognises the
 *   architecture · 5 scale the team to an enterprise · 6 what autonomy
 *   actually requires · 7 the autonomous enterprise.
 *
 * There is no appendix act. Beats the recast removed are archived outside the
 * build (see `archive/` at the repo root), not parked inside the show.
 */
export type ActId = 1 | 2 | 3 | 4 | 5 | 6 | 7

/**
 * Life of the Packet. Reduced from a fifteen-beat walk to a single 30-second
 * visual callback at the Gage hinge (stages 1–4: open, circuit, hop, layers) —
 * the audience already understands networking, and the show's argument is
 * about distributed intelligence, not packet mechanics.
 */
export type PacketLife = 0 | 1 | 2 | 3 | 4

export type Shot =
  /** The organic world: cosmos, earth, body, basketball. */
  | "soma"
  /** Full-bleed centred type over an empty field. */
  | "title"
  /** The node/edge fabric: logistics enterprise, autonomy, the control loop. */
  | "era"
  /** The Gage still. */
  | "gage"
  /** The packet callback. */
  | "packet"

/**
 * Five stations, down from six. "Model" and "Reason" collapsed into
 * "Understand" and "Decide": at thirty minutes the extra two stations cost
 * narration without changing the argument, and five is the same shape as the
 * body's own loop (`COURT_LOOP_STATIONS` in graph/court.ts), so the closing
 * beat lands as a callback to the basketball shot rather than a new framework.
 */
export type LoopStation =
  | "none"
  | "observe"
  | "understand"
  | "decide"
  | "act"
  | "verify"

/** Logistics enterprise reveal stage. See graph/enterprise.ts. */
export type EntPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface WorldState {
  shot: Shot
  /** SVG viewBox zoom. 1 = full graph. Higher = tighter. */
  zoom: number
  focusX: number
  focusY: number
  graphOpacity: number
  /** Gage, centred, with kicker and attribution. */
  showQuote: boolean
  /**
   * Full-bleed centred type instead of the corner panel. Reserved for the
   * show's intentional pauses — the neural reveal, team emergence, the
   * enterprise organism, THE MODEL's second meaning, the closing line — so
   * the treatment itself signals "this one matters."
   */
  showTitle: boolean
  /** Brief "THE MODEL" emphasis over the current beat, then fades — the beat's own line stays underneath. */
  titleFlash: boolean
  /** Beat's own visuals hold, then the whole stage falls to black by the end of the beat. */
  fadeToBlack: boolean

  // ── Movements 1–2: the organic world and one body ────────────────────
  /** Disclosure layer of one living body. 0 = no body on screen. */
  somaEra: SomaEra
  somaSpikes: boolean
  somaSense: boolean
  somaLoop: boolean
  somaDissolve: boolean
  /** Max revealed world layer. 0 none · 1 cosmos · 2 water · 3 mycelium · 4 foodweb · 5 language/art/music/invention · 6 people · 7 economy · 8 internet · 9 satellites + ships. Once shown, a layer stays. */
  somaCompanion: SomaCompanion
  /** One-shot Indra's-Net lattice flare over the cosmic web — extra chords + node flares, fades back to the plain ring. */
  somaIndra: boolean
  /** Soil cross-section. Stays open once the earth is revealed. */
  somaEarth: SomaEarth
  /** Sky-band atmosphere shot — sunlight in, infrared back out. Precedes water/soil/photosynthesis; not part of `somaEarth`. */
  somaAtmosphere: boolean
  /** True only on the atmosphere's own beat (full brightness); water/photosynthesis leave this off so the band lingers dimmed instead of gone. */
  somaAtmosphereFocus: boolean
  /** Full-world pullback — every region readable, camera wide, body still centre. */
  somaPullback: boolean
  /** Gold nerves re-light to rhyme with whatever graph is on screen. */
  somaRhyme: boolean
  /** Camera behind the eyes — we are inside this mind. */
  somaMind: boolean
  /** Cortex nerve edges render with unequal, per-edge stroke weight — learning as reweighting, not new units. */
  somaWeighted: boolean
  /** Archival Gage still. Off until the quote has landed; then fade in. */
  somaGage: boolean

  // ── Movements 2–3: the shot and the team ─────────────────────────────
  /**
   * The basketball shot, drawn over the soma figure (`shot: "soma"`).
   * 0 off · 1 the court is in the world · 2 motor chain and release ·
   * 3 the perceive→model→predict→act→sense loop. See graph/court.ts.
   * `courtMind` is the pause before the shot: inputs meet in the brain and
   * the arm network is already the act.
   */
  court: CourtStage
  courtMind: boolean
  /**
   * The basketball team. Replaces the single figure with five asterisms.
   * 0 off · 1 shared model (relationships only, no ball) · 2 live
   * communication and a pass · 3 emergence (the system, not the players).
   */
  team: TeamStage
  /**
   * Pause on the inbound, zoomed into one skull. 0 off · 1 senses arriving ·
   * 2 the trained branches · 3 they resolve, and the crash is the sequence.
   */
  teamMind: TeamMind

  // ── Movement 4: the hinge ───────────────────────────────────────────
  /** Life of the Packet callback. 0 = off. */
  packetLife: PacketLife

  // ── Movements 5–7: the enterprise ───────────────────────────────────
  /** Logistics enterprise reveal. 0 off, else cumulative 1–9. */
  ent: EntPhase
  /** Policy, commitment and capacity semantics on the enterprise edges. */
  entModel: boolean
  /** One package travels the whole route — the enterprise's basketball shot. */
  entPackage: boolean
  /** Machines acting within policy render focused; humans stay lit regardless. */
  entAutonomy: boolean
  /** Humans move up the stack — supervision rather than execution. */
  entHumans: boolean
  /**
   * Weather closes the Pacific gateway. "onset" turns the affected span
   * amber; "reroute" adds the alternate paths and shifts capacity. Amber, not
   * red — nothing failed, and the beat is about the response.
   */
  entDisrupt: "none" | "onset" | "reroute"
  /**
   * The storm, told like the shot. 0 off · 1 the aircraft call does not
   * return and the dispatcher waits · 2 the path answers and she reroutes ·
   * 3 the same call dies on the way to the system, while the hub still looks
   * fine · 4 the system acts on the gateway anyway · 5 the path answers and
   * the packages move.
   */
  dispatch: 0 | 1 | 2 | 3 | 4 | 5
  /** Live operational signals beside the nodes — the enterprise's senses. */
  entSignals: boolean
  /** Facts snap into the dependency chain that actually explains them. */
  entRelations: boolean
  /** Subtle MCP / A2A / RAG / telemetry edge tags. Detail, never narration. */
  entTags: boolean
  /** Domain intelligences answer from their own authority, just in time. */
  federation: boolean
  /** Keep all contract answers visible (skip the staggered ask). */
  federationHold: boolean
  /** Which station of the autonomy loop is lit. */
  station: LoopStation
  /** Pulse travels the full Observe→Verify orbit once. */
  loopTour: boolean
  /** The loop closed: the action's effect came back. Turns the fabric healthy. */
  verified: boolean
  /** Final pullback: neuron → brain → body → player → team → enterprise. */
  scaleTour: boolean
}

export interface Beat {
  id: string
  act: ActId
  actLabel: string
  /** Audience sentence. Empty = silence. */
  line: string
  /** Presenter: what comes next. */
  nextHint: string
  durationMs: number
  world: WorldState
}

export type StageMode = "cinema" | "conductor"
