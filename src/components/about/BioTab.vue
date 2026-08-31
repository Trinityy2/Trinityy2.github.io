<script setup lang="ts">
  import SoulHeart from '@/components/SoulHeart.vue'
  import { useTypewriter } from '@/composables/useTypewriter'
  import { profile } from '@/data/profile'

  const typed = useTypewriter(profile.bio)
</script>

<template>
  <div class="bio">
    <div class="bio__dialogue">
      <SoulHeart class="bio__soul" pulse />
      <p class="bio__line">{{ typed }}<span class="bio__caret">_</span></p>
    </div>

    <div class="bio__notes">
      <p v-for="note in profile.notes" :key="note">{{ note }}</p>
    </div>
  </div>
</template>

<style scoped>
  .bio {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .bio__dialogue {
    display: flex;
    gap: 14px;
    min-height: 96px;
    padding: 22px;
    background: var(--zone-panel-deep);
    border: var(--border-width) solid var(--zone-ink);
  }

  .bio__soul {
    margin-top: 5px;
  }

  .bio__line {
    font-size: 15px;
    line-height: 1.75;
    color: var(--zone-ink);
    text-wrap: pretty;
  }

  .bio__caret {
    color: var(--zone-accent);
    animation: caret-blink 1s steps(1, end) infinite;
  }

  .bio__notes {
    display: flex;
    flex-direction: column;
    gap: 9px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--zone-muted);
  }

  @keyframes caret-blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bio__caret {
      animation: none;
    }
  }
</style>
