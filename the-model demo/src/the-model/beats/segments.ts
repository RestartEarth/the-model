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
 * - The cortex sentence (`neural`) is its own hold, before senses and the shot.
 * - People and language sit between that sentence and the shot, so the shot
 *   can stay a tight clip of its own.
 * - Team emergence is the hold; "five is a team" opens the climb to Gage.
 * - The Gage photograph is a silence. The packet callback is the next click,
 *   not a tail on the photograph.
 * - The organism line is the logistics hold. The scale line is the entrance.
 * - Understanding ends once the model can ask the parts that know. Agents
 *   and the humans line are the next film.
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
    note: "Cosmos, water, mycelium, photosynthesis, food web, then the pullback. Talk over the architecture line. The cortex is the next film.",
  },
  {
    slug: "02-body",
    title: "Body",
    from: "body",
    to: "neural",
    note: "One body, layer by layer, ending inside the cortex. Long hold on the relationships sentence.",
  },
  {
    slug: "03-minds",
    title: "Minds",
    from: "senses",
    to: "language",
    note: "Perception, the living loop, then people and language. Hold on language as the way one mind gives another a model. The shot is the next click.",
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
    note: "Five players, the inbound inside one skull, the play, then the celebration. Hold on the emergence sentence. The scale line opens the next film.",
  },
  {
    slug: "06-gage",
    title: "Gage",
    from: "team-scale",
    to: "gage",
    note: "From the team up through markets and the internet to the bare quote, then the photograph. End motionless. This silence is the presenter's, not the file's. Click for the packet.",
  },
  {
    slug: "07-packet",
    title: "Packet",
    from: "packet-open",
    to: "packet-layers",
    note: "The wordless proof that computing was built this way. Short hold, then the enterprise.",
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
    note: "One promise, weather closes a hub, the aircraft call dies on the path and she waits, then the path answers and the route changes. Hold on the promise.",
  },
  {
    slug: "10-understand",
    title: "Understanding",
    from: "auto-open",
    to: "auto-federate-hold",
    note: "Perception, relationships, meaning, federation. The longest hold in the deck — the system can ask the parts that actually know. Reasoning is the next click.",
  },
  {
    slug: "11-agents",
    title: "Agents",
    from: "auto-reasoning",
    to: "humans",
    note: "Reasoning has to cross the network. The same storm: it knows how storms work, the hub still looks fine, the aircraft call does not return, and it acts on the gateway. Then the path answers and every package moves. Hold on the humans line.",
  },
  {
    slug: "12-loop",
    title: "The loop",
    from: "loop",
    to: "loop-runs",
    note: "Observe, understand, decide, act, verify. Hold on the callback to the shot — it is the only loop there is.",
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
