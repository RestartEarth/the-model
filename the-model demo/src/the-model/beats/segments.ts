import { BEATS } from "./script"

/**
 * Presentation chapters — the films inside the PowerPoint deck.
 *
 * Cinema mode stays the full rehearsal: one timeline, every beat, clocks
 * included. A performed deck is the other cut of the same beats. Each
 * chapter is one clip, one slide. The clip plays when the slide opens and
 * does not advance the deck. It ends on a frame that is already complete,
 * and PowerPoint leaves that frame up for as long as you talk.
 *
 * Design rule for every chapter, and for any beat added later:
 *
 *   entry → motion → stable hold
 *
 * The motion earns the idea. The last beat is the hold. Do not end a clip
 * mid-transition, and do not fade it to black — the cinema-only `end` beat
 * is the one place the stage falls away, and it is not a slide. Do not bake
 * the presenter pause into the clip. `durationMs` on the hold beat is how
 * long that frame is rehearsed in cinema, not how long the file runs.
 *
 * The earlier ten-film sketch is the shape of this list. The current script
 * splits a few of those films where a silence was added:
 *
 * - The cortex sentence (`neural`) is its own hold, then senses, then the shot.
 * - Team emergence is the hold. The pullback opens Gage.
 * - The Gage photograph is a silence. Thought descending to the wire is the
 *   next click, and the packet follows that, not a tail on the photograph.
 * - The organism line is the logistics hold. The scale line is the entrance.
 * - The network film holds through perceive, model, and meaning on the
 *   traffic diagram. Understanding is the return to the enterprise, and it
 *   ends once the model can ask the parts that know. Agents and the humans
 *   line are the next film.
 * - The closing has three holds — the second meaning of the title, Gage's
 *   sentence returned, and the last line — so they are three clips. One
 *   finale film would have played through those silences.
 */

export interface PresentationSegment {
  /** `01-nature` is also the export name: `01-nature.mp4`. */
  slug: string
  title: string
  /** First beat id. Inclusive. */
  from: string
  /** Hold beat id. Inclusive. The clip ends on this frame. */
  to: string
  /** What the presenter does once the hold frame is up. */
  note: string
}

export interface ResolvedSegment extends PresentationSegment {
  start: number
  end: number
  file: string
  /** Audience sentence sitting on the hold frame. */
  hold: string
}

