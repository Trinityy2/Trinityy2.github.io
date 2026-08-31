<script setup lang="ts">
  import { computed, ref } from 'vue'

  import SoulHeart from '@/components/SoulHeart.vue'
  import { zoneRoutes } from '@/data/zones'
  import type { Zone } from '@/types/zone'

  const props = defineProps<{ zone: Zone }>()

  const hovered = ref<Zone | null>(null)

  /**
   * Nodes are equal-width columns, so a node's centre is the midpoint of its
   * share of the path. Deriving it from the index rather than hard-coding
   * percentages means the path still reads correctly if a zone is ever added.
   */
  function centreOf(index: number): string {
    return `${((index + 0.5) / zoneRoutes.length) * 100}%`
  }

  /*
   * Marked from the zone rather than from an exact URL match: the blog
   * reader lives at /blog/<slug> and must still light the Blog node.
   */
  const currentIndex = computed(() => zoneRoutes.findIndex((r) => r.zone === props.zone))

  const soulLeft = computed(() => centreOf(currentIndex.value))

  /** The tooltip follows the hovered node, and is only shown while hovering. */
  const previewed = computed(() => zoneRoutes.find((r) => r.zone === hovered.value) ?? null)

  const previewLeft = computed(() => {
    const index = zoneRoutes.findIndex((r) => r.zone === hovered.value)
    return centreOf(index === -1 ? currentIndex.value : index)
  })

  function nodeState(zone: Zone): 'current' | 'hovered' | 'idle' {
    if (zone === props.zone) return 'current'
    if (zone === hovered.value) return 'hovered'
    return 'idle'
  }
</script>

<template>
  <header class="path">
    <nav class="path__route" aria-label="Zones">
      <div class="path__line" aria-hidden="true"></div>

      <div class="path__soul" :style="{ left: soulLeft }" aria-hidden="true">
        <SoulHeart pulse />
        <div class="path__soul-shadow"></div>
      </div>

      <RouterLink
        v-for="route in zoneRoutes"
        :key="route.zone"
        class="path__node"
        :class="`path__node--${nodeState(route.zone)}`"
        :to="route.path"
        :aria-current="route.zone === zone ? 'page' : undefined"
        @mouseenter="hovered = route.zone"
        @mouseleave="hovered = null"
        @focus="hovered = route.zone"
        @blur="hovered = null"
      >
        <span class="path__save-point" aria-hidden="true"></span>
        <span class="path__label">{{ route.label }}</span>
      </RouterLink>
    </nav>

    <Transition name="preview">
      <div
        v-if="previewed"
        class="path__preview"
        :style="{ left: previewLeft }"
        role="tooltip"
        aria-hidden="true"
      >
        <span class="path__preview-line">{{ previewed.preview }}</span>
        <span class="path__preview-meta">{{ previewed.previewMeta }}</span>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
  .path {
    position: relative;
    z-index: 20;
    flex: 0 0 auto;
    padding: var(--space-2) var(--space-3) var(--space-2);
    background: var(--zone-bg);
    border-bottom: var(--border-width) solid var(--zone-ink);
    transition:
      background 420ms linear,
      border-color 420ms linear;
  }

  .path__route {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  /* The dashed road, drawn between the first and last node centres. */
  .path__line {
    position: absolute;
    z-index: 0;
    left: 16.6%;
    right: 16.6%;
    top: 29px;
    border-top: var(--border-width) dashed var(--zone-line);
    transition: border-color 420ms linear;
  }

  .path__soul {
    position: absolute;
    z-index: 3;
    top: 0;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    /* The soul travels along the path rather than teleporting to the node. */
    transition: left 480ms cubic-bezier(0.3, 0.8, 0.3, 1);
  }

  .path__soul-shadow {
    width: 20px;
    height: 7px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    filter: blur(3px);
  }

  .path__node {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding-top: var(--space-3);
    text-decoration: none;
  }

  /* The save point: an Undertale star, glowing when it is where you are. */
  .path__save-point {
    width: 36px;
    height: 11px;
    border-radius: 50%;
    color: var(--zone-muted);
    background: currentColor;
    box-shadow: 0 0 14px currentColor;
    transition: color 300ms linear;
  }

  .path__label {
    font-family: var(--font-display);
    font-size: 13px;
    letter-spacing: 1px;
    color: var(--zone-muted);
    transition: color 300ms linear;
  }

  .path__node--current .path__save-point,
  .path__node--current .path__label {
    color: var(--zone-accent);
  }

  .path__node--hovered .path__save-point,
  .path__node--hovered .path__label {
    color: var(--zone-ink);
  }

  .path__preview {
    position: absolute;
    top: 100%;
    transform: translateX(-50%);
    margin-top: -4px;
    z-index: 30;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    white-space: nowrap;
    background: var(--zone-panel-deep);
    border: var(--border-width) solid var(--zone-ink);
    padding: 10px var(--space-2);
  }

  .path__preview-line {
    font-size: 12px;
    color: var(--zone-ink);
  }

  .path__preview-meta {
    font-family: var(--font-display);
    font-size: 10px;
    color: var(--zone-accent);
  }

  .preview-enter-active,
  .preview-leave-active {
    transition: opacity 140ms linear;
  }

  .preview-enter-from,
  .preview-leave-to {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .path,
    .path__line,
    .path__soul,
    .path__save-point,
    .path__label {
      transition: none;
    }

    .preview-enter-active,
    .preview-leave-active {
      transition: none;
    }
  }

  @media (min-width: 900px) {
    .path {
      padding: 28px 90px 18px;
    }
  }
</style>
