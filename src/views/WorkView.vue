<script setup lang="ts">
  import { computed, ref } from 'vue'

  import FallingParticles from '@/components/FallingParticles.vue'
  import PixelAvatar from '@/components/PixelAvatar.vue'
  import ExperienceCard from '@/components/work/ExperienceCard.vue'
  import { useSiteContent } from '@/content'

  const { experience } = useSiteContent()

  /** Index 0 is the most recent role; stepping forward goes further back. */
  const index = ref(0)

  const current = computed(() => experience[index.value])
  const hasEarlier = computed(() => index.value < experience.length - 1)
  const hasLater = computed(() => index.value > 0)

  function step(by: number) {
    const next = index.value + by
    if (next < 0 || next >= experience.length) return
    index.value = next
  }
</script>

<template>
  <section class="work">
    <FallingParticles kind="leaf" />

    <div class="work__layout">
      <PixelAvatar class="work__avatar" zone="work" />

      <div class="work__content">
        <header class="work__head">
          <h1 class="work__title">EXPERIENCE</h1>
          <p class="work__blurb">* Every room was a puzzle. Here's each one.</p>
        </header>

        <p v-if="!current" class="work__empty">* No encounters recorded yet.</p>

        <template v-else>
          <ExperienceCard :entry="current" />

          <div class="work__controls">
            <button
              class="work__step"
              type="button"
              :disabled="!hasLater"
              @click="step(-1)"
            >
              ← MORE RECENT
            </button>

            <div class="work__position">
              <ul class="work__dots">
                <li
                  v-for="(entry, dot) in experience"
                  :key="entry.title"
                  class="work__dot"
                  :class="{
                    'work__dot--current': dot === index,
                    'work__dot--seen': dot < index,
                  }"
                ></li>
              </ul>
              <p class="work__counter">{{ index + 1 }} / {{ experience.length }}</p>
            </div>

            <button
              class="work__step"
              type="button"
              :disabled="!hasEarlier"
              @click="step(1)"
            >
              FURTHER BACK →
            </button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .work {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    padding: var(--space-4) var(--space-3);
  }

  .work__layout {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .work__avatar {
    flex: 0 0 auto;
  }

  .work__content {
    min-width: 0;
    max-width: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .work__head {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .work__title {
    font-size: 22px;
    letter-spacing: 1px;
    color: var(--zone-accent-2);
  }

  .work__blurb,
  .work__empty {
    font-size: 13px;
    color: var(--zone-muted);
  }

  .work__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 18px;
    padding-top: 2px;
  }

  .work__step {
    background: transparent;
    border: var(--border-width) solid var(--zone-accent);
    color: var(--zone-accent);
    font-family: var(--font-display);
    font-size: 11px;
    padding: 11px 18px;
    cursor: pointer;
    transition:
      color 160ms linear,
      border-color 160ms linear;
  }

  /* Visibly dead at the ends, rather than silently inert. */
  .work__step:disabled {
    border-color: var(--zone-line);
    color: var(--zone-line);
    cursor: default;
  }

  .work__position {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .work__dots {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 9px;
  }

  .work__dot {
    width: 11px;
    height: 11px;
    background: var(--zone-line);
    transition: background 200ms linear;
  }

  .work__dot--seen {
    background: var(--zone-muted);
  }

  .work__dot--current {
    background: var(--zone-accent);
  }

  .work__counter {
    font-family: var(--font-display);
    font-size: 11px;
    color: var(--zone-muted);
  }


  @media (min-width: 900px) {
    .work {
      align-items: center;
      padding: 34px 60px 30px;
      overflow-y: auto;
    }

    .work__layout {
      flex-direction: row;
      align-items: flex-start;
      gap: var(--space-5);
    }

    .work__avatar {
      margin-top: var(--space-4);
    }
  }
</style>