const CHAPTERS: PresentationSegment[] = [
  {
    slug: "01-nature",
    title: "Nature",
    from: "open",
    to: "architecture-repeats",
    note: "Cosmos, the atmosphere as a transport network, then water on that circuit. Mycelium, photosynthesis, the food web, then the pullback. Talk over the architecture line. The body is the next film.",
  },
  {
    slug: "02-body",
    title: "Body",
    from: "body",
    to: "neural",
    note: "One body, layer by layer: energy, structure, blood, organs, lymph, nerves, the brain, then the cortex. Long hold on the relationships sentence.",
  },
  {
    slug: "03-minds",
    title: "Minds",
    from: "senses",
    to: "senses",
    note: "Perception. Hold on the senses. Thought packets are the next click.",
  },
  {
    slug: "03b-minds",
    title: "Minds together",
    from: "language",
    to: "internet",
    note: "Language, people, markets, then off the ground, then the network we built. The shot is the next click.",
  },
  {
    slug: "04-shot",
    title: "The shot",
    from: "shot-reveal",
    to: "shot-loop",
    note: "Tight sync. One figure, one shot, correction still running after the ball leaves the hand. Hold on that loop.",
  },
  {
    slug: "05-team",
    title: "Team",
    from: "team",
    to: "team-emergence",
    note: "Five players, the links, the inbound inside one skull, the tip, then the celebration. Hold on the emergence sentence. The pullback is the next film.",
  },
  {
    slug: "06-gage",
    title: "Gage",
    from: "all-of-it",
    to: "gage",
    note: "The pullback, the bare quote, then the photograph. End motionless. This silence is the presenter's, not the file's. Click for the descent to the wire.",
  },
  {
    slug: "07-packet",
    title: "Packet",
    from: "packet-layers",
    to: "packet-path",
    note: "Thought goes down through the layers and leaves as a pulse. Then the parcel, then a path chosen in flight. Hold on that path. The enterprise is the next click.",
  },
  {
    slug: "08-organism",
    title: "Organism",
    from: "ent-open",
    to: "ent-organism",
    note: "The scale line is the entrance. Aircraft, vehicles, hubs, people, systems, then the pullback. Hold on the organism sentence.",
  },
  {
    slug: "09-package",
    title: "One package",
    from: "ent-package",
    to: "ent-reroute",
    note: "One promise, weather closes a hub, the aircraft call dies on the path and she waits, then the path answers and the route changes. Hold on the promise. The autonomous aircraft is the next click.",
  },
  {
    slug: "09b-aircraft",
    title: "The aircraft",
    from: "air-seat",
    to: "air-operate",
    note: "Use case. One aircraft, no one in the seat, sensitive cargo, turbulence, the herd, one path. Hold on perceive–traverse–verify. The network view is the next click.",
  },
  {
    slug: "09c-network",
    title: "The network",
    from: "ai-file",
    to: "auto-semantics",
    note: "Traffic patterns, then the commit rule, then perceive, model, and meaning still on that diagram. Do not replay the flight. The enterprise map is the next click.",
  },
  {
    slug: "10-understand",
    title: "Understanding",
    from: "auto-federate",
    to: "auto-federate-hold",
    note: "Return to the same enterprise, the landing, once the nouns are air, hub, and belt. Hold on the parts that actually know. Reasoning is the next click.",
  },
  {
    slug: "11-agents",
    title: "Agents",
    from: "auto-reasoning",
    to: "humans",
    note: "Reasoning has to cross the network. Traffic, relationships, the act, then the path answers. Hold on the humans line. The enterprise running is the next film.",
  },
  {
    slug: "13-model",
    title: "The model",
    from: "autonomous-enterprise",
    to: "the-model",
    note: "The enterprise running while people sleep, the six scales, then the title's second meaning. Hold there.",
  },
  {
    slug: "14-return",
    title: "Return",
    from: "humans-remain",
    to: "gage-returns",
    note: "People are still in the picture. Then the same photograph and the same sentence, now an operating requirement. Silence, then click.",
  },
  {
    slug: "14b-recap",
    title: "Recap",
    from: "recap-architecture",
    to: "recap-model",
    note: "Three held frames. The organism, the wide fabric under perceive-traverse-verify, the wide fabric under the model. The close is the next click.",
  },
  {
    slug: "15-close",
    title: "Close",
    from: "close",
    to: "close",
    note: "The last line, and nothing else. Thank-you and the fade to black stay in cinema; they are not this clip.",
  },
]

function beatIndex(id: string): number {
  const index = BEATS.findIndex((beat) => beat.id === id)
  if (index < 0) {
    throw new Error(`Presentation segment references unknown beat "${id}".`)
  }
  return index
}

function resolve(chapter: PresentationSegment): ResolvedSegment {
  const start = beatIndex(chapter.from)
  const end = beatIndex(chapter.to)
  if (end < start) {
    throw new Error(
      `Presentation segment ${chapter.slug} ends at "${chapter.to}" before it starts at "${chapter.from}".`
    )
  }
  return {
    ...chapter,
    start,
    end,
    file: `${chapter.slug}.mp4`,
    hold: BEATS[end]!.line,
  }
}

export const SEGMENTS: ResolvedSegment[] = CHAPTERS.map(resolve)

/**
 * How long the hold beat plays before a recording should cut. Long enough
 * for the camera ease, the Gage fade, and the title flash to finish. The
 * frame then stays on screen; that extra time is not part of the file.
 */
export const HOLD_SETTLE_MS = 4500

let cursor = 0
for (const segment of SEGMENTS) {
  if (segment.start !== cursor) {
    const missed = BEATS.slice(cursor, segment.start)
      .map((beat) => beat.id)
      .join(", ")
    throw new Error(
      `Presentation segment ${segment.slug} skips ${missed || "a gap"}. Chapters have to cover the show in order.`
    )
  }
  cursor = segment.end + 1
}

const leftover = BEATS.slice(cursor).map((beat) => beat.id)
if (leftover.length !== 1 || leftover[0] !== "end") {
  throw new Error(
    `Presentation segments must cover every beat except the cinema-only "end" fade. Left over: ${
      leftover.join(", ") || "(nothing)"
    }.`
  )
}

export function segmentBySlug(slug: string): ResolvedSegment | undefined {
  return SEGMENTS.find((segment) => segment.slug === slug)
}
