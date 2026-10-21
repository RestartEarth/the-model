import "@/the-model/stage.css"

import { useEffect, useRef } from "react"
import { UniLogo } from "@/components/uni-logo"
import { cn } from "@/lib/utils"
import {
  aiChapterAltitude,
  airChapterStage,
  BEATS,
} from "@/the-model/beats/script"
import {
  GAGE_ATTR,
  GAGE_RETURN_ATTR,
  GAGE_RETURN_KICKER,
  TITLE,
} from "@/the-model/content/copy"
import {
  FLOW_COLOR,
  FLOW_LABEL,
  FLOW_ORDER,
} from "@/the-model/graph/aiNetwork"
import { stage } from "@/the-model/stage/engine"
import { usePrefersReducedMotion } from "@/the-model/stage/hooks"
import {
  presentationLocked,
  useStage,
  useStageInput,
} from "@/the-model/stage/input"
import type { WorldState } from "@/the-model/stage/types"
import { AiNetwork } from "@/the-model/world/AiNetwork"
import { Fabric } from "@/the-model/world/Fabric"
import { RouteSky } from "@/the-model/world/RouteSky"
import { Starfield } from "@/the-model/world/Starfield"

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

function TheModelTitleBar({
  beatIndex,
  ai,
  onAi,
  onSection,
}: {
  beatIndex: number
  ai: boolean
  onAi: () => void
  onSection: (index: number) => void
}) {
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
            onClick={() => onSection(i)}
            aria-current={activeSection === i ? "page" : undefined}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
          >
            {section.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onAi}
          aria-current={ai ? "page" : undefined}
          className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
        >
          AI network
        </button>
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
function fabricRequested() {
  if (typeof window === "undefined") return false
  return new URLSearchParams(window.location.search).get("fabric") === "ai"
}

const AI_START = BEATS.findIndex((b) => b.id === "ai-file")
const REROUTE = BEATS.findIndex((b) => b.id === "ent-reroute")

/**
 * Key 8 / AI network / `?fabric=ai` jumps into the technical chapter.
 * Left from ai-file then returns to the logistics beat that was interrupted.
 * The audience door is the run order: aircraft, then the traffic diagram
 * through perceive, model, and meaning, then the enterprise map at federation.
 */

/**
 * Readings of ai-fabric's picture. Frame 14, labels on, their own bottom
 * caption. Later `networkWide` beats stay the quiet wide shot.
 */
const FABRIC_READ = new Set(["auto-perceive", "auto-model", "auto-semantics"])
let techReturn: number | null = null

function inTechChapter(id: string) {
  return aiChapterAltitude(id) > 0
}

function enterTechChapter() {
  const index = stage.get().index
  const id = BEATS[index]?.id ?? ""
  if (!inTechChapter(id) && airChapterStage(id) === 0) techReturn = index
  stage.go(AI_START)
}

function leaveTechShortcut() {
  const back = techReturn ?? REROUTE
  techReturn = null
  stage.go(back)
}

export function TheModelPage() {
  const snap = useStage()
  useStageInput()
  const reducedMotion = usePrefersReducedMotion()
  const { beat } = snap
  const recording = Boolean(snap.segment)
  const airStage = airChapterStage(beat.id)
  const aiAltitude = aiChapterAltitude(beat.id)
  const fabricRead = FABRIC_READ.has(beat.id)
  const showWide = beat.world.networkWide
  const showChapter = airStage > 0 || aiAltitude > 0 || fabricRead || showWide
  const wasTech = useRef(false)

  useEffect(() => {
    if (wasTech.current && aiAltitude === 0) techReturn = null
    wasTech.current = aiAltitude > 0
  }, [aiAltitude])

  useEffect(() => {
    if (!fabricRequested()) return
    if (!inTechChapter(stage.get().beat.id)) enterTechChapter()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === "8" && !presentationLocked()) {
        e.preventDefault()
        e.stopPropagation()
        if (inTechChapter(stage.get().beat.id)) leaveTechShortcut()
        else enterTechChapter()
        return
      }
      const prev =
        e.key === "ArrowLeft" ||
        e.key === "PageUp" ||
        e.key === "Backspace" ||
        e.key === "[" ||
        e.key === "ArrowUp"
      if (!prev || techReturn == null) return
      if (stage.get().beat.id !== "ai-file") return
      e.preventDefault()
      e.stopPropagation()
      leaveTechShortcut()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [])

  return (
    <div className="the-model-stage-frame">
      <main
        className="the-model-stage"
        data-beat={beat.id}
        data-segment={snap.segment ?? undefined}
        data-segment-phase={recording ? (snap.segmentHold ? "hold" : "playing") : undefined}
      >
        {airStage > 0 ? (
          <>
            <Starfield />
            <RouteSky stage={airStage} reduced={reducedMotion} />
            <div className="stage-vignette" />
          </>
        ) : aiAltitude > 0 || fabricRead ? (
          <>
            <Starfield />
            <AiNetwork
              reduced={reducedMotion}
              beat={fabricRead ? 14 : aiAltitude}
            />
            <div className="stage-vignette" />
          </>
        ) : showWide ? (
          <>
            <Starfield />
            <AiNetwork reduced={reducedMotion} beat={14} quietBrands />
            <div className="stage-vignette" />
          </>
        ) : (
          <Fabric world={beat.world} />
        )}

        {!recording && (
          <div className="pointer-events-none absolute inset-0 z-40">
            <TheModelTitleBar
              beatIndex={snap.index}
              ai={showChapter}
              onAi={enterTechChapter}
              onSection={(i) => {
                techReturn = null
                stage.go(SECTION_START_INDEX[i])
              }}
            />
          </div>
        )}

        {snap.segmentError && (
          <p className="pointer-events-none absolute bottom-4 left-4 z-40 text-sm text-[#E8A04A]">
            {snap.segmentError}
          </p>
        )}

        {airStage > 0 || aiAltitude > 0 || fabricRead ? (
          <div className="pointer-events-none absolute right-4 bottom-3 left-4 z-30 flex flex-col gap-1.5">
            <p className="max-w-4xl text-[18px] leading-snug text-[#F1F5FE]">
              {beat.line}
            </p>
            {beat.id === "ai-fabric" && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {FLOW_ORDER.map((kind) => (
                  <span
                    key={kind}
                    className="flex items-center gap-1.5 text-[11px] tracking-[0.08em] text-[#8B97A8] uppercase"
                  >
                    <span
                      className="inline-block size-1.5 rounded-full"
                      style={{
                        background: FLOW_COLOR[kind],
                        boxShadow: `0 0 8px ${FLOW_COLOR[kind]}`,
                      }}
                    />
                    {FLOW_LABEL[kind]}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : beat.world.showQuote ? (
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
