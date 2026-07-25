import type { Doctor, DoctorAvailability } from './doctor.types'
import type { CreateDoctorRequest } from './doctor.dto'

export type { Doctor, DoctorAvailability } from './doctor.types'
export type { CreateDoctorRequest, UpdateDoctorRequest } from './doctor.dto'

export type DoctorDTO = Doctor
export type DoctorWriteDTO = Partial<CreateDoctorRequest>
export type DoctorAvailabilityDTO = DoctorAvailability