import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const GITHUB_PAGES_BASE = '/TASK6_React_TypeScript_TanStack-Router-Query-_WebSocket/'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GH_PAGES === 'true' ? GITHUB_PAGES_BASE : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tanstack/react-router')) return 'router'
            if (id.includes('@tanstack/react-query')) return 'query'
            if (id.includes('react-dom') || id.includes('react/')) return 'react'
          }
        },
      },
    },
  },
})
