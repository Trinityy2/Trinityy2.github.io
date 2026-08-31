<script setup lang="ts">
  import { marked } from 'marked'
  import { computed, watchEffect } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useSiteContent } from '@/content'

  const route = useRoute()
  const router = useRouter()
  const { posts } = useSiteContent()

  const slug = computed(() => String(route.params.slug))
  const index = computed(() => posts.findIndex((post) => post.slug === slug.value))
  const post = computed(() => posts[index.value])

  /**
   * A slug with no post behind it — a stale link, or a draft someone
   * remembers — goes back to the landing rather than rendering an empty
   * article. The design contains no 404 screen.
   */
  watchEffect(() => {
    if (index.value === -1) {
      void router.replace('/blog')
    }
  })

  /** Posts sort newest first, so the *next* one along is the older one. */
  const older = computed(() => posts[index.value + 1])
  const newer = computed(() => posts[index.value - 1])

  /** With one post there is nothing to move between, so the list is absent. */
  const showsEntries = computed(() => posts.length > 1)

  const html = computed(() => (post.value ? marked.parse(post.value.body, { async: false }) : ''))
</script>

<template>
  <section v-if="post" class="reader">
    <div class="reader__layout">
      <aside v-if="showsEntries" class="reader__entries">
        <RouterLink class="reader__back" to="/blog">← BACK TO THE THOUGHTS</RouterLink>

        <p class="reader__entries-count">ALL ENTRIES · {{ posts.length }}</p>

        <nav class="reader__entry-list" aria-label="All entries">
          <RouterLink
            v-for="entry in posts"
            :key="entry.slug"
            class="reader__entry"
            :class="{ 'reader__entry--current': entry.slug === post.slug }"
            :to="`/blog/${entry.slug}`"
            :aria-current="entry.slug === post.slug ? 'page' : undefined"
          >
            <span class="reader__entry-title">{{ entry.title }}</span>
            <span class="reader__entry-date">{{ entry.date }}</span>
          </RouterLink>
        </nav>
      </aside>

      <article class="reader__article">
        <RouterLink v-if="!showsEntries" class="reader__back" to="/blog">
          ← BACK TO THE THOUGHTS
        </RouterLink>

        <header class="reader__head">
          <p class="reader__meta">
            {{ post.date }} · {{ post.readingMinutes }} MIN · {{ post.category }}
          </p>
          <h1 class="reader__title">{{ post.title }}</h1>
        </header>

        <!-- eslint-disable-next-line vue/no-v-html -- the site's own posts -->
        <div class="reader__body" v-html="html"></div>

        <!-- Absent rather than dead: with nothing adjacent, nothing renders. -->
        <nav v-if="newer || older" class="reader__adjacent" aria-label="Adjacent posts">
          <RouterLink v-if="newer" class="reader__adjacent-link" :to="`/blog/${newer.slug}`">
            ← {{ newer.title }}
          </RouterLink>
          <span v-else></span>

          <RouterLink v-if="older" class="reader__adjacent-link" :to="`/blog/${older.slug}`">
            {{ older.title }} →
          </RouterLink>
        </nav>
      </article>
    </div>
  </section>
</template>

<style scoped>
  .reader {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    padding: var(--space-4) var(--space-3);
  }

  .reader__layout {
    width: 100%;
    max-width: 1040px;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: stretch;
  }

  .reader__entries {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .reader__back {
    border: var(--border-width) solid var(--zone-accent);
    color: var(--zone-accent);
    font-family: var(--font-display);
    font-size: 11px;
    padding: 11px 14px;
    text-align: center;
    text-decoration: none;
  }

  .reader__back:hover {
    background: var(--zone-accent);
    color: var(--zone-bg);
  }

  .reader__entries-count {
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 1px;
    color: var(--zone-muted);
    padding-top: 4px;
  }

  .reader__entry-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .reader__entry {
    padding: 11px 12px;
    border-left: var(--border-width) solid var(--zone-line);
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-decoration: none;
    transition:
      background 160ms linear,
      border-color 160ms linear;
  }

  .reader__entry--current {
    border-left-color: var(--zone-accent);
    background: var(--zone-panel);
  }

  .reader__entry-title {
    font-size: 12px;
    line-height: 1.5;
    color: var(--zone-muted);
  }

  .reader__entry--current .reader__entry-title {
    color: var(--zone-ink);
  }

  .reader__entry-date {
    font-size: 10px;
    color: var(--zone-muted);
  }

  .reader__article {
    flex: 1;
    min-width: 0;
    border: var(--border-width) solid var(--zone-ink);
    background: var(--zone-panel-deep);
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .reader__head {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .reader__meta {
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 1px;
    color: var(--zone-accent);
  }

  .reader__title {
    font-size: 20px;
    line-height: 1.4;
    color: var(--zone-ink);
  }

  .reader__body {
    font-size: 14px;
    line-height: 1.85;
    color: var(--zone-body);
    text-wrap: pretty;
  }

  .reader__body :deep(p) {
    margin: 0 0 var(--space-2);
  }

  .reader__body :deep(p:last-child) {
    margin-bottom: 0;
  }

  .reader__body :deep(h2),
  .reader__body :deep(h3) {
    color: var(--zone-ink);
    margin: var(--space-3) 0 var(--space-1);
  }

  .reader__body :deep(a) {
    color: var(--zone-accent-2);
  }

  .reader__adjacent {
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
    border-top: var(--border-width) solid var(--zone-line);
    padding-top: var(--space-2);
  }

  .reader__adjacent-link {
    font-size: 12px;
    color: var(--zone-accent-2);
    text-decoration: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .reader__entry {
      transition: none;
    }
  }

  @media (min-width: 900px) {
    .reader {
      padding: 30px 60px 20px;
      overflow-y: auto;
    }

    .reader__layout {
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 36px;
    }

    .reader__entries {
      width: 250px;
      position: sticky;
      top: 0;
    }

    .reader__article {
      /* Capped for line length. With the entry list present this is exactly
         the rest of the 1040px layout; without it, the article stays
         readable rather than running the full width. */
      max-width: 754px;
      padding: 34px 38px;
    }
  }
</style>
