import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath, URL } from "node:url";

/** Offline single-file build for a house laptop. Relative base. Inter is already vendored. */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: {
    "import.meta.env.VITE_PACK": JSON.stringify("1"),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "./",
  build: {
    outDir: "dist-pack",
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
