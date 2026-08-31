import { copyFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * GitHub Pages has no single-page-app rewrite: a direct request for /work has
 * no file behind it and would 404. Pages does serve 404.html for anything
 * unmatched, so shipping the app itself under that name makes a deep link
 * load the app, which then routes on the real path.
 */
function pagesDeepLinkFallback(): Plugin {
  return {
    name: 'pages-deep-link-fallback',
    apply: 'build',
    async closeBundle() {
      await copyFile('dist/index.html', 'dist/404.html')
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    // The site is a GitHub *user* site served at the domain root. If it ever
    // moves to a project-site subpath, this is the single place to change it.
    base: env.VITE_BASE_PATH || '/',
    plugins: [vue(), pagesDeepLinkFallback()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['tests/**/*.test.ts'],
      setupFiles: ['tests/setup.ts'],
    },
  }
})
