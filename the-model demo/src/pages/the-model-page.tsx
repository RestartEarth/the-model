import "@/the-model/stage.css"

import { UniLogo } from "@/components/uni-logo"
import { cn } from "@/lib/utils"
import { BEATS } from "@/the-model/beats/script"
import {
  GAGE_ATTR,
  GAGE_RETURN_ATTR,
  GAGE_RETURN_KICKER,
  TITLE,
} from "@/the-model/content/copy"
import { stage } from "@/the-model/stage/engine"
import { usePrefersReducedMotion } from "@/the-model/stage/hooks"
import { useStage, useStageInput } from "@/the-model/stage/input"
import type { WorldState } from "@/the-model/stage/types"
import { Fabric } from "@/the-model/world/Fabric"

/**
 * The three top-nav destinations, each a jump to the beat that opens that arc
 * of the show. They follow the recast structure: nature (movement 1), then
 * intelligence and teams (movements 2–3), then Gage onward into the enterprise
 * and autonomy (movements 4–7). See the-model/beats/script.ts.
 */
const SECTIONS = [
  { label: "Nature", beatId: "open" },
  { label: "Intelligence", beatId: "body" },
  { label: "Enterprise", beatId: "ent-open" },
] as const

const SECTION_START_INDEX = SECTIONS.map((s) =>
  BEATS.findIndex((b) => b.id === s.beatId)
)

/**
 * Opaque, not `FLOATING_SURFACE`'s `backdrop-blur-md` — this stage sits over
 * a full-bleed SVG that's mid-camera-lerp or beat-pulse animating on nearly
 * every frame (worst case: the water-cycle beat's mountains/rivers/ocean/
 * clouds/rain all animate at once), so a blurred backdrop has to resample
 * that motion continuously. That resample cost scales with panel area and
 * screen resolution, which is why it only visibly flickers on large/zoomed
 * displays — the standalone the-model app never had floating chrome at all,
 * so this regression is specific to hosting it under uni-demo's canvas shell.
 *
 * Colors are the-model's own literal palette (`design/tokens.ts`'s `rail`/
 * `railBorder`), not uni-demo's `bg-background`/`border-border` theme
 * tokens — this stage is always the show's fixed dark cinematic look, not
 * something that should flip to a light card on a viewer whose OS/browser
 * reports a light `prefers-color-scheme` (uni-demo's theme defaults to
 * "system", see `routes/__root.tsx`).
 */
const THE_MODEL_SURFACE =
  "rounded-xl border border-[#2A3140]/60 bg-[#1F232C]/95 shadow-lg"

// Drop shadow standing in for `THE_MODEL_SURFACE`'s opaque card, now that the
// title and nav float directly over the stage's animated visual instead of
// sitting on a backing card — legibility over whatever beat is playing
// underneath (starfield, earth, body/soma) without paying for a blurred
// backdrop (see the `THE_MODEL_SURFACE` comment above for why blur is out).
const FLOATING_TEXT_SHADOW = "drop-shadow-[0_1px_10px_rgba(10,12,18,0.85)]"

function TheModelTitleBar({ beatIndex }: { beatIndex: number }) {
  // Last section whose start index is at or before the current beat.
  let activeSection = 0
  for (let i = 0; i < SECTION_START_INDEX.length; i++) {
    if (beatIndex >= SECTION_START_INDEX[i]) activeSection = i
  }

  return (
    <>
      <div
        className={cn(
          "pointer-events-auto absolute top-4 left-4 flex min-w-0 items-center gap-3",
          FLOATING_TEXT_SHADOW
        )}
      >
        <UniLogo className="size-9 shrink-0 [&_path]:fill-white" />
        <h1 className="truncate text-2xl font-semibold text-white">
          The Network is the Computer
        </h1>
      </div>

      <nav
        className={cn(
          "pointer-events-auto absolute top-4 right-4 flex shrink-0 items-center gap-1",
          FLOATING_TEXT_SHADOW
        )}
      >
        {SECTIONS.map((section, i) => (
          <button
            key={section.label}
            type="button"
            onClick={() => stage.go(SECTION_START_INDEX[i])}
            aria-current={activeSection === i ? "page" : undefined}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
          >
            {section.label}
          </button>
        ))}
      </nav>
    </>
  )
}

