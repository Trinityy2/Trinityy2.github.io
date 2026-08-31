import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { zoneRoutes } from '@/data/zones'

const STEP_FOR_KEY: Record<string, number | undefined> = {
  ArrowLeft: -1,
  ArrowRight: 1,
}

/** Travel the route with the arrow keys. */
export function useArrowTravel(): void {
  const route = useRoute()
  const router = useRouter()

  function onKeydown(event: KeyboardEvent) {
    const step = STEP_FOR_KEY[event.key]
    if (step === undefined) return

    const from = zoneRoutes.findIndex((r) => r.zone === route.meta.zone)
    const to = from + step

    /*
     * Dead stops at both ends — left at the first zone and right at the last
     * do nothing at all. Wraparound was rejected deliberately: it produces a
     * history entry that teleports the visitor across the site, which reads
     * as a bug and undermines the reason real routes were chosen.
     */
    if (to < 0 || to >= zoneRoutes.length) return

    router.push(zoneRoutes[to].path)
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
