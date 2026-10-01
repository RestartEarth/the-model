import { useEffect, useRef, useState } from "react"

/**
 * Monotonic seconds since the hook went active, for renderers that animate a
 * travelling glyph along a route (the basketball motor chain, the package
 * crossing the logistics network). Returns a frozen frame under reduced
 * motion — callers pick a representative `t` themselves rather than getting a
 * stopped clock at 0, so the scene still reads as composed.
 */
export function useClock(active: boolean, reduced: boolean): number {
  const [t, setT] = useState(0)
  const start = useRef(0)

  useEffect(() => {
    if (!active || reduced) return
    let raf = 0
    // The origin comes from the first frame's own timestamp, not from a
    // `performance.now()` taken here: rAF reports the time the frame began,
    // which can precede this line, and a clock that starts a few
    // milliseconds negative sends every `t % cycle` consumer below zero.
    start.current = 0
    const step = (now: number) => {
      if (!start.current) start.current = now
      setT((now - start.current) / 1000)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, reduced])

  return t
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  return reduced
}

export function useAudienceMode(): boolean {
  const [audience] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const file = window.location.pathname
    if (params.get("presenter") === "1" || /presenter\.html$/i.test(file)) {
      return false
    }
    if (params.get("audience") === "1" || /audience\.html$/i.test(file)) {
      return true
    }
    return import.meta.env.VITE_PACK === "1"
  })
  return audience
}
