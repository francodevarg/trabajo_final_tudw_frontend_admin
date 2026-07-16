import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DoctorDTO, DoctorCreateDTO, EmailStatus } from '@/types'
import { doctorsService } from '@/services/doctors.service'

export const useDoctorsStore = defineStore('doctors', () => {
  const items = ref<DoctorDTO[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await doctorsService.getAll()
      items.value = data
    } catch (e: any) {
      error.value = e.message || 'Error al cargar médicos'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: DoctorCreateDTO) {
    const { data } = await doctorsService.create(dto)
    items.value.push(data)
    return data
  }

  async function update(id: number, dto: DoctorCreateDTO) {
    const { data } = await doctorsService.update(id, dto)
    const idx = items.value.findIndex(d => d.id === id)
    if (idx !== -1) items.value[idx] = data
    return data
  }

  async function remove(id: number) {
    await doctorsService.remove(id)
    items.value = items.value.filter(d => d.id !== id)
  }

  async function toggleActive(id: number) {
    const item = items.value.find(d => d.id === id)
    if (!item) return
    const dto: DoctorCreateDTO = { ...item, is_active: !item.is_active }
    const { data } = await doctorsService.update(id, dto)
    const idx = items.value.findIndex(d => d.id === id)
    if (idx !== -1) items.value[idx] = data
  }

  return { items, loading, error, fetchAll, create, update, remove, toggleActive }
})
