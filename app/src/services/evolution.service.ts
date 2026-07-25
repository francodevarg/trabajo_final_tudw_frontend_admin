import ApiService from './ApiService'
import type { EvolutionCreateDTO, EvolutionReadDTO } from '@/types/evolution'
import { instance as axios } from '@/plugins/axios'

const ENDPOINT = '/evolutions'

export const evolutionsService = {
  create(data: EvolutionCreateDTO) {
    return ApiService.create<EvolutionReadDTO, EvolutionCreateDTO>(ENDPOINT, data)
  },

  async getByAppointment(appointmentId: number): Promise<EvolutionReadDTO | null> {
    try {
      const { data } = await axios.get<EvolutionReadDTO>(
        `${ENDPOINT}/appointment/${appointmentId}/`
      )
      return data
    } catch (e: any) {
      if (e.response?.status === 404) return null
      throw e
    }
  }
}
