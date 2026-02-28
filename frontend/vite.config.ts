/// <reference types="vite/client" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy para o backend Node.js (GraphQL)
    // Usa variável de ambiente VITE_API_URL ou localhost como fallback
    proxy: {
      '/graphql': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
      '/health': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
