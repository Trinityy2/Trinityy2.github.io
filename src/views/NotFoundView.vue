<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-4">Page Not Found</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <RouterLink
        to="/"
        class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
