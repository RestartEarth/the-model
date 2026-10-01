/**
 * Stand-in for uni-demo's `@/components/theme-controls/init-theme`.
 *
 * The real one resolves the stored/system theme before first paint so the host
 * app does not flash. The keynote stage never reads a theme token — it is
 * always the show's fixed dark cinematic palette (see the `THE_MODEL_SURFACE`
 * note in pages/the-model-page.tsx) — so for the standalone harness this only
 * has to guarantee the dark class is on before the stage mounts.
 */
export function initTheme() {
  document.documentElement.classList.add("dark")
  document.documentElement.style.colorScheme = "dark"
}
