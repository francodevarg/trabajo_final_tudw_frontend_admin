export type AppointmentStatus =
  'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export type AppointmentStatusAction =
  | 'check-in'
  | 'cancel'
  | 'start'
  | 'complete'
  | 'no-show'

export interface Appointment {
  id: number

  doctor: {
    id: number
    first_name: string
    last_name: string
    specialty: {
      id: number
      name: string
    }
    license_number: string
  }

  patient: {
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