<template>
  <div class="min-h-screen bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
    <slot name="nav" />
    <main>
      <slot />
    </main>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

// Ensure theme is initialised when layout mounts
useThemeStore()
</script>
