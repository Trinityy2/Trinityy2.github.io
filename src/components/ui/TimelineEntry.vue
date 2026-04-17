<template>
  <div class="relative pl-8 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
    <!-- Dot -->
    <div class="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-primary-500 bg-white dark:bg-slate-950"></div>

    <div class="card p-6">
      <div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ entry.title }}</h3>
          <p class="font-medium text-primary-600 dark:text-primary-400">{{ entry.company }}</p>
        </div>
        <span class="shrink-0 text-sm text-slate-500 dark:text-slate-400">{{ entry.dates }}</span>
      </div>
      <ul class="mt-4 space-y-2">
        <li
          v-for="bullet in entry.bullets"
          :key="bullet"
          class="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        >
          <span class="mt-1 shrink-0 text-primary-500">▸</span>
          {{ bullet }}
        </li>
      </ul>
      <div v-if="entry.tags" class="mt-4 flex flex-wrap gap-2">
        <span v-for="tag in entry.tags" :key="tag" class="tag-slate">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ExperienceEntry {
  title: string
  company: string
  dates: string
  bullets: string[]
  tags?: string[]
}

defineProps<{ entry: ExperienceEntry }>()
</script>
