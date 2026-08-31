<script setup lang="ts">
  import { computed } from 'vue'

  import type { AvatarPose } from '@/types/avatar'
  import type { Zone } from '@/types/zone'

  const props = withDefaults(defineProps<{ zone: Zone; pose?: AvatarPose }>(), {
    pose: 'idle',
  })

  const SPRITE_FOR_ZONE: Record<Zone, string> = {
    about: 'avatar-void.png',
    work: 'avatar-ruins.png',
    blog: 'avatar-snowdin.png',
  }

  const ALT_FOR_ZONE: Record<Zone, string> = {
    about: 'Pixel-art avatar standing in the void, keyboard held like a sword',
    work: 'Pixel-art avatar mid-stride through the ruins, keyboard carried',
    blog: 'Pixel-art avatar in the snow, keyboard held low',
  }

  function spriteFor(zone: Zone, _pose: AvatarPose): string {
    // Every pose resolves to the idle image until other poses are drawn.
    return SPRITE_FOR_ZONE[zone]
  }

  const src = computed(
    () => `${import.meta.env.BASE_URL}sprites/${spriteFor(props.zone, props.pose)}`
  )
</script>

<template>
  <img class="pixel-avatar" :src="src" :alt="ALT_FOR_ZONE[zone]" width="168" height="204" />
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
