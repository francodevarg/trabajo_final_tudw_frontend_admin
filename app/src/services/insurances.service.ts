import type { Insurance } from '@/types'
import ApiService from './ApiService'

const ENDPOINT = '/doctors/insurances'

export const insurancesService = {
  getAll() {
    return ApiService.getAll<Insurance>(ENDPOINT)
  },
}
