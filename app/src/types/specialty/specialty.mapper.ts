import type { Specialty } from './specialty.types'
import type { SpecialtyDTO } from './specialty.dto'

export function specialtyDtoToDomain(dto: SpecialtyDTO): Specialty {
  return { ...dto }
}

export function specialtyDomainToDto(specialty: Specialty): SpecialtyDTO {
  return { ...specialty }
}
