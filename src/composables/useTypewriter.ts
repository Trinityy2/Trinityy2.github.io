import { onUnmounted, ref, type Ref } from 'vue'

import { prefersReducedMotion } from './usePrefersReducedMotion'

/** Matches the design prototype's typing speed. */
const CHARACTER_INTERVAL_MS = 26

/**
 * Reveal `text` one character at a time, starting when the caller mounts.
 *
 * Restarting is remounting: the returned ref begins empty every time the
 * composable is called, so a component behind a `v-if` retypes whenever it
 * comes back. Under a reduced-motion preference the text is complete from the
 * first frame — the visitor asked not to wait on an animation.
 */
export function useTypewriter(text: string): Ref<string> {
  if (prefersReducedMotion()) {
    return ref(text)
  }

  const typed = ref('')
  let revealed = 0

  const timer = setInterval(() => {
    revealed += 1
    typed.value = text.slice(0, revealed)

    if (revealed >= text.length) {
      clearInterval(timer)
    }
  }, CHARACTER_INTERVAL_MS)

  onUnmounted(() => clearInterval(timer))

  return typed
}
