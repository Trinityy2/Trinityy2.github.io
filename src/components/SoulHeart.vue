<script setup lang="ts">
  /**
   * The soul. Drawn as a clip-path polygon rather than an image so it scales
   * cleanly, and it is the one colour that never recolours between zones.
   *
   * Size comes from `--soul-width` / `--soul-height` on the consumer, so the
   * shape is defined once and the call sites differ only in dimensions.
   */
  withDefaults(defineProps<{ pulse?: boolean }>(), { pulse: false })
</script>

<template>
  <span class="soul" :class="{ 'soul--pulse': pulse }" aria-hidden="true"></span>
</template>

<style scoped>
  .soul {
    display: block;
    flex: 0 0 auto;
    width: var(--soul-width, 16px);
    height: var(--soul-height, 14px);
    background: var(--soul-red);
    clip-path: polygon(
      12.5% 0%,
      37.5% 0%,
      37.5% 16.7%,
      62.5% 16.7%,
      62.5% 0%,
      87.5% 0%,
      87.5% 16.7%,
      100% 16.7%,
      100% 50%,
      87.5% 50%,
      87.5% 66.7%,
      75% 66.7%,
      75% 83.3%,
      62.5% 83.3%,
      62.5% 100%,
      37.5% 100%,
      37.5% 83.3%,
      25% 83.3%,
      25% 66.7%,
      12.5% 66.7%,
      12.5% 50%,
      0% 50%,
      0% 16.7%,
      12.5% 16.7%
    );
  }

  .soul--pulse {
    animation: soul-pulse 1.6s ease-in-out infinite;
  }

  @keyframes soul-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.14);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .soul--pulse {
      animation: none;
    }
  }
</style>
