<script setup lang="ts">
  import type { ProfileStats } from '@/data/profile'

  defineProps<{ stats: ProfileStats }>()
</script>

<template>
  <dl class="stats">
    <div class="stats__row">
      <dt>LV</dt>
      <dd class="stats__value">{{ stats.lv }}</dd>
    </div>
    <div class="stats__row">
      <dt>HP</dt>
      <dd class="stats__value">{{ stats.hp }}</dd>
    </div>
    <div class="stats__row">
      <dt>SINCE</dt>
      <dd class="stats__value stats__value--accent">{{ stats.since }}</dd>
    </div>
  </dl>
</template>

<style scoped>
  .stats {
    margin: 0;
    border: var(--border-width) solid var(--zone-line);
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    font-family: var(--font-display);
    font-size: 10px;
    color: var(--zone-muted);
  }

  .stats__row {
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .stats__row dt,
  .stats__row dd {
    margin: 0;
  }

  .stats__value {
    color: var(--zone-ink);
  }

  .stats__value--accent {
    color: var(--zone-accent);
  }
</style>
