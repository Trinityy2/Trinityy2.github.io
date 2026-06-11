<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950/80"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
      <!-- Logo / Name -->
      <RouterLink
        to="/"
        class="min-w-0 truncate text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
      >
        {{ name }}
      </RouterLink>

      <!-- Desktop timeline navigation -->
      <nav class="hidden items-center lg:flex" aria-label="Section navigation">
        <!-- Prev arrow -->
        <button
          class="btn-ghost rounded-lg p-1.5"
          :disabled="sections.isFirst"
          :class="{ 'pointer-events-none opacity-30': sections.isFirst }"
          aria-label="Previous section"
          @click="navigateTo(sections.currentIndex - 1)"
        >
          <ChevronLeftIcon class="h-4 w-4" />
        </button>

        <!-- Timeline -->
        <div class="relative flex h-16 items-center">
          <!-- Connecting line + progress fill (inset by half a node width so it spans dot centers).
               The fill animates scaleX (compositor-only) rather than width — width repaints
               under the header's backdrop-filter leave ghost traces in Chromium. -->
          <div class="absolute inset-x-9 top-1/2 h-0.5 -translate-y-1/2">
            <div class="absolute inset-0 my-auto h-px bg-slate-200 dark:bg-slate-800"></div>
            <div
              ref="progressEl"
              class="absolute inset-0 origin-left rounded-full bg-primary-500"
              style="transform: scaleX(0)"
            ></div>
          </div>

          <button
            v-for="(section, i) in SECTIONS"
            :key="section.id"
            class="group relative z-10 flex h-full w-[4.5rem] flex-col items-center justify-center"
            :aria-current="i === sections.currentIndex ? 'true' : undefined"
            :aria-label="`Go to ${section.label}`"
            @click="navigateTo(i)"
          >
            <span
              :ref="(el) => setDotRef(el, i)"
              class="h-2.5 w-2.5 rounded-full transition-colors duration-300"
              :class="
                i === sections.currentIndex
                  ? 'bg-primary-500 ring-4 ring-primary-500/20'
                  : i < sections.currentIndex
                    ? 'bg-primary-400/70 group-hover:bg-primary-500'
                    : 'bg-slate-300 group-hover:bg-slate-400 dark:bg-slate-700 dark:group-hover:bg-slate-500'
              "
            ></span>
            <span
              class="absolute bottom-1.5 text-[10px] font-medium tracking-wide transition-colors duration-300"
              :class="
                i === sections.currentIndex
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
              "
            >
              {{ section.label }}
            </span>
          </button>
        </div>

        <!-- Next arrow -->
        <button
          class="btn-ghost rounded-lg p-1.5"
          :disabled="sections.isLast"
          :class="{ 'pointer-events-none opacity-30': sections.isLast }"
          aria-label="Next section"
          @click="navigateTo(sections.currentIndex + 1)"
        >
          <ChevronRightIcon class="h-4 w-4" />
        </button>
      </nav>

      <!-- Compact pager (small screens, home only) -->
      <nav
        v-if="isHome"
        class="flex items-center gap-1 lg:hidden"
        aria-label="Section navigation"
      >
        <button
          class="btn-ghost rounded-lg p-1.5"
          :disabled="sections.isFirst"
          :class="{ 'pointer-events-none opacity-30': sections.isFirst }"
          aria-label="Previous section"
          @click="navigateTo(sections.currentIndex - 1)"
        >
          <ChevronLeftIcon class="h-4 w-4" />
        </button>
        <span class="whitespace-nowrap text-center text-xs font-medium text-slate-600 dark:text-slate-300">
          {{ sections.current.label }}
          <span class="hidden text-slate-400 dark:text-slate-500 sm:inline">
            · {{ sections.currentIndex + 1 }}/{{ SECTIONS.length }}
          </span>
        </span>
        <button
          class="btn-ghost rounded-lg p-1.5"
          :disabled="sections.isLast"
          :class="{ 'pointer-events-none opacity-30': sections.isLast }"
          aria-label="Next section"
          @click="navigateTo(sections.currentIndex + 1)"
        >
          <ChevronRightIcon class="h-4 w-4" />
        </button>
      </nav>

      <!-- Right controls -->
      <div class="flex shrink-0 items-center gap-2">
        <RouterLink
          to="/blog"
          class="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:block"
        >
          Blog
        </RouterLink>

        <!-- Theme toggle -->
        <button
          @click="themeStore.toggleTheme()"
          class="btn-ghost rounded-lg p-2"
          :aria-label="themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <SunIcon v-if="themeStore.theme === 'dark'" class="h-5 w-5" />
          <MoonIcon v-else class="h-5 w-5" />
        </button>

        <!-- Mobile hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="btn-ghost rounded-lg p-2 lg:hidden"
          aria-label="Toggle menu"
          :aria-expanded="mobileOpen"
        >
          <XMarkIcon v-if="mobileOpen" class="h-5 w-5" />
          <Bars3Icon v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="border-t border-slate-200 bg-white px-4 pb-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden"
      >
        <nav class="flex flex-col gap-1 pt-2" aria-label="Mobile navigation">
          <button
            v-for="(section, i) in SECTIONS"
            :key="section.id"
            @click="navigateTo(i)"
            class="rounded-md px-3 py-2 text-left text-sm font-medium"
            :class="
              i === sections.currentIndex && isHome
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            "
          >
            {{ section.label }}
          </button>
          <RouterLink
            to="/blog"
            @click="mobileOpen = false"
            class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Blog
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, h, type ComponentPublicInstance, type FunctionalComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { animate, utils } from 'animejs'
import { useThemeStore } from '@/stores/theme'
import { SECTIONS, useSectionsStore } from '@/stores/sections'

