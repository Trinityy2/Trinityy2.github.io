import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // VITE_BASE_PATH is set to /personal-website/ in .env.production for GitHub Pages.
  // When a custom domain is added, set VITE_BASE_PATH=/ in the deploy environment.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
