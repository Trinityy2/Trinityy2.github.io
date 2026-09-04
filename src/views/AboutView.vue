<script setup lang="ts">
  import { ref } from 'vue'

  import PixelAvatar from '@/components/PixelAvatar.vue'
  import SoulHeart from '@/components/SoulHeart.vue'
  import BioTab from '@/components/about/BioTab.vue'
  import ExtrasTab from '@/components/about/ExtrasTab.vue'
  import SkillsTab from '@/components/about/SkillsTab.vue'
  import StatPanel from '@/components/about/StatPanel.vue'
  import { profile } from '@/data/profile'

  const TABS = [
    { id: 'bio', label: 'BIO' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'extras', label: 'EXTRAS' },
  ] as const

  type TabId = (typeof TABS)[number]['id']

  /**
   * Tab state deliberately has no URL representation. Nobody links to a tab,
   * and putting it in the URL would turn every click into a history entry.
   */
  const tab = ref<TabId>('bio')
</script>

<template>
  <section class="about">
    <div class="about__stage">
      <div class="about__layout">
        <div class="about__sprite">
          <PixelAvatar zone="about" />
          <StatPanel :stats="profile.stats" />
        </div>

        <div class="about__identity">
          <div class="about__masthead">
            <h1 class="about__name">{{ profile.name }}</h1>
            <div class="about__badges">
              <span class="about__handle">{{ profile.handle }}</span>
              <p class="about__meta">{{ profile.role }} · {{ profile.location }}</p>
            </div>
          </div>

          <!--
            All three panels are mounted and stacked into one grid cell, so
            the deck is always as tall as the tallest of them and the masthead
            above it cannot drift. A hard-coded reserve did this job before
            and went stale the first time the content was edited.
          -->
          <div class="about__deck">
            <div
              v-for="entry in TABS"
              :key="entry.id"
              class="about__panel"
              :class="{ 'about__panel--showing': tab === entry.id }"
              role="tabpanel"
              :aria-hidden="tab === entry.id ? undefined : 'true'"
              :inert="tab === entry.id ? undefined : true"
            >
              <BioTab v-if="entry.id === 'bio'" :active="tab === 'bio'" />
              <SkillsTab v-else-if="entry.id === 'skills'" />
              <ExtrasTab v-else />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="about__tabs" role="tablist" aria-label="About sections">
      <button
        v-for="entry in TABS"
        :key="entry.id"
        class="about__tab"
        :class="{ 'about__tab--active': tab === entry.id }"
        type="button"
        role="tab"
        :aria-selected="tab === entry.id"
        @click="tab = entry.id"
      >
        <SoulHeart v-if="tab === entry.id" class="about__tab-soul" />
        {{ entry.label }}
      </button>
    </div>
  </section>
</template>

<style scoped>
  .about {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .about__stage {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: var(--space-4) var(--space-3) 0;
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
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .about__identity {
    /* In a centred column flex, children size to their content and can grow
       wider than the container. Clamping here is what lets the badge row wrap
       instead of pushing the document sideways. */
    min-width: 0;
    max-width: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  /*
   * The masthead is the part that must not move. It is a separate element
   * from the panel below it so that the two have independent heights: the
   * panel's content changes with the tab, and nothing above it should notice.
   */
  .about__masthead {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
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

  .about__deck {
    display: grid;
    margin-top: 18px;
  }

  /* Every panel occupies the same cell, so the deck takes the tallest one. */
  .about__deck > * {
    grid-area: 1 / 1;
  }

  .about__panel {
    text-align: left;
  }

  .about__panel:not(.about__panel--showing) {
    visibility: hidden;
  }

  .about__tabs {
    flex: 0 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-2);
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--space-3) var(--space-3);
  }

  .about__tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 15px;
    background: transparent;
    border: var(--border-width) solid var(--zone-muted);
    color: var(--zone-muted);
    font-family: var(--font-display);
    font-size: 13px;
    cursor: pointer;
    transition:
      border-color 160ms linear,
      color 160ms linear,
      background 160ms linear;
  }

  .about__tab--active {
    border-color: var(--zone-accent);
    color: var(--zone-accent);
    background: var(--zone-panel);
  }

  .about__tab-soul {
    --soul-width: 14px;
    --soul-height: 12px;
  }


  @media (min-width: 900px) {
    .about__stage {
      min-height: 0;
      overflow-y: auto;
      padding: 30px 60px 0;
    }

    .about__layout {
      flex-direction: row;
      align-items: flex-start;
      gap: var(--space-5);
      /*
       * Vertical centring by auto margin rather than `align-items: center`.
       * A centred flex item whose content overflows its container cannot be
       * scrolled back to its own top edge; auto margins centre without that.
       */
      margin-block: auto;
    }

    .about__identity {
      flex: 1;
      text-align: left;
    }

    .about__name {
      font-size: 38px;
    }

    .about__badges {
      justify-content: flex-start;
    }

    .about__tabs {
      grid-template-columns: repeat(3, 1fr);
      padding: 20px 60px 24px;
    }
  }
</style>
