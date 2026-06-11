import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface SectionDef {
  id: string
  label: string
}

/** Ordered list of full-viewport sections on the home page. */
export const SECTIONS: SectionDef[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
]

export const useSectionsStore = defineStore('sections', () => {
  const currentIndex = ref(0)

  const current = computed(() => SECTIONS[currentIndex.value])
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === SECTIONS.length - 1)

  function goTo(index: number) {
    if (index >= 0 && index < SECTIONS.length) {
      currentIndex.value = index
    }
  }

  function goToId(id: string) {
    const index = SECTIONS.findIndex((s) => s.id === id)
    if (index !== -1) goTo(index)
  }

  function next() {
    goTo(currentIndex.value + 1)
  }

  function prev() {
    goTo(currentIndex.value - 1)
  }

  return { currentIndex, current, isFirst, isLast, goTo, goToId, next, prev }
})
