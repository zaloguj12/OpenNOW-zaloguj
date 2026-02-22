import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "dist-electron/main",
    },
    resolve: {
      alias: {
        "@shared": resolve("src/shared"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "dist-electron/preload",
    },
    resolve: {
      alias: {
        "@shared": resolve("src/shared"),
      },
    },
  },
  renderer: {
    build: {
      outDir: "dist",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@shared": resolve("src/shared"),
        // Alias node:crypto to a browser shim so cloudmatch.ts can be
        // imported in the WebView (Capacitor) renderer.
        // The shim exposes only randomUUID() which is what cloudmatch.ts uses.
        "node:crypto": resolve(__dirname, "src/renderer/src/platform/cryptoShim.ts"),
        // Allow the renderer to import shared main-process GFN logic.
        "@main": resolve(__dirname, "src/main"),
      },
    },
  },
});
