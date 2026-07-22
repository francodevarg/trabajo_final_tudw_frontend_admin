import { instance as axios } from '@/plugins/axios'
import type { Patient, PaginatedResponse } from '@/types'

const ENDPOINT = '/patients'

export interface PatientListParams {
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}

export const patientsService = {
  getAll(params?: PatientListParams) {
    return axios.get<PaginatedResponse<Patient>>(ENDPOINT, { params })
  },
}
