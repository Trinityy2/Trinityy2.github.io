<template>
  <AppLayout>
    <template #nav>
      <NavBar />
      <!-- Reading progress bar -->
      <div
        class="fixed top-16 inset-x-0 z-40 h-0.5 bg-primary-500 origin-left"
        :style="{ transform: `scaleX(${progress / 100})` }"
        role="progressbar"
        :aria-valuenow="Math.round(progress)"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Reading progress"
      />
    </template>

    <div class="section pt-24 pb-20">
      <div class="section-container">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-32">
          <div
            class="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
          />
        </div>

        <!-- Not found -->
        <div v-else-if="!post" class="py-32 text-center">
          <p class="text-2xl font-bold text-slate-900 dark:text-white">Post not found</p>
          <RouterLink to="/blog" class="btn-primary mt-6 inline-flex">← Back to Blog</RouterLink>
        </div>

        <!-- Post -->
        <template v-else>
          <!-- Back link -->
          <RouterLink
            to="/blog"
            class="btn-ghost mb-8 inline-flex items-center gap-1.5 text-sm"
          >
            <span aria-hidden="true">←</span> Back to Blog
          </RouterLink>

          <!-- Post header -->
          <header class="mb-10">
            <div class="mb-4 flex flex-wrap gap-2">
              <TagChip v-for="tag in post.frontmatter.tags" :key="tag" :tag="tag" />
            </div>
            <h1 class="text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              {{ post.frontmatter.title }}
            </h1>
            <p class="mt-4 text-slate-500 dark:text-slate-400">
              <time :datetime="post.frontmatter.date">{{ formatDate(post.frontmatter.date) }}</time>
              <span class="mx-2">·</span>
              <span>{{ post.readingTime }} min read</span>
            </p>
            <img
              v-if="post.frontmatter.cover_image"
              :src="post.frontmatter.cover_image"
              :alt="post.frontmatter.title"
              class="mt-6 w-full rounded-2xl object-cover shadow-lg"
              style="max-height: 420px"
            />
          </header>

          <!-- Content grid: TOC left, prose right -->
          <div class="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[260px_minmax(0,1fr)]">
            <!-- Sticky TOC sidebar -->
            <aside
              v-if="tocHeadings.length > 0"
              class="hidden lg:block"
              aria-label="Table of contents"
            >
              <div class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-4">
                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  On this page
                </p>
                <nav>
                  <a
                    v-for="heading in tocHeadings"
                    :key="heading.id"
                    :href="`#${heading.id}`"
                    class="block py-1 text-sm transition-colors"
                    :class="[
                      heading.level === 3 ? 'pl-4' : heading.level === 4 ? 'pl-7' : 'pl-0',
                      activeTocId === heading.id
                        ? 'font-medium text-primary-600 dark:text-primary-400'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                    ]"
                  >
                    {{ heading.text }}
                  </a>
                </nav>
              </div>
            </aside>

            <!-- Main prose content -->
            <div>
              <div
                ref="contentEl"
                class="prose-custom"
                v-html="post.html"
              />

              <!-- Share section -->
              <div class="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
                <p class="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Share this post
                </p>
                <div class="flex flex-wrap gap-3">
                  <a
                    :href="twitterShareUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary text-sm"
                  >
                    Share on X / Twitter
                  </a>
                  <a
                    :href="linkedinShareUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary text-sm"
                  >
                    Share on LinkedIn
                  </a>
                  <button class="btn-secondary text-sm" @click="copyLink">
                    {{ copied ? 'Copied!' : 'Copy link' }}
                  </button>
                </div>
              </div>

              <!-- About the author -->
              <div
                class="mt-10 flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white"
                >
                  {{ authorInitials }}
                </div>
                <div>
                  <p class="font-semibold text-slate-900 dark:text-white">{{ authorName }}</p>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Software engineer writing about tech, architecture, and life beyond the keyboard.
                  </p>
                  <RouterLink to="/" class="mt-3 inline-flex text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
                    View my portfolio →
                  </RouterLink>
                </div>
              </div>

              <!-- Related posts -->
              <div v-if="relatedPosts.length > 0" class="mt-12">
                <h2 class="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Related posts
                </h2>
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <PostCard v-for="related in relatedPosts" :key="related.slug" :post="related" />
                </div>
              </div>

              <!-- Prev / Next navigation -->
              <nav
                v-if="prevPost || nextPost"
                class="mt-12 grid gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 sm:grid-cols-2"
                aria-label="Post navigation"
              >
                <RouterLink
                  v-if="prevPost"
                  :to="`/blog/${prevPost.slug}`"
                  class="group flex flex-col rounded-xl border border-slate-200 p-4 transition-colors hover:border-primary-400 dark:border-slate-800 dark:hover:border-primary-600"
                >
                  <span class="mb-1 text-xs text-slate-400">← Previous</span>
                  <span
                    class="font-medium text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                  >
                    {{ prevPost.frontmatter.title }}
                  </span>
                </RouterLink>
                <div v-else />
                <RouterLink
                  v-if="nextPost"
                  :to="`/blog/${nextPost.slug}`"
                  class="group flex flex-col rounded-xl border border-slate-200 p-4 text-right transition-colors hover:border-primary-400 dark:border-slate-800 dark:hover:border-primary-600"
                >
                  <span class="mb-1 text-xs text-slate-400">Next →</span>
                  <span
                    class="font-medium text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                  >
                    {{ nextPost.frontmatter.title }}
                  </span>
                </RouterLink>
              </nav>
            </div>
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <AppFooter />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import NavBar from '@/components/layout/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import TagChip from '@/components/blog/TagChip.vue'
import PostCard from '@/components/blog/PostCard.vue'
import { getPost, getPosts } from '@/composables/usePosts'
import type { PostWithContent, Post } from '@/composables/usePosts'
import { useReadingProgress } from '@/composables/useReadingProgress'