/**
 * The show's floating right panel — the same `/intelligence`-style detail
 * panel slot, but simplified down to just the beat's line: a handful of
 * large, presenter-facing sentences rather than a header/tabs/sections
 * detail view, since that's all a beat ever carries. Absent on silent
 * beats (empty `line`) rather than showing an empty panel.
 */
function TheModelTextPanel({ line }: { line: string }) {
  if (!line) return null

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-[26rem] max-w-[calc(100%-2rem)] flex-col gap-2 p-6",
        THE_MODEL_SURFACE
      )}
    >
      <p className="text-2xl leading-snug font-medium text-[#F1F5FE]">{line}</p>
    </div>
  )
}

/**
 * The `world.showTitle` beats are a thesis-drop, not a caption — they get the
 * full-bleed centered treatment over whatever visual is still on screen,
 * rather than the corner panel. In the recast show these are the intentional
 * pauses: the neural-intelligence reveal, team emergence, the enterprise
 * organism, THE MODEL's second meaning, and the closing line. `stage.css`
 * already ships `.audience`/`.audience-title` (ported verbatim from
 * the-model's `AudienceChrome`).
 */
function TheModelCenterTitle({ line }: { line: string }) {
  if (!line) return null

  return (
    <div className="audience center">
      <p className="audience-statement">{line}</p>
    </div>
  )
}

/**
 * The `world.showQuote` beats — Gage's "the network is the computer" and its
 * closing return — get the same full-bleed centered treatment as `showTitle`,
 * plus a kicker/attribution frame around the line. Ported from the-model's
 * `AudienceChrome` `showQuote` branch. `onGage` gates the kicker/attribution
 * (not just `line`) because `soma-gage` shows the bare quote a beat before
 * `gage-fade` reveals whose line it is — the same dramatic beat as the
 * original show.
 */
function TheModelCenterQuote({
  line,
  world,
}: {
  line: string
  world: WorldState
}) {
  if (!line) return null

  const returned = world.verified
  const onGage = returned || world.somaGage

  return (
    <div className="audience center">
      {onGage && (
        <p className="audience-kicker">
          {returned ? GAGE_RETURN_KICKER : "Sun Microsystems"}
        </p>
      )}
      <p className="audience-quote">{line}</p>
      {onGage && (
        <p className="audience-attr">
          {returned ? GAGE_RETURN_ATTR : GAGE_ATTR}
        </p>
      )}
    </div>
  )
}

/**
 * Brief "THE MODEL" title emphasis over the current beat's own visual/panel,
 * then fades — distinct from `TheModelCenterTitle`'s sustained full-bleed
 * takeover. Keyed by beat id so re-entering the beat replays the flash.
 */
function TitleFlash() {
  return (
    <div className="title-flash" aria-hidden="true">
      <p className="audience-title-flash">{TITLE}</p>
    </div>
  )
}

/**
 * Hosts the ported the-model keynote engine inside uni-demo's own floating
 * chrome (matching `/intelligence`'s title-bar and detail-panel patterns)
 * instead of the bare debug overlay this started as.
 */
export function TheModelPage() {
  const snap = useStage()
  useStageInput()
  const reducedMotion = usePrefersReducedMotion()

  const { beat } = snap

  return (
    <div className="the-model-stage-frame">
      <main className="the-model-stage">
        <Fabric world={beat.world} />

        <div className="pointer-events-none absolute inset-0 z-40">
          <TheModelTitleBar beatIndex={snap.index} />
        </div>

        {beat.world.showQuote ? (
          <div className="pointer-events-none absolute inset-0 z-30">
            <TheModelCenterQuote line={beat.line} world={beat.world} />
          </div>
        ) : beat.world.showTitle ? (
          <div className="pointer-events-none absolute inset-0 z-30">
            <TheModelCenterTitle line={beat.line} />
          </div>
        ) : (
          <div className="pointer-events-none absolute right-3 bottom-3 z-30">
            <TheModelTextPanel line={beat.line} />
          </div>
        )}

        {beat.world.titleFlash && !reducedMotion && (
          <div className="pointer-events-none absolute inset-0 z-[35]">
            <TitleFlash key={beat.id} />
          </div>
        )}
      </main>
    </div>
  )
}
