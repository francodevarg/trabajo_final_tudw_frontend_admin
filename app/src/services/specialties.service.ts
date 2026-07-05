import type { Specialty } from '@/types'
import ApiService from './ApiService'

const ENDPOINT = '/doctors/specialties'

export const specialtiesService = {
  getAll() {
    return ApiService.getAll<Specialty>(ENDPOINT)
  },

  create(name: string) {
    return ApiService.create<Specialty>(ENDPOINT, { name: name.trim() })
  },

  update(id: string, name: string) {
    return ApiService.update<Specialty>(ENDPOINT, id, { name: name.trim() })
  },

  remove(id: string) {
    return ApiService.destroy(ENDPOINT, id)
  },
}
