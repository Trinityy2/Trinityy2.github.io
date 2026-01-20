import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, AuthResponse } from '@shared/types'
import { authApi } from '@/services/api'
import { useAppStore } from './app'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const userRole = computed(() => user.value?.role?.name)
  const isAdmin = computed(() => userRole.value === 'admin')

  // Actions
  async function login(credentials: LoginCredentials): Promise<void> {
    const appStore = useAppStore()
    
    try {
      isLoading.value = true
      appStore.setLoading(true, 'Signing in...')
      
      const response = await authApi.login(credentials)
      
      // Store authentication data
      setAuthData(response)
      
      appStore.notifySuccess('Welcome!', 'Successfully signed in')
      
    } catch (error: any) {
      appStore.notifyError(
        'Login Failed', 
        error.response?.data?.message || 'Invalid credentials'
      )
      throw error
    } finally {
      isLoading.value = false
      appStore.setLoading(false)
    }
  }

  async function logout(): Promise<void> {
    const appStore = useAppStore()
    
    try {
      if (refreshToken.value) {
        await authApi.logout(refreshToken.value)
      }
    } catch (error) {
      console.warn('Logout request failed:', error)
    } finally {
      clearAuthData()
      appStore.notifyInfo('Signed Out', 'You have been successfully signed out')
    }
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) {
      return false
    }

    try {
      const response = await authApi.refresh({ refreshToken: refreshToken.value })
      
      // Update access token
      accessToken.value = response.jwt
      
      // Update user data if provided
      if (response.user) {
        user.value = response.user
      }
      
      // Store in localStorage
      localStorage.setItem('accessToken', response.jwt)
      
      return true
      
    } catch (error) {
      console.warn('Token refresh failed:', error)
      clearAuthData()
      return false
    }
  }

  async function fetchProfile(): Promise<void> {
    if (!accessToken.value) {
      throw new Error('No access token available')
    }

    try {
      const userData = await authApi.getProfile()
      user.value = userData
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      throw error
    }
  }

  function setAuthData(authData: AuthResponse): void {
    user.value = authData.user
    accessToken.value = authData.jwt
    
    if (authData.refreshToken) {
      refreshToken.value = authData.refreshToken
      localStorage.setItem('refreshToken', authData.refreshToken)
    }
    
    // Store in localStorage
    localStorage.setItem('accessToken', authData.jwt)
    localStorage.setItem('user', JSON.stringify(authData.user))
  }

  function clearAuthData(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    
    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  function restoreAuthData(): void {
    try {
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')
      
      if (storedAccessToken) {
        accessToken.value = storedAccessToken
      }
      
      if (storedRefreshToken) {
        refreshToken.value = storedRefreshToken
      }
      
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
      
    } catch (error) {
      console.warn('Failed to restore auth data:', error)
      clearAuthData()
    }
  }

  // Initialize auth state from localStorage
  restoreAuthData()

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    
    // Actions
    login,
    logout,
    refreshAccessToken,
    fetchProfile,
    setAuthData,
    clearAuthData,
    restoreAuthData
  }
})