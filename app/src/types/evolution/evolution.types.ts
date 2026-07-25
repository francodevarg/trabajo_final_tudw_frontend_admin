export interface EvolutionCreateDTO {
  appointment: number
  reason: string
  diagnosis: string
  treatment: string
  notes: string
}

export interface EvolutionReadDTO {
  id: number
  appointment: number
  doctor: number
  reason: string
  diagnosis: string
  treatment: string
  notes: string
  created_at: string
}
