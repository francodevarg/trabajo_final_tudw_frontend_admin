import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Insurance } from '@/types'
import { insurancesService } from '@/services/insurances.service'

export const useInsurancesStore = defineStore('insurances', () => {
  const items = ref<Insurance[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref('')

  async function fetchAll(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = ''
    try {
      const data = await insurancesService.getAll()
      items.value = data
      loaded.value = true
    } catch (e: any) {
      error.value = e.message || 'Error al cargar obras sociales'
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    loaded.value = false
    await fetchAll(true)
  }

  async function create(name: string) {
    const data = await insurancesService.create(name)
    items.value.push(data)
    return data
  }

  async function update(id: number, name: string) {
    const data = await insurancesService.update(id, name)
    const idx = items.value.findIndex(s => s.id === id)
    if (idx !== -1) items.value[idx] = data
    return data
  }

  async function remove(id: number) {
    await insurancesService.remove(id)
    items.value = items.value.filter(s => s.id !== id)
  }

  return { items, loading, loaded, error, fetchAll, refresh, create, update, remove }
})
