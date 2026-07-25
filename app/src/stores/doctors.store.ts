import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Doctor, CreateDoctorRequest, UpdateDoctorRequest } from '@/types'
import { doctorsService } from '@/services/doctors.service'

export const useDoctorsStore = defineStore('doctors', () => {
  const items = ref<Doctor[]>([])
  const myProfile = ref<Doctor | null>(null)
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

  async function fetchOne(id:number) {
    loading.value = true
    error.value = null
    try {
      const data = await doctorsService.getOne(id)
      myProfile.value = data
      return data
    } catch (err: any) {
      error.value = err?.message ?? 'Error al cargar tu perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMe(id:number,payload: UpdateDoctorRequest) {
    loading.value = true
    error.value = null
    try {
      const data = await doctorsService.update(id,payload)
      myProfile.value = data
      setItem(data)
      return data
    } catch (err: any) {
      error.value = err?.message ?? 'Error al actualizar tu perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clear() {
    items.value = []
    error.value = null
  }

  return {
    // State
    items,
    myProfile,
    loading,
    error,

    // Actions
    fetchAll,
    create,
    update,
    remove,
    fetchOne,
    updateMe,

    // Helpers
    getById,
    clear,
  }
})