<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import PathHeader from '@/components/PathHeader.vue'
  import { useArrowTravel } from '@/composables/useArrowTravel'
  import { zoneRoutes } from '@/data/zones'

  const route = useRoute()

  /**
   * The single attribute the whole colour system hangs off. Every colour in
   * the site resolves from a custom property switched by this one write.
   */
  const zone = computed(() => route.meta.zone ?? 'about')

  const zoneRoute = computed(() => zoneRoutes.find((r) => r.zone === zone.value) ?? zoneRoutes[0])

  useArrowTravel()
</script>

<template>
  <div class="app-shell" :data-zone="zone">
    <PathHeader :zone="zone" />

    <main class="app-shell__stage">
      <RouterView />
    </main>

    <footer class="app-shell__footer">
      <span>{{ zoneRoute.title }}</span>
      <span>← → to travel</span>
    </footer>
  </div>
</template>

<style scoped>
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--zone-bg);
    color: var(--zone-body);
  }

  .app-shell__stage {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .app-shell__footer {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
    padding: 14px var(--space-3);
    border-top: var(--border-width) solid var(--zone-line);
    font-size: 11px;
    color: var(--zone-muted);
  }

  /* Desktop stage: locked to the viewport. See the inversion note in base.css. */
  @media (min-width: 900px) {
    .app-shell {
      height: 100vh;
      min-height: 0;
      overflow: hidden;
    }

    .app-shell__stage {
      min-height: 0;
      overflow: hidden;
    }

    .app-shell__footer {
      padding: 14px 60px;
    }
  }
</style>
