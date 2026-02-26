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
  const isLoading = ref(false)
  const notifications = ref<Notification[]>([])

  const hasNotifications = computed(() => notifications.value.length > 0)

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    const newNotification: Notification = { id, duration: 5000, ...notification }
    notifications.value.push(newNotification)

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => removeNotification(id), newNotification.duration)
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) notifications.value.splice(index, 1)
  }

  function clearNotifications() {
    notifications.value = []
  }

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
    isLoading,
    notifications,
    hasNotifications,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  }
})
