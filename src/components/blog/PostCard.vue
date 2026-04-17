<template>
  <RouterLink :to="`/blog/${post.slug}`" class="group block h-full">
    <article
      class="card flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <!-- Cover image / gradient header -->
      <div class="h-44 flex-shrink-0 overflow-hidden">
        <img
          v-if="post.frontmatter.cover_image"
          :src="post.frontmatter.cover_image"
          :alt="post.frontmatter.title"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700"
        >
          <span class="text-5xl opacity-25">✍️</span>
        </div>
      </div>

      <!-- Body -->
      <div class="flex flex-1 flex-col p-5">
        <!-- Tags -->
        <div class="mb-3 flex flex-wrap gap-1.5">
          <TagChip v-for="tag in post.frontmatter.tags" :key="tag" :tag="tag" />
        </div>

        <!-- Title -->
        <h3
          class="mb-2 line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
        >
          {{ post.frontmatter.title }}
        </h3>

        <!-- Description -->
        <p class="mb-4 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
          {{ post.frontmatter.description }}
        </p>

        <!-- Meta footer -->
        <div
          class="mt-auto flex items-center justify-between text-xs text-slate-400 dark:text-slate-500"
        >
          <time :datetime="post.frontmatter.date">{{ formatDate(post.frontmatter.date) }}</time>
          <span>{{ post.readingTime }} min read</span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Post } from '@/composables/usePosts'
import TagChip from './TagChip.vue'

defineProps<{ post: Post }>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>
