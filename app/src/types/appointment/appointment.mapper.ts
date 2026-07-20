import type { AppointmentReadDTO } from './appointment.dto'
import type { Appointment } from './appointment.types'

export function appointmentDtoToDomain(dto: Appointment): AppointmentReadDTO {
  return {
    id: dto.id,
    patient_detail: {
      id: dto.patient.id,
      first_name: dto.patient.first_name,
      last_name: dto.patient.last_name,
      dni: dto.patient.dni
    },
    doctor_detail: {
      id: dto.doctor.id,
      first_name: dto.doctor.first_name,
      last_name: dto.doctor.last_name,
      specialty: {
        id: dto.doctor.specialty?.id || 0,
        name: dto.doctor.specialty?.name || ''
      },
      license_number: dto.doctor.license_number
    },
    date: dto.date,
    time: dto.time,
    status: dto.status,
    notes: dto.notes || undefined
  }
}
