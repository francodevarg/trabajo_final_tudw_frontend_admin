import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { OtpTokens } from '@/types'
import { authService, AuthServiceError } from '@/services/auth.service'
import { usePermissionsStore } from './permissions.store'
import { getEmailFromToken, getUserNameFromToken } from '@/helpers/jwt'
import { getRoleFromToken } from '../helpers/jwt'

const ACCESS_KEY = 'medicare_access'
const REFRESH_KEY = 'medicare_refresh'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem(ACCESS_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_KEY))
  const userEmail = ref<string | null>(null)
  const userFirstName = ref<string | null>(null)
  const userLastName = ref<string | null>(null)
  const userGroup = ref<string | null>(null)
  const loading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!accessToken.value)

  function extractUser(token: string) {
    const email = getEmailFromToken(token)
    if (email != null && email !== '') {
      userEmail.value = email
    }
    const name = getUserNameFromToken(token)
    if (name) {
      userFirstName.value = name.firstName || null
      userLastName.value = name.lastName || null
    }
    const role = getRoleFromToken(token)
    if (role) {
      userGroup.value = role
    }
  }

  function persistTokens(tokens: OtpTokens) {
    accessToken.value = tokens.access
    refreshToken.value = tokens.refresh
    localStorage.setItem(ACCESS_KEY, tokens.access)
    localStorage.setItem(REFRESH_KEY, tokens.refresh)
    extractUser(tokens.access)
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    userEmail.value = null
    userFirstName.value = null
    userLastName.value = null
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  function init() {
    const stored = localStorage.getItem(ACCESS_KEY)
    if (stored) {
      accessToken.value = stored
      refreshToken.value = localStorage.getItem(REFRESH_KEY)
      extractUser(stored)
      const perms = usePermissionsStore()
      perms.load()
    }
  }

  async function requestOTP(email: string) {
    loading.value = true
    error.value = ''
    try {
      await authService.requestOTP(email)
    } catch (e) {
      if (e instanceof AuthServiceError) {
        error.value = e.message
        throw e
      }
      error.value = 'Error de red. Verificá tu conexión.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function verifyOTP(email: string, otp: string): Promise<boolean> {
    loading.value = true
    error.value = ''
    try {
      const tokens = await authService.verifyOTP(email, otp)
      persistTokens(tokens)
      const perms = usePermissionsStore()
      perms.load()
      return true
    } catch (e) {
      if (e instanceof AuthServiceError) {
        error.value = e.message
        throw e
      }
      error.value = 'Error de red. Verificá tu conexión.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    if (refreshToken.value) {
      await authService.logout(refreshToken.value)
    }
    clearTokens()
    const perms = usePermissionsStore()
    perms.clear()
  }

  return {
    accessToken,
    refreshToken,
    userEmail,
    userFirstName,
    userLastName,
    userGroup,
    loading,
    error,
    isAuthenticated,
    init,
    requestOTP,
    verifyOTP,
    logout,
  }
})
