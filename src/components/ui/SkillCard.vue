<template>
  <div
    class="card flex flex-col items-center gap-3 p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
  >
    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-2xl dark:bg-primary-900/30">
      {{ skill.icon }}
    </div>
    <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ skill.name }}</span>
    <!-- Proficiency bar -->
    <div class="w-full" v-if="skill.level">
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          class="h-full rounded-full bg-primary-500 transition-all duration-700"
          :style="{ width: `${skill.level}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Skill {
  name: string
  icon: string
  level?: number
}

defineProps<{ skill: Skill }>()
</script>
