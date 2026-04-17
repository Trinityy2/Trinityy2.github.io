<template>
  <component
    :is="clickable ? 'button' : 'span'"
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
    :class="
      clickable
        ? active
          ? 'bg-primary-500 text-white cursor-pointer'
          : 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800/60'
        : 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
    "
    @click="clickable ? $emit('select', tag) : undefined"
  >
    {{ tag }}
  </component>
</template>

<script setup lang="ts">
defineProps<{
  tag: string
  active?: boolean
  clickable?: boolean
}>()

defineEmits<{
  (e: 'select', tag: string): void
}>()
</script>
