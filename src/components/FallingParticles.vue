<script setup lang="ts">
  /**
   * Zone ambience: a handful of pixels drifting down the screen.
   *
   * Positions, sizes, durations and offsets are fixed rather than random so
   * the effect is identical on every visit and in every render — there is no
   * state here, and nothing to reset when a zone remounts.
   */
  defineProps<{ kind: 'leaf' | 'snow' }>()

  /**
   * `offset` is a **negative** animation delay, and must stay negative.
   *
   * A positive delay parks the element at its pre-animation state for the
   * duration of the delay — visibly, at full opacity, at the top of the zone.
   * Since a zone remounts on every arrival, that showed up as a handful of
   * static dots pinned to the top edge for up to three seconds after every
   * transition, before they abruptly began to fall.
   *
   * A negative delay instead starts the animation part-way through, so each
   * particle is already mid-fall on the very first frame. The offsets below
   * put the four at roughly a quarter, a half, two thirds and four fifths of
   * the way through their own cycles, which spreads them down the screen
   * immediately rather than releasing them in a clump.
   */
  const PARTICLES = [
    { left: '8%', size: 9, duration: 10, offset: -2.5, tone: 'accent' },
    { left: '29%', size: 7, duration: 12.5, offset: -8, tone: 'accent-2' },
    { left: '57%', size: 10, duration: 10.5, offset: -5, tone: 'accent' },
    { left: '82%', size: 8, duration: 13.5, offset: -11, tone: 'accent-2' },
  ] as const
</script>

<template>
  <div class="ambience" aria-hidden="true">
    <span
      v-for="particle in PARTICLES"
      :key="particle.left"
      class="ambience__particle"
      :class="[`ambience__particle--${kind}`, `ambience__particle--${particle.tone}`]"
      :style="{
        left: particle.left,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        animationDuration: `${particle.duration}s`,
        animationDelay: `${particle.offset}s`,
      }"
    ></span>
  </div>
</template>

<style scoped>
  .ambience {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .ambience__particle {
    position: absolute;
    top: 0;
    display: block;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    /* Belt and braces: were an offset ever made positive, the particle would
       at least wait out the delay invisibly instead of parked at the top. */
    animation-fill-mode: backwards;
  }

  .ambience__particle--accent {
    background: var(--zone-accent);
  }

  .ambience__particle--accent-2 {
    background: var(--zone-accent-2);
  }

  .ambience__particle--leaf {
    animation-name: leaf-fall;
  }

  .ambience__particle--snow {
    animation-name: snow-fall;
  }

  @keyframes leaf-fall {
    0% {
      transform: translateY(-40px) rotate(0deg);
      opacity: 0;
    }
    12% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(105vh) rotate(220deg);
      opacity: 0.3;
    }
  }

  @keyframes snow-fall {
    0% {
      transform: translateY(-40px) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 0.9;
    }
    100% {
      transform: translateY(105vh) translateX(30px);
      opacity: 0.5;
    }
  }

  /* A visitor who asked for no motion gets no drifting pixels at all. */
  @media (prefers-reduced-motion: reduce) {
    .ambience {
      display: none;
    }
  }
</style>
