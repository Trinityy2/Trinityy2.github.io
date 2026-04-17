<template>
  <footer class="border-t border-slate-200 py-8 dark:border-slate-800">
    <div class="section-container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6 lg:px-8">
      <p>© {{ year }} Your Name. All rights reserved.</p>
      <div class="flex items-center gap-4">
        <RouterLink to="/blog" class="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
          Blog
        </RouterLink>
        <a
          href="https://github.com/Trinityy2"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-slate-900 dark:hover:text-slate-100"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
