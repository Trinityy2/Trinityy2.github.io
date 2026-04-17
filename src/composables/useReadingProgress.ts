import { ref, onMounted, onUnmounted } from 'vue'

export function useReadingProgress() {
  const progress = ref(0)

  function update() {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
  }

  onMounted(() => window.addEventListener('scroll', update, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', update))

  return { progress }
}
