import type { EmailStatus } from '../common/common.types'
import type { InsuranceDTO } from '../insurance/insurance.dto'
import type { SpecialtyDTO } from '../specialty/specialty.dto'

export interface DoctorAvailabilityDTO {
  id?: number
  day_of_week: number
  start_time: string
  end_time: string
}

export interface DoctorReadDTO {
  id: number
  first_name: string
  last_name: string
  email: string
  specialty: SpecialtyDTO | null
  insurances: InsuranceDTO[]
  license_number: string
  phone: string
  description: string
  consultation_fee: string
  availabilities: DoctorAvailabilityDTO[]
  is_active: boolean
  email_status: EmailStatus
}

export interface DoctorWriteDTO {
  first_name?: string
  last_name?: string
  email?: string
  specialty_id?: number
  insurance_ids?: number[]
  license_number?: string
  phone?: string
  description?: string
  consultation_fee?: string
  availabilities?: DoctorAvailabilityDTO[]
  is_active?: boolean
}