// Inline minimal icon components to avoid a heavy icon library dependency.
// Render functions (not `template:` strings) — the runtime-only Vue build
// can't compile templates at runtime.
function svgIcon(d: string, strokeWidth = 1.5): FunctionalComponent {
  return () =>
    h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': strokeWidth,
        stroke: 'currentColor',
      },
      [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d })]
    )
}

const SunIcon = svgIcon(
  'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
)
const MoonIcon = svgIcon(
  'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z'
)
const Bars3Icon = svgIcon('M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5')
const XMarkIcon = svgIcon('M6 18 18 6M6 6l12 12')
const ChevronLeftIcon = svgIcon('M15.75 19.5 8.25 12l7.5-7.5', 2)
const ChevronRightIcon = svgIcon('m8.25 4.5 7.5 7.5-7.5 7.5', 2)

const name = 'Tomohito Suzuki'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const sections = useSectionsStore()
const mobileOpen = ref(false)

const isHome = computed(() => route.name === 'Home')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function navigateTo(index: number) {
  if (index < 0 || index >= SECTIONS.length) return
  mobileOpen.value = false
  sections.goTo(index)
  if (!isHome.value) {
    router.push({ path: '/', hash: index === 0 ? '' : `#${SECTIONS[index].id}` })
  }
}

// --- Timeline progress + dot animations (anime.js) ---

const progressEl = ref<HTMLElement | null>(null)
const dotEls: (HTMLElement | null)[] = []

function setDotRef(el: Element | ComponentPublicInstance | null, i: number) {
  dotEls[i] = el as HTMLElement | null
}

function progressScale(index: number): number {
  return index / (SECTIONS.length - 1)
}

watch(
  () => sections.currentIndex,
  (index) => {
    if (progressEl.value) {
      // Drop any in-flight tween before retargeting so interrupted
      // back-and-forth navigation can't leave the fill mid-value.
      utils.remove(progressEl.value)
      animate(progressEl.value, {
        scaleX: progressScale(index),
        duration: prefersReducedMotion ? 0 : 700,
        ease: 'inOutExpo',
      })
    }
    const dot = dotEls[index]
    if (dot && !prefersReducedMotion) {
      animate(dot, {
        scale: [0.4, 1.35, 1],
        duration: 600,
        ease: 'outBack(2)',
      })
    }
  }
)

onMounted(() => {
  if (progressEl.value) {
    utils.set(progressEl.value, { scaleX: progressScale(sections.currentIndex) })
  }
})
</script>
