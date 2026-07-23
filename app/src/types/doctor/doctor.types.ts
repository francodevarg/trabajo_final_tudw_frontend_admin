import type { DayOfWeek } from '../common/common.types'
import type { Specialty } from '../specialty/specialty.types'
import type { Insurance } from '../insurance/insurance.types'

export interface DoctorAvailability {
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
}

export interface Doctor {
  id: number
  first_name: string
  last_name: string
  email: string
  specialty: Specialty
  insurances: Insurance[]
  license_number: string
  phone: string
  description: string
  consultation_fee: string
  availabilities: DoctorAvailability[]
  is_active: boolean
}