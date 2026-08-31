<script setup lang="ts">
  import type { Experience } from '@/data/experience'

  defineProps<{ entry: Experience }>()
</script>

<template>
  <article class="encounter">
    <p v-if="entry.placeholder" class="encounter__placeholder">
      * PLACEHOLDER — replace with real history.
    </p>

    <header class="encounter__head">
      <div class="encounter__identity">
        <h2 class="encounter__title">{{ entry.title }}</h2>
        <p class="encounter__where">{{ entry.organisation }} · {{ entry.dates }}</p>
      </div>
      <p class="encounter__level">LV {{ entry.level }}</p>
    </header>

    <div class="encounter__responsibilities">
      <p v-for="line in entry.responsibilities" :key="line">{{ line }}</p>
    </div>

    <ul class="encounter__tags">
      <li v-for="tag in entry.tags" :key="tag" class="encounter__tag">{{ tag }}</li>
    </ul>
  </article>
</template>

<style scoped>
  .encounter {
    display: flex;
    flex-direction: column;
    gap: 14px;
    border: var(--border-width) solid var(--zone-ink);
    background: var(--zone-panel);
    padding: 22px;
  }

  .encounter__placeholder {
    font-family: var(--font-display);
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--soul-red);
  }

  .encounter__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
  }

  .encounter__identity {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .encounter__title {
    font-size: 16px;
    line-height: 1.4;
    color: var(--zone-ink);
  }

  .encounter__where {
    font-size: 13px;
    color: var(--zone-accent-2);
  }

  .encounter__level {
    flex: 0 0 auto;
    font-family: var(--font-display);
    font-size: 11px;
    color: var(--zone-accent);
    border: var(--border-width) solid var(--zone-accent);
    padding: 6px 10px;
  }

  .encounter__responsibilities {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    font-size: 13px;
    line-height: 1.65;
    color: var(--zone-body);
  }

  .encounter__tags {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .encounter__tag {
    border: var(--border-width) solid var(--zone-line);
    color: var(--zone-muted);
    font-size: 11px;
    padding: 5px 9px;
  }
</style>
