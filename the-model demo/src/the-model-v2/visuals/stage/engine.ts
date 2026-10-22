import { ACT_START, BEATS, CINEMA_TOTAL_MS } from "../beats/script"
import { HOLD_SETTLE_MS, segmentBySlug } from "../beats/segments"
import type { ActId, Beat, StageMode } from "./types"

export interface StageSnapshot {
  index: number
  beat: Beat
  mode: StageMode
  paused: boolean
  total: number
  remainingCinemaMs: number
  nextLine: string
  /**
   * Set when the page was opened on one presentation chapter (`?segment=`).
   * Cinema then plays that chapter and stops on its hold frame.
   */
  segment: string | null
  /** True once the hold frame has settled and a recording should cut. */
  segmentHold: boolean
  segmentError: string | null
}

interface SegmentFence {
  slug: string
  start: number
  end: number
}

type Listener = () => void

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function segmentRequest(): { slug: string } | { error: string } | null {
  if (typeof window === "undefined") return null
  const slug = new URLSearchParams(window.location.search).get("segment")
  if (!slug) return null
  return segmentBySlug(slug) ? { slug } : { error: slug }
}

class StageEngine {
  private index = 0
  private mode: StageMode = "conductor"
  private paused = false
  private listeners = new Set<Listener>()
  private cinemaTimer: number | null = null
  private cinemaClock: number | null = null
  private settleTimer: number | null = null
  private beatLeft = 0
  private fence: SegmentFence | null = null
  private segmentHold = false
  private segmentError: string | null = null
  private snap: StageSnapshot

  constructor() {
    const request = segmentRequest()
    if (request && "error" in request) {
      this.segmentError = `Unknown presentation segment "${request.error}".`
    } else if (request) {
      const segment = segmentBySlug(request.slug)!
      this.fence = { slug: segment.slug, start: segment.start, end: segment.end }
      this.index = segment.start
      this.mode = "cinema"
    }
    this.beatLeft = BEATS[this.index]?.durationMs ?? 0
    this.snap = this.build()
    if (this.fence) this.emit()
  }

  subscribe = (fn: Listener) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  get = (): StageSnapshot => this.snap

  private lastIndex(): number {
    return this.fence ? this.fence.end : BEATS.length - 1
  }

  private remaining(): number {
    const last = this.lastIndex()
    let rest = 0
    for (let i = this.index + 1; i <= last; i++) rest += BEATS[i]!.durationMs
    return this.beatLeft + rest
  }

  private build(): StageSnapshot {
    const beat = BEATS[this.index] ?? BEATS[0]!
    const next = BEATS[this.index + 1]
    return {
      index: this.index,
      beat,
      mode: this.mode,
      paused: this.paused,
      total: BEATS.length,
      remainingCinemaMs: this.remaining(),
      nextLine: next && (!this.fence || this.index < this.fence.end) ? next.line : "",
      segment: this.fence?.slug ?? null,
      segmentHold: this.segmentHold,
      segmentError: this.segmentError,
    }
  }

  private emit() {
    this.segmentHold = false
    this.beatLeft = BEATS[this.index]?.durationMs ?? 0
    this.snap = this.build()
    for (const fn of this.listeners) fn()
    this.armCinema()
    this.armClock()
    this.armSettle()
  }

  private tickRemaining() {
    if (this.mode === "cinema" && !this.paused) {
      this.beatLeft = Math.max(0, this.beatLeft - 500)
    }
    this.snap = this.build()
    for (const fn of this.listeners) fn()
  }

  private armClock() {
    if (this.cinemaClock != null) {
      window.clearInterval(this.cinemaClock)
      this.cinemaClock = null
    }
    if (this.mode !== "cinema" || this.paused) return
    if (this.fence && this.index >= this.fence.end) return
    this.cinemaClock = window.setInterval(() => this.tickRemaining(), 500)
  }

  private armCinema() {
    if (this.cinemaTimer != null) {
      window.clearTimeout(this.cinemaTimer)
      this.cinemaTimer = null
    }
    if (this.mode !== "cinema" || this.paused) return
    const beat = BEATS[this.index]
    if (!beat) return
    if (this.index >= this.lastIndex()) return
    this.cinemaTimer = window.setTimeout(() => this.next(), beat.durationMs)
  }

  /**
   * Marks the cut point for a chapter recording. The hold frame stays up;
   * only the attribute flips, so a capture can stop without the presenter
   * pause being in the file.
   */
  private armSettle() {
    if (this.settleTimer != null) {
      window.clearTimeout(this.settleTimer)
      this.settleTimer = null
    }
    const onHold =
      this.fence != null && this.mode === "cinema" && this.index === this.fence.end
    if (!onHold) {
      this.segmentHold = false
      return
    }
    this.segmentHold = false
    this.settleTimer = window.setTimeout(() => {
      this.settleTimer = null
      this.segmentHold = true
      this.snap = this.build()
      for (const fn of this.listeners) fn()
    }, HOLD_SETTLE_MS)
  }

  next = () => {
    this.go(this.index + 1)
  }

  prev = () => {
    this.go(this.index - 1)
  }

  go = (index: number) => {
    const min = this.fence?.start ?? 0
    this.index = clamp(index, min, this.lastIndex())
    this.emit()
  }

  jumpAct = (act: ActId) => {
    if (this.fence) return
    const i = ACT_START[act]
    if (i >= 0) this.go(i)
  }

  toggleMode = () => {
    this.mode = this.mode === "cinema" ? "conductor" : "cinema"
    if (this.mode === "cinema") this.paused = false
    this.emit()
  }

  togglePause = () => {
    this.paused = !this.paused
    this.emit()
  }
}

export const stage = new StageEngine()
export { CINEMA_TOTAL_MS }
