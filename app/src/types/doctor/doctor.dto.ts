import type { DoctorAvailability } from './doctor.types'

export interface DoctorPayload {
  email: string;
  first_name: string;
  last_name: string;

  specialty_id: number;

  insurance_ids: number[];

  license_number: string;
  phone: string;
  description: string;
  consultation_fee: number;

  availabilities: DoctorAvailability[];
}

export type CreateDoctorRequest = DoctorPayload;
export type UpdateDoctorRequest = Partial<DoctorPayload>;