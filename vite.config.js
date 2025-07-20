import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill Node.js built-in modules.
      protocolImports: true,
      // Include specific polyfills
      include: ["buffer", "stream", "crypto"],
    }),
  ],
  define: {
    global: "globalThis",
    // "process.env": {},
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: "ignore-non-english-wordlists",
          resolveId(source) {
            if (/.*\/wordlists\/(?!english).*\.json$/.test(source)) {
              return source;
            }
            return null;
          },
          load(id) {
            if (/.*\/wordlists\/(?!english).*\.json$/.test(id)) {
              return "export default {}";
            }
            return null;
          },
        },
      ],
    },
  },
});
