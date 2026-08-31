import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'

import App from '@/App.vue'
import { createAppRouter } from '@/router'

/**
 * The project's single test seam: the mounted application.
 *
 * Tests drive the app the way a person would — navigate, press keys, click
 * controls — and assert on rendered output and route state. Nothing below this
 * boundary is tested directly. See #72's Testing Decisions.
 */
export async function mountApp(initialPath = '/'): Promise<VueWrapper> {
  const router = createAppRouter(createMemoryHistory())

  await router.push(initialPath)
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router] },
    attachTo: document.body,
  })

  await wrapper.vm.$nextTick()

  return wrapper
}

/**
 * Let a navigation settle.
 *
 * Navigation is held behind the zone transition until the overlay reports
 * itself opaque, so a keypress or click does not change the route on its own.
 * This drives the same `transitionend` the browser would fire, which resolves
 * the gate immediately instead of waiting out its timeout fallback. The
 * fallback path — a backgrounded tab, where the event never arrives — is
 * covered separately with fake timers.
 */
export async function flushRouter(wrapper: VueWrapper): Promise<void> {
  // Let the guard start and attach its listener.
  await flushPromises()
  await wrapper.vm.$nextTick()

  wrapper.find('[data-covering]').element.dispatchEvent(new Event('transitionend'))

  await flushPromises()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$router.isReady()
  await flushPromises()
  await wrapper.vm.$nextTick()
}
