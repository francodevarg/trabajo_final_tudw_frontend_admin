import type { Patient } from '@/types'
import ApiService from './ApiService'

const ENDPOINT = '/patients'


export const patientsService = {
  getAll() {
    return ApiService.getAll<Patient>(ENDPOINT)
  },
}

