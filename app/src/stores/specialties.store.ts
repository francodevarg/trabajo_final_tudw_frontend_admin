import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Specialty } from '@/types'
import { specialtiesService } from '@/services/specialties.service'

export const useSpecialtiesStore = defineStore('specialties', () => {
  const items = ref<Specialty[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await specialtiesService.getAll()
      items.value = data
    } catch (e: any) {
      error.value = e.message || 'Error al cargar especialidades'
    } finally {
      loading.value = false
    }
  }

  async function create(name: string) {
    const { data } = await specialtiesService.create(name)
    items.value.push(data)
    return data
  }

  async function update(id: string, name: string) {
    const { data } = await specialtiesService.update(id, name)
    const idx = items.value.findIndex(s => s.id === id)
    if (idx !== -1) items.value[idx] = data
    return data
  }

  async function remove(id: string) {
    await specialtiesService.remove(id)
    items.value = items.value.filter(s => s.id !== id)
  }

  return { items, loading, error, fetchAll, create, update, remove }
})
