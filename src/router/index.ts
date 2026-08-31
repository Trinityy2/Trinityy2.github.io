import { createRouter, type Router, type RouterHistory } from 'vue-router'

import { zoneRoutes } from '@/data/zones'
import type { Zone } from '@/types/zone'
import AboutView from '@/views/AboutView.vue'
import BlogView from '@/views/BlogView.vue'
import PostView from '@/views/PostView.vue'
import WorkView from '@/views/WorkView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** The zone this route belongs to. Drives the shell's `data-zone`. */
    zone: Zone
  }
}

const VIEW_FOR_ZONE = {
  about: AboutView,
  work: WorkView,
  blog: BlogView,
}

/**
 * The history is a parameter so tests can supply an in-memory one. Production
 * passes a web history; the app seam test passes `createMemoryHistory()`.
 */
export function createAppRouter(history: RouterHistory): Router {
  return createRouter({
    history,
    routes: [
      ...zoneRoutes.map((route) => ({
        path: route.path,
        name: route.zone,
        component: VIEW_FOR_ZONE[route.zone],
        meta: { zone: route.zone },
      })),
      /*
       * The reader shares the Blog zone's theme and maps to the Blog node in
       * the header, so it carries the same zone rather than a fourth one.
       */
      {
        path: '/blog/:slug',
        name: 'post',
        component: PostView,
        meta: { zone: 'blog' },
      },
      /*
       * Anything unmatched goes to the root. The design contains no 404
       * screen and inventing one is scope; a visitor following a stale link
       * lands somewhere useful instead of at a dead end.
       */
      { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
  })
}
