import { useEffect, useState } from "react"
import { usePrefersReducedMotion } from "../stage/hooks"
import type { WorldState } from "../stage/types"
import gageStill from "../assets/gage/john-gage-2008.jpg"

/**
 * Archival still of John Gage, graded into the keynote field.
 *
 * The photograph stays clean — no soma cosmos, gold nerves, or starfield on
 * the face. It fades in under the quote, holds through the silence, then
 * recedes when the next beat takes the frame with centred type.
 *
 * The teal 1984 period scaffolding that used to sit beside the portrait
 * (workstations, Ethernet, the earliest internet) is gone with its beats: the
 * recast show jumps forward from Gage into the future enterprise rather than
 * rewinding into period hardware, so there is nothing left for that column to
 * hold. See §12 of the recast brief, and beats/script.ts.
 *
 * Source: Wikimedia Commons File:John Gage (2).jpg — Joi Ito, 5 Oct 2008,
 * CC BY 2.0. Not a Sun labs interior. Attribution lives on the presenter HUD.
 */
export function GageStill({ world }: { world: WorldState }) {
  const reduced = usePrefersReducedMotion()
  const [fadedInRaw, setFadedIn] = useState(reduced)

  // Two frames, not one: the fade-in class has to land on a paint after the
  // element already exists, or the browser has nothing to transition from.
  useEffect(() => {
    if (reduced) return
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setFadedIn(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [reduced])

  const fadedIn = reduced ? true : fadedInRaw
  const recede = world.showTitle

  return (
    <div
      className={`gage-still${fadedIn ? " is-in" : ""}${
        recede ? " is-receding is-title" : ""
      }`}
      aria-label="John Gage, Sun Microsystems, 1984"
    >
      <img
        className="gage-still-photo"
        src={gageStill}
        alt="John Gage, photographed by Joi Ito, 5 October 2008"
      />
      <div className="gage-still-grade" />
    </div>
  )
}
