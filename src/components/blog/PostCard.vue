<script setup lang="ts">
  import type { Post } from '@/posts/parsePosts'

  defineProps<{ post: Post }>()
</script>

<template>
  <RouterLink class="post-card" :to="`/blog/${post.slug}`">
    <span class="post-card__title">{{ post.title }}</span>
    <span class="post-card__meta">{{ post.date }} · {{ post.readingMinutes }} min</span>
  </RouterLink>
</template>

<style scoped>
  .post-card {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 20px;
    padding: 15px 0;
    border-bottom: var(--border-width) solid var(--zone-line);
    text-decoration: none;
    transition: padding-left 160ms linear;
  }

  .post-card:hover {
    padding-left: 10px;
  }

  .post-card__title {
    font-size: 15px;
    color: var(--zone-accent-2);
  }

  .post-card__meta {
    flex: 0 0 auto;
    font-size: 11px;
    color: var(--zone-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .post-card {
      transition: none;
    }
  }
</style>
