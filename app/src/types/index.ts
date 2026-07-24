/* ── Domain models ── */
export type { Doctor, DoctorAvailability } from './doctor/doctor.types'

export type { Specialty } from './specialty/specialty.types'

export type { Insurance } from './insurance/insurance.types'

export type { JwtPayload, OtpTokens, UserRole } from './auth/auth.types'

export type {
  PermissionMode,
  PermissionConfig,
  PermissionValue
} from './permissions/permissions.types'

export type { DayOfWeek } from './common/common.types'

export type {
  Appointment,
  AppointmentStatus,
  AppointmentStatusAction,
  AppointmentActionConfig,
  AppointmentReadDTO
} from './appointment'
export { appointmentDtoToDomain } from './appointment'

export type { Patient } from './patient'

/* ── DTOs ── */

export type { SpecialtyDTO } from './specialty/specialty.dto'

export type { InsuranceDTO } from './insurance/insurance.dto'
export type { CreateDoctorRequest, UpdateDoctorRequest } from './doctor/doctor.dto'

export type { OtpRequest, OtpResponse, OtpVerify, AuthError } from './auth/auth.dto'

export { specialtyDtoToDomain, specialtyDomainToDto } from './specialty/specialty.mapper'

export { insuranceDtoToDomain, insuranceDomainToDto } from './insurance/insurance.mapper'
