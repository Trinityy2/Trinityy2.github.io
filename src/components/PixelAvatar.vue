<script setup lang="ts">
  import { computed } from 'vue'

  import type { AvatarPose } from '@/types/avatar'
  import type { Zone } from '@/types/zone'

  const props = withDefaults(defineProps<{ zone: Zone; pose?: AvatarPose }>(), {
    pose: 'idle',
  })

  interface Art {
    file: string
    alt: string
  }

  const ART_FOR_ZONE: Record<Zone, Art> = {
    about: {
      file: 'avatar-void.png',
      alt: 'Pixel-art avatar standing in the void, keyboard held like a sword',
    },
    work: {
      file: 'avatar-ruins.png',
      alt: 'Pixel-art avatar mid-stride through the ruins, keyboard carried',
    },
    blog: {
      file: 'avatar-snowdin.png',
      alt: 'Pixel-art avatar in the snow, keyboard held low',
    },
  }

  function artFor(zone: Zone, _pose: AvatarPose): Art {
    // Every pose resolves to the idle art until other poses are drawn.
    return ART_FOR_ZONE[zone]
  }

  const art = computed(() => artFor(props.zone, props.pose))
  const src = computed(() => `${import.meta.env.BASE_URL}sprites/${art.value.file}`)
</script>

<template>
  <img class="pixel-avatar" :src="src" :alt="art.alt" width="168" height="204" />
</template>

<style scoped>
  .pixel-avatar {
    /*
     * Native size. The design prototype showed these at 190x230 and 160x210 —
     * non-integer upscales that make pixel art visibly uneven even with
     * nearest-neighbour rendering. Any future scaling must stay integer.
     */
    display: block;
    width: 168px;
    height: 204px;
    image-rendering: pixelated;
  }
</style>
