import { nextTick, onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import { prefersReducedMotion } from './usePrefersReducedMotion'

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

  const removeBeforeEach = router.beforeEach(async (to, from) => {
    // Nothing to cover on the first paint, and nothing to fade from.
    if (from.matched.length === 0) return true
    if (to.fullPath === from.fullPath) return true

    covering.value = true
    await whenOpaque()

    return true
  })

  const removeAfterEach = router.afterEach((_to, _from, failure) => {
    if (failure) {
      // An aborted navigation must not leave the screen black forever.
      covering.value = false
      return
    }

    epoch.value += 1
    void nextTick(() => {
      covering.value = false
    })
  })

  onUnmounted(() => {
    removeBeforeEach()
    removeAfterEach()
  })

  return { covering, epoch, overlay }
}
