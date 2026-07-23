import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Patient } from '@/types'
import { patientsService } from '@/services/patients.service'

export const usePatientsStore = defineStore('patients', () => {
  const items = ref<Patient[]>([])
  const loading = ref(false)
  const error = ref('')
  const loaded = ref(false)

  async function fetchAll(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = ''
    try {
      const data = await patientsService.getAll()
      console.log('patients',data)
      items.value = data
      loaded.value = true
    } catch (e: any) {
      error.value = e.message || 'Error al cargar especialidades'
    } finally {
      loading.value = false
    }
  }
  

  return {
    fetchAll,
    items,
    loading,
    error
  }
})
