<script setup lang="ts">
  import PixelAvatar from '@/components/PixelAvatar.vue'
</script>

<template>
  <section class="work">
    <PixelAvatar zone="work" />
    <p class="work__pending">* The encounters have not been written yet.</p>
  </section>
</template>

<style scoped>
  .work {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-3);
  }

  .work__pending {
    font-size: 13px;
    color: var(--zone-muted);
  }
</style>
