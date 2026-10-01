/**
 * Static runtime report for the keynote.
 *
 * Parses `durationMs` straight out of beats/script.ts rather than importing
 * it, so it runs with plain node and needs no build step or DOM. The target
 * is 27–29 scripted minutes; the hard ceiling is 30.
 *
 *   node scripts/runtime.mjs
 *   node scripts/runtime.mjs --beats
 */

import { readFileSync } from "node:fs"

const src = readFileSync(
  new URL("../src/the-model/beats/script.ts", import.meta.url),
  "utf8"
)

const BEAT_RE =
  /beat\(\s*"([a-z0-9-]+)",\s*(\d),\s*(M[1-7]),[\s\S]*?(\d{4,6}),\s*\n\s*world\(/g

const beats = []
for (const m of src.matchAll(BEAT_RE)) {
  beats.push({ id: m[1], act: Number(m[2]), ms: Number(m[4]) })
}

if (!beats.length) {
  console.error("runtime: parsed 0 beats — the beat() shape in script.ts changed")
  process.exit(1)
}

const clock = (ms) => {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

const MOVEMENTS = {
  1: "An architecture that repeats",
  2: "Networks make intelligence",
  3: "Intelligence networks with intelligence",
  4: "1984",
  5: "The enterprise",
  6: "What autonomy requires",
  7: "The autonomous enterprise",
}

// Every beat runs. There is no appendix act to exclude — removed beats live in
// `archive/` at the repo root, outside the build.
const show = beats
const total = show.reduce((n, b) => n + b.ms, 0)

if (process.argv.includes("--beats")) {
  let at = 0
  for (const b of show) {
    console.log(
      `${clock(at).padStart(6)}  ${String(b.act)}  ${b.id.padEnd(24)} ${String(b.ms / 1000).padStart(5)}s`
    )
    at += b.ms
  }
  console.log()
}

for (const act of Object.keys(MOVEMENTS).map(Number)) {
  const inAct = beats.filter((b) => b.act === act)
  if (!inAct.length) continue
  const ms = inAct.reduce((n, b) => n + b.ms, 0)
  console.log(
    `  ${act}  ${MOVEMENTS[act].padEnd(42)} ${String(inAct.length).padStart(2)} beats  ${clock(ms).padStart(6)}`
  )
}

console.log()
console.log(`  ${show.length} beats · ${clock(total)} scripted`)

if (total > 30 * 60_000) {
  console.error(`\n  OVER THE 30-MINUTE CEILING by ${clock(total - 30 * 60_000)}`)
  process.exit(1)
}
if (total < 27 * 60_000) {
  console.log(`  under the 27-minute target by ${clock(27 * 60_000 - total)}`)
}
