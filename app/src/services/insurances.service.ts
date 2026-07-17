import type { Insurance } from '@/types'
import ApiService from './ApiService'

const ENDPOINT = '/doctors/insurances'

export const insurancesService = {
  getAll() {
    return ApiService.getAll<Insurance>(ENDPOINT)
  },

  create(name: string) {
    return ApiService.create<Insurance>(ENDPOINT, { name: name.trim() })
  },

  update(id: number, name: string) {
    return ApiService.update<Insurance>(ENDPOINT, id, { name: name.trim() })
  },

  remove(id: number) {
    return ApiService.destroy(ENDPOINT, id)
  },
}
