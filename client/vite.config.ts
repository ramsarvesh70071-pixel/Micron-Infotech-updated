import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    port: 5173,
    // Same-origin API and uploaded images in development => no CORS needed.
    proxy: {
      "/api": { target: process.env.VITE_PROXY_TARGET || "http://localhost:5000", changeOrigin: true },
      "/uploads": { target: process.env.VITE_PROXY_TARGET || "http://localhost:5000", changeOrigin: true }
    }
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: { manualChunks: { react: ["react", "react-dom", "react-router-dom"], motion: ["framer-motion"] } }
    }
  }
});
