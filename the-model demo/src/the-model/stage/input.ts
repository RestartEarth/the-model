import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import { stage } from "./engine"
import type { ActId } from "./types"

export function useStage() {
  return useSyncExternalStore(
    stage.subscribe,
    () => stage.get(),
    () => stage.get()
  )
}

/**
 * Packaged event apps open `the-model.html?present=1`. A normal visit,
 * including localhost rehearsal, does not set the flag and keeps the full
 * conductor keys.
 */
export function presentationLocked(): boolean {
  if (typeof window === "undefined") return false
  return new URLSearchParams(window.location.search).get("present") === "1"
}

const LOCKED_NEXT = ["ArrowRight", "PageDown", "ArrowDown", " ", "Enter"]
const LOCKED_PREV = ["ArrowLeft", "PageUp", "ArrowUp"]

export function useStageInput() {
  const snapping = useRef(false)

  const bind = useCallback(() => {
    const onKey = (e: KeyboardEvent) => {
      // Leave Command-Q and Alt+F4 to the OS. Do not preventDefault them.
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      )
        return

      if (presentationLocked()) {
        if (LOCKED_NEXT.includes(e.key)) {
          e.preventDefault()
          e.stopPropagation()
          if (snapping.current) return
          snapping.current = true
          stage.next()
          window.setTimeout(() => {
            snapping.current = false
          }, 120)
        } else if (LOCKED_PREV.includes(e.key)) {
          e.preventDefault()
          e.stopPropagation()
          stage.prev()
        } else if (
          e.key === "." ||
          e.key === "b" ||
          e.key === "B" ||
          e.key === "Escape" ||
          e.key === "r" ||
          e.key === "R" ||
          e.key === "Home" ||
          e.key === "c" ||
          e.key === "C" ||
          e.key === "p" ||
          e.key === "P" ||
          (e.key >= "1" && e.key <= "7") ||
          e.key === "[" ||
          e.key === "]" ||
          e.key === "Backspace"
        ) {
          // Swallow clicker and rehearsal keys. Escape must not restart.
          e.preventDefault()
          e.stopPropagation()
        }
        return
      }

      const nextKeys = [" ", "ArrowRight", "PageDown", ".", "Enter"]
      const prevKeys = ["ArrowLeft", "PageUp", "Backspace"]

      if (nextKeys.includes(e.key)) {
        e.preventDefault()
        if (snapping.current) return
        snapping.current = true
        stage.next()
        window.setTimeout(() => {
          snapping.current = false
        }, 120)
      } else if (prevKeys.includes(e.key)) {
        e.preventDefault()
        stage.prev()
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault()
        stage.togglePause()
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault()
        stage.toggleMode()
      } else if (e.key === "[") {
        e.preventDefault()
        stage.prev()
      } else if (e.key === "]") {
        e.preventDefault()
        stage.next()
      } else if (
        e.key === "Home" ||
        e.key === "r" ||
        e.key === "R" ||
        e.key === "Escape"
      ) {
        e.preventDefault()
        stage.go(0)
      } else if (e.key >= "1" && e.key <= "7") {
        // One key per movement. The old `-` (prelude), `0` (1984 cold start)
        // and `8` (appendix) keys are gone with those acts.
        e.preventDefault()
        stage.jumpAct(Number(e.key) as ActId)
      }
    }

    const swallowLockedClick = (e: MouseEvent) => {
      if (!presentationLocked()) return
      e.preventDefault()
      e.stopPropagation()
    }

    const onClick = () => {
      if (presentationLocked()) return
      // A chapter recording auto-advances on its own clock. A click would
      // skip a beat and land in the file.
      if (stage.get().segment) return
      stage.next()
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("click", swallowLockedClick, true)
    window.addEventListener("click", onClick)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("click", swallowLockedClick, true)
      window.removeEventListener("click", onClick)
    }
  }, [])

  useEffect(() => bind(), [bind])
}
