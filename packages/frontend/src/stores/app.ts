import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const notifications = ref<Notification[]>([])
  const sidebarOpen = ref(false)

  // Getters
  const hasNotifications = computed(() => notifications.value.length > 0)

  // Actions
  function setLoading(loading: boolean, message = '') {
    isLoading.value = loading
    loadingMessage.value = message
  }

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  // Utility methods for common notification types
  function notifySuccess(title: string, message?: string) {
    addNotification({ type: 'success', title, message })
  }

  function notifyError(title: string, message?: string) {
    addNotification({ type: 'error', title, message })
  }

  function notifyWarning(title: string, message?: string) {
    addNotification({ type: 'warning', title, message })
  }

  function notifyInfo(title: string, message?: string) {
    addNotification({ type: 'info', title, message })
  }

  return {
    // State
    isLoading,
    loadingMessage,
    notifications,
    sidebarOpen,
    
    // Getters
    hasNotifications,
    
    // Actions
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleSidebar,
    closeSidebar,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  }
})