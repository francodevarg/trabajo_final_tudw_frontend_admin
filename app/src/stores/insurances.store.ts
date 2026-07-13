import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Insurance } from '@/types'
import { insurancesService } from '@/services/insurances.service'

export const useInsurancesStore = defineStore('insurances', () => {
  const items = ref<Insurance[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchAll(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await insurancesService.getAll()
      items.value = data
      loaded.value = true
    } catch {
      // silently fail — form will show empty list
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    loaded.value = false
    await fetchAll(true)
  }

  return { items, loading, loaded, fetchAll, refresh }
})
