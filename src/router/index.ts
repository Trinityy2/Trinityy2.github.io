import { createRouter, type Router, type RouterHistory } from 'vue-router'

import type { Zone } from '@/types/zone'
import AboutView from '@/views/AboutView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** The zone this route belongs to. Drives the shell's `data-zone`. */
    zone: Zone
  }
}

/**
 * The history is a parameter so tests can supply an in-memory one. Production
 * passes a web history; the app seam test passes `createMemoryHistory()`.
 */
export function createAppRouter(history: RouterHistory): Router {
  return createRouter({
    history,
    routes: [
      {
        path: '/',
        name: 'about',
        component: AboutView,
        meta: { zone: 'about' },
      },
    ],
  })
}
