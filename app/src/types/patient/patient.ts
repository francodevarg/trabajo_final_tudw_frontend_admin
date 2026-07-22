export interface Patient {
  id: number
  full_name: string
  first_name: string
  last_name: string
  dni: number
  sex: 'M' | 'F'
  age: number
  last_appointment: {
    date: string
    status: string
  } | null
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
