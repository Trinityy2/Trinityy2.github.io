import { nextTick, onUnmounted, ref, type Ref } from 'vue'
import { useRouter, type RouteLocationNormalized } from 'vue-router'

import { prefersReducedMotion } from './prefersReducedMotion'

/**
 * How long to wait for the overlay to report itself opaque before giving up
 * and proceeding anyway.
 *
 * This fallback is not optional. A backgrounded browser tab never fires
 * `transitionend`, and without it a navigation started in a hidden tab would
 * hang forever behind an overlay that never lifts.
 */
const OPAQUE_TIMEOUT_MS = 250

export interface ZoneTransition {
  /** Drives the overlay's opacity. True means "fading to, or at, black". */
  covering: Ref<boolean>
  /**
   * Bumped once per completed swap. Entrance animations key off it so they
   * restart from zero rather than resuming mid-flight.
   */
  epoch: Ref<number>
  /** Bind to the overlay element so its `transitionend` can be awaited. */
  overlay: Ref<HTMLElement | null>
}

/**
 * The room transition: fade to black, swap the zone while the screen is fully
 * dark, fade back in.
 *
 * The ordering is the whole point, and it is why this is a **router guard**
 * rather than a watcher on the route. Reacting to a route change would mean
 * the route had already changed before black was down, and one slow frame
 * would expose the incoming zone. Navigation is held instead:
 *
 *     navigation requested
 *       ├─ initial page load? ──▶ allow immediately
 *       └─ otherwise:
 *            set covering = true         (overlay fades 0 → 1)
 *            await overlay transitionend (timeout fallback)
 *            ── overlay now fully opaque ──
 *            resolve navigation          (new zone mounts, unseen)
 *            bump epoch                  (entrance animations reset)
 *            next tick: covering = false (overlay fades 1 → 0)
 */
export function useZoneTransition(): ZoneTransition {
  const router = useRouter()

  const covering = ref(false)
  const epoch = ref(0)
  const overlay = ref<HTMLElement | null>(null)

  /** Resolve once the overlay can be trusted to be hiding everything. */
  function whenOpaque(): Promise<void> {
    // The visitor asked for no motion, so there is no fade to wait on.
    if (prefersReducedMotion()) return Promise.resolve()

    return new Promise((resolve) => {
      const element = overlay.value
      let settled = false

      const settle = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        element?.removeEventListener('transitionend', settle)
        resolve()
      }

      const timer = setTimeout(settle, OPAQUE_TIMEOUT_MS)
      element?.addEventListener('transitionend', settle)
    })
  }

  /**
   * Which navigations are travel, and so worth a room transition.
   *
   * Not the first paint: there is nothing to cover and nothing to fade from.
   * Not a change of parameter within the same route either — moving between
   * two posts inside the reader is turning a page, not walking to another
   * room, and blacking the screen out for it would be absurd.
   */
  function isTravel(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
    return from.matched.length > 0 && to.name !== from.name
  }

  /**
   * How many held navigations are outstanding.
   *
   * Needed because a second navigation supersedes the first, and vue-router
   * reports the first as *cancelled*. Lifting the overlay on that failure
   * would uncover the screen while the newer navigation is still held behind
   * its own gate — the swap would then happen in plain sight, which is the
   * one thing this whole mechanism exists to prevent.
   */
  let inFlight = 0

  const removeBeforeEach = router.beforeEach(async (to, from) => {
    if (!isTravel(to, from)) return true

    inFlight += 1
    covering.value = true
    await whenOpaque()

    return true
  })

  const removeAfterEach = router.afterEach((to, from, failure) => {
    if (isTravel(to, from)) {
      inFlight = Math.max(0, inFlight - 1)
    }

    if (failure) {
      // Only safe to uncover once nothing newer is still waiting behind it.
      if (inFlight === 0) covering.value = false
      return
    }

    epoch.value += 1
    void nextTick(() => {
      if (inFlight === 0) covering.value = false
    })
  })

  onUnmounted(() => {
    removeBeforeEach()
    removeAfterEach()
  })

  return { covering, epoch, overlay }
}
