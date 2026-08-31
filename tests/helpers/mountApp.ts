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
 * Let a navigation settle. Routing is asynchronous, so a keypress or a click
 * that triggers one needs the router's own promise to resolve before the
 * rendered result can be asserted on.
 */
export async function flushRouter(wrapper: VueWrapper): Promise<void> {
  await wrapper.vm.$router.isReady()
  await flushPromises()
  await wrapper.vm.$nextTick()
}
