import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Doctor, CreateDoctorRequest } from '@/types'
import { doctorsService } from '@/services/doctors.service'

export const useDoctorsStore = defineStore('doctors', () => {
  const items = ref<Doctor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setItem(item: Doctor) {
    const index = items.value.findIndex(d => d.id === item.id)

    if (index === -1) {
      items.value.push(item)
    } else {
      items.value[index] = item
    }
  }

  function removeItem(id: number) {
    items.value = items.value.filter(d => d.id !== id)
  }

  async function fetchAll() {
    loading.value = true
    error.value = null

    try {
      const data = await doctorsService.getAll()
      items.value = data
    } catch (err: any) {
      error.value = err?.message ?? 'Error al cargar los médicos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateDoctorRequest) {
    const data = await doctorsService.create(payload)
    setItem(data)
    return data
  }

  async function update(id: number, payload: CreateDoctorRequest) {
    const data = await doctorsService.update(id, payload)
    setItem(data)
    return data
  }

  async function remove(id: number) {
    await doctorsService.remove(id)
    removeItem(id)
  }

  function getById(id: number) {
    return items.value.find(d => d.id === id) ?? null
  }

  function clear() {
    items.value = []
    error.value = null
  }

  return {
    // State
    items,
    loading,
    error,

    // Actions
    fetchAll,
    create,
    update,
    remove,

    // Helpers
    getById,
    clear,
  }
})