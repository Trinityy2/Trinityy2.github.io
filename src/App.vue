<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import PathHeader from '@/components/PathHeader.vue'
  import { useArrowTravel } from '@/composables/useArrowTravel'
  import { useZoneTransition } from '@/composables/useZoneTransition'
  import { zoneRouteFor } from '@/data/zones'

  const route = useRoute()

  /**
   * The single attribute the whole colour system hangs off. Every colour in
   * the site resolves from a custom property switched by this one write.
   */
  const zone = computed(() => route.meta.zone ?? 'about')

  const zoneRoute = computed(() => zoneRouteFor(zone.value))

  useArrowTravel()

  const { covering, epoch, overlay } = useZoneTransition()
</script>

<template>
  <div class="app-shell" :data-zone="zone">
    <PathHeader :zone="zone" />

    <main class="app-shell__stage">
      <!-- Keyed on the epoch so a zone remounts on every completed swap, and
           its entrance state starts from zero rather than resuming. -->
      <RouterView :key="epoch" />
    </main>

    <footer class="app-shell__footer">
      <span>{{ zoneRoute.title }}</span>
      <span>← → to travel</span>
    </footer>

    <!-- The room transition. Full-bleed black, above everything, never
         interactive. The zone swaps underneath it while it is opaque. -->
    <div
      ref="overlay"
      class="app-shell__overlay"
      :class="{ 'app-shell__overlay--covering': covering }"
      :data-covering="String(covering)"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped>
  .app-shell {
    position: relative;
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

  .app-shell__overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: var(--transition-black);
    pointer-events: none;
    opacity: 0;
    /* Asymmetric by design: 200ms down, 160ms back up. */
    transition: opacity 160ms linear;
  }

  .app-shell__overlay--covering {
    opacity: 1;
    transition: opacity 200ms linear;
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
