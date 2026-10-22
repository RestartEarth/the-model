import { readFileSync, writeFileSync } from "node:fs"
import { manualCues, restoredNature } from "./v2-manual-cues.mjs"

const source = readFileSync(new URL("../../presentation-script-proposed-v2.txt", import.meta.url), "utf8")
const body = source.split("REVIEW AND INTEGRATION NOTES")[0]
const blocks = body.split(/(?=^V2 BEAT \d+)/m).slice(1)
const editorialBeats = blocks.map((block, index) => {
  const header = block.match(/^V2 BEAT (\d+) — (.+)/)
  if (!header || Number(header[1]) !== index + 1) throw new Error("V2 beat numbers must be consecutive")
  const field = (start, end) => {
    const match = block.match(new RegExp(`^${start}\\n([\\s\\S]*?)\\n\\n${end}`, "m"))
    if (!match) throw new Error(`Missing ${start} in beat ${header[1]}`)
    return match[1].trim()
  }
  const number = Number(header[1])
  const narration = field("NARRATION", "VISUAL CHANGE")
  let line = field("ON SCREEN", "PICTURE / DELIVERY")
    .replace("(No type.)", "")
    .replace("(Keep the final line.)", "THE NETWORK IS THE FOUNDATION OF INTELLIGENCE")
  if (number === 26) line = "A model of the enterprise gives reasoning something to work with."
  if (number === 13 || number === 45) line = "The network is the computer."
  const words = narration.replace(/\([^)]*\)/g, "").trim().split(/\s+/).filter(Boolean).length
  return {
    number, id: `v2-${header[1]}`, title: header[2],
    source: block.match(/^SOURCE: (.+)/m)?.[1] ?? "NEW",
    line, narration,
    visualChange: block.split("\nVISUAL CHANGE\n")[1].split("\n\n\n")[0].trim(),
    durationMs: number === 1 ? 6000 : number === 11 ? 18000 : Math.max(12000, Math.round(words / 135 * 60000) + 5000),
  }
})
if (editorialBeats.length !== 47) throw new Error("The v2 scene map expects 47 beats; review the choreography before changing the beat count")
function blendedVisual(scene, phase) {
  if (scene >= 15 && scene <= 26) return "Keep V2’s enterprise dependencies and arrival/handling promise. Use V1’s recognizable aircraft silhouette for the aircraft carrying Shipment TK–BOS / 01. Each reveal is a manual stop."
  if (scene >= 27 && scene <= 29) return "Follow the same shipment in V1’s aircraft visual language: aircraft, air lanes, satellites, and ground links. Dispatch and flight operations remain visible. New ride evidence is highlighted at scene 28; the proposed alternative is dashed at scene 29. The aircraft remains on its current approved route. Hold until clicked."
  if (scene >= 30 && scene <= 37) return `Open the V1-derived topology around the same aircraft: weather, dispatch, load, slot, handling, models, and shipment retain fixed positions. Highlight only the dependencies relevant to this beat; keep the others dim. In the workload overview, mark processing at participating compute and service nodes as well as traffic along the edges. Route authority and the receiving flight system are explicit separate nodes. ${scene === 37 ? ['Checks satisfied; approval still required.', 'Approval recorded; amendment not yet accepted.', 'Receiving system has accepted Amendment 01; execution is still to be confirmed.'][phase] : 'Pending exchanges use dashed paths. Recovery scenarios are labeled as contingencies, not a second commitment.'} Hold until clicked.`
  if (scene === 38 || scene === 39) return `Return to the same aircraft and shipment. ${scene === 39 || phase >= 2 ? 'Execution and outcome evidence are reported; show the return to dispatch.' : phase === 1 ? 'Flight operations report execution; make the changed route solid. Outcome measurements are still pending.' : 'Amendment accepted, but execution is unconfirmed: keep the aircraft on its current route and the proposed alternative dashed.'} Keep approval, acceptance, execution, and outcome separate. Hold until clicked.`
  if (scene === 41) return [
    "Pull back to the full flight ecosystem using the original topology glyphs and edges. Show processing at compute and service nodes alongside traffic between them. Include chips, compute fabric, serving clusters, model providers, weather, dispatch, aircraft, shipment, logistics company, airline partner, ground, and WAN/interconnect. Architectural roles are illustrative, not claimed vendor contracts. Hold until clicked.",
    "Keep the full topology fixed; dim secondary traffic and highlight the application-code paths through tools, policy, connectivity, and partner systems. Routing, reachability, deadlines, retries, and authorization are part of designing the job and coordinating its workload. Hold until clicked.",
    "Keep the same topology; highlight directed returns from aircraft and cargo sensors, arrival, inference, weather, and network telemetry into observability, then into application code and dispatch. Application context supplies business meaning; packet visibility alone does not establish the outcome. Hold until clicked.",
  ][phase]
  if (scene === 40) return "Return to the same fixed topology with the full set of dependencies illuminated. The aircraft and Shipment 01 remain the anchors. This is the visual payoff: evidence, models, authority, execution, and feedback supported one job. Show processing at participating nodes as well as exchanges between them. Hold until clicked."
}
const beats = []
for (const parent of editorialBeats) {
  const cues = manualCues[parent.number] ?? [{}]
  for (const [i, cue] of cues.entries()) {
    const overrides = Object.fromEntries(Object.entries(cue).filter(([, value]) => value !== undefined))
    beats.push({ ...parent, scene: parent.number, phase: 0, legacyScene: "", ...overrides,
      id: `${parent.id}-${cue.legacyScene || i + 1}`, number: beats.length + 1,
      visualChange: blendedVisual(parent.number, cue.phase ?? 0) ?? (cues.length > 1
        ? `Separate manual stop: ${overrides.title || parent.title}. This state holds until clicked; the next state never appears on a timer.`
        : parent.number === 4 ? "Food web follows the restored mycelium and photosynthesis beats. Hold until clicked."
        : `${parent.visualChange}\n\nManual playback: this state holds until the next click.`),
    })
  }
  if (parent.number === 3) for (const cue of restoredNature) {
    beats.push({ ...parent, ...cue, scene: 3, phase: 0, number: beats.length + 1,
      id: `v2-${cue.source}`, visualChange: "Restored as a separate presenter-controlled nature beat. Holds until clicked.",
    })
  }
}
const target = new URL("../src/the-model-v2/script.json", import.meta.url)
const serialized = JSON.stringify(beats, null, 2) + "\n"
let existing = ""
try { existing = readFileSync(target, "utf8") } catch { /* First generation. */ }
if (existing !== serialized) writeFileSync(target, serialized)
const manualScript = [
  "THE MODEL — V2 MANUAL PRESENTATION", "Every beat advances only on click, Space, or Right Arrow.",
  "Decorative motion and a single play may animate within a beat. There are no timed scene changes.",
  "Generated from the editorial draft and scripts/v2-manual-cues.mjs. Edit those sources, then run npm run sync:v2.", "",
  ...beats.map(b => `BEAT ${String(b.number).padStart(2, "0")}  ${b.id} — ${b.title}\nSOURCE: ${b.source}\n\nON SCREEN\n${b.line || "(No type.)"}\n\nNARRATION\n${b.narration}\n\nVISUAL / DELIVERY\n${b.visualChange}\n`),
].join("\n\n")
const manualTarget = new URL("../../presentation-script-v2-manual.txt", import.meta.url)
let priorManual = ""
try { priorManual = readFileSync(manualTarget, "utf8") } catch { /* First generation. */ }
if (priorManual !== manualScript) writeFileSync(manualTarget, manualScript)
console.log(`Synced ${beats.length} manually advanced v2 beats, including mycelium and photosynthesis.`)
