import type { Appointment, AppointmentStatus} from '@/types'
import ApiService from './ApiService'
import type { AppointmentReadDTO } from '@/types/appointment'

const ENDPOINT = '/appointments'

export const appointmentsService = {
  getAll(dateFrom?: string, dateTo?: string) {
    const params: Record<string, string> = {}
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo
    return ApiService.getAll<AppointmentReadDTO>(ENDPOINT, params)
  },

  updateStatus(id: number, status: AppointmentStatus) {
    return ApiService.update<Appointment>(ENDPOINT, id, { status })
  }
}
