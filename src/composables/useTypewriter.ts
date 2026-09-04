import { onUnmounted, ref, watch, type Ref } from 'vue'

import { prefersReducedMotion } from './prefersReducedMotion'

/** Matches the design prototype's typing speed. */
const CHARACTER_INTERVAL_MS = 26

/**
 * Reveal `text` one character at a time whenever `active` is true.
 *
 * Restarting is explicit rather than a side effect of remounting. The About
 * tabs are all mounted at once so the panel keeps a constant height, which
 * means the Bio tab is no longer destroyed when you leave it — it has to be
 * told when it is being looked at.
 *
 * Under a reduced-motion preference the text is complete from the first
 * frame: the visitor asked not to wait on an animation.
 */
export function useTypewriter(text: string, active?: Ref<boolean>): Ref<string> {
  const typed = ref('')
  let timer: ReturnType<typeof setInterval> | undefined

  function stop() {
    clearInterval(timer)
    timer = undefined
  }

  function start() {
    stop()

    if (prefersReducedMotion()) {
      typed.value = text
      return
    }

    typed.value = ''
    let revealed = 0

    timer = setInterval(() => {
      revealed += 1
      typed.value = text.slice(0, revealed)

      if (revealed >= text.length) stop()
    }, CHARACTER_INTERVAL_MS)
  }

  if (active) {
    watch(active, (isActive) => (isActive ? start() : stop()), { immediate: true })
  } else {
    start()
  }

  onUnmounted(stop)

  return typed
}
