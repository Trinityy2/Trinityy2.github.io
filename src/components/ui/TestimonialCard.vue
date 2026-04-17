<template>
  <div class="card p-6">
    <svg class="mb-4 h-8 w-8 text-primary-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
    </svg>
    <blockquote class="text-slate-600 dark:text-slate-300">
      "{{ testimonial.quote }}"
    </blockquote>
    <div class="mt-4 flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
        {{ initials }}
      </div>
      <div>
        <p class="font-semibold text-slate-900 dark:text-white">{{ testimonial.name }}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ testimonial.title }} · {{ testimonial.company }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Testimonial {
  quote: string
  name: string
  title: string
  company: string
}

const props = defineProps<{ testimonial: Testimonial }>()

const initials = computed(() =>
  props.testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
)
</script>
