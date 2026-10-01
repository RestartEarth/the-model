import { ACT_START, BEATS, CINEMA_TOTAL_MS } from "../beats/script";
import type { ActId, Beat, StageMode } from "./types";

export interface StageSnapshot {
  index: number;
  beat: Beat;
  mode: StageMode;
  paused: boolean;
  total: number;
  remainingCinemaMs: number;
  nextLine: string;
}

type Listener = () => void;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

class StageEngine {
  private index = 0;
  private mode: StageMode = "conductor";
  private paused = false;
  private listeners = new Set<Listener>();
  private cinemaTimer: number | null = null;
  private cinemaClock: number | null = null;
  private beatLeft = 0;
  private snap: StageSnapshot;

  constructor() {
    this.beatLeft = BEATS[0]?.durationMs ?? 0;
    this.snap = this.build();
  }

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  get = (): StageSnapshot => this.snap;

  private remaining(): number {
    const here = BEATS[this.index];
    const inAppendix = here?.act === 6;
    let rest = 0;
    for (let i = this.index + 1; i < BEATS.length; i++) {
      const b = BEATS[i]!;
      if (!inAppendix && b.act === 6) continue;
      rest += b.durationMs;
    }
    return this.beatLeft + rest;
  }

  private build(): StageSnapshot {
    const beat = BEATS[this.index] ?? BEATS[0]!;
    const next = BEATS[this.index + 1];
    return {
      index: this.index,
      beat,
      mode: this.mode,
      paused: this.paused,
      total: BEATS.length,
      remainingCinemaMs: this.remaining(),
      nextLine: next?.line ?? "",
    };
  }

  private emit() {
    this.beatLeft = BEATS[this.index]?.durationMs ?? 0;
    this.snap = this.build();
    for (const fn of this.listeners) fn();
    this.armCinema();
    this.armClock();
  }

  private tickRemaining() {
    if (this.mode === "cinema" && !this.paused) {
      this.beatLeft = Math.max(0, this.beatLeft - 500);
    }
    this.snap = this.build();
    for (const fn of this.listeners) fn();
  }

  private armClock() {
    if (this.cinemaClock != null) {
      window.clearInterval(this.cinemaClock);
      this.cinemaClock = null;
    }
    if (this.mode !== "cinema" || this.paused) return;
    this.cinemaClock = window.setInterval(() => this.tickRemaining(), 500);
  }

  private armCinema() {
    if (this.cinemaTimer != null) {
      window.clearTimeout(this.cinemaTimer);
      this.cinemaTimer = null;
    }
    if (this.mode !== "cinema" || this.paused) return;
    const beat = BEATS[this.index];
    if (!beat) return;
    if (this.index >= BEATS.length - 1) return;
    const next = BEATS[this.index + 1];
    if (beat.act !== 6 && next?.act === 6) return;
    this.cinemaTimer = window.setTimeout(() => this.next(), beat.durationMs);
  }

  next = () => {
    this.index = clamp(this.index + 1, 0, BEATS.length - 1);
    this.emit();
  };

  prev = () => {
    this.index = clamp(this.index - 1, 0, BEATS.length - 1);
    this.emit();
  };

  go = (index: number) => {
    this.index = clamp(index, 0, BEATS.length - 1);
    this.emit();
  };

  jumpAct = (act: ActId) => {
    const i = ACT_START[act];
    if (i >= 0) this.go(i);
  };

  toggleMode = () => {
    this.mode = this.mode === "cinema" ? "conductor" : "cinema";
    if (this.mode === "cinema") this.paused = false;
    this.emit();
  };

  togglePause = () => {
    this.paused = !this.paused;
    this.emit();
  };
}

export const stage = new StageEngine();
export { CINEMA_TOTAL_MS };
