import type { EmailStatus, DayOfWeek } from '../common/common.types'
import type { Specialty } from '../specialty/specialty.types'
import type { Insurance } from '../insurance/insurance.types'

export interface DoctorAvailability {
  id?: number
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
}

export interface Doctor {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  specialty: Specialty | null
  insurances: Insurance[]
  licenseNumber: string
  phone: string
  description: string
  consultationFee: string
  availabilities: DoctorAvailability[]
  isActive: boolean
  emailStatus: EmailStatus
}
