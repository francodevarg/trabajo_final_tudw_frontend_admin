import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Patient, PaginatedResponse } from '@/types'
import { patientsService, type PatientListParams } from '@/services/patients.service'

export const usePatientsStore = defineStore('patients', () => {
  const items = ref<Patient[]>([])
  const loading = ref(false)
  const error = ref('')
  const count = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const search = ref('')
  const ordering = ref('')

  async function fetchAll(params?: PatientListParams) {
    loading.value = true
    error.value = ''
    try {
      const requestParams: Record<string, string | number> = {
        page: params?.page ?? currentPage.value,
        page_size: params?.page_size ?? pageSize.value,
      }
      if (params?.search ?? search.value) requestParams.search = params?.search ?? search.value
      if (params?.ordering ?? ordering.value) requestParams.ordering = params?.ordering ?? ordering.value

      const { data } = await patientsService.getAll(requestParams)
      items.value = data.results
      count.value = data.count
    } catch (e: any) {
      error.value = e.message || 'Error al cargar pacientes'
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    currentPage.value = page
    fetchAll()
  }

  function setSearch(value: string) {
    search.value = value
    currentPage.value = 1
    fetchAll()
  }

  function setOrdering(value: string) {
    ordering.value = value
    currentPage.value = 1
    fetchAll()
  }

  return {
    items, loading, error, count,
    currentPage, pageSize, search, ordering,
    fetchAll, setPage, setSearch, setOrdering,
  }
})
