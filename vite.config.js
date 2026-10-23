import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  publicDir: "static",
  resolve: {
    // The ESM build assigns to a mapbox-gl namespace import, which throws in browsers.
    alias: { "react-mapbox-gl": "react-mapbox-gl/lib/index.js" },
  },
})
