import { instance as axios } from '../plugins/axios'
import type { AxiosResponse } from 'axios'

class ApiService {
  getAll<T>(url: string): Promise<AxiosResponse<T[]>> {
    return axios.get<T[]>(url)
  }

  getOne<T>(url: string, id: number | string): Promise<AxiosResponse<T>> {
    return axios.get<T>(`${url}/${id}`)
  }

  create<T>(url: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    return axios.post<T>(url, data)
  }

  update<T>(
    url: string,
    id: number | string,
    data: Partial<T>
  ): Promise<AxiosResponse<T>> {
    return axios.put<T>(`${url}/${id}`, data)
  }

  destroy(url: string, id: number | string): Promise<AxiosResponse<void>> {
    return axios.delete<void>(`${url}/${id}`)
  }
}

export default new ApiService()
