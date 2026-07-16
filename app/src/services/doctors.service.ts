import type { DoctorDTO, DoctorCreateDTO } from '@/types'
import ApiService from './ApiService'

const ENDPOINT = '/doctors'

export const doctorsService = {
  getAll() {
    return ApiService.getAll<DoctorDTO>(ENDPOINT)
  },

  getOne(id: number) {
    return ApiService.getOne<DoctorDTO>(ENDPOINT, id)
  },

  create(data: DoctorCreateDTO) {
    return ApiService.create<DoctorDTO>(ENDPOINT, data)
  },

  update(id: number, data: DoctorCreateDTO) {
    return ApiService.update<DoctorDTO>(ENDPOINT, id, data)
  },

  remove(id: number) {
    return ApiService.destroy(ENDPOINT, id)
  }
}
