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
