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

export type { EmailStatus, DayOfWeek } from './common/common.types'

export type { Appointment, AppointmentStatus, DoctorBriefDTO, PatientDTO } from './appointment'
export { appointmentDtoToDomain } from './appointment'

/* ── DTOs ── */
export type { DoctorAvailabilityDTO } from './doctor/doctor.dto'

export type { SpecialtyDTO } from './specialty/specialty.dto'

export type { InsuranceDTO } from './insurance/insurance.dto'

export type { OtpRequest, OtpResponse, OtpVerify, AuthError } from './auth/auth.dto'

/* ── Mappers ── */
export {
  doctorDtoToDomain,
  doctorDomainToCreateDto,
  dtoAvailToDomain,
  domainAvailToDto
} from './doctor/doctor.mapper'

export { specialtyDtoToDomain, specialtyDomainToDto } from './specialty/specialty.mapper'

export { insuranceDtoToDomain, insuranceDomainToDto } from './insurance/insurance.mapper'
