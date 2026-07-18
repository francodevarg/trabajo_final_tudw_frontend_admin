import type { AppointmentDTO, AppointmentStatus } from '@/types'
import ApiService from './ApiService'

const ENDPOINT = '/appointments'

export const appointmentsService = {
  getAll(dateFrom?: string, dateTo?: string) {
    const params: Record<string, string> = {}
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo
    return ApiService.getAll<AppointmentDTO>(ENDPOINT, params)
  },

  updateStatus(id: number, status: AppointmentStatus) {
    return ApiService.update<AppointmentDTO>(ENDPOINT, id, { status })
  },
}
