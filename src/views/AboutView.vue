<script setup lang="ts">
  import PixelAvatar from '@/components/PixelAvatar.vue'
  import { profile } from '@/data/profile'
</script>

<template>
  <section class="about">
    <div class="about__layout">
      <div class="about__sprite">
        <PixelAvatar zone="about" />
      </div>

      <div class="about__identity">
        <h1 class="about__name">{{ profile.name }}</h1>
        <div class="about__badges">
          <span class="about__handle">{{ profile.handle }}</span>
          <p class="about__meta">{{ profile.role }} · {{ profile.location }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .about {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: var(--space-4) var(--space-3);
  }

  .about__layout {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .about__sprite {
    flex: 0 0 auto;
  }

  .about__identity {
    /* In a centred column flex, children size to their content and can grow
       wider than the container. Clamping here is what lets the badge row wrap
       instead of pushing the document sideways. */
    min-width: 0;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    text-align: center;
  }

  .about__name {
    /* Mobile baseline: small enough that the display face cannot push the
       document sideways. The designed 38px is applied at desktop below. */
    font-size: 24px;
    line-height: 1.15;
    letter-spacing: 2px;
    color: var(--zone-ink);
  }

  .about__badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }

  .about__handle {
    font-family: var(--font-display);
    font-size: 11px;
    color: var(--zone-accent);
    border: var(--border-width) solid var(--zone-accent);
    padding: 5px 9px;
  }

  .about__meta {
    font-size: 13px;
    color: var(--zone-muted);
  }

  /*
   * Desktop: the designed side-by-side layout. Below this the sprite sits
   * above the text so the text column is not crushed — the mobile fallback is
   * functional, not designed.
   */
  @media (min-width: 900px) {
    .about {
      align-items: center;
      padding: var(--space-4) var(--space-6);
    }

    .about__layout {
      flex-direction: row;
      align-items: flex-start;
      gap: var(--space-5);
    }

    .about__name {
      font-size: 38px;
    }

    .about__identity {
      flex: 1;
      text-align: left;
    }

    .about__badges {
      justify-content: flex-start;
    }
  }
</style>
