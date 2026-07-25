import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { EvolutionCreateDTO, EvolutionReadDTO } from '@/types/evolution'
import { evolutionsService } from '@/services/evolution.service'
import { useUiStore } from './ui.store'

export const useEvolutionsStore = defineStore('evolutions', () => {
  const currentEvolution = ref<EvolutionReadDTO | null>(null)
  const loading = ref(false)
  const cache = ref<Record<number, EvolutionReadDTO>>({})

  async function createEvolution(data: EvolutionCreateDTO): Promise<EvolutionReadDTO | null> {
    const ui = useUiStore()
    loading.value = true
    try {
      const result = await evolutionsService.create(data)
      cache.value[result.appointment] = result
      currentEvolution.value = result
      ui.success('Evolución registrada correctamente')
      return result
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al registrar la evolución'
      ui.error(message)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchEvolutionByAppointment(appointmentId: number): Promise<EvolutionReadDTO | null> {
    if (cache.value[appointmentId]) {
      currentEvolution.value = cache.value[appointmentId]
      return currentEvolution.value
    }

    loading.value = true
    try {
      const result = await evolutionsService.getByAppointment(appointmentId)
      if (result) {
        cache.value[appointmentId] = result
        currentEvolution.value = result
      }
      return result
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al cargar la evolución'
      useUiStore().error(message)
      return null
    } finally {
      loading.value = false
    }
  }

  function clear() {
    currentEvolution.value = null
  }

  function hasEvolution(appointmentId: number): boolean {
    return appointmentId in cache.value
  }

  return {
    currentEvolution,
    loading,
    createEvolution,
    fetchEvolutionByAppointment,
    clear,
    hasEvolution
  }
})
