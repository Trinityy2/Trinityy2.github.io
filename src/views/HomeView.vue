<template>
  <AppLayout>
    <template #nav>
      <NavBar />
    </template>

    <!-- Full-viewport stage: sections never scroll into each other — navigation happens
         via the NavBar timeline. Each slide is its own scroll container so a section
         taller than the viewport can scroll internally; overscroll-contain plus the
         overflow-hidden stage stops scrolling from ever chaining past the section. -->
    <div
      ref="stageEl"
      class="h-screen overflow-hidden overscroll-none"
      @click.capture="onStageClick"
      @scroll.passive="onStageScroll"
    >
      <div ref="trackEl" class="will-change-transform">
        <div
          v-for="(section, i) in SECTIONS"
          :key="section.id"
          :ref="(el) => setSlideRef(el, i)"
          class="flex h-screen flex-col overflow-y-auto overscroll-contain"
          :inert="i !== sections.currentIndex"
          :aria-hidden="i !== sections.currentIndex"
        >
          <component :is="sectionComponents[section.id]" class="flex-1" />
          <AppFooter v-if="i === SECTIONS.length - 1" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, type Component, type ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'
import { animate, utils } from 'animejs'
import { SECTIONS, useSectionsStore } from '@/stores/sections'
import AppLayout from '@/components/layout/AppLayout.vue'
import NavBar from '@/components/layout/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

const sectionComponents: Record<string, Component> = {
  hero: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
}

const route = useRoute()
const sections = useSectionsStore()
const stageEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const slideEls: (HTMLElement | null)[] = []

function setSlideRef(el: Element | ComponentPublicInstance | null, i: number) {
  slideEls[i] = el as HTMLElement | null
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Pin to the measured position of the section's slide rather than assuming
// index * viewport height, so the track always lands exactly on the section.
function offsetFor(index: number): number {
  const slide = slideEls[index]
  return -(slide ? slide.offsetTop : index * window.innerHeight)
}

watch(
  () => sections.currentIndex,
  (index) => {
    // Incoming slide always presents from its top (it is off-screen at this point)
    slideEls[index]?.scrollTo({ top: 0 })
    if (trackEl.value) {
      // anime.js v4 default composition is 'replace', so retargeting mid-flight
      // (e.g. spamming the arrows) cancels the in-flight tween cleanly.
      animate(trackEl.value, {
        translateY: offsetFor(index),
        duration: prefersReducedMotion ? 0 : 850,
        ease: 'inOutExpo',
      })
    }
    // Keep the hash shareable without triggering router scroll behaviour
    const url = index === 0 ? window.location.pathname : `#${SECTIONS[index].id}`
    history.replaceState(history.state, '', url)
  }
)

// Any in-page link to a section (e.g. the hero's "View My Work" → #projects)
// goes through the store so the timeline and track stay in sync, instead of
// the browser natively scrolling the overflow-hidden stage.
function onStageClick(e: MouseEvent) {
  const anchor = (e.target as HTMLElement | null)?.closest?.('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return
  const index = SECTIONS.findIndex((s) => s.id === url.hash.slice(1))
  if (index === -1) return
  e.preventDefault()
  sections.goTo(index)
}

// The stage must never scroll — section positioning is the track transform's
// job. Browsers still force-scroll overflow-hidden containers for things like
// focus() and find-in-page, so undo it immediately.
function onStageScroll() {
  if (stageEl.value) {
    stageEl.value.scrollTop = 0
    stageEl.value.scrollLeft = 0
  }
}

// Slide offsets are pixel measurements, so re-pin when the viewport resizes.
function onResize() {
  if (trackEl.value) {
    utils.set(trackEl.value, { translateY: offsetFor(sections.currentIndex) })
  }
}

// Vertical keys scroll within the active slide (never across sections);
// left/right arrows remain section navigation.
function scrollActiveSlide(e: KeyboardEvent, to: number | 'top' | 'bottom') {
  e.preventDefault()
  const slide = slideEls[sections.currentIndex]
  if (!slide || slide.scrollHeight <= slide.clientHeight) return
  const behavior = prefersReducedMotion ? ('auto' as const) : ('smooth' as const)
  if (to === 'top') slide.scrollTo({ top: 0, behavior })
  else if (to === 'bottom') slide.scrollTo({ top: slide.scrollHeight, behavior })
  else slide.scrollBy({ top: to, behavior })
}

function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return

  const page = window.innerHeight * 0.8
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      sections.next()
      break
    case 'ArrowLeft':
      e.preventDefault()
      sections.prev()
      break
    case 'ArrowDown':
      scrollActiveSlide(e, 100)
      break
    case 'ArrowUp':
      scrollActiveSlide(e, -100)
      break
    case 'PageDown':
      scrollActiveSlide(e, page)
      break
    case 'PageUp':
      scrollActiveSlide(e, -page)
      break
    case ' ':
      scrollActiveSlide(e, e.shiftKey ? -page : page)
      break
    case 'Home':
      scrollActiveSlide(e, 'top')
      break
    case 'End':
      scrollActiveSlide(e, 'bottom')
      break
  }
}

// Router-driven hash changes while on the home page (e.g. links from other
// components) also keep the timeline in sync.
watch(
  () => route.hash,
  (hash) => {
    if (hash) sections.goToId(hash.slice(1))
  }
)

onMounted(() => {
  // Deep link: /#about etc. lands directly on that section, no animation
  const hash = route.hash.replace('#', '')
  if (hash) sections.goToId(hash)
  if (trackEl.value) {
    utils.set(trackEl.value, { translateY: offsetFor(sections.currentIndex) })
  }
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
})
</script>
