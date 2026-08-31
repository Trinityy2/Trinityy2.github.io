import { createRouter, type Router, type RouterHistory } from 'vue-router'

import type { SiteContent } from '@/content'
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
 *
 * The content is a parameter for a narrower reason: the router needs to know
 * which post slugs exist in order to turn away the ones that do not, and it
 * has to know before the *first* navigation resolves. A check inside the
 * reader would be too late — the empty stage would already have painted.
 */
export function createAppRouter(history: RouterHistory, content: SiteContent): Router {
  const router = createRouter({
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

  router.beforeEach((to) => {
    if (to.name !== 'post') return true
    if (content.posts.some((post) => post.slug === to.params.slug)) return true

    /*
     * A stale link, or a draft someone remembers. Drafts take this path too:
     * they never leave `parsePosts`, so asking for one by URL is
     * indistinguishable from asking for a post that never existed.
     */
    return { path: '/blog', replace: true }
  })

  return router
}
