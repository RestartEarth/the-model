import { BEATS } from "./visuals/beats/script"
import script from "./script.json"
import type { WorldState } from "./visuals/stage/types"

// Local snapshot: v2 visual edits never mutate the v1 renderer or choreography.
export function sceneFor(id: string): WorldState {
  const base = BEATS.find(b => b.id === id)!.world
  return { ...base, showTitle: false, showQuote: false, titleFlash: false,
    fadeToBlack: false, somaLoop: false }
}
export const movements = [
  { start: 1, title: "Connection" }, { start: 15, title: "One promise" },
  { start: 23, title: "The model" }, { start: 27, title: "One decision" },
  { start: 40, title: "What changes" },
].map(m => ({ ...m, start: script.findIndex(b => b.scene === m.start) + 1 }))
export function movementFor(n: number) {
  return movements.filter(m => n >= m.start).at(-1)!
}
