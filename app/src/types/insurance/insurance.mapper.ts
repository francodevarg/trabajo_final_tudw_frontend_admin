import type { Insurance } from './insurance.types'
import type { InsuranceDTO } from './insurance.dto'

export function insuranceDtoToDomain(dto: InsuranceDTO): Insurance {
  return { ...dto }
}

export function insuranceDomainToDto(insurance: Insurance): InsuranceDTO {
  return { ...insurance }
}
