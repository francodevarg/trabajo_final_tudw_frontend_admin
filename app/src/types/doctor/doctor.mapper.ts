import type { Doctor, DoctorAvailability } from './doctor.types'
import type { DoctorDTO, DoctorCreateDTO, DoctorAvailabilityDTO } from './doctor.dto'
import type { InsuranceDTO } from '../insurance/insurance.dto'

/* ── Extract helpers (private) ── */

function extractSpecialtyName(s: unknown): string | undefined {
  if (!s) return undefined
  if (typeof s === 'string') return s
  if (typeof s === 'object' && s !== null && 'name' in s) return (s as { name: string }).name
  return undefined
}

function extractInsuranceName(i: unknown): string {
  if (typeof i === 'string') return i
  if (typeof i === 'object' && i !== null && 'name' in i) return (i as { name: string }).name
  return ''
}

/* ── DTO → Domain ── */

export function dtoAvailToDomain(dto: DoctorAvailabilityDTO): DoctorAvailability {
  return {
    id: dto.id,
    dayOfWeek: dto.day_of_week as DoctorAvailability['dayOfWeek'],
    startTime: dto.start_time,
    endTime: dto.end_time,
  }
}

export function doctorDtoToDomain(dto: DoctorDTO): Doctor {
  return {
    id: dto.id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    fullName: dto.name,
    email: dto.email,
    specialty: dto.specialty
      ? { id: String(extractSpecialtyName(dto.specialty) ?? ''), name: extractSpecialtyName(dto.specialty) ?? '', slug: '' }
      : null,
    insurances: (dto.insurances as unknown as InsuranceDTO[]).map(i => ({
      id: i.id ?? 0,
      name: extractInsuranceName(i) || String(i.name ?? ''),
      slug: i.slug ?? '',
    })),
    licenseNumber: dto.license_number,
    phone: dto.phone,
    description: dto.description,
    consultationFee: dto.consultation_fee,
    availabilities: dto.availabilities.map(dtoAvailToDomain),
    isActive: dto.is_active ?? true,
    emailStatus: dto.email_status ?? 'never',
  }
}

/* ── Domain → DTO ── */

export function domainAvailToDto(avail: DoctorAvailability): DoctorAvailabilityDTO {
  return {
    id: avail.id,
    day_of_week: avail.dayOfWeek,
    start_time: avail.startTime,
    end_time: avail.endTime,
  }
}

export function doctorDomainToCreateDto(doctor: Doctor): DoctorCreateDTO {
  return {
    name: doctor.fullName || `${doctor.firstName} ${doctor.lastName}`.trim(),
    email: doctor.email || undefined,
    license_number: doctor.licenseNumber || undefined,
    phone: doctor.phone || undefined,
    description: doctor.description || undefined,
    consultation_fee: doctor.consultationFee || undefined,
    availabilities: doctor.availabilities.length ? doctor.availabilities.map(domainAvailToDto) : undefined,
  }
}
