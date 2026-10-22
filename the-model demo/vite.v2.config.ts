import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  base: process.env.VITE_BASE_URL ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build: {
    outDir: "dist-the-model-v2",
    rollupOptions: { input: {
      v2: path.resolve(__dirname, "the-model-v2.html"),
      compare: path.resolve(__dirname, "compare.html"),
      reference: path.resolve(__dirname, "the-model.html"),
    } },
  },
  server: { port: 8091, strictPort: true },
  preview: { port: 8091, strictPort: true },
})
