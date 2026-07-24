import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { appointmentsService } from '@/services/appointments.service'
import type { AppointmentStatus } from '@/types'
import type { AppointmentStatusAction } from '@/types/appointment'
import { useUiStore } from './ui.store'
import type { AppointmentReadDTO } from '@/types/appointment'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<AppointmentReadDTO[]>([])
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
      const data = await appointmentsService.getAll(dateFrom, dateTo)
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
    return appointments.value.filter(appointment => {
      if (filters.specialtyId && appointment.doctor_detail.specialty.id !== filters.specialtyId) {
        return false
      }
      return true
    })
  })

  async function updateAppointmentStatus(
    appointmentId: number,
    action: AppointmentStatusAction
  ): Promise<void> {
    const ui = useUiStore()
    try {
      const updated = await appointmentsService.performAction(appointmentId, action)
      const idx = appointments.value.findIndex(a => a.id === appointmentId)
      if (idx !== -1) {
        appointments.value[idx] = updated
      }
      ui.success('Turno actualizado correctamente')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al actualizar el turno'
      console.error('Error updating appointment status:', message)
      ui.error(message)
    }
  }

  return {
    appointments,
    loading,
    error,
    filters,
    filteredAppointments,
    fetchAppointments,
    updateAppointmentStatus
  }
})
