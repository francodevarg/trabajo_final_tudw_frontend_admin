import { instance as axios } from '@/plugins/axios'
import type { PatientHistoryItem } from '@/types'

const ENDPOINT = '/patients'

export const patientHistoryService = {
  async getHistory(patientId: number): Promise<PatientHistoryItem[]> {
    const { data } = await axios.get<PatientHistoryItem[]>(
      `${ENDPOINT}/${patientId}/history`
    )
    return data
  }
}
