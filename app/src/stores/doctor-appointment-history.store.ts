import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { appointmentsService } from '@/services/appointments.service'
import { patientHistoryService } from '@/services/patient-history.service'
import type { AppointmentReadDTO, PatientHistoryItem } from '@/types'
import { useUiStore } from './ui.store'

export const useDoctorAppointmentHistoryStore = defineStore('doctorAppointmentHistory', () => {
  const appointments = ref<AppointmentReadDTO[]>([])
  const patientHistory = ref<PatientHistoryItem[]>([])
  const loading = ref(false)
  const historyLoading = ref(false)
  const error = ref<string | null>(null)

  const filters = reactive({
    patientId: null as number | null
  })

  async function fetchAppointments(dateFrom: string, dateTo: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const data = await appointmentsService.getAll(dateFrom, dateTo)
      appointments.value = data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al cargar el historial de turnos'
      console.error('Error fetching doctor appointments:', message)
      error.value = message
      useUiStore().error(message)
    } finally {
      loading.value = false
    }
  }

  async function fetchPatientHistory(patientId: number): Promise<void> {
    historyLoading.value = true
    try {
      const data = await patientHistoryService.getHistory(patientId)
      patientHistory.value = data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al cargar la historia clínica'
      console.error('Error fetching patient history:', message)
      useUiStore().error(message)
    } finally {
      historyLoading.value = false
    }
  }

  const uniquePatients = computed(() => {
    const map = new Map<number, { id: number; first_name: string; last_name: string }>()
    for (const appt of appointments.value) {
      const p = appt.patient_detail
      if (!map.has(p.id)) {
        map.set(p.id, { id: p.id, first_name: p.first_name, last_name: p.last_name })
      }
    }
    return [...map.values()].sort((a, b) => a.last_name.localeCompare(b.last_name))
  })

  const filteredAppointments = computed(() => {
    if (!filters.patientId) return appointments.value
    return appointments.value.filter(a => a.patient_detail.id === filters.patientId)
  })

  function clearHistory() {
    patientHistory.value = []
  }

  return {
    appointments,
    patientHistory,
    loading,
    historyLoading,
    error,
    filters,
    uniquePatients,
    filteredAppointments,
    fetchAppointments,
    fetchPatientHistory,
    clearHistory
  }
})
