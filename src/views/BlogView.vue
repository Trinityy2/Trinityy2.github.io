<template>
  <AppLayout>
    <template #nav>
      <NavBar />
    </template>

    <section class="section pt-28">
      <div class="section-container">
        <!-- Header -->
        <header class="mb-12 text-center">
          <h1 class="section-heading animate-fade-in-up">Writings</h1>
          <p class="section-subheading animate-fade-in-up animate-delay-100">
            Thoughts on software, architecture, and life.
          </p>
        </header>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>

        <template v-else>
          <!-- Tag filter -->
          <div
            v-if="allTags.length > 0"
            class="mb-10 flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter posts by tag"
          >
            <TagChip
              tag="All"
              :active="activeTag === null"
              :clickable="true"
              @select="activeTag = null"
            />
            <TagChip
              v-for="tag in allTags"
              :key="tag"
              :tag="tag"
              :active="activeTag === tag"
              :clickable="true"
              @select="activeTag = tag"
            />
          </div>

          <!-- Empty state -->
          <div
            v-if="filteredPosts.length === 0"
            class="py-20 text-center text-slate-500 dark:text-slate-400"
          >
            No posts found for
            <span class="font-medium text-primary-600 dark:text-primary-400">"{{ activeTag }}"</span>.
          </div>

          <!-- Post grid -->
          <div
            v-else
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            <div
              v-for="post in filteredPosts"
              :key="post.slug"
              role="listitem"
              class="animate-fade-in-up"
            >
              <PostCard :post="post" />
            </div>
          </div>
        </template>
      </div>
    </section>

    <template #footer>
      <AppFooter />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import NavBar from '@/components/layout/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import TagChip from '@/components/blog/TagChip.vue'
import PostCard from '@/components/blog/PostCard.vue'
import { getPosts } from '@/composables/usePosts'
import type { Post } from '@/composables/usePosts'

const loading = ref(true)
const posts = ref<Post[]>([])
const activeTag = ref<string | null>(null)

const allTags = computed(() => {
  const tagSet = new Set<string>()
  posts.value.forEach((p) => p.frontmatter.tags.forEach((t) => tagSet.add(t)))
  return [...tagSet].sort()
})

const filteredPosts = computed(() =>
  activeTag.value
    ? posts.value.filter((p) => p.frontmatter.tags.includes(activeTag.value!))
    : posts.value,
)

onMounted(async () => {
  posts.value = await getPosts()
  loading.value = false
})
</script>

