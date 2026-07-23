import { instance as axios } from "../plugins/axios";

class ApiService {
  async getAll<Response>(
    url: string,
    params?: Record<string, string>
  ): Promise<Response[]> {
    const { data } = await axios.get<Response[]>(url, { params });
    return data;
  }

  async getOne<Response>(
    url: string,
    id: number | string
  ): Promise<Response> {
    const { data } = await axios.get<Response>(`${url}/${id}`);
    return data;
  }

  async create<Response, Request>(
    url: string,
    payload: Request
  ): Promise<Response> {
    const { data } = await axios.post<Response>(url, payload);
    return data;
  }

  async update<Response, Request>(
    url: string,
    id: number | string,
    payload: Request
  ): Promise<Response> {
    const { data } = await axios.put<Response>(`${url}/${id}`, payload);
    return data;
  }

  async destroy(
    url: string,
    id: number | string
  ): Promise<void> {
    await axios.delete(`${url}/${id}`);
  }
}

export default new ApiService();