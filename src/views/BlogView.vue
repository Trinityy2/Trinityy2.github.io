<script setup lang="ts">
  import { computed } from 'vue'

  import FallingParticles from '@/components/FallingParticles.vue'
  import PixelAvatar from '@/components/PixelAvatar.vue'
  import PostCard from '@/components/blog/PostCard.vue'
  import { useSiteContent } from '@/content'

  /** The landing is a taste, not an archive. */
  const LANDING_POSTS = 4

  const { posts } = useSiteContent()

  // Fewer than four is simply fewer — the list is never padded.
  const recent = computed(() => posts.slice(0, LANDING_POSTS))
  const latest = computed(() => posts[0])
</script>

<template>
  <section class="blog">
    <FallingParticles kind="snow" />

    <div class="blog__layout">
      <div class="blog__content">
        <h1 class="blog__title">BLOG N STUFF</h1>
        <p class="blog__blurb">
          * It's a beautiful day outside. Birds are singing. You are reading blog posts.
        </p>

        <p v-if="posts.length === 0" class="blog__empty">
          * Nothing has been written from here yet.
        </p>

        <template v-else>
          <div class="blog__posts">
            <PostCard v-for="post in recent" :key="post.slug" :post="post" />
          </div>

          <RouterLink class="pixel-button blog__enter" :to="`/blog/${latest.slug}`">
            GO TO THE BLOG →
          </RouterLink>
        </template>
      </div>

      <PixelAvatar class="blog__avatar" zone="blog" />
    </div>
  </section>
</template>

<style scoped>
  .blog {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    padding: var(--space-4) var(--space-3);
  }

  .blog__layout {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 980px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: var(--space-3);
  }

  .blog__content {
    min-width: 0;
    max-width: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .blog__title {
    font-size: 24px;
    letter-spacing: 1px;
    color: var(--zone-ink);
  }

  .blog__blurb,
  .blog__empty {
    font-size: 13px;
    line-height: 1.7;
    color: var(--zone-muted);
  }

  .blog__posts {
    display: flex;
    flex-direction: column;
  }

  .blog__enter {
    align-self: flex-end;
    font-size: 12px;
    padding: 13px 26px;
  }

  .blog__avatar {
    flex: 0 0 auto;
  }

  @media (min-width: 900px) {
    .blog {
      align-items: center;
      padding: 36px 60px;
      overflow-y: auto;
    }

    .blog__layout {
      flex-direction: row;
      align-items: center;
      gap: 44px;
    }
  }
</style>
