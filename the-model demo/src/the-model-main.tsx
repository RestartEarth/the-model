import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"

import "./index.css"
import { ThemeSync } from "@/components/theme-controls/theme-sync"
import { initTheme } from "@/components/theme-controls/init-theme"
import { TheModelPage } from "@/pages/the-model-page"

// Standalone entry point (the-model.html) for the presentation, kept
// deliberately independent of main.tsx/routeTree.gen.ts — no TanStack
// Router, no uni-demo routes, so nothing here can pull in uni-demo's data
// layer (db/datasets, dataset-store, vcf-scope-store) transitively.
// Mirrors __root.tsx's ThemeProvider/ThemeSync and _canvas.tsx's fixed
// inset-0 wrapper so the standalone build renders identically to the
// `/the-model` route inside uni-demo.
initTheme()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="theme"
      disableTransitionOnChange
    >
      <ThemeSync />
      <div className="fixed inset-0 overflow-hidden bg-background">
        <TheModelPage />
      </div>
    </ThemeProvider>
  </StrictMode>
)
