import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { appointmentsService } from '@/services/appointments.service'
import type { Appointment, AppointmentStatus } from '@/types'
import {appointmentDtoToDomain} from  '@/types'
import { useUiStore } from './ui.store'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = reactive({
    specialtyId: null as number | null,
    doctorId: null as number | null,
    status: null as AppointmentStatus | null,
    search: ''
  })

  async function fetchAppointments(dateFrom: string, dateTo: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { data } = await appointmentsService.getAll(dateFrom, dateTo)
      appointments.value = data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al cargar los turnos'
      console.error('Error fetching appointments:', message)
      error.value = message
      useUiStore().error(message)
    } finally {
      loading.value = false
    }
  }
  const filteredAppointments = computed(() => {
    console.log('Filtro seleccionado:', filters.specialtyId)

    return appointments.value.filter(appointment => {
      console.log('Turno:', appointment.id)

      if (filters.specialtyId && appointment.doctor.specialty.id !== filters.specialtyId) {
        return false
      }

      return true
    })
  })

  return {
    appointments,
    loading,
    error,
    filters,
    filteredAppointments,
    fetchAppointments
  }
})
