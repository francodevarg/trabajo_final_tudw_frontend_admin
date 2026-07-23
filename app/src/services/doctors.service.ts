import type { Doctor, CreateDoctorRequest, UpdateDoctorRequest } from '@/types'
import ApiService from './ApiService'

const ENDPOINT = '/doctors'

export const doctorsService = {
  getAll(): Promise<Doctor[]> {
    return ApiService.getAll<Doctor>(ENDPOINT);
  },

  getOne(id: number): Promise<Doctor> {
    return ApiService.getOne<Doctor>(ENDPOINT, id);
  },

  create(data: CreateDoctorRequest): Promise<Doctor> {
    return ApiService.create<Doctor, CreateDoctorRequest>(ENDPOINT, data);
  },

  update(id: number, data: UpdateDoctorRequest): Promise<Doctor> {
    return ApiService.update<Doctor, UpdateDoctorRequest>(
      ENDPOINT,
      id,
      data
    );
  },

  remove(id: number): Promise<void> {
    return ApiService.destroy(ENDPOINT, id);
  },
};
