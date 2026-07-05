import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPermissionsFromToken } from '@/helpers/jwt'
import type { PermissionValue } from '@/types'

const ACCESS_KEY = 'medicare_access'

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<string[]>([])

  function load() {
    const token = localStorage.getItem(ACCESS_KEY)
    if (token) {
      permissions.value = getPermissionsFromToken(token)
    } else {
      permissions.value = []
    }
  }

  function has(perm: string): boolean {
    return permissions.value.includes(perm)
  }

  function check(value: PermissionValue): boolean {
    if (typeof value === 'string') {
      return has(value)
    }

    if (Array.isArray(value)) {
      return value.some(p => has(p))
    }

    const { permissions: required, mode = 'or' } = value
    if (mode === 'and') {
      return required.every(p => has(p))
    }
    return required.some(p => has(p))
  }

  function clear() {
    permissions.value = []
  }

  return { permissions, load, has, check, clear }
})
