import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { chaptersIndexPlugin } from "./scripts/chapter-index.mjs"

// Separate build entry for the-model presentation, deployed independently
// of uni-demo. Deliberately does NOT include the tanstackRouter plugin —
// the-model.html's entry (src/the-model-main.tsx) never imports the router
// or routeTree.gen.ts, so uni-demo's ~50 other routes and its data layer
// (vcf-scope dataset etc.) never enter this build's module graph at all.
// See vite.config.ts for the full uni-demo app build.
export default defineConfig({
  base: process.env.VITE_BASE_URL ?? "/",
  plugins: [react(), tailwindcss(), chaptersIndexPlugin(__dirname)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-the-model",
    rollupOptions: {
      input: path.resolve(__dirname, "the-model.html"),
    },
  },
  server: {
    port: 8090,
    strictPort: true,
  },
  preview: {
    port: 8090,
    strictPort: true,
  },
})