const route = useRoute()
const { progress } = useReadingProgress()

const loading = ref(true)
const post = ref<PostWithContent | null>(null)
const allPosts = ref<Post[]>([])
const contentEl = ref<HTMLElement | null>(null)
const activeTocId = ref<string>('')
const copied = ref(false)

const authorName = 'Your Name'
const authorInitials = computed(() =>
  authorName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase(),
)

const tocHeadings = computed(() => post.value?.headings ?? [])

const relatedPosts = computed(() => {
  if (!post.value) return []
  const tags = new Set(post.value.frontmatter.tags)
  return allPosts.value
    .filter((p) => p.slug !== post.value!.slug && p.frontmatter.tags.some((t) => tags.has(t)))
    .slice(0, 3)
})

const sortedPosts = computed(() =>
  [...allPosts.value].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  ),
)

const currentIndex = computed(() =>
  sortedPosts.value.findIndex((p) => p.slug === post.value?.slug),
)

const prevPost = computed(() =>
  currentIndex.value > 0 ? sortedPosts.value[currentIndex.value - 1] : null,
)

const nextPost = computed(() =>
  currentIndex.value < sortedPosts.value.length - 1
    ? sortedPosts.value[currentIndex.value + 1]
    : null,
)

const pageUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return window.location.href
})

const twitterShareUrl = computed(
  () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value?.frontmatter.title ?? '')}&url=${encodeURIComponent(pageUrl.value)}`,
)

const linkedinShareUrl = computed(
  () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl.value)}`,
)

async function copyLink() {
  await navigator.clipboard.writeText(pageUrl.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// TOC active section tracking via IntersectionObserver
function observeHeadings() {
  if (!contentEl.value) return
  const headingEls = contentEl.value.querySelectorAll('h2[id], h3[id], h4[id]')
  if (headingEls.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeTocId.value = (entry.target as HTMLElement).id
        }
      }
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
  )
  headingEls.forEach((el) => observer.observe(el))
}

// Copy button click handler for code blocks
function attachCopyButtons() {
  if (!contentEl.value) return
  contentEl.value.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = decodeURIComponent(btn.dataset.code ?? '')
      await navigator.clipboard.writeText(code)
      const original = btn.textContent
      btn.textContent = 'Copied!'
      setTimeout(() => (btn.textContent = original), 2000)
    })
  })
}

async function loadPost(slug: string) {
  loading.value = true
  post.value = null
  const [loadedPost, loadedAll] = await Promise.all([getPost(slug), getPosts()])
  post.value = loadedPost
  allPosts.value = loadedAll
  loading.value = false
  await nextTick()
  observeHeadings()
  attachCopyButtons()
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') loadPost(slug)
  },
  { immediate: false },
)

onMounted(() => {
  const slug = route.params.slug
  if (typeof slug === 'string') loadPost(slug)
})
</script>

