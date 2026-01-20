<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Global Loading Indicator -->
    <LoadingSpinner v-if="isLoading" />
    
    <!-- Toast Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import NotificationContainer from '@/components/ui/NotificationContainer.vue'

const appStore = useAppStore()
const isLoading = computed(() => appStore.isLoading)
</script>