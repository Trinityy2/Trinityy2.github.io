import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env, .env.production etc. so VITE_BASE_PATH is available here.
  // .env.production sets VITE_BASE_PATH=/personal-website/ for GitHub Pages.
  // When a custom domain is added, set VITE_BASE_PATH=/ in that file (or env).
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_PATH ?? '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
    },
  }
})
