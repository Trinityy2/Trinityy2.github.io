<script setup lang="ts">
  import PixelAvatar from '@/components/PixelAvatar.vue'
</script>

<template>
  <section class="blog">
    <PixelAvatar zone="blog" />
    <p class="blog__pending">* Nothing has been written from here yet.</p>
  </section>
</template>

<style scoped>
  .blog {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-3);
  }

  .blog__pending {
    font-size: 13px;
    color: var(--zone-muted);
  }
</style>
