import type { AppointmentStatus } from "./appointment.types"
export interface DoctorBriefDTO {
  id: number
  first_name: string
  last_name: string
  specialty: string
  license_number: string
}

export interface PatientDTO {
  id: number
  first_name: string
  last_name: string
  dni: number
}


export interface AppointmentReadDTO{
  id: number

  doctor_detail: {
    id: number
    first_name: string
    last_name: string
    specialty: {
      id: number
      name: string
    }
    license_number: string
  }

  patient_detail: {
    id: number
    first_name: string
    last_name: string
    dni: number
  }

  date: string
  time: string
  status: AppointmentStatus
  notes?: string
}