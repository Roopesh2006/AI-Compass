import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '7860'),
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '7860'),
  },
});
