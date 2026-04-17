<template>
  <div class="card group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
    <!-- Gradient header -->
    <div class="h-2 w-full" :class="project.color ?? 'bg-gradient-to-r from-primary-400 to-primary-600'"></div>

    <div class="flex flex-1 flex-col gap-4 p-6">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-semibold text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
          {{ project.title }}
        </h3>
        <div class="flex shrink-0 gap-2">
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
            aria-label="View on GitHub"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" clip-rule="evenodd"/></svg>
          </a>
          <a
            v-if="project.demoUrl"
            :href="project.demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
            aria-label="View live demo"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
          </a>
        </div>
      </div>

      <p class="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ project.description }}</p>

      <div class="flex flex-wrap gap-1.5">
        <span v-for="tag in project.tags" :key="tag" class="tag-primary">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Project {
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  demoUrl?: string
  color?: string
}

defineProps<{ project: Project }>()
</script>
